import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Radio,
  Upload,
  Card,
  Row,
  Col,
  Divider,
  message,
  Typography,
  Switch,
  InputNumber,
  Breadcrumb
} from 'antd';
import {
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useMemberRegisterMutation } from '../../../service/register';
import { useGetMyPlanQuery, useGymPlansQuery} from "../../../service/plans/indx"
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
// import MapView from "./mapView"
const MemberRegistrationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
const [photoFile, setPhotoFile] = useState(); // store file list for Upload
const [photoUrl, setPhotoUrl] = useState(''); // store preview URL
const {data:plansData} = useGetMyPlanQuery()
  const [emergencyContacts, setEmergencyContacts] = useState([{ name: '', phone: '', relation: '' }]);
const [trigger,{data}] = useMemberRegisterMutation()
const onFinish = async (values) => {
  setLoading(true);
  try {
    // Construct payload
const formData = new FormData();

formData.append('first_name', values.first_name);
formData.append('last_name', values.last_name);
formData.append('gender', values.gender);
formData.append('dob', values.dob ? values.dob.format('YYYY-MM-DD') : '');
formData.append('email', values.email);
formData.append('phone', values.phone);
formData.append('address', values.address);

formData.append('membership_type', values.membership_type);
// formData.append('fee_amount', values.fee_amount);

formData.append('height', values.height || '');
formData.append('weight', values.weight || '');
formData.append('blood_group', values.blood_group || '');
formData.append('medical_conditions', JSON.stringify(values.medical_conditions || []));
formData.append('injuries', values.injuries || '');
formData.append('fitness_goals', values.fitness_goals || '');

// Emergency contacts as JSON string
formData.append('emergency_contacts', JSON.stringify(emergencyContacts));

formData.append('referred_by', values.referred_by || '');
formData.append('occupation', values.occupation || '');
formData.append('notes', values.notes || '');
formData.append('create_by', 'gym_owner');
formData.append('plan',values?.membership_type );

// Add photo file
if (photoFile?.originFileObj) {
  formData.append('photo', photoFile.originFileObj);
}

// Now you can use formData in your API call


trigger(formData)
    
  } catch (error) {
    message.error('Error registering member. Please try again.');
  } finally {
    setLoading(false);
  }
};




  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: '', phone: '', relation: '' }]);
  };

  const removeEmergencyContact = (index) => {
    if (emergencyContacts.length > 1) {
      const newContacts = [...emergencyContacts];
      newContacts.splice(index, 1);
      setEmergencyContacts(newContacts);
    }
  };

  const updateEmergencyContact = (index, field, value) => {
    const newContacts = [...emergencyContacts];
    newContacts[index][field] = value;
    setEmergencyContacts(newContacts);
  };

  const medicalConditions = [
    'Diabetes',
    'High Blood Pressure',
    'Heart Disease',
    'Asthma',
    'Arthritis',
    'Back Pain',
    'Osteoporosis',
    'None'
  ];




  return (
    <div style={{width:"100%",overflow:"hidden",padding:"20px"}}>
        <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0,fontSize:"24px" }}><UserOutlined style={{ marginRight: '12px', color: '#1890ff' }} /> New Member Registration</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Gyms</Breadcrumb.Item>
            <Breadcrumb.Item>All Gyms</Breadcrumb.Item>
          </Breadcrumb>

            </div>
      </div>
    
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Divider orientation="left" style={{ color: '#1890ff' }}>Personal Information</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="First name" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input 
                  placeholder="Last name" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="Select gender" size="large">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  size="large"
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { type: 'email', message: 'Please enter a valid email' },
                  { required: true, message: 'Please enter email address' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Email address" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { pattern: /^[0-9+\s()-]{10,}$/, message: 'Please enter a valid phone number' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="Phone number" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Full Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Enter complete address" 
              size="large"
              prefix={<EnvironmentOutlined />}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
<Form.Item label="Member Photo">
  <Upload
    listType="picture-card"
    fileList={photoFile ? [photoFile] : []} // controlled, only one file
    onRemove={() => {
      setPhotoFile(null);
      setPhotoUrl('');
    }}
    beforeUpload={(file) => {
      // create a temporary preview URL
      const preview = URL.createObjectURL(file); 
      setPhotoUrl(preview);

      // set the file immediately so Upload knows it's there
      setPhotoFile({
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: preview,
        originFileObj: file
      });

      return false; // prevent automatic upload
    }}
  >
    {!photoUrl && (
      <div>
        <CameraOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )}
  </Upload>
</Form.Item>


            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="id_proof"
                label="ID Proof"
                rules={[{ required: true, message: 'Please upload ID proof' }]}
              >
                <Upload
                  beforeUpload={() => false} // Prevent automatic upload
                >
                  <Button icon={<IdcardOutlined />} size="large">Upload ID Proof</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ color: '#1890ff' }}>Membership Details</Divider>
          
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="membership_type"
                label="Membership Type"
                rules={[{ required: true, message: 'Please select membership type' }]}
              >
                <Select placeholder="Select type" size="large">
                  {plansData?.map((item)=>{
                    return(

                      <Option value={item?.planId}>{item?.planName}</Option>

                    )
                  })}
                
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="registration_date"
                label="Registration Date"
                rules={[{ required: true, message: 'Please select registration date' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  size="large"
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />
              </Form.Item>
            </Col>
            {/* <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="fee_amount"
                label="Fee Amount (₹)"
                rules={[{ required: true, message: 'Please enter fee amount' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Fee amount"
                  size="large"
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col> */}
          </Row>

          <Divider orientation="left" style={{ color: '#1890ff' }}>Health Information</Divider>
          
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="height"
                label="Height (cm)"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Height in cm"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="weight"
                label="Weight (kg)"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Weight in kg"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="blood_group"
                label="Blood Group"
              >
                <Select placeholder="Select blood group" size="large">
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="medical_conditions"
            label="Medical Conditions"
          >
            <Select
              mode="multiple"
              placeholder="Select any medical conditions"
              size="large"
            >
              {medicalConditions.map(condition => (
                <Option key={condition} value={condition}>{condition}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="injuries"
            label="Previous Injuries/Surgeries"
          >
            <TextArea 
              rows={2} 
              placeholder="List any previous injuries or surgeries" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="fitness_goals"
            label="Fitness Goals"
          >
            <TextArea 
              rows={2} 
              placeholder="What are your fitness goals?" 
              size="large"
            />
          </Form.Item>

          <Divider orientation="left" style={{ color: '#1890ff' }}>Emergency Contacts</Divider>
          
          {emergencyContacts.map((contact, index) => (
            <Row gutter={16} key={index} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Contact Name"
                  value={contact.name}
                  onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                  size="large"
                />
              </Col>
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Phone Number"
                  value={contact.phone}
                  onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                  size="large"
                />
              </Col>
              <Col xs={24} sm={6}>
                <Input
                  placeholder="Relationship"
                  value={contact.relation}
                  onChange={(e) => updateEmergencyContact(index, 'relation', e.target.value)}
                  size="large"
                />
              </Col>
              <Col xs={24} sm={2}>
                {emergencyContacts.length > 1 && (
                  <MinusCircleOutlined
                    onClick={() => removeEmergencyContact(index)}
                    style={{ color: '#ff4d4f', fontSize: '20px', marginTop: '8px' }}
                  />
                )}
              </Col>
            </Row>
          ))}
          
          <Button
            type="dashed"
            onClick={addEmergencyContact}
            icon={<PlusOutlined />}
            style={{ width: '100%', marginBottom: 24 }}
            size="large"
          >
            Add Emergency Contact
          </Button>

          <Divider orientation="left" style={{ color: '#1890ff' }}>Additional Information</Divider>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="referred_by"
                label="Referred By"
              >
                <Input 
                  placeholder="Name of member who referred you" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="occupation"
                label="Occupation"
              >
                <Input 
                  placeholder="Your occupation" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Additional Notes"
          >
            <TextArea 
              rows={3} 
              placeholder="Any additional information" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading}
              style={{ width: '100%', marginTop: '24px', height: '45px' }}
            >
              Register Member
            </Button>
          </Form.Item>
        </Form>
    </div>
  );
};

export default MemberRegistrationForm;