import React from "react";
import { LinearProgress } from "@material-ui/core";
import OllaCartLogo from "../components/Logo/ollacartmulti";

const NoCard = ({ page }) => {
  return (
    <div className="no-card-container">
      <OllaCartLogo />
      <div className="no-card-text">
        {page === "home" && (
          <>
            Add any item you wish to share or purchase to OllaCart using our
            extension.
          </>
        )}
        {page === "purchase" && (
          <>
            Add items to your purchase cart by clicking on the item once to turn
            the outline green.
          </>
        )}
        {page === "share" && (
          <>
            Add items to your shared cart by clicking on the item twice to turn
            the outline blue.
          </>
        )}
        {page === "order" && <>Items go here after purchase for tracking.</>}
        {page === "social" && (
          <>Follow users and their shared items appear here.</>
        )}
        {page === "add" && <>No items appear here.</>}
      </div>
      <LinearProgress />
    </div>
  );
};

export default NoCard;
