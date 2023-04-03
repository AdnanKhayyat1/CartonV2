import "./styles/App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Navbar from "./components/navbar/Navbar";
import ObjectContainer from "./components/NewObject/ObjectContainer";
import { supabase } from "./api/supabaseClient";

import { useAuthStore } from "./components/stores/authStore";
import SideBarV2 from "./components/sidebar/SideBarV2";
import TagGallery from "./components/Gallery/TagGallery";

function App() {
  const [session, setSession] = useState(null);
  const [userID, setUserID] = useAuthStore((state) => [
    state.userID,
    state.updateUserID,
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session && userID === "") {
      setUserID(session.user.id);
    }
  }, [userID, session]);

  return (
    <Router>
      <div className="App">
        <div className="main-site">
          {!!userID && <SideBarV2 userID={userID} />}
          <div className="content">
            {!!userID && <Navbar />}
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route
                exact
                path="/newobject/:id"
                element={<ObjectContainer />}
              />
              {/* <Route exact path="/graph" element={</>} /> */}
              <Route exact path="/tag/:id" element={<TagGallery />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
