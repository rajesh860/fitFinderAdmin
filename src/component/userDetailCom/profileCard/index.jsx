// src/components/ProfileCard.jsx
import React from "react";
import { Tag } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import moment from "moment";

const ProfileCard = ({ userData }) => {
  return (
    <div className="profile-card">
      <img
        src={userData?.photo}
        alt="Profile"
        className="profile-image"
      />
      <h2>{userData?.name}</h2>

      <Tag color="#fadb14" className="tag gold">
        {userData?.planName}
      </Tag>
      <Tag color="green" className="tag active">
        {userData?.membership_status}
      </Tag>

      <div className="details">
        <div className="row">
          <span>Valid Until:</span>
          <span className="bold">
            {moment(userData?.membership_end).format("DD MMMM YYYY")}
          </span>
        </div>
        <div className="row">
          <span>Plan Price:</span>
          <span className="bold green">₹{userData?.planPrice}</span>
        </div>
      </div>

      <hr />

      <div className="contact-info">
        <h4>Contact Info</h4>
        <p>
          <PhoneOutlined /> +91 {userData?.phone}
        </p>
        <p>
          <MailOutlined /> {userData?.email}
        </p>
        <p>
          <EnvironmentOutlined /> {userData?.address}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
