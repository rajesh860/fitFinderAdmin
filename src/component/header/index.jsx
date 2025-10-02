import React, { useEffect, useState } from "react";
import {
  useGenerateQrCodeMutation,
  useGymProfileQuery,
} from "../../service/gyms";
import { Layout, Button, Modal, Spin, Avatar, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./styles.scss";
const HeaderComp = () => {
  const { Header } = Layout;
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trigger, { data: qrData }] = useGenerateQrCodeMutation();
  const { data, isLoading, refetch } = useGymProfileQuery();
  const branchQrCode = data?.data?.branchQrCode;

  // ✅ Example: get user name / image
  const profileName = data?.data?.name || "Profile";
  const profileImage = data?.data?.profileImage; // if backend sends image URL

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
        <div className="header-right">
          {/* ✅ Avatar with tooltip and link */}
          {/* ✅ Show button only if QR not exists */}
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
            <Button type="default" onClick={handleViewQr}>
              View QR
            </Button>
          )}
          <Tooltip title="View Profile">
            <Link to="/gym-profile" className="header-link-avatar">
              <Avatar
                src={profileImage}
                icon={!profileImage && <UserOutlined />}
                style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
              >
                {!profileImage && profileName?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Link>
          </Tooltip>
        </div>
      </Header>
      <Modal
        title="Gym QR Code"
        open={qrModalVisible}
        footer={null}
        onCancel={() => setQrModalVisible(false)}
        centered
      >
        {branchQrCode ? (
          <img
            src={branchQrCode}
            alt="Gym QR Code"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        ) : (
          <Spin
            tip="Generating QR..."
            style={{ width: "100%", display: "block" }}
          />
        )}
      </Modal>
    </>
  );
};

export default HeaderComp;
