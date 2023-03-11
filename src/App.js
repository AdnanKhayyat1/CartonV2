import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/auth";
import Page from "./components/object/Page";
import Dashboard from "./components/dashboard/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import NewObject from "./components/NewObject/NewObject";
import DashboardNew from "./components/NewObject/DashboardNew";
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
              <Route exact path="/newobject/" element={<DashboardNew/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
