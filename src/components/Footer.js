import "../styles/Footer.css"
import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {

    const redirectGitHub = () => {
        window.open("https://github.com/ant-zmp");
    }

    const redirectLinkedIn = () => {
        window.open("https://www.linkedin.com/in/okzampo/");
    }

    return (
        <div className={"footer"}>
            <div className={"socialMedia"}>
                <GitHubIcon onClick={redirectGitHub}/> <LinkedInIcon onClick={redirectLinkedIn}/>
            </div>
            <p>&copy; 2024 - awesomepizza.com </p>
        </div>
    )
}

export default Footer;