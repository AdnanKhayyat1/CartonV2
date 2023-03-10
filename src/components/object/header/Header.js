import React, { useEffect, useState } from "react";
import {
  ArrowsAltOutlined,
  FormatPainterOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import "./Header.css";
import { COVER_IMAGE_URLS } from "../../../tools/constants";
import ContentEditable from "react-contenteditable";
import { useNavigate } from "react-router-dom";
import { saveAsTemplate } from "../../../tools/services";
function Header({
  existingIndex = null,
  useCase = "",
  saveHandler,
  fsHandler,
}) {
  const [coverIndex, setCoverIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [pageTitle, setPageTitle] = useState({
    innerRef: React.createRef(),
    tagName: "h1",
    html: "My page",
  });
  const navigate = useNavigate();

  const onTextChange = (e) => {
    setPageTitle({ ...pageTitle, html: e.target.value });
  };

  useEffect(() => {
    setCoverIndex(
      existingIndex
        ? existingIndex
        : Math.floor(Math.random() * COVER_IMAGE_URLS.length)
    );
  }, []);

  return (
    <>
      <div
        className={`Header`}
        style={{ backgroundColor: COVER_IMAGE_URLS[coverIndex] }}
      >

        <ContentEditable
          className="page-title"
          onChange={onTextChange}
          {...pageTitle}
        />

        <div className="toolbar-content right">
          <Button icon={<HeartOutlined />} onClick={saveAsTemplate}></Button>
          <Button icon={<ArrowsAltOutlined />} onClick={fsHandler}></Button>
          <Button
            icon={<FormatPainterOutlined />}
            onClick={() => {
              setShowPicker(!showPicker);
            }}
          ></Button>
        </div>
        {showPicker && (
          <div className="color-picker">
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
      </div>
    </>
  );
}

export default Header;
