import React, { useEffect, useState } from "react";
import { Card, Avatar, message } from "antd";
import { useParams } from "react-router-dom";
import { useGetTrainerByIdQuery } from "../../service/trainer";

const TrainerDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetTrainerByIdQuery(id);
  const demoAvatar = "https://xsgames.co/randomusers/avatar.php?g=male";

  useEffect(() => {
    if (error) {
      message.error("Failed to fetch trainer details");
    }
  }, [error]);

  if (isLoading) return <p>Loading...</p>;

  const trainer = data?.data;

  return (
    <Card
      title="Trainer Details"
      style={{ maxWidth: 600, margin: "20px auto", backgroundColor: "#1a1a1a", color: "#fff" }}
      headStyle={{ color: "#fff", borderBottom: "1px solid #333" }}
    >
      <div style={{ textAlign: "center" }}>
        <Avatar
          size={120}
          src={trainer?.photo || demoAvatar}
          style={{ marginBottom: 20 }}
        />
        <p><strong>Name:</strong> {trainer?.user?.name || "-"}</p>
        <p><strong>Email:</strong> {trainer?.user?.email || "-"}</p>
        <p><strong>Phone:</strong> {trainer?.user?.phone || "-"}</p>
        <p><strong>Specialization:</strong> {trainer?.specialization?.length ? trainer.specialization.join(", ") : "-"}</p>
        <p><strong>Rating:</strong> {trainer?.rating || 0}</p>
        <p><strong>Bio:</strong> {trainer?.bio || "-"}</p>
        <p><strong>Experience:</strong> {trainer?.experience || 0} years</p>
      </div>
    </Card>
  );
};

export default TrainerDetail;
