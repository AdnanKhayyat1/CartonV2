import React, { useState, createContext, useEffect } from "react";
import NewObject from "./NewObject";
import styled from "styled-components";
import { Col, Row } from "antd";
import { ObjectApi } from "../../api/objectApi";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
export const StateContext = createContext();

const Wrapper2 = styled.div``;
function ObjectContainer() {
  const {id} = useParams();
  
  const [splitScreen, setSplitScreen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [splitScreen]);

  return (
    <StateContext.Provider value={{ splitScreen, setSplitScreen }}>
      <Wrapper2>
        <Row>
          <Col span={splitScreen ? 12 : 24}>
            <NewObject id={id}/>
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

export default ObjectContainer;
