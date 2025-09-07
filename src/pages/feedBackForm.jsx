import React, { useEffect, useState } from "react";
import "./css/bootstrap.min.css";
import "./css/style.css"; // aapke css ke path ke hisaab se
import "./css/responsive.css";
import GoodSmileIcon from "./svg/goodSmile";
import NeutralSmileIcon from "./svg/neutralIcon";
import BadSmileIcon from "./svg/badSmile";
import {useAddFeedbackMutation, useGetImagesUrlMutation, useImageDeleteMutation} from "../service/feedback/index"
import { message } from "antd";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../src/assets/whiteLogo.png"
import { FaUpload } from "react-icons/fa";
const FeedbackPage = () => {
  // const {branchId} = useParams()
  const branchId = 1
  const nav = useNavigate()
   const [images, setImages] = useState([]);
const [responseImages, setResponseImages] = useState([]);
  const [trig,{data:formResponse}] = useAddFeedbackMutation()
  const [formData, setFormData] = useState({
    gymHygiene: "",
    staffBehaivior: "",
   
    // staff: "",
    // other_detail: "",
    images: responseImages,
    customerName: "",
    mobileNumber: "",
    email: "",
    branchId:branchId,

    department: "", // new select input
    messageText: "", // new textarea
  });

  const [filePreview, setFilePreview] = useState(null); 

  const handleChange = (e) => {
    const { name, value, type ,files} = e.target;
    const file = files && files[0];
    if (file) {
      setFormData({
        ...formData,
        [name]: file,
      });
      setFilePreview(URL.createObjectURL(file)); // 👈 preview set
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = (e) => {
  e.preventDefault();

  // final data create karo
  const finalData = {
    ...formData,
    images: responseImages, // ✅ images field me responseImages daal do
  };

  // validation (agar chahiye to)
  const errors = [];
  if (!finalData.customerName) errors.push("Name is required");
  if (!finalData.mobileNumber) errors.push("Mobile number is required");

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  console.log("🚀 Final Form Data to submit:", finalData);

  // API call
  trig(finalData);
};

  const emojiOptions = [
    { val: 1, icon: <GoodSmileIcon />, colorClass: "good" },
    { val: 2, icon: <NeutralSmileIcon />, colorClass: "neutral" },
    { val: 3, icon: <BadSmileIcon />, colorClass: "bad" },
  ];


// mutation hooks
const [trigger, { data: imagesUrlData }] = useGetImagesUrlMutation();
const [trigge, { data: deletedImagesResponse }] = useImageDeleteMutation();

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  const newImages = files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
  }));

  setImages((prev) => [...prev, ...newImages]);

  // 🚀 sirf yaha upload API call hogi
  if (files.length) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    trigger(formData);
  }
};

const handleRemoveImage = (index) => {
  setImages((prev) => {
    const updated = [...prev];
    URL.revokeObjectURL(updated[index].preview); // memory cleanup
    updated.splice(index, 1);
    return updated;
  });

  setResponseImages((prev) => {
    const updated = [...prev];
    const [removed] = updated.splice(index, 1);

    // 🚀 delete API sirf yaha chalegi
    if (removed) {
      trigge(removed); // backend ko URL ya ID bhejna hoga
    }

    return updated;
  });
};

// response handling
useEffect(() => {
  if (imagesUrlData?.images?.length) {
    setResponseImages((prev) => [...prev, ...imagesUrlData.images]);
  }
}, [imagesUrlData]);


console.log(formResponse, "imagesUrlData");
useEffect(()=>{
if(formResponse?.success){
  message.success(formResponse?.message)
  nav("/thankyou")
}
},[formResponse])

  return (
    <div>
      {/* Header */}
      <header>
        <div className="container-fluid">
          <div className="row">
            {/* Left nav */}
            <div className="col-2 col-sm-2 col-md-6 col-xl-5 tab-order1">
              <nav className="navbar navbar-expand-lg main-menu">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <img
                    src="images/menu-bar.svg"
                    className="navbar-toggler-icon"
                    alt="menu"
                  />
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a href="https://fitclub.in/career" className="nav-link">
                        Careers
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="https://fitclub.in/franchise"
                        className="nav-link"
                      >
                        Franchise
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>

            {/* Logo */}
            <div className="col-5 col-sm-5 col-md-12 col-xl-2 text-center tab-order2">
              <a href="https://fitclub.in/">
                <img src={logo} width="170" alt="Fitclub Logo" />
              </a>
            </div>

            {/* Right nav */}
            <div className="col-5 col-sm-5 col-md-6 col-xl-5 tab-order3">
              <ul className="top-contact navigation">
                <li className="mob-hide ">
                  <a href="https://fitclub.in/contact">Contact Us</a>
                </li>
                <li>
                  <a href="#" data-bs-toggle="modal" data-bs-target="#myModal">
                    join now [+]
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Feedback heading */}
      <section className="career">
        <div className="container">
          <div className="row">
            <div className="col text-center">
  <h1 className="career-title">Feedback</h1>
              
            </div>
          </div>
        </div>
      </section>

      {/* Feedback form */}
      <form onSubmit={handleSubmit} id="feedback-form">
        <section className="satisfaction-review">
          <div className="container">
            <div className="row">
              {/* Cleanliness */}
             <div className="col-lg-6">
  <div className="vill-experince mb-4 mb-lg-0">
    <h2 className="love-hve">
      How satisfied are you with the cleanliness and hygiene in the gym?
    </h2>
    <div className="feedback">
      {emojiOptions.map((item, idx) => (
        <label key={idx}  className={`emoji ${Number(formData.gymHygiene) === item.val ? "selected" : ""}`}>
          <input
            type="radio"
            name="gymHygiene"
            value={item.val}
            checked={Number(formData.gymHygiene) === item.val}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <span className="emoji-icon">{item.icon}</span>
        </label>
      ))}
    </div>
  </div>
</div>

              {/* Staff */}
            <div className="col-lg-6">
  <div className="vill-experince mb-4 mb-lg-0">
    <h2 className="love-hve">
      How satisfied are you with the Staff Behavior & Support in the gym?
    </h2>
    <div className="feedback">
      {emojiOptions.map((item, idx) => (
        <label key={idx} className={`emoji ${Number(formData.staffBehaivior) === item.val ? "selected" : ""}`}>
          <input
            type="radio"
            name="staffBehaivior"
            value={item.val}
            checked={Number(formData.staffBehaivior) === item.val}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <span className="emoji-icon">{item.icon}</span>
        </label>
      ))}
    </div>
  </div>
</div>
            </div>

         

            {/* Comments & Details */}
           <div className="row mt-gp">
  <div className="col-lg-8 offset-lg-2">
    <h3 className="next-vision text-center">
      How can we make your next visit even more fabulous?
    </h3>

    {/* Department + Additional Comment */}
    <div className="row mt-4">
      <div className="col-12">
        <select
          name="department"
          className="career-field-2 form-select"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          <option value="Billing">Billing</option>
          <option value="House keeping">House keeping</option>
          <option value="Workout station">Workout station</option>
          <option value="Sales team">Sales team</option>
          <option value="Training team">Training team</option>
          <option value="Cafe">Cafe</option>
          <option value="Other">Other</option>
        </select>

        <label className="form-label mt-3 next-vision" style={{marginBottom:"15px"}}>Additional Comment</label>
        <textarea
          name="messageText"
          className="franchise-txtarea w-100"
          placeholder="Write your comment..."
          value={formData.additional_comment}
          onChange={handleChange}
        />
      </div>

<div>
      {/* Image Previews */}
      <div className="d-flex flex-wrap gap-2 mb-3 mt-2">
        {images.map((img, index) => (
          <div
            key={index}
            className="position-relative"
            style={{
              width: "150px",
              height: "150px",
              overflow: "hidden",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <img
              src={img.preview}
              alt={`Preview ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "rgba(0,0,0,0.6)",
                border: "none",
                borderRadius: "50%",
                color: "#fff",
                width: "25px",
                height: "25px",
                cursor: "pointer",
                lineHeight: "22px",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <label className="btn" style={{background:"#ff3c00",color:"white"}}>
         <FaUpload/>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </label>
    </div>

    </div>

    {/* Feedback Form */}
    <div className="feedback-form row mt-4">
      {/* Left side */}
      {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
        <input
          type="text"
          name="staff"
          className="career-field"
          placeholder="Staff & Service"
          value={formData.staff}
          onChange={handleChange}
          required
        />
        <textarea
          name="other_detail"
          className="franchise-txtarea form-mt"
          style={{color:"white"}}
          placeholder="Additional Comments"
          value={formData.other_detail}
          onChange={handleChange}
        />
   
      </div> */}

      {/* Right side */}
     <div className="col-lg-12 col-md-6 col-12 mb-3">
  {/* Row 1: Full Name + Mobile */}
  <div className="row">
    <div className="col-12 col-sm-6 mb-3">
      <input
        type="text"
         name="customerName"
        className="career-field"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-12 col-sm-6 mb-3">
      <input
        type="text"
        name="mobileNumber"
        className="career-field"
        placeholder="Mobile No"
        value={formData.mobile}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  {/* Row 2: Email (full width) */}
   <div className="row">
    <div className="col-12 col-sm-6 mb-2">
      <input
        type="text"
      name="email"
        className="career-field"
        placeholder="Email"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-12 col-sm-6 mb-2 sumit-btn">
      <button
        type="submit"
        className="send_btn btn btn-black w-100"
      >
        Submit
      </button>
    </div>
  </div>
 
</div>

    </div>
  </div>
</div>

          </div>
        </section>
      </form>
    </div>
  );
};

export default FeedbackPage;
