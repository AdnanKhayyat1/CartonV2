import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCellStore } from "../stores/cellStore";
import { supabase } from "../../api/supabaseClient";
import { PictureOutlined } from "@ant-design/icons";
import { Typography, Alert, Space} from "antd";
import { FaUnsplash, FaImage, FaGoogleDrive, FaRegFile } from "react-icons/fa";
import { useMutation } from "react-query";
import {CellApi} from "../../api/cellApi";


const { Title } = Typography;

function ImageBlock({ id, cell }) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const updateCell = useCellStore((state) => state.updateCellById);
  const mutation = useMutation({
    mutationFn: CellApi.updateCell,
    onSuccess: (data) => {
      if (data.status === 200) {
        updateCell(cell._id, data.data);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(`${path}`);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setSelectedImage(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }
    if (cell.data && cell.data.file) {
      downloadImage(cell.data.file);
    }
  }, [cell]);


  const uploadImage = async (event) => {
    try {
      setLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }
      mutation.mutate({ ...cell, data: { file: fileName } });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async () => {
    try {
      setLoading(true);
      const { error: removeError } = await supabase.storage
        .from("avatars")
        .remove([`${cell.data.file}`]);
      if (removeError) {
        throw removeError;
      }
      updateCell(id, {});
      setSelectedImage(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById("single-upload").click();
  }
  return (
    <ImageWrapper>
      {selectedImage && (
        <ImageContainer>
          <Image alt="not found" src={selectedImage} />
          <br />
          <button onClick={removeImage}>Remove</button>
        </ImageContainer>
      )}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert banner message="For shareable files, use a public shareable link." type="warning" showIcon closable />
        <Title level={5}>Enter a URL to import a file</Title>
        <Typography.Text>URL can be a website, download, or image.</Typography.Text>

      </Space>
      <input
        type="file"
        id="single-upload"
        accept="image/*"
        style={{display: "none"}}
        onChange={uploadImage}
        disabled={loading}
      />
      
    </ImageWrapper>
  );
}
const GridIcons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const UploadIcon = styled.div`
:hover {
  background-color: rgba(0,0,0,.2);
  cursor: pointer;
}
background-color: white;
border-radius: 10px;
padding: 10px;
box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
margin-right: 10px;
margin-left: 10px;

`
const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`;
const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
const ImageWrapper = styled.div`
  flex: 9 1;
  background-color: #e8ebf4;
  border-radius: 10px;
`;
const ImageContainer = styled.div`
  width: 100%;

  height: 200px;
`;

export default ImageBlock;
