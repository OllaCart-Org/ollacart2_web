import React from "react";

const Overlay = ({ isOpen, closeModal }) => {
  return (
    <div
      className={`overlay ${isOpen ? "open" : ""}`}
      onClick={closeModal}
    ></div>
  );
};

export default Overlay;
