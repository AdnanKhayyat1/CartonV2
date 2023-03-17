import React from "react";
import { Modal, Button, Input, Space } from "antd";
import styled from "styled-components";
function CreateTemplateModal({ show, setShow, setIsTemplate }) {
  const [templateName, setTemplateName] = React.useState("");
  const [inputStatus, setInputStatus] = React.useState("");

  const onTemplateModalOk = () => {
    if(templateName === ''){
        setInputStatus('warning')
    } else{
        setIsTemplate(true);
        setShow(false);

    }
  };
  const onTemplateModalCancel = () => {
    setIsTemplate(true);
    setShow(false);
  };
  return (
    <Modal
      title="Create template"
      open={show}
      onOk={onTemplateModalOk}
      onCancel={onTemplateModalCancel}
    >
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Input
          placeholder="Template name.."
          addonBefore={<div>Name</div>}
          value={templateName}
          status={inputStatus}
          onChange={(e) => {
            if(inputStatus !== ''){
                setInputStatus('')
            }
            setTemplateName(e.target.value)
        }}
        ></Input>
        {inputStatus === "warning" && (<WarningMessage>Template name is required!</WarningMessage>)}
      </Space>
    </Modal>
  );
}

const WarningMessage = styled.div`
 color: orange;
`

export default CreateTemplateModal;
