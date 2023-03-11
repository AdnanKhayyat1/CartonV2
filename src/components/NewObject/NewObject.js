import React, { useState, useContext } from "react";
import { Input, Divider, Button, Breadcrumb } from "antd";
import {
  PlusCircleOutlined,
  HighlightOutlined,
  ExperimentOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./newObject.css";
import { COVER_IMAGE_URLS } from "../../tools/constants";
import Property from "../../tools/Property";
import ContentGridV2 from "./ContentGridV2";
import styled from "styled-components";
import { StateContext } from "./DashboardNew";

const Nav = styled.div`
  height: 20px;
  padding-left: 0px;
  border-radius: 10px 10px 0px 0px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 10px;
  align-items: center;
`;
const Wrapper = styled.div`
  border-radius: 10px;
  margin: 10px;
`;
function NewObject({ useCase }) {
  const [pageTitle, setPageTitle] = useState("");
  const [showIconSet, setShowIconSet] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [coverIndex, setCoverIndex] = useState(-1);
  const { setSplitScreen } = useContext(StateContext);

  const [bio, setBio] = useState("");

  const [properties, setProperties] = useState([]);

  const addProperty = () => {
    setProperties([...properties, <Property data={{}} />]);
  };
  return (
    <Wrapper>
      {useCase == "side-page" && (
        <Nav>
          <ArrowLeftOutlined
            className="navbar-icon"
            onClick={() => setSplitScreen(false)}
          />

          <Breadcrumb
            style={{
              margin: "0 auto",
            }}
            items={[
              {
                href: "",
                title: <HomeOutlined />,
              },
              {
                href: "",
                title: <span>{pageTitle ? pageTitle : "Parent"}</span>,
              },
              {
                title: "New Object",
              },
            ]}
          />
        </Nav>
      )}
      <div
        className="object-app"
        style={{
          backgroundColor:
            coverIndex >= 0 ? COVER_IMAGE_URLS[coverIndex] : "white",
        }}
      >
        <div className="header-main" onMouseLeave={() => setShowIconSet(false)}>
          {pageTitle !== "" && (showIconSet || showPicker) && (
            <div className="icon-set">
              {showPicker && (
                <div className="color-picker-cover">
                  {COVER_IMAGE_URLS.map((color, index) => {
                    return (
                      <div
                        className="color-icon"
                        style={{
                          backgroundColor: color,
                        }}
                        value={index}
                        key={index}
                        onClick={() => {
                          setCoverIndex(index);
                          setShowPicker(!showPicker);
                        }}
                      ></div>
                    );
                  })}
                </div>
              )}
              <Button
                className="header-btn"
                icon={<HighlightOutlined />}
                onClick={() => {
                  setShowPicker(!showPicker);
                }}
                type="text"
              >
                Theme
              </Button>
              <Button
                className="header-btn"
                icon={<ExperimentOutlined />}
                onClick={() => {}}
                type="text"
              >
                Logic
              </Button>

              {/* <PlusCircleTwoTone className="btn-icon"/>
            <ApiTwoTone className="btn-icon" disabled={true}/> */}
            </div>
          )}
          <Input
            placeholder="New Page Title"
            onMouseEnter={() => setShowIconSet(true)}
            bordered={false}
            style={{ fontSize: 50, fontWeight: 600, maxWidth: "30vw" }}
            onChange={(e) => {
              setPageTitle(e.target.value);
            }}
          />
        </div>
        <div className="header-section">
          <Input
            placeholder="Add bio"
            style={{ color: "grey" }}
            bordered={false}
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />
        </div>
        <div className="header-section">
          <Divider orientation="left" orientationMargin="0">
            Properties
          </Divider>
          {properties}
          <Button
            icon={<PlusCircleOutlined />}
            type="dashed"
            onClick={() => {
              addProperty();
            }}
          >
            Add property
          </Button>
        </div>
        <Divider />
        <ContentGridV2 />
      </div>
    </Wrapper>
  );
}

export default NewObject;
