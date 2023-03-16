import React, { useState } from "react";
import styled from "styled-components";
import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "react-query";
import { ObjectApi } from "../../api/objectApi";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Space, Divider, List, Card, Meta } from "antd";
import img from "./db-img.jpg";
function MainDashboard() {
  const [objects, setObjects] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [templates, setTemplates] = useState([]);

  const { isLoading, isError, data, isSuccess } = useQuery(
    "objects",
    () => ObjectApi.getObjects(),
    {
      onSuccess: (data) => {
        if (data) {
          setObjects(data);
        }
      },
    }
  );
  const createNewObjectMutation = useMutation(ObjectApi.createObject, {
    onSuccess: (data) => {
        if(data) {
            navigate(`/newobject/${data._id}`);
        }
    }
  });
  const navigate = useNavigate();
  const showModal = () => {
    setCreateModalVisible(true);
  };
  const handleOk = () => {
    setCreateModalVisible(false);
  };
  const handleCancel = () => {
    setCreateModalVisible(false);
  };
  const createNewPage = () => {
    setCreateModalVisible(false);
    createNewObjectMutation.mutate();
  };
  const objectClickHandler = (e) => {
    navigate(`/newobject/${e.currentTarget.id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }
  return (
    <Wrapper>
      <Modal
        title="New object"
        open={createModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
          <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <p>Select from a list of templates, or start from scratch.</p>
              <div className="create-blank">
                <Button
                  block={true}
                  onClick={createNewPage}
                  style={{ height: "40px", width: "50%" }}
                >
                  Blank Page
                </Button>
              </div>
              {/* Templates */}
              <Divider orientation="left">Templates</Divider>

              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 3,
                  xxl: 3,
                }}
                dataSource={templates}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      headStyle={{ overflowWrap: "anywhere" }}
                      hoverable={true}
                      onClick={(e) => {
    
                      }}
                    >
                      <Card.Meta avatar={item.icon} title={item.title}></Card.Meta>
                      Custom Template
                    </Card>
                  </List.Item>
                )}
              />
            </Space>
      </Modal>
      <Header>
        <h2>Select Object</h2>
        <Button icon={<PlusCircleOutlined />} onClick={showModal}></Button>
      </Header>
      <SelectWrapper>
        {objects.map((object) => {
          return (
            <>
              <ListItem
                key={object._id}
                id={object._id}
                onClick={(e) => objectClickHandler(e)}
              >
                <ListItemIcon>{<FileOutlined />}</ListItemIcon>
                <ListItemContent>
                  <ListItemTitle>{object.title}</ListItemTitle>
                  <ListItemBio>{object.bio}</ListItemBio>
                </ListItemContent>
              </ListItem>
              <LineSeperator />
            </>
          );
        })}
      </SelectWrapper>
    </Wrapper>
  );
}

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
