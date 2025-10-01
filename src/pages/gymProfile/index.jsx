import React, { useState } from "react";
import {
  Card,
  Avatar,
  List,
  Button,
  Row,
  Col,
  Tag,
  Typography,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useGymProfileQuery } from "../../service/gyms";
import EditGymModal from "../../component/modal/EditGymModal";

const { Meta } = Card;
const { Text } = Typography;

export default function GymProfile() {
  const { data, isLoading } = useGymProfileQuery();
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (!data?.data) return <p>No gym data available</p>;

  const {
    name,
    owner_name,
    contact,
    email,
    address,
    location,
    coverImage,
    images,
    owner_image,
    gymCertificates,
    aboutGym,
  } = data?.data;

  const [lat, lng] = location?.coordinates || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "20px" }}>
      {/* Edit Button */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
      >
        Edit Profile
      </Button>

      {/* Cover Card */}
      <Card
        cover={
          <img
            alt="cover"
            src={coverImage}
            style={{ objectFit: "cover", height: "320px" }}
          />
        }
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <Meta
          title={<span style={{ fontSize: "24px", fontWeight: 700 }}>{name}</span>}
          description={
            <span style={{ fontSize: "14px", color: "#555" }}>
              {aboutGym || "No description available"}
            </span>
          }
        />
      </Card>

      <Row gutter={[24, 24]}>
        {/* Left column */}
        <Col xs={24} lg={16}>
          {/* Gallery */}
          <Card title="Gallery" style={{ marginBottom: "24px" }}>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={images?.length ? images : []}
              renderItem={(item) => (
                <List.Item>
                  <img
                    src={item}
                    alt="gallery"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* About */}
          <Card title="About the Gym">
            <p>{aboutGym}</p>
          </Card>
        </Col>

        {/* Right column */}
        <Col xs={24} lg={8}>
          {/* Owner */}
          <Card style={{ marginBottom: "24px" }}>
            <Meta
              avatar={
                <Avatar
                  size={64}
                  src={owner_image[0] || "https://i.pravatar.cc/150?img=3"}
                />
              }
              title={name || "No Name"}
              description={
                gymCertificates?.length > 0 ? (
                  <Row gutter={[8, 8]}>
                    {gymCertificates.map((cert, index) => (
                      <Col key={index}>
                        <Tag color="magenta" key={index}>
                          {cert}
                        </Tag>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  "No Certificate"
                )
              }
            />
          </Card>

          {/* Contact Info */}
          <Card title="Contact Info" style={{ marginBottom: "24px" }}>
            <p>
              <PhoneOutlined /> {contact}
            </p>
            <p>
              <MailOutlined /> {email}
            </p>
            <p>
              <EnvironmentOutlined /> {address}
            </p>
          </Card>

          {/* Location */}
          <Card
            title="Location"
            bordered={false}
            style={{ borderRadius: 16, marginBottom: 24 }}
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
              <div
                style={{
                  borderRadius: "8px",
                  height: "140px",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  fontSize: "13px",
                }}
              >
                Map not available
              </div>
            )}
            <Text type="secondary" style={{ fontSize: 12 }}>
              {address}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* ✅ Separate Modal Component */}
      <EditGymModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        data={data?.data}
      />
    </div>
  );
}
