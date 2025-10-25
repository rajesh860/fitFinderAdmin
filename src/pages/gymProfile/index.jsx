import React, { useState } from "react";
import { Row, Col, Card, List, Avatar, Tag, Typography, Button, Upload, Image, Popconfirm } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  AimOutlined,
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import GymBanner from "../../component/gymProfileComponent/GymBanner";
import { useDeleteGalleryImageMutation, useGymProfileQuery, useUpdarteGymProfileMutation } from "../../service/gyms";
import EditGymModal from "../../component/modal/EditGymModal";
import { toast } from "react-toastify";
import OwnerImage from "../../component/ownerImageUpload";

const { Text } = Typography;

const GymProfile = () => {
  const { data, isLoading, refetch } = useGymProfileQuery();
  const [uploadGalleryImage] = useUpdarteGymProfileMutation();
  const [trigg] = useDeleteGalleryImageMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (!data?.data) return <p>No gym data available</p>;

  const {
    name,
    owner_name,
    phone,
    email,
    address,
    location,
    coverImage,
    images,
    owner_image,
    gymCertificates,
    aboutGym,
    gymName,
    _id:gymId
  } = data?.data;

  const [lat, lng] = location?.coordinates || [];

  // ✅ Handle Gallery Upload
  const handleGalleryUpload = async ({ file }) => {
    try {
      console.log(data,"jhk")
      setUploading(true);
      const formData = new FormData();
      formData.append("images", file);

      const res = await uploadGalleryImage({ id: gymId, data: formData }).unwrap();

      if (res?.success) {
        toast.success("Gallery image uploaded successfully!");
        refetch(); // Refresh gym data
      } else {
        toast.error(res?.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const ownerImgSrc =
    Array.isArray(owner_image) && owner_image.length > 0
      ? owner_image[0]
      : owner_image || "https://i.pravatar.cc/150?img=3";


 const handleDeleteImage = async (file, type="gallery") => {
    const getS3KeyFromUrl = (url) => {
    if (!url) return null;
    const [path] = url.split("?");
    const baseUrl = "https://fitcrewimages.s3.ap-south-1.amazonaws.com/uploads/";
    return path.replace(baseUrl, "");
  };
    try {
      console.log(file,"file")
      const imageKey = getS3KeyFromUrl(file);
      if (!imageKey) throw new Error("Image key not found");
      await trigg({ gymId: gymId, imageKey, type }).unwrap();

      toast.success("Image deleted successfully!");

   
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="gym-profile">
      {/* 🔹 Top Banner */}
      <div className="banner-wrapper">
        <GymBanner coverImage={coverImage} gymName={gymName} gymId={data?.data?._id}/>
        <Button
          type="primary"
          icon={<EditOutlined />}
          className="edit-btn"
          onClick={() => setIsModalVisible(true)}
        >
          Edit Profile
        </Button>
      </div>

      {/* 🔹 Main Content */}
      <Row gutter={[24, 24]} className="content-section">
        {/* LEFT SIDE */}
        <Col xs={24} lg={16}>
          {/* 🖼️ GALLERY */}
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width:"100%"
                }}
              >
                <span>
                  <PictureOutlined /> Gallery
                </span>
                <Upload
                  customRequest={handleGalleryUpload}
                  showUploadList={false}
                  beforeUpload={() => true}
                >
                  <Button
                    icon={<UploadOutlined />}
                    type="primary"
                    size="small"
                    loading={uploading}
                  >
                    Upload Gallery
                  </Button>
                </Upload>
              </div>
            }
            className="card gallery-card"
          >
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={images}
              renderItem={(item) => (
                <List.Item>
                  <div className="img-div">

                  <Image src={item} alt="gallery" className="gallery-img" />
                  <div className="dlt-icon">
                    <Popconfirm
                      title="Delete this image?"
                      onConfirm={() => handleDeleteImage(item)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined className="delete-icon" />
                    </Popconfirm>
                  </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* 🧩 ABOUT GYM */}
          <Card
            title={
              <>
                <InfoCircleOutlined /> About the Gym
              </>
            }
            className="card about-card"
          >
            <p>{aboutGym}</p>
          </Card>
        </Col>

        {/* RIGHT SIDE */}
        <Col xs={24} lg={8}>
          {/* 👤 OWNER */}
    <OwnerImage gymId={data?.data?._id} owner_name={owner_name} gymCertificates={gymCertificates} ownerImgSrc={ownerImgSrc} uploading={uploading} setUploading={setUploading} uploadGalleryImage={uploadGalleryImage}/>


          {/* ☎️ CONTACT INFO */}
          <Card
            title={
              <>
                <PhoneOutlined /> Contact Info
              </>
            }
            className="card contact-card"
          >
            <p>
              <PhoneOutlined /> {phone}
            </p>
            <p>
              <MailOutlined /> {email}
            </p>
            <p>
              <EnvironmentOutlined /> {address}
            </p>
          </Card>

          {/* 📍 LOCATION */}
          <Card
            title={
              <>
                <AimOutlined /> Location
              </>
            }
            className="card location-card"
          >
            {lat && lng ? (
              <iframe
                title="Gym Location"
                width="100%"
                height="140"
                style={{ border: 0, borderRadius: 8 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${lng},${lat}&hl=es;z=14&output=embed`}
              ></iframe>
            ) : (
              <div className="map-placeholder">Map not available</div>
            )}
            <Text className="location-text">
              {gymName}
              <br />
              {address}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* ✅ Edit Gym Modal */}
      <EditGymModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        data={data?.data}
      />
    </div>
  );
};

export default GymProfile;
