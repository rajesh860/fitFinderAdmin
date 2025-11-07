import React, { useEffect, useState } from "react";
import { Modal, Card, Select, DatePicker, Input, Form, Button } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import { useRenewPlanMutation } from "../../service/gyms";

const { Option } = Select;

const RenewModal = ({
  selectedFee,
  isRenewModalVisible,
  setIsRenewModalVisible,
  gymPlan,
  planLoading,
}) => {
  const [form] = Form.useForm();
  const [trigg] = useRenewPlanMutation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // ✅ Fixed: DatePicker ke liye separate state maintain karo
  const [startDateValue, setStartDateValue] = useState(null);

  console.log(selectedFee,"selectedFee");

  // Auto select first plan when modal opens
  useEffect(() => {
    if (isRenewModalVisible && gymPlan?.length > 0) {
      const first = gymPlan[0];
      setSelectedPlan(first);
      setStartDateValue(null); // ✅ Reset date when modal opens
      form.setFieldsValue({
        planName: first.planName,
        totalAmount: first.price,
        durationInMonths: first.durationInMonths,
        paidAmount: 0,
        pendingAmount: first.price,
        startDate: null, // ✅ Explicitly set to null
        endDate: null,   // ✅ Explicitly set to null
      });
    }
  }, [isRenewModalVisible, gymPlan]);

  // ✅ Fixed: Handle start date change properly
  const handleStartDateChange = (date, dateString) => {
    console.log("Date selected:", date, dateString);
    
    if (!date || !selectedPlan?.durationInMonths) {
      setStartDateValue(null);
      form.setFieldsValue({ 
        startDate: null, 
        endDate: null 
      });
      return;
    }

    const start = moment(date);
    const end = moment(start).add(selectedPlan.durationInMonths, "months");
    
    setStartDateValue(date); // ✅ Update state
    form.setFieldsValue({
      startDate: date,
      endDate: end,
    });
  };

  // ✅ Fixed: Handle plan change - reset dates
  const handlePlanChange = (value) => {
    const selected = gymPlan.find((p) => p.planName === value);
    setSelectedPlan(selected);
    setStartDateValue(null); // ✅ Reset date when plan changes
    
    const paid = form.getFieldValue("paidAmount") || 0;
    form.setFieldsValue({
      totalAmount: selected?.price || "",
      durationInMonths: selected?.durationInMonths || "",
      pendingAmount: selected?.price && paid ? selected.price - Number(paid) : selected?.price || "",
      startDate: null, // ✅ Reset start date
      endDate: null,   // ✅ Reset end date
    });
  };

  // ✅ Fixed: Modal close par reset karo
  const handleModalClose = () => {
    setStartDateValue(null); // ✅ Reset date state
    form.resetFields();
    setIsRenewModalVisible(false);
  };

  // 🧾 Handle submit
  const handleRenewPlan = async (values) => {
    try {
      const plan = gymPlan.find((p) => p.planName === values.planName);
      if (!plan?._id) return toast.error("Invalid plan selection");

      // ✅ Prepare payload as per backend API
      const payload = {
        memberId: selectedFee?.memberId,
        planId: plan?.planId,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        totalAmount: Number(values.totalAmount),
        paidAmount: Number(values.paidAmount || 0),
        pendingAmount: Number(values.pendingAmount || 0),
      };

      const response = await trigg(payload).unwrap();

      if (response?.success) {
        toast.success("Plan renewed successfully!");
        handleModalClose(); // ✅ Use common close function
      } else {
        toast.error(response?.message || "Failed to renew plan");
      }
    } catch (err) {
      console.error("Renew Plan Error:", err);
      toast.error(err?.data?.message || "Failed to renew plan");
    }
  };

  return (
    <Modal
      destroyOnClose // ✅ Yeh important hai
      className="edit-plan-modal"
      bodyStyle={{
        background: "#161b22",
        color: "#c9d1d9",
        borderRadius: "8px",
      }}
      title={
        <span style={{ color: "#fff" }}>
          Renew Plan for {selectedFee?.memberName || ""}
        </span>
      }
      open={isRenewModalVisible}
      onCancel={handleModalClose} // ✅ Use common close function
      footer={null}
      afterClose={() => {
        setStartDateValue(null); // ✅ Modal close hone ke baad bhi reset
        form.resetFields();
      }}
    >
      {selectedFee && (
        <Card
          bordered
          style={{
            marginBottom: 20,
            background: "#1e1e1e",
            color: "#fff",
            borderColor: "#30363d",
          }}
        >
          <p>
            <strong>Current Plan:</strong> {selectedFee.status === "expired" ? <span style={{color:"red"}}>No Active Plan</span> : selectedFee.planName }
          </p>
          <p>
            <strong>Next Due Date:</strong> {selectedFee.nextDueDate}
          </p>
        </Card>
      )}

      {/* -------------------- Form -------------------- */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleRenewPlan}
        style={{ color: "#fff" }}
      >
        {/* Select New Plan */}
        <Form.Item
          name="planName"
          label={<span style={{ color: "#c9d1d9" }}>Select New Plan</span>}
          rules={[{ required: true, message: "Please select a plan" }]}
        >
          <Select
            placeholder="Select Plan"
            loading={planLoading}
            onChange={handlePlanChange} // ✅ Use fixed handler
            style={{
              width: "100%",
              background: "#0d1117",
              borderColor: "#30363d",
              color: "#c9d1d9",
            }}
            dropdownStyle={{ background: "#161b22", color: "#c9d1d9" }}
          >
            {gymPlan?.map((plan) => (
              <Option key={plan._id} value={plan.planName}>
                {plan.planName} – ₹{plan.price} ({plan.durationInMonths} month)
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Start Date */}
        <Form.Item
          name="startDate"
          label={<span style={{ color: "#c9d1d9" }}>Start Date</span>}
          rules={[{ required: true, message: "Please select start date" }]}
        >
          <DatePicker
            value={startDateValue} // ✅ Controlled value
            style={{
              width: "100%",
              background: "#0d1117",
              borderColor: "#30363d",
              color: "#c9d1d9",
            }}
            getPopupContainer={(trigger) => trigger.parentNode}
            format="YYYY-MM-DD"
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
            onChange={handleStartDateChange}
            allowClear={true} // ✅ Allow clear option
            onClear={() => {
              setStartDateValue(null);
              form.setFieldsValue({ endDate: null });
            }}
          />
        </Form.Item>

        {/* End Date (auto calculated) */}
        <Form.Item
          name="endDate"
          label={<span style={{ color: "#c9d1d9" }}>End Date</span>}
        >
         <DatePicker
  disabled
  value={form.getFieldValue("endDate") ? moment(form.getFieldValue("endDate")) : null}
  format="YYYY-MM-DD"
  style={{ width: "100%", background: "#0d1117", borderColor: "#30363d" }}
/>
        </Form.Item>

        {/* Total Amount */}
        <Form.Item
          name="totalAmount"
          label={<span style={{ color: "#c9d1d9" }}>Total Amount (₹)</span>}
          rules={[{ required: true, message: "Please enter total amount" }]}
        >
          <Input
            type="number"
            onChange={(e) => {
              const total = Number(e.target.value);
              const paid = form.getFieldValue("paidAmount") || 0;
              form.setFieldsValue({
                pendingAmount: total - paid >= 0 ? total - paid : 0,
              });
            }}
            style={{
              background: "#0d1117",
              color: "#c9d1d9",
              borderColor: "#30363d",
            }}
          />
        </Form.Item>

        {/* Paid Amount */}
        <Form.Item
          name="paidAmount"
          label={<span style={{ color: "#c9d1d9" }}>Paid Amount (₹)</span>}
          rules={[{ required: true, message: "Please enter paid amount" }]}
        >
          <Input
            type="number"
            onChange={(e) => {
              const paid = Number(e.target.value);
              const total = form.getFieldValue("totalAmount") || 0;
              form.setFieldsValue({
                pendingAmount: total - paid >= 0 ? total - paid : 0,
              });
            }}
            style={{
              background: "#0d1117",
              color: "#c9d1d9",
              borderColor: "#30363d",
            }}
          />
        </Form.Item>

        {/* Pending Amount */}
        <Form.Item
          name="pendingAmount"
          label={<span style={{ color: "#c9d1d9" }}>Pending Amount (₹)</span>}
        >
          <Input
            type="number"
            readOnly
            style={{
              background: "#0d1117",
              color: "#c9d1d9",
              borderColor: "#30363d",
            }}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              background: "#1677ff",
              borderRadius: "6px",
              marginTop: "10px",
            }}
          >
            Renew Plan
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RenewModal;