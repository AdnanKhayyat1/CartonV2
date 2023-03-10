import React from 'react'
import {
    SearchOutlined,
    CloseOutlined,
    ArrowsAltOutlined,
    FormatPainterOutlined,
  } from "@ant-design/icons";
  import { Button } from "antd";

function Toolbar() {
    
  return (
    <div className="toolbar">
        <div className="toolbar-content left">
          <Button icon={<CloseOutlined />} onClick={() => {saveHandler(true);}}></Button>
        </div>
        <div class="toolbar-content middle">{pageTitle.html.replace(/\&nbsp;/g, '')}</div>

        <div className="toolbar-content right">
          <Button icon={<SearchOutlined />}></Button>
          <Button icon={<ArrowsAltOutlined />} onClick={goFullScreen}></Button>
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

  )
}

export default Toolbar