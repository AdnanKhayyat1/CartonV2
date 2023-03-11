import React, {useContext} from "react";
import styled from "styled-components";
import { FileOutlined  } from "@ant-design/icons";
import { StateContext } from "./DashboardNew";
const Wrapper = styled.div`
  margin: 10px;

  text-align: left;
  background-color: white;
  flex: 9;
`;
const Title = styled.div`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  line-height: 1.6;
  padding: 10px;
  font-weight: 600;
`;
const Bio = styled.div``;

function EmbeddedObject() {
    const { setSplitScreen } = useContext(StateContext);

  return (
    <Wrapper onClick={() => setSplitScreen(true)}>
      <Title>
        <FileOutlined /> Embedded Object
      </Title>
    </Wrapper>
  );
}

export default EmbeddedObject;
