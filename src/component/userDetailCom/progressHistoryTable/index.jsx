import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Form, Input, Tag } from "antd";
import "./styles.scss";

const ProgressHistory = ({ progressData }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (progressData) {
      const history = progressData.history || [];
      const current = progressData.current
        ? { key: "current", date: progressData.current.updatedAt, ...progressData.current, isCurrent: true }
        : null;

      const tableData = current ? [current, ...history.map((h, idx) => ({ key: idx, ...h }))] : history;
      setData(tableData);
    }
  }, [progressData]);

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      setData((prev) =>
        prev.map((item) =>
          item.key === editingRecord.key ? { ...editingRecord, ...values } : item
        )
      );
      setIsModalOpen(false);
      setEditingRecord(null);
    });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{record.isCurrent ? new Date(text).toLocaleDateString() : text}</span>
          {record.isCurrent && <Tag color="blue">Latest</Tag>}
        </div>
      ),
    },
    { title: "Chest (cm)", dataIndex: "chest", key: "chest" },
    { title: "Weight (kg)", dataIndex: "weight", key: "weight" },
    { title: "Height (cm)", dataIndex: "height", key: "height" },
    { title: "Arm (cm)", dataIndex: "arm", key: "arm" },
    { title: "Waist (cm)", dataIndex: "waist", key: "waist" },
    { title: "Thigh (cm)", dataIndex: "thigh", key: "thigh" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Card className="progress-card">
      <h3 className="card-title">Progress History</h3>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        className="progress-table"
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Progress"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Date" name="date">
            <Input />
          </Form.Item>
          <Form.Item label="Chest (cm)" name="chest">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Weight (kg)" name="weight">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Height (cm)" name="height">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Arm (cm)" name="arm">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Waist (cm)" name="waist">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Thigh (cm)" name="thigh">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProgressHistory;
