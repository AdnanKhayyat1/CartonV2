import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GridRow from "../NewObject/GridRow";
import { useCellStore } from "../stores/cellStore";
import { useParams } from "react-router-dom";
import { TAG_GALLERY_COLORS } from "../../tools/constants";
import { titleCase } from "../../tools/utils_";
import { useTagStore } from "../stores/tagStore";
import { shallow } from "zustand/shallow";
import { Typography } from "antd";
import { DisconnectOutlined } from "@ant-design/icons";
import { useAuthStore } from "../stores/authStore";

function TagGallery() {
  const { id: tagID } = useParams();
  const cells = useCellStore((state) => state.cells);
  const tags = useTagStore((state) => state.tags, shallow);
  const [showTaggedCell, setShowTaggedCell] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const updateIsSidebarOpen = useAuthStore((state) => state.updateIsSidebarOpen);
  useEffect(() => {

    const selectedTag = tags.filter((tag) => tag._id === tagID)[0];
    setSelectedTag(selectedTag);
    updateIsSidebarOpen(true);

  }, [tags, tagID]);

  useEffect(() => {
  
    const taggedCells = cells.filter((cell) => cell.tags.includes(tagID));
    setShowTaggedCell(taggedCells);

  }, [cells]);

  return (
    <GalleryWrapper>
      {selectedTag && (
        <>
          <GalleryHeader
            backgroundColor={TAG_GALLERY_COLORS[selectedTag.color][0]}
          >
            <Typography.Title
              level={1}
              style={{
                color: `${TAG_GALLERY_COLORS[selectedTag.color][6]}`,
                marginBottom: 0,
              }}
            >
              {titleCase(selectedTag.name)}
            </Typography.Title>
          </GalleryHeader>
          <Gallery>
            {showTaggedCell && showTaggedCell.length > 0 ? (
              showTaggedCell.map((cell) => (
                <GridRow cell={cell} editorReadOnly={true} />
              ))
            ) : (
              <NoItemsYet>
                <DisconnectOutlined style={{ fontSize: "2em" }} />
                <Typography.Title level={5}>
                  You have no items tagged with {titleCase(selectedTag.name)}.
                  <br /> Note: Tag Gallery does NOT show tagged pages, only sections.
                </Typography.Title>
              </NoItemsYet>
            )}
          </Gallery>
        </>
      )}
    </GalleryWrapper>
  );
}
const NoItemsYet = styled.div`
position: absolute;
top: 50%;
left: 50%;


`;
const GalleryHeader = styled.div`
  width: 100%;
  background: ${(props) => props.backgroundColor};
  padding-top: 2em;
  padding-bottom: 1px;
  padding-left: 0.5em;
  text-align: left;
`;

const GalleryWrapper = styled.div`
  width: 100%:
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #E8EBF4;
`;
const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-auto-flow: row;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  padding: 10px;
`;
export default TagGallery;
