import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCellStore } from "./ContentGridV2";
import { supabase } from "../../api/supabaseClient";
import { PictureOutlined } from '@ant-design/icons';


function ImageBlock({ id, cell }) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const updateCell = useCellStore((state) => state.updateCellById);
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
      updateCell(id, { file: filePath });
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
  return (
    <ImageWrapper>
      {selectedImage && (
        <ImageContainer>
          <Image alt="not found" src={selectedImage} />
          <br />
          <button onClick={removeImage}>Remove</button>
        </ImageContainer>
      )}
      <input
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadImage}
        disabled={loading}
      />
    </ImageWrapper>
  );
}
const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
const ImageWrapper = styled.div``;
const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

export default ImageBlock;
