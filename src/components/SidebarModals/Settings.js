import React, { useEffect, useState } from "react";
import { Modal, Space, Typography, Divider, Button, Spin } from "antd";
import { useAuthStore } from "../stores/authStore";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";

function Settings({ showSettingsModal, setShowSettingsModal }) {
  const userID = useAuthStore((state) => state.userID);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("id", userID);
        if (error) throw new Error(error.message);



        setEmail(data[0].email);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (userID !== "" && email === "") {
      getUserDetails();
    }
  }, [userID]);
  const navigate = useNavigate();
  const closeModal = () => setShowSettingsModal(false);
  const signOut = async () => {
    try{
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error ) throw new Error(error.message);
        navigate(0)
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }

  }
  return (
    <Modal
      open={showSettingsModal}
      onCancel={closeModal}
      onOk={closeModal}
    >
      {isLoading ? (
        <Spin />
      ) : (
        <>
        <Typography.Title level={3}>Settings</Typography.Title>

        <Space align="center">
            <Typography.Text strong>Account:</Typography.Text>
            {email}
        </Space>
        <Button block onClick={signOut}>Sign out</Button>
        </>
        
    
      )}
    </Modal>
  );
}

export default Settings;
