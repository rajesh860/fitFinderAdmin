import { Modal, Select } from "antd";

const ChangeStatusModal = ({ open, onOk, onCancel, value, onChange }) => {
  return (
    <Modal
      title="Change Fee Status"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Update"
    >
       <Select
    showSearch
    placeholder="Select a person"
    optionFilterProp="label"
    onChange={onChange}
    style={{width:"100%"}}
    // onSearch={onSearch}
    options={[
      {
        value: 'pending',
        label: 'pending',
      },
      {
        value: 'paid',
        label: 'paid',
      },
    
    ]}
  />
    </Modal>
  );
};

export default ChangeStatusModal;
