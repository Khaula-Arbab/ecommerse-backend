import react from "react";
import "../componentStyles/Footer.css"
import {Phone, Mail, GitHub, LinkedIn, Instagram, Facebook} from "@mui/icons-material"

function Footer(){
  return(
  <footer className= "footer">
      <div className="footer-container">
            {/* section 1 */}
            <div className="footer-section contact ">
           <h3>Contact Us</h3>
           <p><Phone fontSize="small"/>Phone: +92942863946</p>
           <p><Mail fontSize="small"/>Email: novamart903@gmail.com</p>
            </div>
           {/* section 2 */}
           <div className="footer-section social">
          <h3>Follow me</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <GitHub className="social-icon" /></a>
            <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
            <LinkedIn className="social-icon" /></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><Instagram className="social-icon" /></a>
           <a href="https://www.instagram.com/" target="_blank" rel="noopener  noreferrer"><Facebook className="social-icon" /></a>
          </div>
          </div>
          {/* section 3 */}
          <div className="footer-section about">
            <h3>About NovaMart</h3>
            <p>NovaMart is your one-stop online shop for all your needs. We offer a wide range of products at competitive prices, ensuring quality and customer satisfaction.</p>
          </div>  
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 NovaMart. All rights reserved.</p>
      </div>
  </footer>
  )
}
export default Footer;