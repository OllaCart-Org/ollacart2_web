import React, { useState, useSelector } from "react";
import Videosection from '../components/Landing/videosection'
import Herosection from '../components/Landing/Herosection'
import Shoppingcards from '../components/Landing/Shoppingcards'
import Feature from '../components/Landing/Feature'
import Review from '../components/Landing/Review'
import Infosection from '../components/Landing/Infosection'
import Faq from '../components/Landing/Faq'
import Cta from '../components/Landing/Cta'
import Gallery from '../components/Landing/Gallery'
import Header from '../components/Landing/Header'
import Featuremobile from '../components/Landing/Featuremobile'
import Signin from "../components/Landing/Signin";
import Overlay from "../components/Landing/Overlay";
import { motion } from "framer-motion";
import Layout from "./layout";

const Landing = () => {
  const [modalOpen, setModalOpen] = useState(false);
  //const [activeTab, setActiveTab] = useState(2);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  //const { email } = useSelector((state) => state.auth);

  return (
    <Layout>
      <motion.div id='main-container'
        initial={{
          opacity: 0, // Initial opacity set to 0
        }}
        animate={{
          opacity: 1, // Final opacity set to 1
        }}
        transition={{
          duration: .6, // Animation duration in seconds (200ms)
        }}
      >
        {/* {!email && ( */}
        <Herosection />
        {/* )}  */}
        <Featuremobile />
        <div className="homepage-container">
          <Videosection />
          <Feature />
          <Shoppingcards />
          <Gallery />
          <Review />
          <Infosection />
        </div>
        <Faq />
        <Cta />
        {modalOpen && <Overlay onClick={closeModal} />}
        <Signin isOpen={modalOpen} closeModal={closeModal} />
      </motion.div>
    </Layout>
  )
}

export default Landing;