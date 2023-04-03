import { useState } from "react";
import styled from "styled-components";
import { supabase } from "../api/supabaseClient";
import logo from "../components/sidebar/logo.png";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
export default function Auth() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    const email = values.email;
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginWrapper>
      <div className="col-6 form-widget" aria-live="polite">
        <img src={logo}></img>
        <Typography.Title
          level={2}
          style={{ marginBottom: "1px", textAlign: "left" }}
        >
          Login
        </Typography.Title>
        <Typography.Text>
          Sign in via magic link with your email below
        </Typography.Text>
        {loading ? (
          <Typography.Text>Sending magic link...</Typography.Text>
        ) : (
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            style={{ marginTop: "1em" }}
            onFinish={handleLogin}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Your email"
                type="email"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Log in
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </LoginWrapper>
  );
}
const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  background-color: #e8ebf4;
  padding: 4em;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;

  position: absolute;
  top: 20%;
  left: 40%;
`;
