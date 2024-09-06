import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Header from "./components/Header";
import Wallet from "./screens/Wallet";
import Footer from "./components/Footer";
import About from "./screens/About";

function App() {
  return (
    <Router>
      <Header />
      <div className="bg-gray-100 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/about" element={<About />} />
          <Route path="/unsubscribe/:mail" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
