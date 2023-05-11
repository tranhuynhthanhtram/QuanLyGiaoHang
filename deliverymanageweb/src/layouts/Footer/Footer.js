import React from "react";
import "./styleFooter.css";
import {
   AiFillFacebook,
   AiFillGithub,
   AiFillInstagram
} from "react-icons/ai";

const Footer = (props) => {
   return (
      <>
         <div className="footer flex">
            <div className="contacts-footer">
               <a
                  href="https://www.facebook.com/profile.php?id=100007484493391"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover"
               >
                  <AiFillFacebook />
               </a>
               <a
                  href="https://www.instagram.com/coca.1604/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover"
               >
                  <AiFillInstagram />
               </a>
               <a
                  href="https://github.com/tranhuynhthanhtram"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover"
               >
                  <AiFillGithub />
               </a>
            </div>
            <div className="copyright-footer">@ThanhTram</div>
         </div>
      </>
   );
};

export default Footer;