import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Form, Input, Tag, message } from "antd";
import { useEditProgressMutation } from "../../../service/gyms/index"; // adjust path
import "./styles.scss";
import { toast } from "react-toastify";

const ProgressHistory = ({ progressData }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [data, setData] = useState([]);
  const [editProgress] = useEditProgressMutation();

  useEffect(() => {
    if (progressData) {
      const history = progressData.history || [];
      const current = progressData.current
        ? { key: "current", ...progressData.current, isCurrent: true }
        : null;

      const tableData = current
        ? [current, ...history.map((h, idx) => ({ key: idx, ...h }))]
        : history;
      setData(tableData);
    }
  }, [progressData]);

  const handleEdit = (record) => {
    if (!record.isCurrent) {
      message.warning("You can only edit the current measurements");
      return;
    }
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!editingRecord?.isCurrent) return;

      // Call API mutation
      const response = await editProgress({
        memberId: progressData.member._id,
        body: values,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message);

        // Update local table data
        setData((prev) =>
          prev.map((item) =>
            item.key === editingRecord.key
              ? { ...editingRecord, ...values }
              : item
          )
        );

        setIsModalOpen(false);
        setEditingRecord(null);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to update measurements");
    }
  };

  const columns = [
    {
      title: "Chest (cm)",
      dataIndex: "chest",
      key: "chest",
    },
    {
      title: "Weight (kg)",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Height (cm)",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Arm (cm)",
      dataIndex: "arm",
      key: "arm",
    },
    {
      title: "Waist (cm)",
      dataIndex: "waist",
      key: "waist",
    },
    {
      title: "Thigh (cm)",
      dataIndex: "thigh",
      key: "thigh",
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
    },
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
        className="custom-table"
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Current Progress"
        open={isModalOpen}
        onOk={handleSave}
        // className="dark-modal"
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
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
          <Form.Item label="Blood Group" name="bloodGroup">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProgressHistory;
