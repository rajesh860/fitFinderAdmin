import { Card, Row, Col, Tag, Avatar, Progress, Tooltip } from "antd";
import {
  CheckCircleTwoTone,
  CrownTwoTone,
  LineChartOutlined,
  AimOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import dayjs from "dayjs";

export default function ProfileHeader({ user, progress }) {
  const label = (t, v) => (
    <div className="ph__item">
      <div className="ph__label">{t}</div>
      <div className="ph__value">{v}</div>
    </div>
  );

  const progressData = [
    { title: "Weight", value: progress?.weight, unit: "kg" },
    { title: "Height", value: progress?.height, unit: "cm" },
    { title: "Arm", value: progress?.arm, unit: "cm" },
    { title: "Chest", value: progress?.chest, unit: "cm" },
    { title: "Waist", value: progress?.waist, unit: "cm" },
    { title: "Thigh", value: progress?.thigh, unit: "cm" },
  ];

  return (
    <>
      <Card className="ph" bordered={false}>
        <Row gutter={[16, 16]} align="top">
          <Col xs={24} md={10} className="ph__left">
            <Avatar size={64} src={user?.photo} />
            <div className="ph__meta">
              <div className="ph__name">{user?.name}</div>
              <div className="ph__tags">
                <Tag
                  icon={<CrownTwoTone twoToneColor="#f59e0b" />}
                  color="gold"
                >
                  {user?.currentMembership?.planName} Plan
                </Tag>
                <Tag
                  icon={<CheckCircleTwoTone twoToneColor="#22c55e" />}
                  color="success"
                  style={{ textTransform: "uppercase" }}
                >
                  {user?.status}
                </Tag>
              </div>
              <div className="ph__valid">
                Valid until:{" "}
                <b>
                  {dayjs(user?.currentMembership?.membership_end).format(
                    "DD-MM-YYYY"
                  )}
                </b>
              </div>
            </div>
          </Col>

          <Col xs={24} md={14}>
            <Row gutter={[16, 16]}>
              <Col xs={12} md={8}>
                {label("Phone", user?.phone)}
              </Col>
              <Col xs={12} md={8}>
                {label("Email", user?.email)}
              </Col>
              <Col xs={12} md={8}>
                {label("Plan Price", `₹${user?.currentMembership?.planPrice}`)}
              </Col>
              <Col xs={12} md={8}>
                {label("Address", user?.address)}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* ✅ Progress Section */}
      {/* Progress Section */}
      {/* Progress Section */}
      <Card
        className="progress-card"
        bordered={false}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AimOutlined style={{ color: "#2563eb" }} />
            <span>User Current Progress</span>
          </div>
        }
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "space-around",
            overflowX: "auto",
            padding: "12px 0",
            maxWidth: "100%",
          }}
        >
          {progressData.map((item) => {
            // ✅ Dynamic background color based on title
            let bgColor = "#f3f4f6"; // default gray
            switch (item.title) {
              case "Weight":
                bgColor = "#ffe4e6"; // pinkish
                break;
              case "Height":
                bgColor = "#e0f7fa"; // light cyan
                break;
              case "Arm":
                bgColor = "#fff3e0"; // light orange
                break;
              case "Chest":
                bgColor = "#ede7f6"; // light purple
                break;
              case "Waist":
                bgColor = "#e8f5e9"; // light green
                break;
              case "Thigh":
                bgColor = "#fce4ec"; // light pink
                break;
              default:
                bgColor = "#f3f4f6";
            }

            return (
              <div
                key={item.title}
                style={{
                  minWidth: 100,
                  backgroundColor: bgColor,
                  borderRadius: 8,
                  width: 200,
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontWeight: "700", fontSize: 16, color: "#111" }}>
                  {item.value}
                  {item.unit}
                </div>
                <div style={{ fontSize: 12, color: "#555" }}>{item.title}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
