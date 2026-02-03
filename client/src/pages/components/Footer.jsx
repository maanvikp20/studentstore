import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export default function Footer   () {

    return(
        <footer className="footer">
            <p className="footer_text">
                &copy; Lorem ipsum dolor sit amet, consectetur adipisicing elit. A id suscipit distinctio! Optio esse, earum corporis voluptatibus, repellendus sunt ex sapiente facere
            </p>
            <div>
                <FaInstagram size={15} style={{color:"white", marginRight:"1rem"}}/>
                <FaTwitter size={15} style={{color:"white", marginRight:"1rem"}}/>
                <FaFacebook size={15} style={{color:"white", marginRight:"1rem"}}/>
            </div>
        </footer>        
    )
}
