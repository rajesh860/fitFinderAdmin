import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Breadcrumb,
  Tag,
  Button,
  Popconfirm,
  message,
  Modal,
  Select,
  Form,
} from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  useBookingApproveMutation,
  useGetBookingEnquiryQuery,
} from "../../service/gyms/index";
import { useGetMyPlanQuery } from "../../service/plans/indx";
import { toast } from "react-toastify";
// import { useUpdateBookingStatusMutation } from "../../service/gyms/index";

const BookingEnquiry = () => {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading: loading, refetch } = useGetBookingEnquiryQuery();
  const { data: gymPlan } = useGetMyPlanQuery();
  const [trigger, { data: approve }] = useBookingApproveMutation();
  // const [updateStatus] = useUpdateBookingStatusMutation(); // ✅ custom RTK query/mutation for status update

  // 🔹 New states for modal & plan selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleStatusChange = async (recordId, status, plan) => {
    try {
      // 🔸 Example API call (uncomment when mutation added)
      // await updateStatus({ id: recordId, status, plan }).unwrap();
      console.log({ planId: selectedPlan, id: recordId });
      trigger({ planId: selectedPlan, id: recordId });
      // message.success(`Booking ${status} successfully${plan ? ` with ${plan} plan` : ""}`);
      // refetch(); // refresh table after update
      // setIsModalOpen(false);
      // setSelectedRecord(null);
      // setSelectedPlan(null);
    } catch (err) {
      message.error("Failed to update status");
      console.error(err);
    }
  };

  const columns = [
    {
      title: "User Name",
      key: "userName",
      render: (_, record) => <strong>{record.user?.name || "-"}</strong>,
    },
    {
      title: "User Contact",
      key: "userContact",
      render: (_, record) => record.user?.phone || "-",
    },
    {
      title: "User Email",
      key: "userEmail",
      render: (_, record) => record.user?.email || "-",
    },
    {
      title: "Enquiry Date",
      key: "date",
      dataIndex: "requestedAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.requestedAt) - new Date(b.requestedAt),
    },
    {
      title: "Enquiry Time",
      key: "time",
      dataIndex: "requestedAt",
      render: (date) => new Date(date).toLocaleTimeString(),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "approved"
              ? "green"
              : status === "rejected"
              ? "red"
              : "blue"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "pending" ? (
          <div style={{ display: "flex", gap: "8px" }}>
            {/* 🔹 Approve Button → Modal open karega */}
            <Button
              type="primary"
              onClick={() => {
                setSelectedRecord(record);
                setIsModalOpen(true);
              }}
            >
              Approve
            </Button>

            <Popconfirm
              title="Are you sure to reject this booking?"
              onConfirm={() => handleStatusChange(record._id, "rejected")}
            >
              <Button type="danger">Reject</Button>
            </Popconfirm>
          </div>
        ) : (
          <span>--</span>
        ),
    },
  ];

  const filteredData = data?.data?.filter(
    (item) =>
      (item.user?.name || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (item.user?.email || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (item.user?.phone || "").includes(searchText) ||
      new Date(item.requestedAt).toLocaleDateString().includes(searchText) ||
      new Date(item.requestedAt).toLocaleTimeString().includes(searchText)
  );
  const plngBg = {
    BASIC: "blue",
    SILVER: "gray",
    GOLD: "gold",
    PLATINUM: "green",
  };

  useEffect(() => {
    if (approve?.success) {
      toast.success(approve?.message);
      refetch();
      setIsModalOpen(false);
      setSelectedRecord(null);
      setSelectedPlan(null);
    } else if (approve && !approve?.success) {
      toast.error(approve?.message);
    }
  }, [approve]);
  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>Booking Enquiries</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Enquiry</Breadcrumb.Item>
            <Breadcrumb.Item>Booking Enquiries</Breadcrumb.Item>
          </Breadcrumb>

          <Input
            placeholder="Search by name, email, contact, date, time"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* 🔹 Approve Modal */}
      <Modal
        title="Approve Booking"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
          setSelectedPlan(null);
        }}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={() =>
            handleStatusChange(selectedRecord._id, "approved", selectedPlan)
          }
        >
          <Form.Item
            label="Select Plan"
            required
            rules={[{ required: true, message: "Please select a plan" }]}
          
            >
            <Select
              placeholder="Choose a plan"
              value={selectedPlan}
              onChange={(value) => setSelectedPlan(value)}
            >
              {/* 🔸 Static Plans (Can be Dynamic Later) */}
              {gymPlan?.map((item) => {
                return (
                  <Select.Option value={item?._id}>
                    <Tag color={plngBg[item?.planName]}>{item?.planName}</Tag>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={!selectedPlan}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingEnquiry;
