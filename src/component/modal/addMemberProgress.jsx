import {

  Button,
  Modal,
  Form,
  InputNumber,
  Input,
} from "antd";
import {
  CalendarOutlined,
  DashboardOutlined,
  ScissorOutlined,
  ColumnHeightOutlined,
  BorderOuterOutlined,
} from "@ant-design/icons";
import "./styles.scss"
const AddMemberProgress = ({setIsModalOpen,isModalOpen,handleAddProgress})=>{
    return(
         <Modal
          title="Add Progress"
          open={isModalOpen}
          //  className="dark-modal" // <-- custom class
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form layout="vertical" onFinish={handleAddProgress}>
            <Form.Item
              label="Chest (cm)"
              name="chest"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                className="custom-input"
                style={{ width: "100%" }}
                addonBefore={<DashboardOutlined style={{ color: "#fa8c16" }} />}
              />
            </Form.Item>
            <Form.Item
              label="Blood Group"
              name="bloodGroup"
              rules={[{ required: true }]}
            >
              <Input
                style={{ width: "100%" }}
                className="custom-input"
                addonBefore={<DashboardOutlined style={{ color: "#fa8c16" }} />}
              />
            </Form.Item>
            <Form.Item
              label="Weight (kg)"
              name="weight"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                className="custom-input"
                style={{ width: "100%" }}
                addonBefore={<DashboardOutlined style={{ color: "#f5222d" }} />}
              />
            </Form.Item>
            <Form.Item
              label="Height (cm)"
              name="height"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                className="custom-input"
                style={{ width: "100%" }}
                addonBefore={
                  <ColumnHeightOutlined style={{ color: "#722ed1" }} />
                }
              />
            </Form.Item>
            <Form.Item label="Arm (cm)" name="arm" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                className="custom-input"
                style={{ width: "100%" }}
                addonBefore={<ScissorOutlined style={{ color: "#52c41a" }} />}
              />
            </Form.Item>
            <Form.Item
              label="Waist (cm)"
              name="waist"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                className="custom-input"
                addonBefore={
                  <BorderOuterOutlined style={{ color: "#13c2c2" }} />
                }
              />
            </Form.Item>
            <Form.Item
              label="Thigh (cm)"
              name="thigh"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                className="custom-input"
                style={{ width: "100%" }}
                addonBefore={
                  <ColumnHeightOutlined style={{ color: "#1890ff" }} />
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
    )
}
export default AddMemberProgress