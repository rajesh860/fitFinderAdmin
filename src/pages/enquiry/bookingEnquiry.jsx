import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Popconfirm,
  Modal,
  Select,
  Form,
  InputNumber,
  Input,
} from "antd";
import {
  useBookingApproveMutation,
  useGetBookingEnquiryQuery,
} from "../../service/gyms/index";
import { useGetMyPlanQuery } from "../../service/plans/indx";
import { toast } from "react-toastify";
import PageHeader from "../../component/pageHeader";

const BookingEnquiry = () => {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading: loading, refetch } = useGetBookingEnquiryQuery();
  const { data: gymPlan } = useGetMyPlanQuery();
  const [trigger, { data: approve }] = useBookingApproveMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form] = Form.useForm();

  const plngBg = {
    BASIC: "blue",
    SILVER: "gray",
    GOLD: "gold",
    PLATINUM: "green",
  };

  // 🔹 Handle plan selection → update Total Amount & Duration automatically
  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
    const plan = gymPlan.find((p) => p._id === planId);
    if (plan) {
      form.setFieldsValue({
        totalAmount: plan.price,
        durationInMonths: plan.durationInMonths,
        paidAmount: 0,
        pendingAmount: plan.price,
      });
    }
  };

  // 🔹 Update Pending Amount live when Paid Amount changes
  const handlePaidChange = (paid) => {
    const total = form.getFieldValue("totalAmount") || 0;
    form.setFieldsValue({
      pendingAmount: total - (paid || 0),
    });
  };

  const handleStatusChange = async (values) => {
    if (!selectedRecord || !selectedPlan) return;

    const payload = {
      planId: selectedPlan,
      totalAmount: values.totalAmount,
      paidAmount: values.paidAmount,
      paymentMode: values.paymentMode,
      remark: values.remark,
    };

    try {
      await trigger({ id: selectedRecord._id, planId: payload });
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve booking");
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
              onConfirm={() => handleStatusChange({ status: "rejected" })}
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
      (item.user?.phone || "").includes(searchText)
  );

  useEffect(() => {
    if (approve?.success) {
      toast.success(approve?.message);
      refetch();
      setIsModalOpen(false);
      setSelectedRecord(null);
      setSelectedPlan(null);
      form.resetFields();
    } else if (approve && !approve?.success) {
      toast.error(approve?.message);
    }
  }, [approve]);

  return (
    <div>
      <PageHeader
        title="Booking Enquiries"
        breadcrumbs={["Enquiry", "Booking Enquiries"]}
        searchPlaceholder="Search by name, email, contact"
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title="Approve Booking"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
          setSelectedPlan(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleStatusChange}>
          {/* Plan Select */}
          <Form.Item
            label="Select Plan"
            name="planId"
            rules={[{ required: true, message: "Please select a plan" }]}
          >
            <Select
              placeholder="Choose a plan"
              value={selectedPlan}
              onChange={handlePlanChange}
            >
              {gymPlan?.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.planName} - ₹{item.price} ({item.durationInMonths} mo)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Total Amount - Disabled */}
          <Form.Item label="Total Amount" name="totalAmount">
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>

          {/* Duration - Disabled */}
          <Form.Item label="Duration (Months)" name="durationInMonths">
            <Input style={{ width: "100%" }} disabled />
          </Form.Item>

          {/* Paid Amount */}
          <Form.Item
            label="Paid Amount"
            name="paidAmount"
            rules={[{ required: true, message: "Enter paid amount" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              onChange={handlePaidChange}
            />
          </Form.Item>

          {/* Pending Amount - Disabled */}
          <Form.Item label="Pending Amount" name="pendingAmount">
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>

          {/* Payment Mode */}
          <Form.Item
            label="Payment Mode"
            name="paymentMode"
            rules={[{ required: true, message: "Select payment mode" }]}
          >
            <Select placeholder="Select Mode">
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="upi">UPI</Select.Option>
              <Select.Option value="card">Card</Select.Option>
              <Select.Option value="bank">Bank Transfer</Select.Option>
            </Select>
          </Form.Item>

          {/* Remark */}
          <Form.Item label="Remark" name="remark">
            <Input.TextArea rows={2} placeholder="Any remark" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={!selectedPlan}
            >
              Approve Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingEnquiry;
