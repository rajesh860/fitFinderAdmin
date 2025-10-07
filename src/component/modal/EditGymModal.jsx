import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, Button, Typography, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useUpdarteGymProfileMutation } from "../../service/gyms";
import imageCompression from "browser-image-compression";

const { Text } = Typography;

export default function EditGymModal({ open, onClose, data }) {
  const [trigger, { data: gymProfileUpdateResponse, isLoading }] =
    useUpdarteGymProfileMutation();
  const [form] = Form.useForm();

  const [ownerFileList, setOwnerFileList] = useState([]);
  const [coverFileList, setCoverFileList] = useState([]);
  const [galleryFileList, setGalleryFileList] = useState([]);
  const [locationState, setLocationState] = useState({ lat: "", lng: "", address: "" });
  const [changedFields, setChangedFields] = useState({});

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        gymName: data.gymName,
        owner_name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.address,
        aboutGym: data.aboutGym,
        contact: data.phone,
      });

      setLocationState({
        lat: data.location?.coordinates?.[1] || "",
        lng: data.location?.coordinates?.[0] || "",
        address: data.address || "",
      });

      // Owner Image
      if (data.owner_image) {
        setOwnerFileList([
          { uid: "-2", name: "owner.png", status: "done", url: data.owner_image },
        ]);
      } else setOwnerFileList([]);

      // Cover Image
      if (data.coverImage) {
        setCoverFileList([
          { uid: "-3", name: "cover.png", status: "done", url: data.coverImage },
        ]);
      } else setCoverFileList([]);

      // Gallery Images
      if (data.images?.length) {
        setGalleryFileList(
          data.images.map((url, index) => ({
            uid: String(index),
            name: `image-${index + 1}.png`,
            status: "done",
            url,
          }))
        );
      } else setGalleryFileList([]);

      setChangedFields({});
    }
  }, [data, form]);

  // Location detection
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let detectedAddress = "";

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const geoData = await res.json();
          detectedAddress = geoData.display_name || "";
        } catch (error) {
          console.error(error);
        }

        setLocationState({ lat, lng, address: detectedAddress });
        setChangedFields((prev) => ({
          ...prev,
          location: { type: "Point", coordinates: [lng, lat] },
        }));
        toast.success(
          detectedAddress
            ? `📍 Location updated! ${detectedAddress}`
            : "📍 Location updated successfully!"
        );
      },
      (err) => toast.error("Error fetching location: " + err.message)
    );
  };

  // Track form field changes
  const handleFieldChange = (changedValues) => {
    setChangedFields((prev) => ({ ...prev, ...changedValues }));
  };

  // Compress image and preserve format
  const compressAndSetFile = async (files, key) => {
    if (!files || files.length === 0) {
      setChangedFields((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      return;
    }

    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        if (file.originFileObj) {
          const originalFile = file.originFileObj;
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            initialQuality: 0.8,
          };
          const compressedBlob = await imageCompression(originalFile, options);

          // Preserve format & name
          const preservedFile = new File([compressedBlob], originalFile.name, {
            type: originalFile.type,
          });

          return preservedFile;
        }
        return file.url || file;
      })
    );

    setChangedFields((prev) => ({
      ...prev,
      [key]: compressedFiles,
    }));
  };

  // File change handlers
  const handleOwnerImageChange = ({ fileList }) => {
    setOwnerFileList(fileList);
    compressAndSetFile(fileList, "owner_image");
  };

  const handleCoverImageChange = ({ fileList }) => {
    setCoverFileList(fileList);
    compressAndSetFile(fileList, "coverImage");
  };

  const handleGalleryChange = ({ fileList }) => {
    setGalleryFileList(fileList);
    compressAndSetFile(fileList, "images");
  };

  // Submit
  const handleOk = async () => {
    try {
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected");
        onClose();
        return;
      }

      const formData = new FormData();
      for (const key in changedFields) {
        const value = changedFields[key];
        if (key === "location" && value?.coordinates?.length === 2) {
          formData.append("latitude", value.coordinates[1]);
          formData.append("longitude", value.coordinates[0]);
        } else if (Array.isArray(value)) {
          value.forEach((file) => formData.append(key, file));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
        }
      }

      await trigger({ id: data._id, data: formData });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update gym profile");
    }
  };

  useEffect(() => {
    if (gymProfileUpdateResponse?.success) {
      toast.success(gymProfileUpdateResponse.message);
      onClose();
      setChangedFields({});
    } else if (gymProfileUpdateResponse?.message) {
      toast.error(gymProfileUpdateResponse.message);
    }
  }, [gymProfileUpdateResponse]);

  return (
    <Modal
      title="Edit Gym Profile"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      width={"80%"}
      confirmLoading={isLoading}
    >
      <Form layout="vertical" form={form} onValuesChange={handleFieldChange}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Gym Name" name="gymName"><Input /></Form.Item>
            <Form.Item label="Owner Name" name="owner_name"><Input /></Form.Item>
            <Form.Item label="Contact" name="contact"><Input /></Form.Item>
            <Form.Item label="Email" name="email"><Input /></Form.Item>
            <Form.Item label="Address" name="address"><Input /></Form.Item>
            <Form.Item label="Monthly Fess" name="fees_monthly"><Input /></Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="About Gym" name="aboutGym"><Input.TextArea rows={3} /></Form.Item>
            <Button onClick={detectLocation} style={{ marginBottom: 16 }}>Change Location</Button>
            {locationState.lat && locationState.lng ? (
              <iframe
                title="Selected Location"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: 8, marginBottom: 8 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${locationState.lat},${locationState.lng}&z=15&output=embed`}
              />
            ) : (
              <div
                style={{
                  borderRadius: 8,
                  height: 200,
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                No location selected
              </div>
            )}
            <Text type="secondary" style={{ fontSize: 12 }}>
              {locationState?.address || "No address available"}
            </Text>
          </Col>
        </Row>

        {/* Cover Image */}
        <Form.Item label="Cover Image">
          <Upload
            listType="picture-card"
            fileList={coverFileList}
            maxCount={1}
            beforeUpload={() => false}
            onChange={handleCoverImageChange}
            showUploadList={{ showRemoveIcon: true }}
          >
            {coverFileList.length === 0 && <UploadOutlined />}
          </Upload>
        </Form.Item>

        {/* Gallery Images */}
        <Form.Item label="Gallery Images">
          <Upload
            listType="picture-card"
            fileList={galleryFileList}
            multiple
            beforeUpload={() => false}
            onChange={handleGalleryChange}
            showUploadList={{ showRemoveIcon: true }}
          >
            <UploadOutlined /> Upload
          </Upload>
        </Form.Item>

        {/* Owner Image */}
        <Form.Item label="Owner Image">
          <Upload
            listType="picture-card"
            fileList={ownerFileList}
            maxCount={1}
            beforeUpload={() => false}
            onChange={handleOwnerImageChange}
            showUploadList={{ showRemoveIcon: true }}
          >
            {ownerFileList.length === 0 && <UploadOutlined />}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
