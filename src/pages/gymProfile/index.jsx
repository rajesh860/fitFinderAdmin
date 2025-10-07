import React, { useState } from "react";
import { Row, Col, Card, List, Avatar, Tag, Typography, Button } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  AimOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import GymBanner from "../../component/gymProfileComponent/GymBanner";
import { useGymProfileQuery } from "../../service/gyms";
import EditGymModal from "../../component/modal/EditGymModal";

const { Text } = Typography;

const GymProfile = () => {
  const { data, isLoading } = useGymProfileQuery();
  const [isModalVisible, setIsModalVisible] = useState(false);

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
  } = data?.data;

  const [lat, lng] = location?.coordinates || [];

  // ✅ Fix owner image (in case it's array or null)
  const ownerImgSrc =
    Array.isArray(owner_image) && owner_image.length > 0
      ? owner_image[0]
      : owner_image || "https://i.pravatar.cc/150?img=3";

  return (
    <div className="gym-profile">
      {/* 🔹 Top Banner */}
      <div className="banner-wrapper">
        <GymBanner coverImage={coverImage} gymName={gymName} />
        {/* ✏️ Edit Button on top-right corner */}
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
              <>
                <PictureOutlined /> Gallery
              </>
            }
            className="card gallery-card"
          >
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={images}
              renderItem={(item) => (
                <List.Item>
                  <img src={item} alt="gallery" className="gallery-img" />
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
          <Card
            title={
              <>
                <UserOutlined /> Owner
              </>
            }
            className="card owner-card"
          >
            <div className="owner-details">
              <Avatar size={80} src={ownerImgSrc} className="owner-avatar" />
              <h3 className="owner-name">{owner_name || name}</h3>
              {gymCertificates?.length > 0 ? (
                gymCertificates.map((cert, i) => (
                  <Tag key={i} color="magenta" className="owner-tag">
                    {cert}
                  </Tag>
                ))
              ) : (
                <Tag color="red" className="owner-tag">
                  No Certificate
                </Tag>
              )}
            </div>
          </Card>

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
              <span>
                <PhoneOutlined />
              </span>
              {phone}
            </p>
            <p>
              <span>
                <MailOutlined />
              </span>
              {email}
            </p>
            <p>
              <span>
                <EnvironmentOutlined />
              </span>
              {address}
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
