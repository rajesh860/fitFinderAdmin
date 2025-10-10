import { Table, Button, Tag, Space, Avatar, Popconfirm } from "antd";
import {
  useChangeFeesStatusMutation,
  useGetAllUserQuery,
  useDeleteMemberMutation,
} from "../../service/user/allUser";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChangeStatusModal from "../../component/modal/changeStatusModal";
import { toast } from "react-toastify";
import PageHeader from "../../component/pageHeader";

const AllUser = () => {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading: loading } = useGetAllUserQuery();
  const [trigger] = useChangeFeesStatusMutation();
  const [deleteUser] = useDeleteMemberMutation();
  const nav = useNavigate();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newFeeStatus, setNewFeeStatus] = useState("");

  // Confirm Update
  const handleModalOk = async () => {
    try {
      const payload = {
        id: selectedUser.id,
        fee_status: newFeeStatus,
      };
      if (!newFeeStatus) {
        toast.error("Please select a value");
        return;
      }
      const result = await trigger(payload).unwrap();
      toast.success(result.message || "Fee status updated successfully");
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to update fee status");
    }
  };

  // Cancel Modal
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Delete User
  const handleDelete = async (id) => {
    try {
      const res = await deleteUser(id).unwrap();
      toast.success(res.message || "User deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete user");
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (r, record) => {
        console.log(record.photo,"bjk")
        return(

        <Space size={12} align="center" className="ua-member-cell">
          <Avatar src={record.photo} size={40} />
          <div className="ua-member-meta">
            <div className="ua-member-name">{r}</div>
          </div>
        </Space>
      )},
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="default" onClick={() => nav(`/user-detail/${record?.id}`)}>
            View
          </Button>

          <Popconfirm
            title="Are you sure to delete this user?"
            okText="Yes, Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record?.id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="All Member"
        breadcrumbs={["Member", "All Member"]}
        searchPlaceholder="Search by name, email, contact, date, time"
        searchText={searchText}
        onSearchChange={setSearchText}
      />
      <div className="dark-table">
        <Table
          columns={columns}
          dataSource={data?.data}
          rowKey="id"
          loading={loading}
          bordered
        />
      </div>

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
