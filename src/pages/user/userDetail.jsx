import ProfileCard from "../../component/userDetailCom/profileCard";
import BodyStats from "../../component/userDetailCom/bodyStats";
import AttendanceSummary from "../../component/userDetailCom/attendanceSummary/attendance";
import GoalProgress from "../../component/userDetailCom/attendanceSummary/goalProgress";
import AttendanceCalendar from "../../component/userDetailCom/attendanceCalendar";
import ProgressHistory from "../../component/userDetailCom/progressHistoryTable";
import "./styles.scss";
import {
  useGetUserPlanHistoryQuery,
  useGetUserDetailQuery,
  useGetMemberAttendanceQuery,
} from "../../service/user/allUser";
import {
  useAddProgressMutation,
  useGetProgressQuery,
} from "../../service/gyms";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Insights from "../../component/userDetailCom/attendanceSummary/insight";
import AddMemberProgress from "../../component/modal/addMemberProgress";
import { Button } from "antd";
import { toast } from "react-toastify";
import { skipToken } from "@reduxjs/toolkit/query";

const UserDetail = () => {
  const { id } = useParams(); // memberId

  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembershipId, setSelectedMembershipId] = useState(null);

  const { data, isLoading, isError } = useGetUserDetailQuery(id);
  const { data: getProgress, refetch } = useGetProgressQuery(id);

  const gymId = data?.user?.currentMembership?.gymId;

  // ✅ Get Plan History
  const { data: planHistory, isLoading: planLoading } = useGetUserPlanHistoryQuery(
    gymId && id ? { gymId, memberId: id } : skipToken
  );

  // ✅ Default plan set
  useEffect(() => {
    if (planHistory?.data?.length > 0 && !selectedMembershipId) {
      setSelectedMembershipId(planHistory.data[0]._id);
    }
  }, [planHistory, selectedMembershipId]);

  // ✅ Attendance fetch based on plan
  const { data: getMemberAttendance } = useGetMemberAttendanceQuery(
    selectedMembershipId && id
      ? { membershipId: selectedMembershipId, memberId: id }
      : skipToken
  );

  const attendanceArray = getMemberAttendance?.data?.attendance || [];
// const uniqueAttendance = [];
// const seenDates = new Set();

// attendanceArray.forEach((item) => {
//   const formattedDate = dayjs(item.date).format("YYYY-MM-DD"); // normalize date
//   if (!seenDates.has(formattedDate)) {
//     seenDates.add(formattedDate);
//     uniqueAttendance.push(item);
//   }
// });
  useEffect(() => {
    if (data?.success) {
      setUserData({
        name: data?.user?.name,
        email: data?.user?.email,
        phone: data?.user?.phone,
        photo: data?.user?.photo,
        dob: data?.user?.dob,
        planName: data?.user?.currentMembership?.planName,
        address: data?.user?.currentMembership?.address,
        planPrice: data?.user?.currentMembership?.planPrice,
        membership_status: data?.user?.currentMembership?.membership_status,
        membership_end: data?.user?.currentMembership?.membership_end,
      });
    }
  }, [data]);

  const showModal = () => setIsModalOpen(true);

  const [trigger, { data: apiResponse }] = useAddProgressMutation();

  const handleAddProgress = (values) => {
    const newProgress = {
      data: {
        weight: values.weight,
        height: values.height,
        arm: values.arm,
        waist: values.waist,
        thigh: values.thigh,
        chest: values.chest,
        bloodGroup: values.bloodGroup,
      },
      memberId: id,
    };
    trigger(newProgress);
  };

  useEffect(() => {
    if (apiResponse?.success) {
      toast.success(apiResponse?.message);
      refetch();
    }
  }, [apiResponse, refetch]);
console.log(attendanceArray,"attendanceArray")
  return (
    <div className="user-detail-container">
      {/* ➕ Add Progress Modal */}
      <AddMemberProgress
        handleAddProgress={handleAddProgress}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      {/* ✅ Header */}
      <div className="header-row">
        <div className="title">
          <h2>Gym Member Dashboard</h2>
          <span>Track member progress and attendance</span>
        </div>

        <div className="header-actions">
          <Button type="primary" onClick={showModal}>
            + Add Progress
          </Button>
          <Button type="default" className="export-btn">
            Export Excel
          </Button>
        </div>
      </div>

      {/* ✅ Top Section */}
      <div className="top-col">
        {/* Profile Info */}
        <div className="profile-col">
          <ProfileCard userData={userData} />
        </div>

        {/* Current Progress + Attendance */}
        <div className="current-progress">
          <h3>Current Progress</h3>
          <BodyStats progress={getProgress?.data?.current} />

          {/* ✅ Attendance Calendar with Dropdown Inside */}
          <AttendanceCalendar
            attendanceData={attendanceArray}
            membership_end={
              planHistory?.data?.find((p) => p._id === selectedMembershipId)
                ?.membership_end
            }
            membership_start={
              planHistory?.data?.find((p) => p._id === selectedMembershipId)
                ?.membership_start
            }
            planHistory={planHistory}
            selectedMembershipId={selectedMembershipId}
            setSelectedMembershipId={setSelectedMembershipId}
            planLoading={planLoading}
          />
        </div>

        {/* Attendance Summary */}
        <div className="attendance-summery">
          <AttendanceSummary attendanceData={attendanceArray} />
          <Insights attendanceData={attendanceArray} />
          <GoalProgress attendanceData={attendanceArray} monthlyTarget={30} />
        </div>
      </div>

      {/* ✅ Footer */}
      <div className="footer-table">
        <ProgressHistory progressData={getProgress?.data} />
      </div>
    </div>
  );
};

export default UserDetail;
