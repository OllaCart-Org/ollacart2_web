import React from 'react';
import { useState } from "react";
import Signin from "./Signin";
import Overlay from "./Overlay";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const Shoppingcards = () => {
  const [ref3, inView3] = useInView({ triggerOnce: true });

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <motion.div id='shopping-container'
      ref={ref3}
      initial={{
        opacity: 0,
        y: 40, // Move slightly down initially
      }}
      animate={{
        opacity: inView3 ? 1 : 0,
        y: inView3 ? 0 : 40,
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="shopping-content">

        {/* <img className='url' src="./placeholder-image.svg" alt="shopping url image" /> */}
        <img className='url'
          src="/placeholder-image.svg"
          alt="shopping url"
          layout="responsive"
        //width={100} // Original width of the image
        //height={100} // Original height of the image
        />
        <h1>Online Shoppers Saved: <span>100</span></h1>
        {/* <div className="img-main">
                <img src="./profile.svg" alt="profile avatar pictures" />
                <img src="./profile.svg" alt="profile avatar pictures" />
                <img src="./profile.svg" alt="profile avatar pictures" />
            </div> */}
      </div>
      <div className="shop-online">
        <div className="shop-sigin">
          <Signin isOpen={modalOpen} closeModal={closeModal} />
          <Overlay isOpen={modalOpen} closeModal={closeModal} />
          <h1>Join your friends shopping and saving online </h1>
          <button onClick={openModal}> <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.3417 31.8097H18.9006C18.4205 31.8097 18.0312 31.4205 18.0312 30.9405C18.0312 30.4605 18.4205 30.0713 18.9006 30.0713H23.3417C23.8216 30.0713 24.2108 30.4605 24.2108 30.9405C24.2108 31.4205 23.8216 31.8097 23.3417 31.8097Z" fill="#2B2D42" />
            <path d="M25.3547 14.2468C25.3547 16.7757 23.4311 18.6276 20.8492 18.6276C18.2673 18.6276 16.3438 16.7757 16.3438 14.2468C16.3438 11.7184 18.2673 9.86621 20.8492 9.86621C23.4311 9.86621 25.3547 11.7182 25.3547 14.2468ZM18.1958 14.2468C18.1958 15.8676 19.282 16.9184 20.8492 16.9184C22.4164 16.9184 23.5022 15.8676 23.5022 14.2468C23.5022 12.6265 22.4164 11.5757 20.8492 11.5757C19.282 11.5757 18.1958 12.6264 18.1958 14.2468Z" fill="#FE4A49" />
            <path d="M27.2366 30.1917C26.9338 30.1917 26.6395 30.0331 26.4795 29.7507C26.2429 29.3329 26.3896 28.8024 26.8076 28.5659C27.8363 27.9832 29.0156 26.9938 29.2407 25.9643C29.6034 24.3053 29.2584 22.9967 28.1548 21.8465C27.2726 20.9273 26.6621 20.5392 25.2751 19.8401C24.8465 19.6238 24.6738 19.1012 24.8902 18.6724C25.106 18.2437 25.629 18.0715 26.0577 18.2876C27.5487 19.0392 28.344 19.5326 29.4093 20.6428C30.9087 22.2053 31.4234 24.1206 30.9393 26.3356C30.5137 28.2807 28.5074 29.6012 27.6645 30.0785C27.529 30.1553 27.382 30.1917 27.2366 30.1917Z" fill="#FFFFFF" />
            <path d="M14.4609 30.1916C14.3154 30.1916 14.1686 30.1552 14.0331 30.0785C13.19 29.6012 11.1837 28.2807 10.7583 26.3355C10.274 24.1205 10.7889 22.2052 12.2883 20.6427C13.3534 19.5326 14.1487 19.0391 15.6398 18.2876C16.0687 18.0715 16.5914 18.2438 16.8072 18.6724C17.0236 19.1012 16.8511 19.6237 16.4225 19.8401C15.0354 20.5391 14.4248 20.9273 13.5426 21.8465C12.4392 22.9965 12.094 24.3051 12.4565 25.9643C12.6815 26.9938 13.8611 27.9832 14.89 28.5657C15.3076 28.8023 15.4543 29.3327 15.2181 29.7505C15.0578 30.0332 14.7637 30.1916 14.4609 30.1916Z" fill="#009FB7" />
          </svg>
            <p>Sign in</p></button>
        </div>
        <div className="shop-cards">
          <div className="shop-card">

            <img
              src="./native.svg"
              alt="card"
              layout="responsive"
              width={96}
              height={96}
            />
            <h1>Native Checkout</h1>
            <p> Information and transactions are more secure, and save tons of time on data entry with a single purchase across multiple websites.</p>
          </div>
          <div className="shop-card">
            <img
              src="./social.svg"
              alt="card"
              layout="responsive"
              width={96}
              height={96}
            />
            <h1>Social Shopping</h1>
            <p>Share your cart with friends and family, and browse a feed of what your friends are shopping for. Get feedback, recommendations, and shop comparable products with artificial intelligence.</p>
          </div>
          <div className="shop-card">
            <img
              src="./discount.svg"
              alt="card"
              layout="responsive"
              width={96}
              height={96}
            />
            <h1>Discount Codes</h1>
            <p>Save items from any online store to a single cart. No more juggling multiple tabs and checkouts. Monitor prices, discounts, sales. Save with automatic and exclusive discounts.</p>
          </div>
          <div className="shop-card">
            <img
              src="./affliate.svg"
              alt="card"
              layout="responsive"
              width={96}
              height={96}
            />
            <h1>Affiliate Shopping</h1>
            <p>Share any number of products in one place, and earn from any recommendation directly on OllaCart. Earn discounts, money, and free products for activities and influence.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Shoppingcards