import React, { useEffect } from "react";
import { Card, Avatar, Row, Col, Tag, Typography, Space, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaStar,
  FaDumbbell,
  FaClock,
} from "react-icons/fa";
import { useGetTrainerDetailQuery } from "../../service/trainer";

const { Title, Text } = Typography;

const TrainerDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetTrainerDetailQuery(id);
  const demoAvatar = "https://xsgames.co/randomusers/avatar.php?g=male";

  useEffect(() => {
    if (error) message.error("Failed to fetch trainer details");
  }, [error]);

  if (isLoading)
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "20vh",
    
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading Trainer Details..." />
      </div>
    );

  const trainer = data?.data;

  return (
    <div
      style={{
 
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      {/* ================= Header Section ================= */}
      <Card
        bordered={false}
        style={{
                borderRadius:0,
     backgroundColor: "#1A1A1A",
          overflow: "hidden",
        }}
      >
        <Row gutter={[20, 20]} align="middle">
          <Col xs={24} md={8} style={{ textAlign: "center" }}>
            <Avatar
              size={150}
              src={trainer?.photo || demoAvatar}
            
            />
          </Col>

          <Col xs={24} md={16}>
            <Title level={2} style={{ color: "#fff", marginBottom: 5 }}>
              {trainer?.user?.name || "Unknown Trainer"}
            </Title>

            <Space align="center" size="middle">
              <FaStar color="#FFD700" />
              <Text style={{ color: "#FFD700", fontWeight: 500 }}>
                {trainer?.rating || 0}/5
              </Text>
              <Text style={{ color: "#888" }}>
                ({trainer?.totalReviews || 0} reviews)
              </Text>
            </Space>

            <div style={{ marginTop: 15 }}>
              <Text style={{ color: "#ccc", fontSize: 15, lineHeight: 1.8 }}>
                {trainer?.bio ||
                  "Certified fitness professional helping people transform their lifestyle with proper guidance."}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* ================= Info Card Section ================= */}
      <Card
        bordered={false}
        style={{
          borderRadius:0,
        backgroundColor: "#1A1A1A",
        }}
      >
        <Title level={3} style={{ color: "#fff", marginBottom: 25 }}>
          Trainer Information
        </Title>

        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} md={8}>
            <Space>
              <FaPhone color="#FF6600" />
              <Text style={{ color: "#fff" }}>
                {trainer?.user?.phone || "Not Available"}
              </Text>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space>
              <FaEnvelope color="#FF6600" />
              <Text style={{ color: "#fff" }}>
                {trainer?.user?.email || "Not Available"}
              </Text>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space>
              <FaClock color="#FF6600" />
              <Text style={{ color: "#fff" }}>
                {trainer?.experience || 0} years of experience
              </Text>
            </Space>
          </Col>

          <Col xs={24} style={{ marginTop: 15 }}>
            <Space align="start">
              <FaDumbbell color="#FF6600" style={{ marginTop: 4 }} />
              <div>
                <Text style={{ color: "#fff", display: "block", marginBottom: 8 }}>
                  Specialization:
                </Text>
                {trainer?.specialization?.length ? (
                  <Space wrap>
                    {trainer.specialization.map((spec, index) => (
                      <Tag
                        key={index}
                        color="#FF6600"
                        style={{
                          fontSize: 14,
                          padding: "6px 12px",
                          borderRadius: 20,
                        }}
                      >
                        {spec}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <Text style={{ color: "#bbb" }}>Not specified</Text>
                )}
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ================= Gallery Section ================= */}
      <Card
        bordered={false}
        style={{
        
        backgroundColor: "#1A1A1A",
          borderRadius: 0,
          
     
        }}
      >
        <Title level={3} style={{ color: "#fff", marginBottom: 20 }}>
          Trainer Gallery
        </Title>

        {trainer?.gallery?.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 15,
            }}
          >
            {trainer.gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Gallery ${i}`}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 10,
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
              />
            ))}
          </div>
        ) : (
          <Text style={{ color: "#bbb" }}>No gallery images available</Text>
        )}
      </Card>
    </div>
  );
};

export default TrainerDetail;
