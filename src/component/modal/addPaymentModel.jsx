import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAddPendingPaymentMutation } from "../../service/gyms";
import { Card, Input, Modal, Select } from "antd";

const { Option } = Select;

const AddPaymentModel = ({ selectedFee, setIsModalVisible, isModalVisible }) => {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    mode: "cash",
    remark: "",
  });

  const [trigger, { isLoading: isAddingPayment }] = useAddPendingPaymentMutation();

  const handleAddPayment = async () => {
    if (
      !paymentData.amount ||
      isNaN(paymentData.amount) ||
      Number(paymentData.amount) <= 0
    ) {
      return toast.error("Please enter a valid amount");
    }

    try {
      await trigger({
        feeCollectionId: selectedFee.key,
        amount: Number(paymentData.amount),
        mode: paymentData.mode,
        remark: paymentData.remark,
      }).unwrap();

      toast.success("Payment added successfully");
      setIsModalVisible(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to add payment");
    }
  };

  return (
    <Modal
      className="edit-plan-modal"
      open={isModalVisible}
      destroyOnClose
      centered
      width={480}
      title={
        <span
          style={{
            color: "#fff",
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          💰 Add Payment for {selectedFee?.memberName || ""}
        </span>
      }
      onCancel={() => setIsModalVisible(false)}
      onOk={handleAddPayment}
      okText="Submit"
      confirmLoading={isAddingPayment}
      bodyStyle={{
        background: "#0f0f0f",
        color: "#fff",
        borderRadius: 12,
        padding: 20,
      }}
      style={{
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {selectedFee && (
        <Card
          bordered={false}
          style={{
            marginBottom: 20,
            background: "#1a1a1a",
            color: "#fff",
            borderRadius: 12,
            boxShadow: "0 0 10px rgba(255,255,255,0.05)",
          }}
        >
          <p style={{ marginBottom: 6 }}>
            <strong>Plan Name:</strong>  {selectedFee.planName !== "-"?selectedFee.planName : "No Plan"}
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong>Total Amount:</strong> ₹{selectedFee.feeAmount.toLocaleString()}
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong>Paid Amount:</strong> ₹{selectedFee.paidAmount.toLocaleString()}
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong>Pending Amount:</strong>{" "}
            <span style={{ color: selectedFee.dueAmount > 0 ? "#faad14" : "#52c41a" }}>
              ₹{selectedFee.dueAmount.toLocaleString()}
            </span>
          </p>
        </Card>
      )}

      {/* Amount Input */}
      <Input
        placeholder="Enter Amount"
        type="number"
        value={paymentData.amount}
        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
        style={{
          background: "#1f1f1f",
          color: "#fff",
          borderColor: "#333",
          borderRadius: 8,
          marginBottom: 12,
          padding: "10px 12px",
        }}
      />

      {/* Mode Select */}
      <Select
        value={paymentData.mode}
        onChange={(value) => setPaymentData({ ...paymentData, mode: value })}
        style={{
          width: "100%",
          marginBottom: 12,
          background: "#1f1f1f",
          color: "#fff",
          borderRadius: 8,
        }}
        dropdownStyle={{
          background: "#121212",
          color: "#fff",
        }}
      >
        <Option value="cash">💵 Cash</Option>
        <Option value="upi">📱 UPI</Option>
        <Option value="card">💳 Card</Option>
        <Option value="bank">🏦 Bank</Option>
      </Select>

      {/* Remark TextArea */}
      <Input.TextArea
        placeholder="Add a remark (optional)"
        value={paymentData.remark}
        onChange={(e) => setPaymentData({ ...paymentData, remark: e.target.value })}
        style={{
          background: "#1f1f1f",
          color: "#fff",
          borderColor: "#333",
          borderRadius: 8,
          padding: "10px 12px",
        }}
        rows={3}
      />
    </Modal>
  );
};

export default AddPaymentModel;
