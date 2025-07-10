import React from 'react'
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const Featuremobile = () => {
  const [ref9, inView9] = useInView({ triggerOnce: true });

  return (
    <motion.div id='feature-mobile-container'
    ref={ref9}
    initial={{
      opacity: 0,
      y: 40, // Move slightly down initially
    }}
    animate={{
      opacity: inView9 ? 1 : 0,
      y: inView9 ? 0 : 40,
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
                    <h1>Get the app</h1>
                    <p>Get the app from the Apple app store. Sign in or up once it is downloaded.</p>
                </div>
            </div>
            <div className="tile">
                <div className="number">
                   <p>3</p>
                </div>
                <div className="tile-content">
                    <h1>Shop where you normally shop</h1>
                    <p>Browse your favorite website-based stores. When you are on the page of a product you want to add to OllaCart, hit the share icon.</p>
                </div>
            </div>
            <div className="tile">
                <div className="number">
                   <p>4</p>
                </div>
                <div className="tile-content">
                    <h1>Prioritize OllaCart</h1>
                    <p>After clicking the share icon, scroll along the list of apps to the .. &quot;more&quot; button. Add OllaCart to your favorites.</p>
                </div>
            </div>
            <div className="tile">
                <div className="number">
                   <p>5</p>
                </div>
                <div className="tile-content">
                    <h1>Share to OllaCart App</h1>
                    <p>From the product website, share to ollacart, and select &quot;Add to OllaCart&quot;. The title will be selected by artificial intelligence.</p>
                </div>
            </div>
            <div className="tile">
                <div className="number">
                   <p>6</p>
                </div>
                <div className="tile-content">
                    <h1>Click the notification</h1>
                    <p>After it has been added to OllaCart, you will recieve a push notification to access your cart with your most recent item. Your item will appear in your OllaCart to buy, share, and save.</p>
                </div>
            </div>
        </div>
        </motion.div>
  )
}

export default Featuremobile