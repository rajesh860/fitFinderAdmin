import { Avatar, Button, Card, Tag } from 'antd';
import React from 'react'
import { toast } from 'react-toastify';
import { UserOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';

const OwnerImage = ({ownerImgSrc,uploading,setUploading,uploadGalleryImage,owner_name,gymCertificates,gymId}) => {
  return (
    <Card
  title={
    <>
      <UserOutlined /> Owner
    </>
  }
  className="card owner-card"
>
  <div className="owner-details" style={{ position: "relative", }}>
    {/* Avatar */}
    <Avatar size={80} src={ownerImgSrc} className="owner-avatar" />

    {/* Edit Icon Button on top-right */}
    <Button
      type="primary"
      shape="circle"
      size="small"
      icon={uploading ? <LoadingOutlined /> : <EditOutlined />}
      onClick={() => document.getElementById("ownerImageInput").click()}
      disabled={uploading}
      style={{
        position: "absolute",
        top: -5,
        right: -5,
        zIndex: 10,
        padding: 0,
        borderRadius: "50%",
      }}
    />

    {/* Hidden file input */}
    <input
      type="file"
      accept="image/*"
      id="ownerImageInput"
      style={{ display: "none" }}
      onChange={async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          setUploading(true);
          const formData = new FormData();
          formData.append("owner_image", file);

          const res = await uploadGalleryImage({ id: gymId, data: formData }).unwrap();

          if (res?.success) {
            toast.success("Owner image updated successfully!");
            // refetch();
          } else {
            toast.error(res?.message || "Failed to update image");
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to update image");
        } finally {
          setUploading(false);
          e.target.value = ""; // reset input
        }
      }}
    />

    {/* Owner name & certificates */}
    <h3 className="owner-name">{owner_name || name}</h3>
    {gymCertificates?.length > 0 ? (
      gymCertificates.map((cert, i) => (
        <Tag key={i} color="magenta" className="owner-tag">
          {cert}
        </Tag>
      ))
    ) : (
      <Tag color="red" className="owner-tag">
        No Certificate
      </Tag>
    )}
  </div>
</Card>

  )
}

export default OwnerImage