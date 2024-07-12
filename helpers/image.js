const axios = require("axios");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const validator = require("validator");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const s3 = new AWS.S3();

const uploadToS3 = (buffer, bucketName, key) => {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ACL: "public-read",
      },
      (err, data) => {
        if (err) {
          console.error("uploadToS3 error", err);
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const getDataFromImageUrl = async (url) => {
  const response = await axios({
    url,
    method: "GET",
    timeout: 10000,
    responseType: "arraybuffer",
  });
  return response.data;
};

const resizeImage = async (buffer, width, height) => {
  const resizedBuffer = await sharp(buffer).resize(width, height).toBuffer();
  return resizedBuffer;
};

const processImage = async (url) => {
  try {
    if (!validator.isURL(url)) return;

    const imageName = Date.now() + "-" + url.split("/").pop().split("?")[0];
    const buffer = await getDataFromImageUrl(url);
    const meta = await sharp(buffer).metadata();

    const sizes = [
      {
        size: 500,
        folder: "small",
      },
      {
        size: 1200,
        folder: "normal",
      },
    ];

    for (const size of sizes) {
      let resizedBuffer = null;
      if (meta.width > size.size) {
        resizedBuffer = await resizeImage(
          buffer,
          size.size,
          Math.ceil((meta.height / meta.width) * size.size)
        );
      } else {
        resizedBuffer = await resizeImage(buffer, meta.width, meta.height);
      }
      await uploadToS3(
        resizedBuffer,
        process.env.AWS_BUCKET_NAME,
        `${size.folder}/${imageName}`
      );
    }
    return {
      small: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/small/${imageName}`,
      normal: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/normal/${imageName}`,
    };
  } catch (ex) {
    console.error(ex);
  }
};

exports.processImage = processImage;
