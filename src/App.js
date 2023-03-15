import "./styles/App.css";
import { useState } from "react";

import Page from "./components/object/Page";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import DashboardNew from "./components/NewObject/DashboardNew";
import { create } from "zustand";
import Graph from "./components/Graph/Graph";

function App() {
  const [showSideBar, setShowSideBar] = useState(true);

  const sideBarClickHandler = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <Router>
      <div className="App">
        <div className="main-site">
          <div className="side-content">
            {showSideBar && <Sidebar onSideBarClick={sideBarClickHandler} />}
          </div>

          <div className="content">
            <Navbar onSideBarClick={sideBarClickHandler} />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/pages/:id" element={<Page />} />
              <Route exact path="/newobject/" element={<DashboardNew />} />
              <Route exact path="/graph" element={<Graph />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
