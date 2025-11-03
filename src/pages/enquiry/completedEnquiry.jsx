import { useState } from "react";
import { Table, Input, Breadcrumb, Tag } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { useGetQueryQuery } from "../../service/gyms/index";
import PageHeader from "../../component/pageHeader";

const CompletedEnquiry = () => {
  const [searchText, setSearchText] = useState("");

  const { data, isLoading: loading } = useGetQueryQuery(["completed"]); // ✅ सिर्फ completed fetch

  const columns = [
    {
      title: "User Name",
      key: "userName",
      render: (_, record) => (
        <strong>{`${record.userId?.first_name || ""} ${
          record.userId?.last_name || ""
        }`}</strong>
      ),
    },
    {
      title: "User Contact",
      key: "userContact",
      render: (_, record) => record.userId?.phone || "-",
    },
    {
      title: "User Email",
      key: "userEmail",
      render: (_, record) => record.userId?.email || "-",
    },
    {
      title: "Enquiry Date",
      key: "date",
      dataIndex: "date",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Enquiry Time",
      key: "time",
      dataIndex: "time",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "blue"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Unique Number",
      key: "uniqueNumber",
      dataIndex: "uniqueNumber",
    },
  ];

  const filteredData = data?.data?.filter(
    (item) =>
      (item.userId?.first_name || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (item.userId?.last_name || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (item.userId?.email || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (item.userId?.phone || "").includes(searchText) ||
      new Date(item.date).toLocaleDateString().includes(searchText) ||
      (item.time || "").includes(searchText)
  );

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Completed Enquiries"
        breadcrumbs={["Enquiry", "Completed Enquiries"]}
        searchPlaceholder="Search by name, email, contact, date, time"
        searchText={searchText}
        onSearchChange={setSearchText}
      />


      {/* Table */}
      <div className="dark-table">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record._id}
          loading={loading}
          // pagination={{ pageSize: 10 }}
             pagination={false}
          bordered
        />
      </div>
    </div>
  );
};

export default CompletedEnquiry;
