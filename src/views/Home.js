import React, { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";
import Auth from "../components/auth";
import Dashboard from "../components/dashboard/Dashboard";
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
      <div style={{}}>
      {!session ? <Auth /> : <Dashboard />}
      </div>
    )
  
  }

export default Home;