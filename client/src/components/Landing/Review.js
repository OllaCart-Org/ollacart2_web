import React from 'react'
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const Review = () => {
  const [ref5, inView5] = useInView({ triggerOnce: true });

  return (
    <motion.div id='review-container'
    ref={ref5}
    initial={{
      opacity: 0,
      y: 40, // Move slightly down initially
    }}
    animate={{
      opacity: inView5 ? 1 : 0,
      y: inView5 ? 0 : 40,
    }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    >
        <div className="review-content">
            <h1>User <span>reviews</span></h1>
            <p>Gain insight into OllaCart through the personal experiences and testimonials of users.</p>
        </div>
        <div className="review-main">
            <div className="review-card delay-3">
                <div className="review-profile">
                    <img
        src="/review-1.png"
        alt="customer review"
        layout="responsive"
        width={56} // Original width of the image
        height={56} // Original height of the image
      />
                    <h1>Sarah L.</h1>
                </div>
                <p>&quot;OllaCart made my holiday shopping a breeze. I could see what my friends were shopping for and gave great gift ideas to my family. Love it!&quot;</p>
                <div className="star-section">
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                </div>
            </div>
            <div className="review-card delay-2">
                <div className="review-profile">
                    <img
        src="./profile.svg"
        alt="customer review"
        layout="responsive"
        width={56} // Original width of the image
        height={56} // Original height of the image
      />
                    <h1>Mike T.</h1>
                </div>
                <p>&quot;I love how I can add items from different stores and check out all at once. Plus, sharing my cart with friends is a game-changer.&quot;</p>
                <div className="star-section">
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                </div>
            </div>
            <div className="review-card delay">
                <div className="review-profile">
                    <img
        src="/review-3.png"
        alt="customer review"
        layout="responsive"
        width={56} // Original width of the image
        height={56} // Original height of the image
      />
                    <h1>Jessica R.</h1>
                </div>
                <p>&quot;The social aspect of Ollacart is fantastic. I can keep up with trends and get feedback on my choices before I buy.&quot;</p>
                <div className="star-section">
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                <img
        src="./star.svg"
        alt="review star pics"
        layout="responsive"
        width={20} // Original width of the image
        height={20} // Original height of the image
      />
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default Review