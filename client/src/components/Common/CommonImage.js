import React, { useEffect, useState } from "react";
import Placeholder from "../../assets/img/placeholder.png";

export const CommonImage = ({ photo, ...props }) => {
  const urls = [photo, photo?.url, photo?.normal, photo?.small].filter(
    (photo) => photo && typeof photo === "string"
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUrl, setCurrentUrl] = useState(urls[0]);

  useEffect(() => {
    setCurrentIndex(0);
    setCurrentUrl(urls[0]);
  }, [photo]);

  const handleImageError = () => {
    if (currentIndex < urls.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentUrl(urls[currentIndex + 1]);
    } else {
      setCurrentUrl(Placeholder);
    }
  };

  return <img src={currentUrl} {...props} onError={handleImageError} />;
};
