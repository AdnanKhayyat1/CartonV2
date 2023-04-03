import React, { useState } from "react";
import styled from "styled-components";
import {
  FileOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "react-query";
import { ObjectApi } from "../../api/objectApi";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import img from "./db-img.jpg";
import CreateModal from "../Modals/CreateModal";
import DeleteObject from "../Modals/DeleteObject";
function MainDashboard({ userID }) {
  const [objects, setObjects] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState("");
  const [templates, setTemplates] = useState([]);

  const { isLoading, isError, data, isSuccess } = useQuery(
    "objects",
    () => ObjectApi.getObjects(userID),
    {
      onSuccess: (data) => {
        if (data) {
          setObjects(data);
          setTemplates(data.filter((obj) => obj.isTemplate === true));
        }
      },
      refetchOnMount: "always",
    }
  );

  const navigate = useNavigate();
  const showModal = () => {
    setCreateModalVisible(true);
  };

  const objectClickHandler = (id) => {
    navigate(`/newobject/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }
  return (
    <Wrapper>
      <CreateModal
        createModalVisible={createModalVisible}
        setCreateModalVisible={setCreateModalVisible}
        templates={templates}
        userID={userID}
      />
      <DeleteObject
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        setObjects={setObjects}
        objects={objects}
      />
      <Header>
        <h2>Select Object</h2>
        <Button icon={<PlusCircleOutlined />} onClick={showModal}></Button>
      </Header>
      <SelectWrapper>
        {objects.map((object) => {
          return (
            <>
              <ListItem key={object._id} id={object._id}>
                <ListItemLeft onClick={() => objectClickHandler(object._id)}>
                  <ListItemIcon>{<FileOutlined />}</ListItemIcon>
                  <ListItemContent>
                    <ListItemTitle>{object.title}</ListItemTitle>
                    <ListItemBio>{object.bio}</ListItemBio>
                  </ListItemContent>
                </ListItemLeft>
                <Button
                  icon={<DeleteOutlined />}
                  id={object._id}
                  type="text"
                  onClick={() => setDeleteModal(object._id)}
                />
              </ListItem>
              <LineSeperator />
            </>
          );
        })}
      </SelectWrapper>
    </Wrapper>
  );
}
const ListItemLeft = styled.div`
  display: flex;
  align-items: center;
`;
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url(${img});
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 400px;
  justify-content: space-between;
  align-items: center;
  color: white;
`;
const SelectWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.75);
  height: 45vh;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 100px;
  backdrop-filter: blur(10px);
`;
const ListItem = styled.div`
  :hover {
    background-color: #e8ebf4;
    cursor: pointer;
  }
  display: flex;
  flex-direction: row;
  min-width: 400px;
  padding: 10px;
  padding-top: 20px;
  justify-content: space-between;
  align-items: center;
`;
const ListItemContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;
const ListItemTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 5px;
`;
const ListItemBio = styled.div`
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.54);
`;
const ListItemIcon = styled.div``;
const LineSeperator = styled.div`
  height: 1px;
  width: 90%;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0 auto;
`;

export default MainDashboard;
