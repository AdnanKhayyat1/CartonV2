import React, { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";
import Auth from "../components/auth";
import MainDashboard from "../components/dashboard/MainDashboard";
import '../styles/App.css';
const Home = () => {
    const [session, setSession] = useState(null);
  
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    }, []);
  
    return(
      <div style={{height: '100%'}}>
      {!session ? <Auth /> : <MainDashboard />}
      </div>
    )
  
  }

export default Home;