import React from "react";
import Auth from "../components/auth";
import MainDashboard from "../components/dashboard/MainDashboard";
import '../styles/App.css';
import { useAuthStore } from "../components/stores/authStore";
const Home = () => {
    const userID = useAuthStore((state) => state.userID)

    return(
      <div style={{height: '100%'}}>
      {!!userID ? <MainDashboard userID={userID}/> : <Auth/>}
      </div>
    )
  }

export default Home;