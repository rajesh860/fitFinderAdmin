import React, { useEffect, useState } from "react";
import { Modal, Card, Select, DatePicker, Input, Form, Button } from "antd";
import { toast } from "react-toastify";
import { useRenewPlanMutation } from "../../service/gyms";
import dayjs from "dayjs";

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

  const [startDateValue, setStartDateValue] = useState(null);

  useEffect(() => {
    if (isRenewModalVisible && gymPlan?.length > 0) {
      const first = gymPlan[0];
      setSelectedPlan(first);
      setStartDateValue(null);
      form.setFieldsValue({
        planName: first.planName,
        totalAmount: first.price,
        durationInMonths: first.durationInMonths,
        paidAmount: 0,
        pendingAmount: first.price,
        startDate: null,
        endDate: null,
      });
    }
  }, [isRenewModalVisible, gymPlan]);

  const handleStartDateChange = (date, dateString) => {
    if (!date || !selectedPlan?.durationInMonths) {
      setStartDateValue(null);
      form.setFieldsValue({ startDate: null, endDate: null });
      return;
    }

    const start = dayjs(date);
    const end = dayjs(start).add(selectedPlan.durationInMonths, "months");

    setStartDateValue(date);
    form.setFieldsValue({
      startDate: date,
      endDate: end,
    });
  };

  const handlePlanChange = (value) => {
    const selected = gymPlan.find((p) => p.planName === value);
    setSelectedPlan(selected);
    setStartDateValue(null);

    const paid = form.getFieldValue("paidAmount") || 0;
    form.setFieldsValue({
      totalAmount: selected?.price || "",
      durationInMonths: selected?.durationInMonths || "",
      pendingAmount:
        selected?.price && paid ? selected.price - Number(paid) : selected?.price || "",
      startDate: null,
      endDate: null,
    });
  };

  const handleModalClose = () => {
    setStartDateValue(null);
    form.resetFields();
    setIsRenewModalVisible(false);
  };

  const handleRenewPlan = async (values) => {
    try {
      const plan = gymPlan.find((p) => p.planName === values.planName);
      if (!plan?._id) return toast.error("Invalid plan selection");

      const payload = {
        memberId: selectedFee?.memberId,
        planId: plan?.planId,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        totalAmount: Number(values.totalAmount),
        paidAmount: Number(values.paidAmount || 0),
        pendingAmount: Number(values.pendingAmount || 0),
      };
// console.log(payload,"jkl")
      const response = await trigg(payload).unwrap();

      if (response?.success) {
        toast.success("Plan renewed successfully!");
        handleModalClose();
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
      destroyOnClose
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
      onCancel={handleModalClose}
      footer={null}
      afterClose={() => {
        setStartDateValue(null);
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
            <strong>Current Plan:</strong>{" "}
            {selectedFee.status === "expired" ? (
              <span style={{ color: "red" }}>No Active Plan</span>
            ) : (
              selectedFee.planName
            )}
          </p>
          <p>
            <strong>Next Due Date:</strong> {selectedFee.nextDueDate}
          </p>
        </Card>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleRenewPlan}
        style={{ color: "#fff" }}
      >
        <Form.Item
          name="planName"
          label={<span style={{ color: "#c9d1d9" }}>Select New Plan</span>}
          rules={[{ required: true, message: "Please select a plan" }]}
        >
          <Select
            placeholder="Select Plan"
            loading={planLoading}
            onChange={handlePlanChange}
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

     <Form.Item
  name="startDate"
  label={<span style={{ color: "#c9d1d9" }}>Start Date</span>}
  rules={[{ required: true, message: "Please select start date" }]}
>
  <DatePicker
    value={startDateValue}
    style={{
      width: "100%",
      background: "#0d1117",
      borderColor: "#30363d",
      color: "#c9d1d9",
    }}
    getPopupContainer={(trigger) => trigger.parentNode}
    format="YYYY-MM-DD"
    // ✅ Remove disabledDate to allow all dates
    onChange={handleStartDateChange}
    allowClear={true}
    onClear={() => {
      setStartDateValue(null);
      form.setFieldsValue({ endDate: null });
    }}
  />
</Form.Item>


        <Form.Item
          name="endDate"
          label={<span style={{ color: "#c9d1d9" }}>End Date</span>}
        >
          <DatePicker
            disabled
            value={
              form.getFieldValue("endDate")
                ? dayjs(form.getFieldValue("endDate"))
                : null
            }
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
            min={0}
            onChange={(e) => {
              const total = Number(e.target.value);
              const paid = form.getFieldValue("paidAmount") || 0;

              // If paid exceeds total, adjust paid
              if (paid > total) {
                form.setFieldsValue({ paidAmount: total });
              }

              form.setFieldsValue({
                pendingAmount: total - form.getFieldValue("paidAmount"),
              });
            }}
            style={{
              background: "#0d1117",
              color: "#c9d1d9",
              borderColor: "#30363d",
            }}
          />
        </Form.Item>

        {/* Paid Amount with validation */}
        <Form.Item
          name="paidAmount"
          label={<span style={{ color: "#c9d1d9" }}>Paid Amount (₹)</span>}
          rules={[
            { required: true, message: "Please enter paid amount" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const total = getFieldValue("totalAmount") || 0;
                if (value <= total) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Paid amount cannot exceed Total Amount")
                );
              },
            }),
          ]}
        >
          <Input
            type="number"
            min={0}
            onChange={(e) => {
              let paid = Number(e.target.value);
              const total = form.getFieldValue("totalAmount") || 0;

              if (paid > total) {
                paid = total; // Cap paid amount
              }

              form.setFieldsValue({
                paidAmount: paid,
                pendingAmount: total - paid,
              });
            }}
            style={{
              background: "#0d1117",
              color: "#c9d1d9",
              borderColor: "#30363d",
            }}
          />
        </Form.Item>

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
