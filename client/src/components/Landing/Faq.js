import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';


const Faq = () => {
  const [ref7, inView7] = useInView({ triggerOnce: true });

    const [activeIndex, setActiveIndex] = useState(null);
  const questions = [
    { question: 'What can I buy with OllaCart?', answer: 'You can buy any legal goods sold online with OllaCart.' },
    { question: 'How do I process returns with OllaCart?', answer: 'Returns are processed directly with the retailer. You will use the information provided when your order is placed via OllaCart.' },
    { question: 'How does OllaCart save me money?', answer: 'OllaCart has a price match system, and crawls the web with artificial intelligence saving discount codes to our database. Did you know that usually discount companies scan your emails? We do not do that. We also help you monitor prices in case a price changes over time.' },
    { question: 'How do I sell items on OllaCart?', answer: 'It is as easy as purchasing the ability to sell items on the account page, and then post your share link where you want people to see your OllaCart Store.' },
    { question: 'How does OllaCart make money?', answer: 'OllaCart makes money as the top-of-funnel data provider to retailers, negotiated product spread, affiliate revenue, and selling premium features.' },
    { question: 'Can I make money on OllaCart?', answer: 'Anyone can make affiliate revenue on OllaCart by sharing items that result in a purchase, or their share cart.' },
  ];
  const toggleActive = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const MinusIcon = () => (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.912109" y="0.371094" width="41" height="41" rx="20.5" fill="#FFC827"/>
    <g clipPath="url(#clip0_110_730)">
    <path d="M29.6621 20.8713C29.6621 21.2771 29.5886 21.6663 29.4577 21.9532C29.3268 22.2401 29.1493 22.4013 28.9642 22.4013H13.61C13.4249 22.4013 13.2474 22.2401 13.1165 21.9532C12.9856 21.6663 12.9121 21.2771 12.9121 20.8713C12.9121 20.4655 12.9856 20.0764 13.1165 19.7894C13.2474 19.5025 13.4249 19.3413 13.61 19.3413H28.9642C29.1493 19.3413 29.3268 19.5025 29.4577 19.7894C29.5886 20.0764 29.6621 20.4655 29.6621 20.8713Z" fill="black"/>
    </g>
    <defs>
    <clipPath id="clip0_110_730">
    <rect width="17" height="17" fill="white" transform="translate(12.9121 12.3711)"/>
    </clipPath>
    </defs>
    </svg>
    
);

const PlusIcon = () => (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.912109" y="0.371094" width="41" height="41" rx="20.5" fill="#FFC827"/>
    <path d="M29.9121 20.8711C29.9121 21.1416 29.8046 21.4011 29.6134 21.5923C29.4221 21.7836 29.1626 21.8911 28.8921 21.8911H22.4321V28.3511C22.4321 28.6216 22.3246 28.8811 22.1334 29.0723C21.9421 29.2636 21.6826 29.3711 21.4121 29.3711C21.1416 29.3711 20.8821 29.2636 20.6909 29.0723C20.4996 28.8811 20.3921 28.6216 20.3921 28.3511V21.8911H13.9321C13.6616 21.8911 13.4021 21.7836 13.2109 21.5923C13.0196 21.4011 12.9121 21.1416 12.9121 20.8711C12.9121 20.6006 13.0196 20.3411 13.2109 20.1498C13.4021 19.9586 13.6616 19.8511 13.9321 19.8511H20.3921V13.3911C20.3921 13.1206 20.4996 12.8611 20.6909 12.6698C20.8821 12.4786 21.1416 12.3711 21.4121 12.3711C21.6826 12.3711 21.9421 12.4786 22.1334 12.6698C22.3246 12.8611 22.4321 13.1206 22.4321 13.3911V19.8511H28.8921C29.1626 19.8511 29.4221 19.9586 29.6134 20.1498C29.8046 20.3411 29.9121 20.6006 29.9121 20.8711Z" fill="black"/>
    </svg>
    
);

  return (
    <motion.div id='faq-container'
    ref={ref7}
    initial={{
      opacity: 0,
      y: 40, // Move slightly down initially
    }}
    animate={{
      opacity: inView7 ? 1 : 0,
      y: inView7 ? 0 : 40,
    }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    >
        <div className="faq-img">

            <img src="./faq-bg.svg" alt="faq background" 
            width={1000} 
            height={1000}
            style = {{ objectFit:"cover" }}/>
        </div>
        <div className="faq-main">
        <div className="faq-content">
            <h1>FAQs</h1>
            <p>Have questions? Our FAQ section addresses the most common queries about OllaCart. </p>
        </div>
        <div className='question-section'>
      {questions.map((item, index) => (
        <div key={index} className='faqitem'>
          <div className='question'  onClick={() => toggleActive(index)}>
            <span>{item.question}</span>
            <span className='icon'>
            {activeIndex === index ? <MinusIcon /> : <PlusIcon />}
        </span>
          </div>
          {activeIndex === index && <div className='answer'>{item.answer}</div>}
        </div>
      ))}
    </div>
        </div>

    </motion.div>
  )
}

export default Faq