import React, { useState } from 'react'

interface Props{
  slides: {image: string, cat: string}[]
}

const ImageSlider = ({slides}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(Number(localStorage.getItem('slide_index')))

  const goToPrevious = async () =>{
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    await setCurrentIndex(newIndex);
    await localStorage.setItem('slide_index', newIndex.toString())
  }

  const goToNext = async () =>{
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    await setCurrentIndex(newIndex);
    await localStorage.setItem('slide_index', newIndex.toString())
  }
  const goToSlide = async (slideIndex: number) => {
    setCurrentIndex(slideIndex);
    await localStorage.setItem('slide_index', slideIndex.toString())
  };

  return (
    <div className="image-slider-container">
      <div className="slide-container">
        <img className='slide-image' src={slides[currentIndex].image}/>
        <span className='slide-cat'>{slides[currentIndex].cat}</span>
        <div className="slide-left-arrow slide-arrow" onClick={goToPrevious}>❰</div>
        <div className="slide-right-arrow slide-arrow" onClick={goToNext}>❱</div>
      </div>
      <div className='slide-dots-container'>
        {slides.map((slide, slideIndex) => (
          <div key={slideIndex}>
            {
              slideIndex === currentIndex ? 
              (<div className='current-slide-dot' key={slideIndex} onClick={() => goToSlide(slideIndex)}> ● </div>)
              :
              (<div className='slide-dots' key={slideIndex} onClick={() => goToSlide(slideIndex)}> ● </div>)
            }
          </div>  
        ))}
      </div>
    </div>
  )
}

export default ImageSlider
