import React from "react";
import {
  InsertLink,
  Close,
  ZoomOutMap,
  Add,
  ThumbUpOutlined,
  ThumbDownOutlined,
} from "@material-ui/icons";
import "./card.scss";
import utils from "../utils";
import { CommonImage } from "./Common/CommonImage";

const Card = ({
  card,
  editable,
  showFullControl,
  hideThumbs,
  remove,
  quickView,
  showPrice,
  orderStatus,
  fork,
}) => {
  const removeClicked = (e) => {
    e.stopPropagation();
    remove();
  };
  const quickViewClicked = (e) => {
    e.stopPropagation();
    quickView();
  };

  const forkClicked = (e) => {
    e.stopPropagation();
    fork();
  };

  const getOrderStatusBadge = () => {
    if (!orderStatus || orderStatus < 1 || orderStatus > 3) return "";
    let label, color;
    if (orderStatus === 1) {
      label = "Order Placed";
      color = "color-placed";
    } else if (orderStatus === 2) {
      label = "Shipped";
      color = "color-shipped";
    } else if (orderStatus === 3) {
      label = "Order Closed";
      color = "color-closed";
    }
    return <div className={"order-status-badge " + color}>{label}</div>;
  };

  const getPurchaseStatusBadge = () => {
    if (!card.purchasedStatus || showPrice) return "";
    return <div className={"order-status-badge bg-red"}>Purchased</div>;
  };

  const getSuggestBadge = () => {
    if (!card.addedBy) return "";
    const data = utils.getStoredSuggestItems();
    const idx = data.indexOf(card._id);
    if (idx > -1) return "";
    return <div className={"order-status-badge bg-indigo"}>Suggested</div>;
  };

  const thumbupDiff = () => {
    const current = card.likes.length;
    const before = utils.getStoredThumbCount(card._id).thumbup;
    const diff = current - before;
    if (!diff) return 0;
    return (diff > 0 ? "+" : "") + diff;
  };

  const thumbdownDiff = () => {
    const current = card.dislikes.length;
    const before = utils.getStoredThumbCount(card._id).thumbdown;
    const diff = current - before;
    if (!diff) return 0;
    return (diff > 0 ? "+" : "-") + diff;
  };

  return (
    <div className="card-container">
      <div className="product-img">
        <CommonImage
          photo={card.photo}
          alt={card.name}
          className="mb-3"
          style={{
            objectFit: "contain",
            height: "100%",
            width: "100%",
            display: "flex",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        {getOrderStatusBadge() || getSuggestBadge() || getPurchaseStatusBadge()}
        {hideThumbs ? (
          ""
        ) : (
          <>
            {thumbupDiff() && (
              <div className="thumb thumb-up">
                <ThumbUpOutlined />
                <span>{thumbupDiff()}</span>
              </div>
            )}
            {thumbdownDiff() && (
              <div className="thumb thumb-down">
                <ThumbDownOutlined />
                <span>{thumbdownDiff()}</span>
              </div>
            )}
          </>
        )}
      </div>
      <div className="card-footer d-flex justify-content-end align-items-start">
        <div className="item-name">{card.name}</div>
        {showPrice ? (
          <div className="item-price">${card.price}</div>
        ) : (
          <>
            {!editable ? (
              <>
                <div className="close-link">
                  <span onClick={forkClicked}>
                    <Add />
                  </span>
                </div>
              </>
            ) : (
              <>
                {showFullControl && (
                  <>
                    <div className="close-link">
                      <span onClick={quickViewClicked}>
                        <ZoomOutMap />
                      </span>
                    </div>
                    <div className="insert-link hide-sm">
                      <a
                        onClick={(e) => e.stopPropagation()}
                        href={card.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <InsertLink />
                      </a>
                    </div>
                  </>
                )}
                <div className="close-link">
                  <span onClick={removeClicked}>
                    <Close />
                  </span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
