import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Link,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from "@material-ui/core";
import {
  ChevronLeft,
  ChevronRight,
  Close,
  Delete,
  Edit,
  PersonPin,
  Save,
  Share,
  ShoppingCart,
  Telegram,
  ThumbDown,
  ThumbDownOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from "@material-ui/icons";
import "./quickview.scss";
import utils from "../utils";
import OllaCartAdd from "./Logo/ollacartadd";
import { CommonImage } from "./Common/CommonImage";

const QuickView = ({
  card,
  close,
  share,
  singleShare,
  anonymousShare,
  anonymousShareAllowed,
  save,
  remove,
  updateLogo,
  putPurchase,
  previous,
  next,
  editable,
  fork,
  thumbup,
  thumbdown,
}) => {
  const [logo, setLogo] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState("");

  const { _id } = useSelector((state) => state.auth);

  useEffect(() => {
    setLogo(card.photo || {});
    utils.setStoredThumbCount(card._id, {
      thumbup: card.likes.length,
      thumbdown: card.dislikes.length,
    });
    if (card.addedBy) {
      utils.setStoredSuggestItem(card._id);
    }
  }, [card]);

  const goPreviewClicked = (e) => {
    e.stopPropagation();
    previous();
  };

  const goNextClicked = (e) => {
    e.stopPropagation();
    next();
  };

  const editClicked = () => {
    setEditMode(true);
    setDescription(card.description);
  };

  const saveClicked = () => {
    setEditMode(false);
    card.description = description;
    save(card);
  };

  const imgClicked = (idx) => {
    setLogo(card.photos[idx]);
    if (updateLogo) updateLogo(card, idx);
  };

  return (
    <Box className="quickview-container" onClick={close}>
      <Box className="quickview" onClick={(e) => e.stopPropagation()}>
        <Box className="top-nav">
          {editable ? (
            <>
              {share && (
                <Box
                  className={"top-nav-item " + (card.shared ? "active" : "")}
                  onClick={() => share(card)}
                >
                  <Share />
                </Box>
              )}
              {putPurchase && (
                <Box
                  className={"top-nav-item " + (card.purchased ? "active" : "")}
                  onClick={() => putPurchase(card)}
                >
                  <ShoppingCart />
                </Box>
              )}
              {singleShare && (
                <Box className="top-nav-item" onClick={() => singleShare(card)}>
                  <Telegram />
                </Box>
              )}
              {anonymousShare &&
                (anonymousShareAllowed ? (
                  <Box
                    className="top-nav-item mr-auto"
                    onClick={() => anonymousShare(card)}
                  >
                    <PersonPin />
                  </Box>
                ) : (
                  <Tooltip
                    title="Toggle this feature on from Account Settings first."
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                  >
                    <Box
                      className="top-nav-item mr-auto"
                      onClick={() => anonymousShare(card)}
                    >
                      <PersonPin />
                    </Box>
                  </Tooltip>
                ))}
              {save && !editMode && (
                <Box className="top-nav-item" onClick={editClicked}>
                  <Edit />
                </Box>
              )}
              {save && editMode && (
                <Box className="top-nav-item" onClick={saveClicked}>
                  <Save />
                </Box>
              )}
              {remove && (
                <Box className="top-nav-item" onClick={() => remove(card)}>
                  <Delete />
                </Box>
              )}
              <Box className="top-nav-item" onClick={close}>
                <Close />
              </Box>
            </>
          ) : (
            <>
              <Box className="nav-absolute" onClick={close}>
                <Box className="absolute-nav-item">
                  <Close />
                </Box>
              </Box>
            </>
          )}
        </Box>
        <Box className="quickview-content">
          <Box className="left-bar">
            <Box className="logo-container" marginTop={1}>
              <CommonImage photo={logo} />
            </Box>
            <Box className="photo-container">
              {card.photos
                .filter((photo) => !!photo)
                .map((photo, idx) => (
                  <Box
                    className="quickview-photo"
                    key={idx}
                    onClick={() => imgClicked(idx)}
                  >
                    <CommonImage photo={photo} />
                  </Box>
                ))}
            </Box>
          </Box>
          <Box className="right-bar">
            <Box marginRight={editable ? 0 : 6}>
              <Typography variant="h3" gutterBottom>
                {card.name}
              </Typography>
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              style={{ color: "var(--color-green)" }}
            >
              ${card.price}
            </Typography>
            {editable && card.size && (
              <Box className="size-item">
                <span>Size: {card.size}</span>
              </Box>
            )}
            {!editMode && (
              <Typography style={{ whiteSpace: "break-spaces" }}>
                {card.description}
              </Typography>
            )}
            {editMode && (
              <TextField
                className="description-editor"
                label="Description"
                multiline
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
              />
            )}
            <Typography className="quickview-item-link">
              <Link href={card.url} target="_blank">
                {card.url}
              </Link>
            </Typography>
            {
              <Box className="user-name" mt={2}>
                <span>@{utils.getUsername(card.user)}</span>
              </Box>
            }
            <Box className="thumb-content" mt={3}>
              <Box className="label-button" onClick={() => thumbup(card)}>
                <span>{card.likes.length}</span>
                {card.likes.includes(_id) ? <ThumbUp /> : <ThumbUpOutlined />}
              </Box>
              <Box className="label-button" onClick={() => thumbdown(card)}>
                <span>{card.dislikes.length}</span>
                {card.dislikes.includes(_id) ? (
                  <ThumbDown />
                ) : (
                  <ThumbDownOutlined />
                )}
              </Box>
            </Box>
            {!editable && (
              <Box
                className="ollacart-add-button mr-auto ml-auto"
                my={2}
                display="flex"
                justifyContent="center"
              >
                <OllaCartAdd onClick={() => fork(card)} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box className="quickview-left-navigator" onClick={goPreviewClicked}>
        <ChevronLeft fontSize="large" />
      </Box>
      <Box className="quickview-right-navigator" onClick={goNextClicked}>
        <ChevronRight fontSize="large" />
      </Box>
    </Box>
  );
};

export default QuickView;
