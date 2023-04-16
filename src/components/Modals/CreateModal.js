import React, { useState } from "react";
import { Modal, Space, Button, Divider, List, Card } from "antd";
import { useMutation } from "react-query";
import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { ObjectApi } from "../../api/objectApi";
import { CellApi } from "../../api/cellApi";
import { useNavigate } from "react-router-dom";

function CreateModal({ createModalVisible, setCreateModalVisible, templates, userID }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const createNewPage = async () => {
    try{
      setIsLoading(true);
      const newEditor = await CellApi.createCell();
      if(newEditor.status !== 200) throw new Error("Couldn't create new editor");


      const newPage = await ObjectApi.createObject({userID: userID, editorID: newEditor.data._id});
      if(newPage.status !== 200) throw new Error('Couldn\'t create new page');
      console.log(newPage);
      navigate(`/newobject/${newPage.data.data._id}`)
    } catch(e){
      console.log(e);
    } finally{
      setIsLoading(false);
    }
  };
  const createNewCellFromTemplate = async (cellID) => {
    // here we do type checking
    // get cell by id and check type
    const oldCell = await CellApi.getCell(cellID);
    const templateMode = oldCell.mode;
    const cell = await CellApi.createCell({ mode: templateMode });
    return cell.data._id;
  };
  const createNewPageFromTemplate = async (e) => {
    const id = e.currentTarget.id;
    const currTemplate = templates.find((template) => template._id === id);
    const templateProperties = currTemplate.properties.map((property) => {
      return {
        key: property.key,
        type: property.type,
        value: "",
      };
    });
    const templateEditorID = createNewCellFromTemplate(currTemplate.editorID);


    const newObject = await ObjectApi.createObject();
    const PopulatedNewObject = await ObjectApi.updateObject({
      _id: newObject.data.data._id,
      title: currTemplate.title,
      bio: currTemplate.bio,
      properties: templateProperties,
      editorID: templateEditorID,
      icon: currTemplate.icon,

    });
    navigate(`/newobject/${PopulatedNewObject._id}`);
  };
  const handleOk = () => {
    setCreateModalVisible(false);
  };
  const handleCancel = () => {
    setCreateModalVisible(false);
  };
  return (
    <Modal
      title="New Page"
      open={createModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
    >
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <p>Select from a list of templates, or start from scratch.</p>
        <div className="create-blank">
          <Button
            block={true}
            onClick={createNewPage}
            style={{ height: "40px", width: "100%" }}
          >
            Blank Page
          </Button>
        </div>
        {/* Templates */}
        <Divider orientation="left">Templates</Divider>

        <List
          dataSource={templates}
          renderItem={(item) => (
            <List.Item>
              <Card
                headStyle={{ overflowWrap: "anywhere" }}
                hoverable={true}
                id={item._id}
                onClick={createNewPageFromTemplate}
              >
                <Card.Meta
                  avatar={<FileOutlined />}
                  title={item.title}
                  description={item.bio}
                ></Card.Meta>
              </Card>
            </List.Item>
          )}
        />
      </Space>
    </Modal>
  );
}

export default CreateModal;
