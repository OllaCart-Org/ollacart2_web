import React from 'react'
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const Cta = () => {
  const [ref8, inView8] = useInView({ triggerOnce: true });

  return (
    <motion.div id='cta-container'
    ref={ref8}
    initial={{
      opacity: 0,
      y: 40, // Move slightly down initially
    }}
    animate={{
      opacity: inView8 ? 1 : 0,
      y: inView8 ? 0 : 40,
    }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    >
        <div className="cta-img">
            <img src="./cta.svg" alt="cta section background" 
            width={1000} 
            height={1000}
            style = {{ objectFit:"cover" }}
            />
        </div>
        <div className="cta-main">
            <div className="cta-heading">
                <h1>Join the waitlist for OllaCart Premium</h1>
                <p>Anonymous Purchase, Gifting, and feature any amount of products to sell directly on your own OllaCart</p>
            </div>
            <div className="email-section">
                <div className="email">
                    <input type="email" placeholder='Enter your email' />
                    <button>Get on the short list</button>
                </div>
                <div className="term">
                <p>By clicking Sign Up you&apos;re confirming that you agree with our </p>
                <a href="#">Terms and Conditions.</a>
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default Cta