import React, { useState } from "react";
import { Input, Divider, Button, Dropdown } from "antd";
import {
  HighlightFilled,
  PlusCircleTwoTone,
  ApiTwoTone,
  ExperimentTwoTone,
  PlusCircleOutlined,
  HighlightOutlined,
  ExperimentOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./newObject.css";
import { COVER_IMAGE_URLS } from "../../tools/constants";
import Editor from "../object/Editor";
import Property from "../../tools/Property";
import ContentGridV2 from "./ContentGridV2";


function NewObject() {
  const [pageTitle, setPageTitle] = useState("");
  const [showIconSet, setShowIconSet] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [coverIndex, setCoverIndex] = useState(-1);

  const [bio, setBio] = useState("");

  const [properties, setProperties] = useState([]);

  const addProperty = () => {
    setProperties([...properties, <Property data={{}} />]);
  };
  return (
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
      <ContentGridV2/>

    </div>
  );
}

export default NewObject;
