import React from "react";
import { Breadcrumb, Input } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";

const PageHeader = ({
  title = "Page Title",
  breadcrumbs = [],
  searchPlaceholder = "Search...",
  searchText = "",
  onSearchChange = () => {},
  inputShown = true,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
      }}
    >
      <h2 style={{ margin: 0, color: "white" }}>{title}</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Breadcrumb style={{ color: "white" }}>
          <Breadcrumb.Item href="" style={{ color: "white" }}>
            <HomeOutlined style={{ color: "white" }} />
          </Breadcrumb.Item>

          {breadcrumbs.map((crumb, index) => (
            <Breadcrumb.Item key={index} style={{ color: "white" }}>
              {crumb}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
{
  inputShown &&
        <Input
        placeholder={searchPlaceholder}
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        prefix={<SearchOutlined style={{ color: "white" }} />}
        style={{
          width: 300,
          color: "white",
          borderColor: "white",
          backgroundColor: "transparent",
        }}
        className="white-input"
        />
      }
      </div>
    </div>
  );
};

export default PageHeader;
