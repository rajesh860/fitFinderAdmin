import React, { useEffect } from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Tag,
  Typography,
  Space,
  Spin,
  message,
  Divider,
} from "antd";
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
          paddingTop: "25vh",
          background: "linear-gradient(145deg,#0f0f0f,#1c1c1c)",
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
        background: "linear-gradient(135deg,#0b0b0c,#161616,#0b0b0c)",
        minHeight: "100vh",
        color: "#fff",
        paddingBottom: 50,
      }}
    >
      {/* ================= Header Section ================= */}
      <Card
        bordered={false}
        style={{
          background:
            "linear-gradient(145deg, rgba(35,35,35,0.9), rgba(20,20,20,0.8))",
          backdropFilter: "blur(8px)",
          borderRadius: "18px",
          margin: "24px",
          boxShadow: "0 0 25px rgba(255,102,0,0.15)",
        }}
      >
        <Row gutter={[30, 20]} align="middle" justify="center">
          <Col xs={24} md={8} style={{ textAlign: "center" }}>
            <Avatar
              size={150}
              src={trainer?.photo || demoAvatar}
              style={{
                border: "3px solid #ff6600",
                boxShadow: "0 0 25px rgba(255,102,0,0.4)",
              }}
            />
          </Col>

          <Col xs={24} md={16}>
            <Title
              level={2}
              style={{
                color: "#fff",
                marginBottom: 6,
                fontWeight: 700,
                textShadow: "0 0 10px rgba(255,255,255,0.2)",
              }}
            >
              {trainer?.user?.name || "Unknown Trainer"}
            </Title>

            <Space align="center" size="middle">
              <FaStar color="#FFD700" />
              <Text style={{ color: "#FFD700", fontWeight: 500 }}>
                {trainer?.rating || 0}/5
              </Text>
              <Text style={{ color: "#aaa" }}>
                ({trainer?.totalReviews || 0} reviews)
              </Text>
            </Space>

            <div style={{ marginTop: 15 }}>
              <Text
                style={{
                  color: "#ddd",
                  fontSize: 15,
                  lineHeight: 1.8,
                  fontWeight: 400,
                }}
              >
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
          margin: "24px",
          background:
            "linear-gradient(160deg, rgba(30,30,30,0.9), rgba(15,15,15,0.8))",
          backdropFilter: "blur(8px)",
          borderRadius: "18px",
          boxShadow: "0 0 25px rgba(255,102,0,0.15)",
        }}
      >
        <Title
          level={3}
          style={{
            color: "#fff",
            marginBottom: 25,
            fontWeight: 600,
            borderLeft: "4px solid #ff6600",
            paddingLeft: 12,
          }}
        >
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
        </Row>

        <Divider style={{ borderColor: "#333", margin: "20px 0" }} />

        <Row>
          <Col xs={24}>
            <Space align="start">
              <FaDumbbell color="#FF6600" style={{ marginTop: 4 }} />
              <div>
                <Text
                  style={{
                    color: "#fff",
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 500,
                  }}
                >
                  Specialization:
                </Text>
                {trainer?.specialization?.length ? (
                  <Space wrap>
                    {trainer.specialization.map((spec, index) => (
                      <Tag
                        key={index}
                        color="#ff6600"
                        style={{
                          fontSize: 14,
                          padding: "6px 12px",
                          borderRadius: 20,
                          fontWeight: 500,
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
          margin: "24px",
          background:
            "linear-gradient(160deg, rgba(25,25,25,0.9), rgba(10,10,10,0.85))",
          backdropFilter: "blur(8px)",
          borderRadius: "18px",
          boxShadow: "0 0 25px rgba(255,102,0,0.15)",
        }}
      >
        <Title
          level={3}
          style={{
            color: "#fff",
            marginBottom: 20,
            fontWeight: 600,
            borderLeft: "4px solid #ff6600",
            paddingLeft: 12,
          }}
        >
          Trainer Gallery
        </Title>

        {trainer?.gallery?.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 15,
            }}
          >
            {trainer.gallery.map((img, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={img}
                  alt={`Gallery ${i}`}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    transition: "all 0.4s ease",
                    filter: "brightness(0.85)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.filter = "brightness(1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.filter = "brightness(0.85)";
                  }}
                />
              </div>
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
