import react from "react"
import "../componentStyles/imageSlider.css"
import {useState, useEffect} from "react"
function ImageSlider(){
  const images = [
    "./images/banner1.jpg",
    "./images/banner1.jpg",
    "./images/banner1.jpg"  
  ]
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(()=>{
   const interval =  setInterval(()=>{
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000)
    return () => clearInterval(interval);
  },[])
  return(
     <div className="image-slider-container">
       {/* images */}
     <div className="slider-images" style = {{transform: `translateX(-${currentIndex*100}%)`}}>

        {images.map((image, index) => 
          (<div className="slider-item" key={index}>
          <img src={image} alt="Banner 1"/>
        </div>))
        }

      </div>
      
      {/* dots */}
      <div className="slider-dots">
        {images.map((_, index)=> (
               <span className={`dot ${index===currentIndex? "active": ''} `}
               onClick = {()=>setCurrentIndex(index)}
               key={index}/> 
        ))}
        
      </div>
     </div>
  )
}

export default ImageSlider;