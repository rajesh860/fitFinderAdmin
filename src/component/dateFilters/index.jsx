import { Card, Space, Select, DatePicker, Button } from "antd";
import "./styles.scss";

const { RangePicker } = DatePicker;

export default function DateFilters({ onToday }) {
  return (
    <Card className="filters" bordered={false}>
      <div className="section-title">Attendance Tracking</div>
      <Space wrap size="middle">
        {/* <Button onClick={onToday}>Jump to Today</Button> */}
      </Space>
    </Card>
  );
}
