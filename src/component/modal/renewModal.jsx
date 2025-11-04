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
  // Auto select first plan when modal opens
  useEffect(() => {
    if (isRenewModalVisible && gymPlan?.length > 0) {
      const first = gymPlan[0];
      setSelectedPlan(first);
      form.setFieldsValue({
        planName: first.planName,
        totalAmount: first.price,
        durationInMonths: first.durationInMonths,
        paidAmount: 0,
        pendingAmount: first.price,
      });
    }
  }, [isRenewModalVisible, gymPlan]);

  // 🧠 When start date changes → auto calculate end date
  const handleStartDateChange = (date) => {
    if (!date || !selectedPlan?.durationInMonths) {
      form.setFieldsValue({ startDate: null, endDate: null });
      return;
    }

    const start = moment(date);
    const end = moment(start).add(selectedPlan.durationInMonths, "months");
    form.setFieldsValue({
      startDate: start,
      endDate: end,
    });
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
        setIsRenewModalVisible(false);
        form.resetFields();
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
      destroyOnHidden
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
      onCancel={() => setIsRenewModalVisible(false)}
      footer={null}
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
            <strong>Current Plan:</strong> {selectedFee.planName}
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
            onChange={(value) => {
              const selected = gymPlan.find((p) => p.planName === value);
              setSelectedPlan(selected);
              const paid = form.getFieldValue("paidAmount") || 0;
              form.setFieldsValue({
                totalAmount: selected?.price || "",
                durationInMonths: selected?.durationInMonths || "",
                pendingAmount:
                  selected?.price && paid
                    ? selected.price - Number(paid)
                    : selected?.price || "",
              });
            }}
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
          />
        </Form.Item>

        {/* End Date (auto calculated) */}
        <Form.Item
          name="endDate"
          label={<span style={{ color: "#c9d1d9" }}>End Date</span>}
        >
          <Input
            readOnly
            style={{
              background: "#0d1117",
              color: "#c9d1d9",
              borderColor: "#30363d",
            }}
            value={
              form.getFieldValue("endDate")
                ? moment(form.getFieldValue("endDate")).format("YYYY-MM-DD")
                : ""
            }
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
