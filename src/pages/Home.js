import "../styles/Home.css"
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import BackgroundImage from "../assets/ap_bg_ai3.jpg";

export function Home() {

    let navigate = useNavigate();

    return (
        <div className={"home"}
             style={{backgroundImage: `url(${BackgroundImage})`}}>
            <div className={"headerContainer"}>
                <h1>Pizza is a great idea!</h1>
                <p>Order online from your friendly neighborhood pizzeria</p>

                <motion.button whileHover={{scale: 1.1}}
                               onClick={() => navigate("/menu")}> Order
                </motion.button>

                <motion.button whileHover={{scale: 1.1}}
                               onClick={() => navigate("/tracking")}> Track order
                </motion.button>
            </div>
        </div>
    )
}