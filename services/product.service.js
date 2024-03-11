const axios = require("axios");

const JSOINFY_API_URL = "https://jsonify.co/api/v1";

exports.runJsonify = async (url, text) => {
  try {
    const apiUrl = `${JSOINFY_API_URL}/scraper/start?token=${process.env.JSONIFY_API_KEY}&url=${url}&extended=true`;

    const payload = {
      schema: {
        name: "<product name here>",
        price: "<price here>",
        description: "<product description here",
        photo: "<product thumbnail link here>",
        // images: "<product photos here>",
      },
      url,
      text: text || "",
    };

    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data?.result?.id;
  } catch (ex) {
    console.log("runJsonify error", ex);
  }
};

const getJsonifyResult = async (resultId) => {
  try {
    const apiUrl = `${JSOINFY_API_URL}/result/${resultId}?token=${process.env.JSONIFY_API_KEY}`;

    const response = await axios.get(apiUrl);
    return response.data?.result;
  } catch (ex) {
    console.log("getJsonifyResult error", ex);
  }
};
exports.getJsonifyResult = getJsonifyResult;

const getJsonifyResultLoop = async (resultId, retries = 5) => {
  const result = await this.getJsonifyResult(resultId);
  if (!result?.done) {
    if (retries <= 0) return;
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await getJsonifyResultLoop(resultId, retries - 1);
  }

  return result?.json;
};
exports.getJsonifyResultLoop = getJsonifyResultLoop;
