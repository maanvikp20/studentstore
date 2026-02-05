import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export default function Footer   () {

    return(
        <footer>
            <p className="footer-text">
                &copy; All rights reserved. Designed by West-mec North East Campus.
            </p>
            <div>
                <FaInstagram size={15} style={{color:"black", marginRight:"1rem"}}/>
                <FaTwitter size={15} style={{color:"black", marginRight:"1rem"}}/>
                <FaFacebook size={15} style={{color:"black", marginRight:"1rem"}}/>
            </div>
        </footer>        
    )
}
