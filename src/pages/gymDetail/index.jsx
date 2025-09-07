import React from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Tag,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LockOutlined,
} from "@ant-design/icons";
import ActivityLog from "./activityLog";
import { useGymDetailQuery } from "../../service/gyms";
import { useParams } from "react-router-dom";
import MembershipCard from "../../component/card/memberShipCard";

const { Title, Text } = Typography;

const GymDetailPage = () => {
  const { id } = useParams();
  const { data } = useGymDetailQuery(id);

  const planStyles = {
    Basic: { bg: "linear-gradient(135deg, #D3D3D3, #A9A9A9)", icon: "⭐" },
    Silver: { bg: "linear-gradient(135deg, #C0C0C0, #A9A9A9)", icon: "🥈" },
    Gold: { bg: "linear-gradient(135deg, #FFD43B, #FFA500)", icon: "👑" },
    Platinum: { bg: "linear-gradient(135deg, #E5E4E2, #B0C4DE)", icon: "💎" },
  };

  const formatDuration = (months) => {
    if (!months) return "";
    if (months >= 12) {
      const years = Math.floor(months / 12);
      const remMonths = months % 12;
      return remMonths > 0 ? `${years} Year ${remMonths} Month` : `${years} Year`;
    }
    return `${months} Month`;
  };
const statusTagClr = {
  "approved":"green",
  "pending":"orange",
  "reject":"red",
  "suspended":"red"
}
  return (
    <div style={{ background: "#f5f6fa" }}>
      {/* Cover Image */}
      <div style={{ position: "relative", marginBottom: "10px" }}>
        <img
          src={data?.data?.coverImage}
          alt="cover"
          style={{ width: "100%", height: "300px", objectFit: "cover" }}
        />
      </div>

      <Row gutter={10} style={{ padding: "24px", width: "calc(100% - 0px)" }}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {/* Gym Info */}
              <div style={{ position: "relative" }}>
                <Title level={3} style={{ margin: 0 }}>
                  {data?.data?.name}
                </Title>
                <Text type="secondary">{data?.data?.address}</Text>
                <div>
                  <Text>Owner: {data?.data?.owner_name}</Text>
                </div>
                <Tag
                  color={statusTagClr[data?.data?.status]}
                  icon={<CheckCircleOutlined />}
                  style={{
                    textTransform: "uppercase",
                    marginTop: "0px",
                    position: "absolute",
                    right: "0px",
                    top: "0px",
                    borderRadius: "100px",
                    paddingInline: "10px",
                    paddingBlock: "4px",
                  }}
                >
                  {data?.data?.status}
                </Tag>
              </div>

              {/* Actions */}
              <Card>
                <Space wrap>
                  {data?.data?.status == "pending" ?
                  <Button type="primary" icon={<CheckCircleOutlined />}>
                    Approve
                  </Button>
                  :""}
                  <Button danger icon={<CloseCircleOutlined />}>
                    Reject
                  </Button>
                  <Button icon={<StopOutlined />}>Suspend</Button>
                  <Button danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                  <Button type="dashed" icon={<MailOutlined />}>
                    Send Message
                  </Button>
                </Space>
              </Card>
  {/* Gallery */}
             <Card>
  <Title level={5}>Image Gallery</Title>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "16px",
    }}
  >
    {data?.data?.images?.map((img, i) => (
      <img
        key={i}
        src={img}
        alt="gallery"
        style={{
          width: "100%", // Take full width of grid cell
          height: "150px", // Fix a uniform height
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
    ))}
  </div>
</Card>

              {/* Membership Plan Display */}
              <Card>
                <Title level={5} style={{ margin: 0 }}>
                  Membership Plan
                </Title>
                <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {data?.data?.plans?.map((plan, i) => {
                    const style = planStyles[plan.planName] || {
                      bg: "linear-gradient(135deg, #ccc, #999)",
                      icon: "📦",
                    };

                    return (
                    <MembershipCard data={plan}/>
                    );
                  })}
                </div>
              </Card>

            
            </Space>
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {/* Contact Info */}
            <Card>
              <Title level={5} style={{ margin: 0 }}>
                Contact Information
              </Title>
              <p>
                <PhoneOutlined /> <Text>{data?.data?.contact}</Text>
              </p>
              <p>
                <MailOutlined />{" "}
                <a href="mailto:contact@powerfitgym.com">{data?.data?.email}</a>
              </p>
              <p>
                <EnvironmentOutlined />{data?.data?.address} <br />
                <a href="#">Open in Maps</a>
              </p>
            </Card>

            {/* Trial Fee */}
            <Card>
              <Title level={5} style={{ margin: 0, marginBottom: "10px" }}>
                Trial Fee
              </Title>
              <div
                style={{
                  textAlign: "center",
                  background: "#F5F6FF",
                  borderRadius: "8px",
                  paddingBlock: "20px",
                }}
              >
                <Title level={3} style={{ margin: 0 }}>
                 {data?.data?.fees_trial}
                </Title>
                <Text type="secondary" style={{ color: "black" }}>
                  One-time trial fee
                </Text>
                <br />
                <Text type="secondary">Access to all facilities</Text>
              </div>
            </Card>

            {/* Timestamps */}
            {/* <Card>
              <Title level={5} style={{ margin: 0 }}>
                Timestamps
              </Title>
              <p style={{ display: "flex", justifyContent: "space-between", color: "black" }}>
                <span style={{ color: "#4B5563" }}>Created:</span> 15-01-2024
              </p>
              <p style={{ display: "flex", justifyContent: "space-between", color: "black" }}>
                <span style={{ color: "#4B5563" }}>Updated:</span> 22-08-2024
              </p>
            </Card> */}

            {/* Admin Actions */}
            <Card>
              <Title level={5} style={{ margin: 0 }}>
                Admin Actions
              </Title>
              <p>
                <LockOutlined /> Password: ********
              </p>
              <Button danger>Reset Password</Button>
            </Card>

            {/* Activity Log */}
            {/* <ActivityLog /> */}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default GymDetailPage;
