import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { Box } from "@material-ui/core";
import NoCard from "../components/nocard";
import api from "../api";

const AddItem = (props) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchItem = (url) => {
    setLoading(true);
    api
      .scanPage({ url })
      .then((data) => {
        console.log("data", data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    const location = props?.location;
    const params = new URLSearchParams(location.search);
    const url = params.get("url") || "";
    setUrl(url);
    fetchItem(url);
  }, [props?.location]);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!url ? <NoCard page="add" /> : <Box></Box>}
      </Box>
    </Layout>
  );
};

export default AddItem;
