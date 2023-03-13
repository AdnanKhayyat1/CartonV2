import React, { useState, createContext, useEffect } from "react";
import NewObject from "./NewObject";
import styled from "styled-components";
import { Col, Row } from "antd";
import { ObjectApi } from "../../api/objectApi";
import { useQuery } from "react-query";
export const StateContext = createContext();

const Wrapper = styled.div`
  margin: 10px auto;
  width: 90%;
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  height: 100%;
`;
const Wrapper2 = styled.div``;
function DashboardNew() {
  const [splitScreen, setSplitScreen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [splitScreen]);

  return (
    <StateContext.Provider value={{ splitScreen, setSplitScreen }}>
      <Wrapper2>
        <Row>
          <Col span={splitScreen ? 12 : 24}>
            <NewObject />
          </Col>
          {splitScreen && (
            <Col span={12}>
              <NewObject />
            </Col>
          )}
        </Row>
      </Wrapper2>
    </StateContext.Provider>
  );
}

export default DashboardNew;
