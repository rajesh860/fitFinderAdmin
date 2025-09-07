import React from "react";

const activities = [
  {
    id: 1,
    status: "Status changed to ",
    highlight: "Approved",
    color: "#22c55e", // green
    bg: "#ecfdf5",
    by: "Admin John",
    date: "22-08-2024",
  },
  {
    id: 2,
    status: "Profile updated",
    highlight: "",
    color: "#3b82f6", // blue
    bg: "#f0f7ff",
    by: "Owner John Mitchell",
    date: "20-08-2024",
  },
  {
    id: 3,
    status: "Gym registered",
    highlight: "",
    color: "#6b7280", // gray
    bg: "#f9fafb",
    by: "Owner John Mitchell",
    date: "15-01-2024",
  },
];

const ActivityLog = ()=> {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        // maxWidth: "400px",
      }}
    >
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "16px",
          color: "#111827",
        }}
      >
        Activity Log
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {activities.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              background: item.bg,
              borderRadius: "8px",
              padding: "12px 14px",
            }}
          >
            {/* Status Dot */}
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: item.color,
                marginTop: "6px",
                marginRight: "10px",
              }}
            ></span>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#111827",
                }}
              >
                {item.status}{" "}
                {item.highlight && (
                  <span style={{ color: item.color }}>{item.highlight}</span>
                )}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                by {item.by} • {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityLog
