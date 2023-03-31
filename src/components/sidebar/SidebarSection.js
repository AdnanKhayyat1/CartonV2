import React, { useState } from "react";
import styled from "styled-components";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
function SidebarSection({ title, children }) {
  const [showChildren, setShowChildren] = useState(true);
  const collapseChildren = (e) => {
    e.preventDefault();
    setShowChildren(!showChildren);
  };
  return (
    <SectionWrapper>
      <SectionTitle>
        {showChildren ? (
          <DownOutlined onClick={collapseChildren} />
        ) : (
          <RightOutlined onClick={collapseChildren} />
        )}
        {title}
      </SectionTitle>
      {showChildren && <SectionItems>{children}</SectionItems>}
    </SectionWrapper>
  );
}
const SectionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 15px;
  gap: 0.2em;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 1em;
`;
const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  gap: 0.1em;
  align-items: center;
`;
const SectionItems = styled.div`
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
`;

export default SidebarSection;
