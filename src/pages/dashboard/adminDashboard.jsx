import React from "react";
import { Card, Row, Col, Statistic, Table, Spin } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useAdminDashboardQuery } from "../../service/admin";

const AdminDashboard = () => {
  const { data, isLoading } = useAdminDashboardQuery();

  if (isLoading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // === API DATA ===
  const stats = data?.stats || {};
  const monthlyRevenue = data?.monthlyRevenue || [];
  const gymPerformance = data?.gymPerformance || [];
  const memberInsights = data?.memberInsights || {};
  const attendanceRatio = data?.attendanceRatio || {};

  // === Chart Data ===
  const revenueData =
    monthlyRevenue.length > 0
      ? monthlyRevenue.map((m) => ({
          month: m.month,
          revenue: m.total,
        }))
      : [
          { month: "Jan", revenue: 0 },
          { month: "Feb", revenue: 0 },
          { month: "Mar", revenue: 0 },
          { month: "Apr", revenue: 0 },
          { month: "May", revenue: 0 },
          { month: "Jun", revenue: 0 },
        ];

  const attendanceRatioData = [
    { name: "Biometric", value: attendanceRatio.biometric || 0 },
    { name: "QR Code", value: attendanceRatio.qr || 0 },
  ];

  const memberInsightsData = [
    { name: "Active", value: memberInsights.active || 0 },
    { name: "Inactive", value: memberInsights.inactive || 0 },
  ];

  const COLORS_MEMBER = ["#3b82f6", "#22c55e"]; // blue + green
  const COLORS_ATTENDANCE = ["#00C49F", "#FF8042"]; // teal + orange

  const columns = [
    {
      title: "Gym Name",
      dataIndex: "gymName",
      key: "gymName",
      render: (text) => <span style={{ color: "#fff" }}>{text}</span>,
    },
    {
      title: "Active Members",
      dataIndex: "activeMembers",
      key: "activeMembers",
      render: (text) => <span style={{ color: "#ccc" }}>{text}</span>,
    },
    {
      title: "Attendance Rate",
      dataIndex: "attendanceRate",
      key: "attendanceRate",
      render: (text) => (
        <span style={{ color: text >= 85 ? "#00C49F" : "#FFA726" }}>
          {text}%
        </span>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (text) => <span style={{ color: "#fff" }}>₹{text}</span>,
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* === TOP STATS === */}
      <Row gutter={[16, 16]}>
        {[
          {
            icon: <FaHome size={20} color="#00C49F" />,
            title: "Total Gyms",
            value: stats.totalGyms || 0,
          },
          {
            icon: <FaUserTie size={20} color="#00C49F" />,
            title: "Total Trainers",
            value: stats.totalTrainers || 0,
          },
          {
            icon: <FaUsers size={20} color="#00C49F" />,
            title: "Total Members",
            value: stats.totalMembers || 0,
          },
          {
            icon: <FaMoneyBillWave size={20} color="#00C49F" />,
            title: "Total Revenue",
            value: `₹${stats.totalRevenue || 0}`,
            color: "#00C49F",
          },
        ].map((item, i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <Card
              style={{
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {item.icon}
                <Statistic
                  title={
                    <span style={{ color: "rgb(157 156 156)" }}>
                      {item.title}
                    </span>
                  }
                  value={item.value}
                  valueStyle={{ color: item.color || "#fff" }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* === ANALYTICS SECTION === */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* LEFT COLUMN */}
        <Col xs={24} lg={16}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Revenue Chart */}
            <Card
              title={<span style={{ color: "#fff" }}>Revenue Analytics</span>}
              style={{
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: 8,
              }}
            >
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161b22",
                      border: "1px solid #30363d",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1677ff"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Gym Performance */}
            <Card
              title={<span style={{ color: "#fff" }}>Gym Performance</span>}
              style={{
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: 8,
              }}
            >
              <Table
                columns={columns}
                dataSource={gymPerformance}
                pagination={false}
                style={{
                  background: "transparent",
                  border: "1px solid #30363d",
                }}
                rowKey={(record) => record.gymName}
              />
            </Card>
          </div>
        </Col>

        {/* RIGHT COLUMN */}
        <Col xs={24} lg={8}>
          {/* CARD 1 - Member Insights */}
          <Card
            title={<span style={{ color: "#fff" }}>Member Insights</span>}
            style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={memberInsightsData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  stroke="none"
                >
                  {memberInsightsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS_MEMBER[index % COLORS_MEMBER.length]
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginTop: -10,
              }}
            >
              {memberInsightsData.map((entry, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      background: COLORS_MEMBER[i],
                      borderRadius: "50%",
                    }}
                  ></span>
                  <span style={{ color: "#ccc" }}>{entry.name}</span>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div
              style={{
                background: "#0d1117",
                borderRadius: 8,
                padding: "12px 16px",
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                >
                  New Members (This Month)
                </p>
                <h2 style={{ margin: 0, color: "#fff" }}>
                  {memberInsights.newThisMonth || 0}
                </h2>
              </div>
              <span
                style={{
                  color: "#22c55e",
                  fontWeight: "bold",
                }}
              >
                {memberInsights.growthRate || "+0%"}
              </span>
            </div>
          </Card>

          {/* CARD 2 - Biometric vs QR Ratio */}
          <Card
            title={
              <span style={{ color: "#fff" }}>
                Biometric vs QR Ratio
              </span>
            }
            style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: 12,
            }}
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={attendanceRatioData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  stroke="none"
                >
                  {attendanceRatioData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS_ATTENDANCE[
                          index % COLORS_ATTENDANCE.length
                        ]
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginTop: -10,
              }}
            >
              {attendanceRatioData.map((entry, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      background: COLORS_ATTENDANCE[i],
                      borderRadius: "50%",
                    }}
                  ></span>
                  <span style={{ color: "#ccc" }}>{entry.name}</span>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div
              style={{
                background: "#0d1117",
                borderRadius: 8,
                padding: "12px 16px",
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                >
                  Biometric Usage
                </p>
                <h2 style={{ margin: 0, color: "#fff" }}>
                  {attendanceRatio.biometricUsage || 0}%
                </h2>
              </div>
              <span
                style={{
                  color: "#22c55e",
                  fontWeight: "bold",
                }}
              >
                {attendanceRatio.change || "+0%"}
              </span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
