import React, { useState, useEffect, useCallback } from 'react';
import classes from './Carousel.module.css';

const Carousel = ({ images, autoSlide = true, slideInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (autoSlide) {
      const interval = setInterval(nextSlide, slideInterval);
      return () => clearInterval(interval);
    }
  }, [autoSlide, slideInterval, nextSlide]);

  return (
    <div className={classes.carousel}>
      <div
        className={classes.carouselInner}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div className={classes.carouselItem} key={index}>
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <button className={classes.carouselControlPrev} onClick={prevSlide}>
        ❮
      </button>
      <button className={classes.carouselControlNext} onClick={nextSlide}>
        ❯
      </button>
      <div className={classes.carouselIndicators}>
        {images.map((_, index) => (
          <button
            key={index}
            className={index === currentIndex ? classes.active : ''}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
