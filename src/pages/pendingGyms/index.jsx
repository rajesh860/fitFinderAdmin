import { useEffect, useState } from "react";
import { Table, Input, Breadcrumb, Tag, Modal, Carousel, Button, Tooltip, Popconfirm, message } from "antd";
import { HomeOutlined, SearchOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useApprovedGymMutation, useGymPendingListQuery, useRejectedGymMutation } from "../../service/gyms/index";
import { toast } from "react-toastify";

const AllPendingGymList = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalGymName, setModalGymName] = useState("");

  const { data: gyms, isLoading: loading } = useGymPendingListQuery();
const [trigger,{data:approved}] = useApprovedGymMutation()
const [trigg,{data:rejected}] = useRejectedGymMutation()
  const openImagesModal = (images, name) => {
    setModalImages(images);
    setModalGymName(name);
    setIsModalOpen(true);
  };

  // Approve gym function
  const handleApprove = (gymId, gymName) => {

    trigger(gymId)
   
  };

  // Reject gym function
  const handleReject = (gymId, gymName) => {
   

    trigg(gymId)
   
  };

  const columns = [
    {
      title: "Gym Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images, record) => (
        <a onClick={() => openImagesModal(images, record.name)}>
          {images.length} Image{images.length > 1 ? "s" : ""}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : status === "pending" ? "orange" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Pending", value: "pending" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* Approve Button with Confirmation */}
          <Popconfirm
            title="Approve Gym"
            description={`Are you sure you want to approve ${record.name}?`}
            onConfirm={() => handleApprove(record._id, record.name)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Approve">
              <Button 
                type="primary" 
                shape="circle" 
                icon={<CheckOutlined />} 
                size="small"
                style={{ backgroundColor: "#52c41a" }}
              />
            </Tooltip>
          </Popconfirm>

          {/* Reject Button with Confirmation */}
          <Popconfirm
            title="Reject Gym"
            description={`Are you sure you want to reject ${record.name}?`}
            onConfirm={() => handleReject(record._id, record.name)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Tooltip title="Reject">
              <Button 
                danger 
                shape="square" 
                icon={<CloseOutlined />} 
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredData = gyms?.filter(
    (gym) =>
      gym.name.toLowerCase().includes(searchText.toLowerCase()) ||
      gym.email.toLowerCase().includes(searchText.toLowerCase()) ||
      gym.contact.includes(searchText)
  );


  useEffect(()=>{
    console.log(approved,rejected)
if(approved?.success || rejected?.success){
    toast.success(approved?.message || rejected?.message)
}else{
    message.error(approved?.message || rejected?.message)
}
  },[approved,rejected])

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
        <h2 style={{ margin: 0 }}>New Gyms</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Gyms</Breadcrumb.Item>
            <Breadcrumb.Item>Pending Gyms</Breadcrumb.Item>
          </Breadcrumb>

          <Input
            placeholder="Search by name, email, or contact"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* Images Modal */}
      <Modal
        title={modalGymName}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        width={600}
        className="custom-carousel-modal"
      >
        <Carousel arrows>
          {modalImages.map((img, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <img
                src={img}
                alt={`${modalGymName} ${idx + 1}`}
                style={{ maxWidth: "100%", maxHeight: "400px", margin: "0 auto" }}
              />
            </div>
          ))}
        </Carousel>
      </Modal>

    
    </div>
  );
};

export default AllPendingGymList;