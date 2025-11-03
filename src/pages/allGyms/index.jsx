import { useState } from "react";
import { Table, Input, Breadcrumb, Tag, Modal, Carousel, Button, Tooltip, Popconfirm, message, Switch } from "antd";
import { HomeOutlined, SearchOutlined, PauseOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useGymListQuery, useSuspendGymMutation } from "../../service/gyms/index";
import "./styles.scss"
import { useNavigate } from "react-router-dom";

const AllGymList = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalGymName, setModalGymName] = useState("");

  const { data: gyms, isLoading: loading, refetch } = useGymListQuery();
  const [suspendGym] = useSuspendGymMutation();

  const openImagesModal = (images, name) => {
    setModalImages(images);
    setModalGymName(name);
    setIsModalOpen(true);
  };

  const nav = useNavigate()

  // Suspend/Activate gym function
  const handleStatusChange = async (gymId, currentStatus, gymName) => {
    try {
      // Toggle the status: if current status is "approved", set to "suspended", and vice versa
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await suspendGym({ id: gymId, status: newStatus }).unwrap();
      
      message.success(
        `Gym "${gymName}" ${newStatus === "active" ? "inactive" : "suspended"} successfully!`
      );
      refetch(); // Refresh the data
    } catch (error) {
      message.error(`Failed to update gym status: ${error.message}`);
    }
  };

  const columns = [
    {
      title: "Gym Name",
      dataIndex: "gymName",
      key: "gymName",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "user",
      key: "user",
       sorter: (a, b) => a.name.localeCompare(b.email),
      render: (text) => <strong>{text.email}</strong>,
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
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <Tag color={user.status === "active" ? "green" : "red"}>
          {user.status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.user.status === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Status Toggle Switch */}
          <Tooltip title={record.user.status === "active" ? "Inactive Gym" : "Active Gym"}>
            <Popconfirm
              title={`${record.user.status === "active" ? "Inactive" : "Active"} Gym`}
              description={`Are you sure you want to ${record.user.status === "active" ? "Inactive" : "Active"} ${record.user.name}?`}
              onConfirm={() => handleStatusChange(record._id, record.user.status, record.user.name)}
              okText="Yes"
              cancelText="No"
              okType={record.user.status === "active" ? "danger" : "primary"}
            >
              <Switch
                checked={record.user.status === "active"}
                checkedChildren={<PlayCircleOutlined />}
                unCheckedChildren={<PauseOutlined />}
                style={{
                  backgroundColor: record.user.status === "active" ? "#52c41a" : "#ff4d4f"
                }}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
    {
      title:"More detail",
      key:"moredetail",
      render:(_,record)=>{
        return(
          <Tag onClick={()=>nav(`/gym-detail/${record?._id}`)}>View</Tag>
        )
      }
    }
  ];

  const filteredData = gyms?.data?.filter(
    (gym) =>
      gym.gymName.toLowerCase().includes(searchText.toLowerCase()) ||
      gym.email.toLowerCase().includes(searchText.toLowerCase()) ||
      gym.contact.includes(searchText)
  );

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
        <h2 style={{ margin: 0 }}>All Gyms</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Gyms</Breadcrumb.Item>
            <Breadcrumb.Item>All Gyms</Breadcrumb.Item>
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
        rowKey="_id"
        loading={loading}
        // pagination={{ pageSize: 10 }}
           pagination={false}
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

export default AllGymList;