import React, { useEffect, useState } from "react";
import {
  useGenerateQrCodeMutation,
  useGymProfileQuery,
} from "../../service/gyms";
import { Layout, Button, Modal, Spin, Avatar, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./styles.scss";
import userImg from "../../assets/img/user.png"
const HeaderComp = () => {
  const userRole = localStorage.getItem("userRole")
  const { Header } = Layout;
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trigger, { data: qrData }] = useGenerateQrCodeMutation();
const { data, isLoading, refetch } = useGymProfileQuery(
  undefined,
  { skip: userRole === "admin" }
);

  const gymData = data?.data;
  const branchQrCode = gymData?.branchQrCode;

  // ✅ Extract images and profile info
  const profileName = gymData?.name || "Admin";
  const profileImage =
    gymData?.owner_image?.length > 0
      ? gymData?.owner_image
      : gymData?.profileImage || "";

  const handleViewQr = () => setQrModalVisible(true);

  const handleCreateQr = async () => {
    setLoading(true);
    try {
      trigger();
      setTimeout(() => {
        setLoading(false);
        setQrModalVisible(true);
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qrData?.success) refetch();
  }, [qrData]);

  return (
    <>
      <Header className="main-header">
        <div className="header-left">
          <span className="header-title"></span>
        </div>

        <div
          className="header-right"
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          {/* ✅ Show button only if QR not exists */}

          {userRole !== "admin" &&
          <>
          {!branchQrCode && (
            <Button
              type="primary"
              onClick={handleCreateQr}
              loading={loading || isLoading}
            >
              Create QR
            </Button>
          )}

          {/* ✅ Show View button if QR exists */}
          {branchQrCode && (
            <Button
              style={{
                backgroundColor: "#1f1f1f",
                color: "white",
                border: "1px solid #333",
              }}
              onClick={handleViewQr}
            >
              View QR
            </Button>
          )}
          </>
 }
          {/* ✅ Profile Avatar + Hello + Name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Tooltip title="View Profile">
              <Link to={`${userRole !== "admin" ? "/gym-profile":"/"}`} className="header-link-avatar">
                <Avatar
                  src={profileImage || userImg}
                  icon={!profileImage && <UserOutlined />}
                  style={{
                    // backgroundColor: Col,
                    cursor: "pointer",
                    width: 40,
                    height: 40,
                  }}
                >
                  {!profileImage && profileName?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Link>
            </Tooltip>

            {/* ✅ Greeting + Name */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "white",
                lineHeight: "1.2",
              }}
            >
              <span style={{ fontSize: "13px", opacity: 0.8 }}>Hi,</span>
              <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                {profileName}
              </span>
            </div>
          </div>
        </div>
      </Header>

      {/* ✅ QR Modal */}
      <Modal
        title={<span style={{ color: "white" }}>Gym QR Code</span>}
        open={qrModalVisible}
        footer={null}
        onCancel={() => setQrModalVisible(false)}
        centered
        bodyStyle={{
          backgroundColor: "#141414",
          textAlign: "center",
          borderRadius: "10px",
        }}
        style={{
          backgroundColor: "#141414",
        }}
      >
        {branchQrCode ? (
          <img
            src={branchQrCode}
            alt="Gym QR Code"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          />
        ) : (
          <Spin
            tip="Generating QR..."
            style={{ width: "100%", display: "block", color: "white" }}
          />
        )}
      </Modal>
    </>
  );
};

export default HeaderComp;
