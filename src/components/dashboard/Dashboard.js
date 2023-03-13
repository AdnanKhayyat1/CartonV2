import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../api/supabaseClient";
import { uid } from "../../tools/utils";
import { COVER_IMAGE_URLS } from "../../tools/constants";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import {
  Spin,
  Button,
  Modal,
  Space,
  Divider,
  List,
  Card,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  PieChartOutlined,
  CustomerServiceOutlined,
  CalendarOutlined,
  ClusterOutlined,
  BugOutlined,
  SkinOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  DiffOutlined,
  FileOutlined,
  ExperimentOutlined,
  AppstoreOutlined,
  DownOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import Draggable from "react-draggable";


import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import ModalPage from "../object/ModalPage";
import Header from "../object/header/Header";

const { Meta } = Card;

const buttonItems  = [
  {
    label: 'Blank Page',
    key: '1',
    icon: <FileOutlined />,
  },
  {
    label: 'Template',
    key: '2',
    icon: <FileTextOutlined />,
  },
  {
    label: 'View',
    key: '3',
    icon: <AppstoreOutlined />,
    disabled: true,
  },
];

const Dashboard = (props) => {
  const [currPages, setCurrPages] = useState([]);
  const ref = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openTemplateModal, setOpenTemplateModal] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);
  // Modal stuff
  const [openPreviewPage, setOpenPreviewPage] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const [disabled, setDisabled] = useState(false);

  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    const { key } = e
    switch(key){
      case 1:
        createNewPage()
      break;
      case 2:
        setOpenTemplateModal(true);
      break;
      default:
      break;
    }


  }

  const menuProps = {
    items: buttonItems,
    onClick: handleMenuClick,
  };

  const handleTemplateModalOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenTemplateModal(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleTemplateModalCancel = () => {
    setOpenTemplateModal(false);
  };
  const handlePreviewModalCancel = () => {
    console.log("Clicked cancel button");
    setOpenPreviewPage(false);
  };

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  useEffect(() => {
    init({ data });
    fetchDataOnStart();
  }, []);
  const fetchDataOnStart = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("pages")
        .select()
        .eq("userID", user.id);
      if (error) throw error;
      if (data) {
        setCurrPages(data);
        setTemplates(
          data
            .filter((page) => {
              return page.isTemplate;
            })
            .map((template) => {
              return {
                ...template,
                icon: <DiffOutlined />,
              };
            })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewPage = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("pages")
        .insert({
          id: uid(),
          userID: user.id,
          title: "New Page",
          coverIndex: 0,
          blocks: {
            data: [],
          },
        })
        .select();
      if (error) throw error;

      setPageIndex(data.id);
      setOpenCreateModal(false);
      setOpenPreviewPage(true);
      setCurrPages([...currPages, data]);
    } catch (error) {
      console.log(error);
    }
  };

  const getExistingPage = (e) => {
    setPageIndex(e.currentTarget.id);
    setOpenPreviewPage(true);
    // navigate(`/pages/${e.target.id}`);
  };
  const redirectToFullPage = () => {
    setOpenPreviewPage(false);
    navigate(`/pages/${pageIndex}`);
  };
  return (
    <>
      {!isLoading ? (
        <div className="dashboard-container">
          {/* Create a new page modal */}
          <Modal
            title="Create a template"
            open={openTemplateModal}
            onOk={handleTemplateModalOk}
            confirmLoading={confirmLoading}
            onCancel={handleTemplateModalCancel}
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
                  Blank Template
                </Button>
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
                      <Meta avatar={item.icon} title={item.title}></Meta>
                      Custom Template
                    </Card>
                  </List.Item>
                )}
              />
            </Space>
          </Modal>
          {/* Upper section of main dashboard */}
          <div className="userProfile">
            <div className="profile-child">
              <h3>Good Morning.</h3>
            </div>
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  Button
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>

          <Modal
            open={openPreviewPage}
            onOk={{}}
            confirmLoading={confirmLoading}
            onCancel={handlePreviewModalCancel}
            style={{
              minWidth: "50vw",
            }}
            closable={false}
            modalRender={(modal) => (
              <Draggable
                disabled={disabled}
                bounds={bounds}
                onStart={(event, uiData) => onStart(event, uiData)}
              >
                <div ref={draggleRef}>{modal}</div>
              </Draggable>
            )}
          >
            <Header fsHandler={redirectToFullPage} />
            <ModalPage currID={pageIndex} />
          </Modal>
          {/* List of page icons on main page */}

          <div className="page-selector-container">
            <List
              grid={{
                gutter: 10,

                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              block={true}
              dataSource={currPages}
              renderItem={(page, key) => (
                <List.Item>
                  <Card
                    style={{ maxWidth: 300 }}
                    cover={
                      <div
                        style={{
                          backgroundColor: COVER_IMAGE_URLS[0],
                          width: "100%",
                          height: 40,
                          borderRadius: "10px 10px 0px 0px",
                        }}
                      />
                    }
                    bodyStyle={{
                      textAlign: "left",
                    }}
                    hoverable={true}
                    onClick={(event) => {
                      getExistingPage(event);
                    }}
                    id={page.id}
                    key={key}
                    actions={[
                      <EditOutlined key="edit" />,
                      <SettingOutlined key="setting" />,
                      <DeleteOutlined key="delete" />,
                    ]}
                  >
                    <Meta
                      title={page.title}
                      description="This is the description"
                    />
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </div>
      ) : (
        <div className="temp-loading">
          <Spin size="large" />
        </div>
      )}
    </>
  );
};

export default Dashboard;
