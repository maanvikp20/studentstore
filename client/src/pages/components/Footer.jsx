import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export default function Footer   () {

    return(
        <footer>
            <p className="footer-text">
                &copy; All rights reserved. Designed by Maanvik Poddar, Jose Pajon, and Montgomery McDonald.
            </p>
            <div>
                <FaInstagram size={15} style={{color:"black", marginRight:"1rem"}}/>
                <FaTwitter size={15} style={{color:"black", marginRight:"1rem"}}/>
                <FaFacebook size={15} style={{color:"black", marginRight:"1rem"}}/>
            </div>
        </footer>        
    )
}
