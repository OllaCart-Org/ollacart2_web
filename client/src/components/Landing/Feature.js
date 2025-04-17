import React from 'react'
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const Feature = () => {
    const [ref2, inView2] = useInView({ triggerOnce: true });
  return (
    <motion.div id='feature-container'
    ref={ref2}
    initial={{
      opacity: 0,
      y: 40, // Move slightly down initially
    }}
    animate={{
      opacity: inView2 ? 1 : 0,
      y: inView2 ? 0 : 40,
    }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    >
        <div className="feature-content">
            <h1>How <span>OllaCart</span> works</h1>
            <p>Get an inside look at how your online shopping will change. </p>
        </div>
        <div className="feature-tiles">
            <div className="tile">
                <div className="number">
                   <p>1</p>
                </div>
                <div className="tile-content">
                    <h1>Sign up</h1>
                    <p>Signing up only takes an email. To secure your account, go to the account page and enable security to require email authentication on login.</p>
                </div>
            </div>
            <div className="tile">
                <div className="number">
                   <p>2</p>
                </div>
                <div className="tile-content">
                    <h1>Download the app or extention</h1>
                    <p>Get the app from the Apple app store or extension from the Chrome Web Store. Refresh OllaCart before you start shopping to link to the platform.</p>
                </div>
            </div>
            <div className="tile">
                <div className="number">
                   <p>3</p>
                </div>
                <div className="tile-content">
                    <h1>Shop where you normally shop</h1>
                    <p>Browse your favorite stores and add items to your Ollacart with the extension by selecting the OllaCart icon.</p>
                </div>
            </div>
            <div className="tile">
                <div className="number">
                   <p>4</p>
                </div>
                <div className="tile-content">
                    <h1>Getting it right the first time</h1>
                    <p>Maneuver the cursor until the popup shows appropriate information. Click when the product information is most accurate.</p>
                </div>
            </div>
            <div className="tile">
                <div className="number">
                   <p>5</p>
                </div>
                <div className="tile-content">
                    <h1>Confirming Information</h1>
                    <p>If necessary, specific information can be repicked outside the popup by maneuvering the cursor again. Scroll with the scroll bar.</p>
                </div>
            </div>
            <div className="tile">
                <div className="number">
                   <p>6</p>
                </div>
                <div className="tile-content">
                    <h1>Add to OllaCart</h1>
                    <p>After confirming, &quot;Add to OllaCart&quot;. Your item will appear in your OllaCart to buy, share, and save.</p>
                </div>
            </div>
        </div>
        </motion.div>
  )
}

export default Feature