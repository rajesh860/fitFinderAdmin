import React, { useRef, useState } from "react";
import "./styles.scss";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import imageCompression from "browser-image-compression";
import { useUpdarteGymProfileMutation } from "../../service/gyms";

const GymBanner = ({ coverImage, gymName, gymId }) => {
  const [trigger] = useUpdarteGymProfileMutation();
  const [currentCover, setCurrentCover] = useState(coverImage);
  const [loading, setLoading] = useState(false); // ✅ local loading state
  const fileInputRef = useRef();

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true); // start loading
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
      };
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
      });

      const formData = new FormData();
      formData.append("coverImage", compressedFile);

      const response = await trigger({ id: gymId, data: formData }).unwrap();

      if (response?.success) {
        message.success("Cover image updated successfully!");
        const newImageUrl = URL.createObjectURL(compressedFile);
        setCurrentCover(newImageUrl);
      } else {
        message.error(response?.message || "Failed to update image");
      }
    } catch (error) {
      console.error(error);
      message.error("Error updating cover image");
    } finally {
      setLoading(false); // stop loading
      event.target.value = ""; // reset file input
    }
  };

  return (
    <div
      className="gym-banner"
      style={{
        backgroundImage: `url(${currentCover})`,
        position: "relative",
      }}
    >
      <div className="overlay">
        <div className="content">
          <h1 className="title">{gymName}</h1>
          <p className="subtitle">Transform your body, transform your life</p>
        </div>

        {/* Top-right corner upload button */}
        <Button
          type="primary"
          shape="circle"
          icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
          }}
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default GymBanner;
