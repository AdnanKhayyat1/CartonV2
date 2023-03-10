import React from "react";
import "./cardPreview.css";
import { TiDocumentAdd, TiDocument } from "react-icons/ti";
import { COVER_IMAGE_URLS } from "../../tools/constants";

function CardPreview({ page, clickHandler }) {
  return (
    <div className="preview-card" id={page.id}  onClick={clickHandler} style={{
        backgroundColor: COVER_IMAGE_URLS[page.coverIndex]
    }}>
      <TiDocument size={20} sx={{
        minHeight: 0, minWidth: 0, padding: 0 
      }}/>
      {page.title}
    </div>
  );
}

export default CardPreview;
