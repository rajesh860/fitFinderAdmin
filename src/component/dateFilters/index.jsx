import { Card, Space, Select, DatePicker, Button } from "antd";
import "./styles.scss";

const { RangePicker } = DatePicker;

export default function DateFilters({
  period,
  onPeriodChange,
  range,
  onRangeChange,
  onToday,
}) {
  return (
    <Card className="filters" bordered={false}>
      <div className="section-title">Attendance Tracking</div>
      <Space wrap size="middle">
        <Select
          value={period}
          onChange={onPeriodChange}
          options={[
            { label: "Current Month", value: "current" },
            { label: "Last Month", value: "last" },
            { label: "Custom", value: "custom" },
          ]}
          style={{ width: 160 }}
        />
        <RangePicker
          value={range}
          format="DD/MM/YYYY"
          onChange={onRangeChange}
        //   disabled={period !== "custom"}
        />
        <Button onClick={onToday}>Jump to Today</Button>
      </Space>
    </Card>
  );
}
