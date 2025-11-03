import React, { use, useState } from "react";
import {
  Table,
  Tag,
  DatePicker,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
} from "antd";
import {
  CalendarOutlined,
  DashboardOutlined,
  ScissorOutlined,
  ColumnHeightOutlined,
  BorderOuterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import "./styles.scss";
import {
  useAddProgressMutation,
  useGetProgressQuery,
} from "../../../service/gyms";
import { useParams } from "react-router-dom";

const { RangePicker } = DatePicker;

const ProgressHistoryTable = ({ getProgressHistory }) => {
  const { id } = useParams();
  console.log("Member ID in ProgressHistoryTable:", getProgressHistory);

  const [trigger, { data: apiResponse }] = useAddProgressMutation();

  const [progress, setProgress] = useState([
    {
      _id: "1",
      weight: 72,
      height: 175,
      arm: 32,
      waist: 80,
      chest: 90,
      thigh: 55,
      updatedAt: "2025-09-15T10:00:00Z",
    },
    {
      _id: "2",
      weight: 74,
      height: 175,
      arm: 33,
      waist: 82,
      thigh: 56,
      chest: 90,
      updatedAt: "2025-08-15T10:00:00Z",
    },
  ]);

  const [filteredData, setFilteredData] = useState(progress);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      title: (
        <>
          <CalendarOutlined style={{ color: "#1890ff", marginRight: 5 }} />
          Date
        </>
      ),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date, record, index) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {dayjs(date).format("YYYY-MM-DD")}
          {index === 0 && <Tag color="green">Latest</Tag>}
        </div>
      ),
    },
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
  ];

  const handleDateFilter = (dates) => {
    if (!dates || dates.length === 0) {
      setFilteredData(progress);
      return;
    }
    const [start, end] = dates;
    const filtered = progress.filter((item) => {
      const itemDate = dayjs(item.updatedAt);
      return (
        itemDate.isSameOrAfter(start, "day") &&
        itemDate.isSameOrBefore(end, "day")
      );
    });
    setFilteredData(filtered);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Progress");
    XLSX.writeFile(workbook, "progress.xlsx");
  };

  const handleAddProgress = async (values) => {
    const newProgress = {
      data: {
        weight: values.weight,
        height: values.height,
        arm: values.arm,
        waist: values.waist,
        thigh: values.thigh,
        chest: values.chest,
        bloodGroup: values.bloodGroup,
      },
      memberId: id,
    };
    // ✅ Trigger API call
    try {
      await trigger(newProgress).unwrap();
    } catch (err) {
      console.error("Error adding progress:", err);
    }

    const updatedData = [newProgress, ...progress];
    setProgress(updatedData);
    setFilteredData(updatedData);
    setIsModalOpen(false);
  };
  console.log("New Progress:", getProgressHistory);

  return (
    <div className="progress-history-table">
      <div className="content">
        <h3 className="title">User Progress History</h3>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <RangePicker onChange={handleDateFilter} />
          <div>
            <Button
              type="primary"
              onClick={exportToExcel}
              style={{ marginRight: 8 }}
            >
              Export to Excel
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>Add Progress</Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={getProgressHistory}
          rowKey="_id"
          // pagination={{ pageSize: 5 }}
          pagination={false}
        />

        <Modal
          title="Add Progress"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form layout="vertical" onFinish={handleAddProgress}>
            <Form.Item
              label="Chest (cm)"
              name="chest"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                addonBefore={<DashboardOutlined style={{ color: "#fa8c16" }} />}
              />
            </Form.Item>
            <Form.Item
              label="Blood Group"
              name="bloodGroup"
              rules={[{ required: true }]}
            >
              <Input
                style={{ width: "100%" }}
                addonBefore={<DashboardOutlined style={{ color: "#fa8c16" }} />}
              />
            </Form.Item>
            <Form.Item
              label="Weight (kg)"
              name="weight"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                addonBefore={<DashboardOutlined style={{ color: "#f5222d" }} />}
              />
            </Form.Item>
            <Form.Item
              label="Height (cm)"
              name="height"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                addonBefore={
                  <ColumnHeightOutlined style={{ color: "#722ed1" }} />
                }
              />
            </Form.Item>
            <Form.Item label="Arm (cm)" name="arm" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                addonBefore={<ScissorOutlined style={{ color: "#52c41a" }} />}
              />
            </Form.Item>
            <Form.Item
              label="Waist (cm)"
              name="waist"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                addonBefore={
                  <BorderOuterOutlined style={{ color: "#13c2c2" }} />
                }
              />
            </Form.Item>
            <Form.Item
              label="Thigh (cm)"
              name="thigh"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                addonBefore={
                  <ColumnHeightOutlined style={{ color: "#1890ff" }} />
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProgressHistoryTable;
