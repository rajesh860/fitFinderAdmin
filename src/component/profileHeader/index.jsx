import { Card, Row, Col, Tag, Avatar } from "antd";
import {
  CheckCircleTwoTone,
  CrownTwoTone,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import dayjs from "dayjs";

export default function ProfileHeader({ user }) {
  const label = (t, v) => (
    <div className="ph__item">
      <div className="ph__label">{t}</div>
      <div className="ph__value">{v}</div>
    </div>
  );

  return (
    <Card className="ph" bordered={false}>
      <Row gutter={[16, 16]} align="top">
        <Col xs={24} md={10} className="ph__left">
          <Avatar size={64} src={user?.photo} />
          <div className="ph__meta">
            <div className="ph__name">{user?.first_name + ' '+ user?.last_name}</div>
            <div className="ph__tags">
              <Tag icon={<CrownTwoTone twoToneColor="#f59e0b" />} color="gold">
                {user?.plan} Plan
              </Tag>
              <Tag
                icon={<CheckCircleTwoTone twoToneColor="#22c55e" />}
                color="success"
                style={{textTransform:"uppercase"}}
              >
                {user?.status}
              </Tag>
            </div>
            <div className="ph__valid">
              Valid until: <b>{dayjs(user?.membership_end).format("DD-MM-YYYY")}</b>
            </div>
          </div>
        </Col>

        <Col xs={24} md={14}>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={8}>
              {label("User ID", user?._id)}
            </Col>
            <Col xs={12} md={8}>
              {label("Phone", user?.phone)}
            </Col>
            <Col xs={12} md={8}>
              {label("Email", user?.email)}
            </Col>
            <Col xs={12} md={8}>
              {label("Monthly Fee", user?.fee_amount)}
            </Col>
            <Col xs={12} md={8}>
              {label("Height", user?.height)}
            </Col>
            <Col xs={12} md={8}>
              {label("Weight", user?.weight)}
            </Col>
            <Col xs={12} md={8}>
              {label("Address", user?.address)}
            </Col>
            {/* <Col xs={12} md={8}>
              {label("Created At", user?.createdAt)}
            </Col>
            <Col xs={12} md={8}>
              {label("Updated At", user?.updatedAt)}
            </Col> */}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
