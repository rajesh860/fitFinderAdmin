import { Card, Row, Col, Statistic, Progress } from "antd";
import "./styles.scss";

function Summary({ present, absent, rate }) {
  return (
    <Card bordered={false} className="scard attendance">
      <div className="scard__title">Attendance Summary</div>
      <Row gutter={[2, 2]} className="content">
        <Col span={24}>
          <Statistic title="Present Days" value={present} className="present" />
        </Col>
        <Col span={24}>
          <Statistic title="Absent Days" value={absent} className="absent" />
        </Col>
        <Col span={24}>
          <Statistic
            title="Attendance Rate"
            value={`${rate}%`}
            className="rate"
          />
        </Col>
      </Row>
    </Card>
  );
}

function Insights({ mostActiveTime, avgSession, streak }) {
  return (
    <Card bordered={false} className="scard insights">
      <div className="scard__title">Insights</div>
      <Row gutter={[12, 12]} className="content">
        <Col span={24}>
          <Statistic title="Most Active Time" value={mostActiveTime} />
        </Col>
        <Col span={24}>
          <Statistic title="Avg Session" value={avgSession} />
        </Col>
        <Col span={24}>
          <Statistic title="Current Streak" value={streak} className="red" />
        </Col>
      </Row>
    </Card>
  );
}

function Goal({ completed, target }) {
  const percent = Math.round((completed / target) * 100);
  return (
    <Card bordered={false} className="scard goal">
      <div className="scard__title">Goal Progress</div>
      <div className="scard__goal">
        <div className="scard__row">
          <div>Monthly Goal</div>
          <div className="scard__percentage">{percent}%</div>
        </div>
        <Progress percent={percent} />
        <div className="scard__muted">
          {completed} of {target} days completed
        </div>
      </div>
    </Card>
  );
}

export default function SummaryCards({ summary, insights, goal }) {
  return (
    <div className="summary-stack">
      <Summary
        present={summary.present}
        absent={summary.absent}
        rate={summary.attendanceRate}
      />
      <Insights {...insights} />
      <Goal completed={goal.completed} target={goal.target} />
    </div>
  );
}
