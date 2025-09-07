import { Table, Button, Tag, Space, Avatar } from "antd";
import { useChangeFeesStatusMutation, useGetAllUserQuery } from "../../service/user/allUser";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChangeStatusModal from "../../component/modal/changeStatusModal"; // new modal component import
import { toast } from "react-toastify";

const AllUser = () => {
  const { data, isLoading: loading } = useGetAllUserQuery();
  const [trigger] = useChangeFeesStatusMutation();
  const nav = useNavigate();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newFeeStatus, setNewFeeStatus] = useState("");

  // Open Modal
  const openModal = (record) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  // Confirm Update
  const handleModalOk = async () => {
    try {
      const payload = {
        id: selectedUser.id,
        fee_status: newFeeStatus,
      };
      console.log(newFeeStatus,"newFeeStatus")
    if(!newFeeStatus){
      console.log("gbhjnkm")
      toast.error("Please select the value")
      return
    }else{

      const result = await trigger(payload).unwrap();
      toast.success(result.message || "Fee status updated successfully");
      setIsModalOpen(false);
      setSelectedUser(null);
    }
    } catch (error) {
      toast.error(error.data?.message || "Failed to update fee status");
    } 
  };

  // Cancel Modal
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Table Columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render:(r,record) => {
        console.log(record,"asfdgdfnb")
        return(<Space size={12} align="center" className="ua-member-cell">
        <Avatar src={record.photo} size={40} />
        <div className="ua-member-meta">
          <div className="ua-member-name">{r}</div>
        </div>
      </Space>)},
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Membership",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "Fee",
      dataIndex: "fee_amount",
      key: "fee_amount",
      render: (amount) => `₹ ${amount}`,
    },
    {
      title: "Fee Status",
      dataIndex: "fee_status",
      key: "fee_status",
      render: (fee_status) => (
        <Tag
          color={
            fee_status === "paid"
              ? "green"
              : fee_status === "pending"
              ? "orange"
              : "red"
          }
        >
          {fee_status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => openModal(record)}>
          Change Status
        </Button>
      ),
    },
    {
      title: "More Detail",
      key: "view",
      render: (_, record) => (
        <Button type="default" onClick={() => nav(`/user-detail/${record?.id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>User Management</h2>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={loading}
        bordered
      />

      {/* Modal Component */}
      <ChangeStatusModal
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        value={newFeeStatus}
        onChange={setNewFeeStatus}
      />
    </div>
  );
};

export default AllUser;
