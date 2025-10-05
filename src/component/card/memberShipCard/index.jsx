import React, { useState } from "react";
import { Card, Tag, Button, Modal, Form, Input, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

import "./styles.scss"

// Plan ke icons ke liye colors (dark mode friendly)
const planStyles = {
  Basic: { bg: "linear-gradient(135deg, #444, #666)", icon: "⭐" },
  Silver: { bg: "linear-gradient(135deg, #555, #777)", icon: "🥈" },
  Gold: { bg: "linear-gradient(135deg, #FFD43B, #FFA500)", icon: "👑" },
  Platinum: { bg: "linear-gradient(135deg, #999, #bbb)", icon: "💎" },
};

// Features ke tags ke liye color mapping (dark friendly)
// const featureColors = {
//   0: { color: "#1f2a37", text: "#58a6ff" },
//   1: { color: "#1a1f24", text: "#9ccfd8" },
//   2: { color: "#262c33", text: "#c9d1d9" },
//   3: { color: "#1c1f22", text: "#ffa500" },
// };

const MembershipCard = ({ data, editMode }) => {
  const {
    planName: title,
    price,
    durationInMonths: duration,
    features,
    created_at: createdDate,
  } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const style = planStyles[title] || {
    bg: "linear-gradient(135deg, #333, #555)",
    icon: "📦",
  };

  const handleEdit = () => {
    form.setFieldsValue({ title, price, duration, features });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log("Edited Values:", values);
      setIsModalOpen(false);
      // API call ya parent state update
    });
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

  return (
    <>
      <Card
        style={{
          width: "100%",
          borderRadius: 12,
          // boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          position: "relative",
          background: "transparent",
          color: "#c9d1d9",
          border:"none"
        }}
        bodyStyle={{ padding: 12 }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: style.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            {style.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#c9d1d9" }}>
              {title}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#00A86B" }}>
              {"₹" + price}
            </div>
          </div>

          <Tag
            color="#333"
            style={{
              position: "absolute",
              right: 0,
              top: 5,
              color: "#ffa500",
              fontWeight: 500,
              borderRadius: 20,
              padding: "4px 10px",
            }}
          >
            {formatDuration(duration)}
          </Tag>
        </div>

        {/* Features */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            maxHeight: 63,
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
          {features.map((feature, index) => {
            const randomIndex = Math.floor(Math.random() * 4);
            // const fc = featureColors[randomIndex];
            return (
              <Tag
                key={feature}
                style={{
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontWeight: 500,
                  margin: 0,
                  // background: fc.color,
                  // color: fc.text,
                  border: "none",
                }}
              >
                {feature}
              </Tag>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 16,
            textAlign: "right",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#8b949e",
          }}
        >
          <div>
            Created:{" "}
            <span style={{ fontWeight: 500 }}>
              {moment(createdDate).format("DD-MM-YYYY")}
            </span>
          </div>
      
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              style={{
                borderRadius: 8,
                background: "#009F5D",
                fontWeight: 500,
                padding: "0 20px",
              }}
            >
              Edit
            </Button>
  
        </div>
      </Card>

      {/* Edit Modal */}
   <Modal
  title={<span style={{ color: "#c9d1d9" }}>Edit Membership Plan</span>}
  open={isModalOpen}
  onOk={handleSave}
  onCancel={() => setIsModalOpen(false)}
  okText="Save"
  cancelText="Cancel"
  centered
  className="edit-plan-modal"
  bodyStyle={{
    background: "#161b22",
    color: "#c9d1d9",
    borderRadius: "8px",
  }}
  okButtonProps={{ style: { background: "#009F5D", borderColor: "#009F5D", color: "#fff" } }}
  cancelButtonProps={{ style: { color: "#c9d1d9", borderColor: "#30363d" } }}
>
  <Form form={form} layout="vertical">
    <Form.Item
      name="title"
      label={<span style={{ color: "#c9d1d9" }}>Plan Title</span>}
      rules={[{ required: true, message: "Please enter plan title" }]}
    >
      <Input
        style={{
          background: "#0d1117",
          color: "#c9d1d9",
          borderColor: "#30363d",
        }}
      />
    </Form.Item>

    <Form.Item
      name="price"
      label={<span style={{ color: "#c9d1d9" }}>Price</span>}
      rules={[{ required: true, message: "Please enter price" }]}
    >
      <Input
        style={{
          background: "#0d1117",
          color: "#c9d1d9",
          borderColor: "#30363d",
        }}
      />
    </Form.Item>

    <Form.Item
      name="duration"
      label={<span style={{ color: "#c9d1d9" }}>Duration</span>}
      rules={[{ required: true, message: "Please enter duration" }]}
    >
      <Input
        style={{
          background: "#0d1117",
          color: "#c9d1d9",
          borderColor: "#30363d",
        }}
      />
    </Form.Item>

    <Form.Item
      name="features"
      label={<span style={{ color: "#c9d1d9" }}>Features</span>}
    >
      <Select
        mode="multiple"
        dropdownStyle={{ background: "#0d1117", color: "#c9d1d9" }}
        style={{
          background: "#0d1117",
          color: "#c9d1d9",
          borderColor: "#30363d",
        }}
        // options={Object.keys(featureColors).map((f) => ({
        //   label: f,
        //   value: f,
        // }))}
      />
    </Form.Item>
  </Form>
</Modal>

    </>
  );
};

export default MembershipCard;
