import './App.css';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import Navbar from "./components/Navbar";
import {MainBody} from "./pages/MainBody";
import {BrowserRouter as Router} from "react-router-dom";
import Footer from "./components/Footer";
import {AnimatePresence} from 'framer-motion';


function App() {
    return (
        <div className="App">
            <Router>
                <AnimatePresence>
                    <Navbar/>
                    <MainBody/>
                    <Footer/>
                </AnimatePresence>
            </Router>
        </div>
    );
}

export default App;
