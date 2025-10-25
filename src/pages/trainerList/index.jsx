import React, { useEffect, useState } from "react";
import { Table, Card, Avatar, message, Button } from "antd";
import { useGymTrainerListQuery } from "../../service/trainer"; // RTK Query hook
import PageHeader from "../../component/pageHeader";
import { useNavigate } from "react-router-dom";

const TrainerList = () => {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading, error } = useGymTrainerListQuery();
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.success) {
      setTrainers(data.data); // backend se trainer array
    } else if (error) {
      message.error("Failed to fetch trainers");
    }
  }, [data, error]);

  const demoAvatar = "https://xsgames.co/randomusers/avatar.php?g=male"; // fallback image

  const columns = [
    { 
      title: "Name", 
      key: "name",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar 
            src={record.photo || demoAvatar} 
            alt={record.user?.name} 
            style={{ marginRight: 10 }} 
          />
          <span>{record.user?.name || "-"}</span>
        </div>
      )
    },
    { 
      title: "Email", 
      dataIndex: ["user", "email"], 
      key: "email", 
      render: text => text || "-" 
    },
    { 
      title: "Phone", 
      dataIndex: ["user", "phone"], 
      key: "phone", 
      render: text => text || "-" 
    },
    { 
      title: "Specialization", 
      dataIndex: "specialization", 
      key: "specialization",
      render: spec => spec?.length ? spec.join(", ") : "-" 
    },
    { 
      title: "Rating", 
      dataIndex: "rating", 
      key: "rating", 
      render: rate => rate || 0 
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => navigate(`/trainer/${record._id}`)}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Trainer List"
        breadcrumbs={["Trainers", "Trainer List"]}
        searchPlaceholder="Search by name, email, phone"
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      <Card
        title="Trainer List"
        style={{ backgroundColor: "#1a1a1a", color: "#fff" }}
        headStyle={{ color: "#fff", borderBottom: "1px solid #333" }}
      >
        <Table
          dataSource={trainers}
          columns={columns}
          rowKey={record => record._id}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          style={{ color: "#fff" }}
        />
      </Card>
    </div>
  );
};

export default TrainerList;
