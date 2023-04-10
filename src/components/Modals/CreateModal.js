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

      const newPage = await ObjectApi.createObject({userID: userID});
      if(!newPage) throw new Error('Couldn\'t create new page');
      const defaultCell = await CellApi.createCell();
      if(!defaultCell) throw new Error('Couldn\'t create default cell');
      const updatedPage = {
        ...newPage.data.data,
        leftCol: {
          showColumn: true,
          cellIDs: [defaultCell.data._id]
        }
      }
      const resPage = await ObjectApi.updateObject(updatedPage);
      if(!resPage) throw new Error('Couldn\'t update page');
      navigate(`/newobject/${updatedPage._id}`)
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
    const title = currTemplate.title;
    const bio = currTemplate.bio;
    const properties = currTemplate.properties.map((property) => {
      return {
        key: property.key,
        type: property.type,
        value: "",
      };
    });
    const leftCol = {
      showColumn: currTemplate.leftCol.showColumn,
      cellIDs: await Promise.all(
        currTemplate.leftCol.cellIDs.map(createNewCellFromTemplate)
      ),
    };
    const rightCol = {
      showColumn: currTemplate.rightCol.showColumn,
      cellIDs: await Promise.all(
        currTemplate.rightCol.cellIDs.map(createNewCellFromTemplate)
      ),
    };

    const newObject = await ObjectApi.createObject();
    const PopulatedNewObject = await ObjectApi.updateObject({
      _id: newObject.data.data._id,
      title: title,
      bio: bio,
      properties: properties,
      leftCol: leftCol,
      rightCol: rightCol,
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
