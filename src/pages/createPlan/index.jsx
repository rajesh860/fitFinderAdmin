import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Tag,
  message,
  Typography,
  Space
} from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { useGymCreatePlansMutation, useGymPlansQuery } from '../../service/plans/indx';
import { toast } from 'react-toastify';

const { Option } = Select;
const { Title, Text } = Typography;

const durationOptions = [
  { label: '1 Month', value: 1 },
  { label: '3 Months', value: 3 },
  { label: '6 Months', value: 6 },
  { label: '1 Year', value: 12 },
  { label: '2 Years', value: 24 },
];

const gymFeatures = [
  "Trainer", "Diet", "Locker", "Shower", "Parking",
  "Cardio Machines", "Weight Training", "Free Weights", "Yoga Classes",
  "Group Classes", "Personal Training", "Stretching Area", "Wi-Fi",
  "CrossFit Zone", "Functional Training", "HIIT Classes", "Pilates",
  "Barre Classes", "Cycling / Spin Classes", "Martial Arts",
  "Boxing / Kickboxing", "Body Composition Analysis", "Health Check",
  "Towel Service", "Music / Entertainment System", "Swimming Pool",
  "Sauna", "Steam Room", "Jacuzzi", "Spa / Massage / Physiotherapy",
  "Juice / Protein Shake Bar", "Premium Locker Rooms", "Childcare / Kids Zone",
  "Smart Gym Equipment", "App / Online Workout Subscription",
  "Celebrity / Expert Trainer Sessions", "Merchandise / Supplements Store",
  "24/7 Access", "Lounge / Cafe Area", "Cryotherapy / Recovery Equipment"
];

const CreatePlanForm = () => {
  const [form] = Form.useForm();
  const [features, setFeatures] = useState([]);
  const [currentFeature, setCurrentFeature] = useState('');
  const { data: getPlan } = useGymPlansQuery();
  const [trigger, { isLoading, data }] = useGymCreatePlansMutation();

  // Add feature from input or selection
  const handleAddFeature = (feature) => {
    const val = feature || currentFeature;
    if (val && !features.includes(val)) {
      setFeatures([...features, val]);
      setCurrentFeature('');
    } else if (features.includes(val)) {
      message.warning('This feature has already been added.');
    }
  };

  // Remove feature
  const handleRemoveFeature = (featureToRemove) => {
    setFeatures(features.filter(feature => feature !== featureToRemove));
  };

  const onFinish = async (values) => {
    try {
      const planData = {
        planId: values.planType,
        price: values.price,
        durationInMonths: values.durationInMonths,
        features,
      };

      // console.log('Final Payload:', planData);

      await trigger(planData).unwrap();

      message.success('Plan created successfully!');
      form.resetFields();
      setFeatures([]);
      setCurrentFeature('');
    } catch (error) {
      message.error(error?.data?.message || 'Error creating plan');
    }
  };

  const plngBg = {
    BASIC: 'blue',
    SILVER: 'gray',
    GOLD: 'gold',
    PLATINUM: 'green',
  };

  useEffect(() => {
    console.log(data)
    if (data?.success) {
      toast.success(data?.message)
    }
  }, [data])

  return (
    <div style={{ padding: '24px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'left', marginBottom: '24px' }}>
          Create Gym Plan
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ durationInMonths: 1, price: 29.99 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="planType"
                label="Plan Type"
                rules={[{ required: true, message: 'Please select a plan type' }]}
              >
                <Select placeholder="Select plan type">
                  {getPlan?.map(plan => (
                    <Option key={plan._id} value={plan._id}>
                      <Tag color={plngBg[plan?.name]}>{plan.name}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="price"
                label="Price ($)"
                rules={[{ required: true, message: 'Please enter the price' }]}
              >
                <Input
                  type="number"
                  placeholder="0.00"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

        <Row gutter={16}>
  <Col xs={24} sm={12}>
    <Form.Item
      name="durationInMonths"
      label="Duration (Months)"
      rules={[{ required: true, message: 'Please enter duration in months' }]}
    >
      <Input
        type="number"
        min={1}
        placeholder="Enter duration in months"
        style={{ width: '100%' }}
      />
    </Form.Item>
  </Col>
</Row>

          <Divider>Plan Features</Divider>

          <Form.Item label="Add Features">
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                placeholder="Enter a feature or select from list"
                onPressEnter={() => handleAddFeature()}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAddFeature()}
              >
                Add
              </Button>
            </Space.Compact>

            <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
              Click a feature below to add it
            </Text>

            {/* Show gym features as selectable tags */}
            <div style={{ marginTop: 12 }}>
              {gymFeatures.map((feature, idx) => (
                <Tag
                  key={idx}
                  color={features.includes(feature) ? 'green' : 'default'}
                  style={{ cursor: 'pointer', marginBottom: 4, marginRight: 4 }}
                  onClick={() => handleAddFeature(feature)}
                >
                  {feature}
                </Tag>
              ))}
            </div>
          </Form.Item>

          {features.length > 0 && (
            <Form.Item label="Selected Features">
              <div style={{ marginBottom: '16px' }}>
                {features.map((feature, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleRemoveFeature(feature)}
                    style={{ marginBottom: '8px', padding: '4px 8px' }}
                  >
                    {feature}
                  </Tag>
                ))}
              </div>
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={isLoading}
              style={{ width: '100%' }}
            >
              Create Plan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePlanForm;
