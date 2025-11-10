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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  useEffect(() => {
    if (data?.success) {
      setUserData({
        name: data?.user?.name,
        email: data?.user?.email,
        phone: data?.user?.phone,
        photo: data?.user?.photo,
        dob: data?.user?.dob,
        planName: data?.user?.currentMembership?.planName,
        address: data?.user?.address,
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

  // ✅ Export Progress to Excel Function
  const exportProgressToExcel = () => {
    const mergerHistory = [getProgress?.data?.current,...getProgress?.data?.history]
    if (!mergerHistory.length) {
      toast.warning("No progress data available to export");
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = getProgress.data.history.map((progress, index) => ({
        "S.No": index + 1,
        "Date": progress.createdAt ? new Date(progress.createdAt).toLocaleDateString('en-IN') : 'N/A',
        "Weight (kg)": progress.weight || 'N/A',
        "Height (cm)": progress.height || 'N/A',
        "Arm (cm)": progress.arm || 'N/A',
        "Waist (cm)": progress.waist || 'N/A',
        "Thigh (cm)": progress.thigh || 'N/A',
        "Chest (cm)": progress.chest || 'N/A',
        "Blood Group": progress.bloodGroup || 'N/A',
      }));

      // Add current progress as first row if available
      if (getProgress.data.current) {
        const currentProgress = getProgress.data.current;
        excelData.unshift({
          "S.No": "Current",
          "Date": "Latest",
          "Weight (kg)": currentProgress.weight || 'N/A',
          "Height (cm)": currentProgress.height || 'N/A',
          "Arm (cm)": currentProgress.arm || 'N/A',
          "Waist (cm)": currentProgress.waist || 'N/A',
          "Thigh (cm)": currentProgress.thigh || 'N/A',
          "Chest (cm)": currentProgress.chest || 'N/A',
          "Blood Group": currentProgress.bloodGroup || 'N/A',
        });
      }

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Progress History");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Download file
      const fileName = `${userData.name || 'Member'}_Progress_History_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(data, fileName);

      toast.success("Progress data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export progress data");
    }
  };

  // ✅ Export Attendance to Excel Function (Optional)
  const exportAttendanceToExcel = () => {
    if (!attendanceArray.length) {
      toast.warning("No attendance data available to export");
      return;
    }

    try {
      const excelData = attendanceArray.map((attendance, index) => ({
        "S.No": index + 1,
        "Date": attendance.date ? new Date(attendance.date).toLocaleDateString('en-IN') : 'N/A',
        "Check-In": attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString('en-IN') : 'N/A',
        "Check-Out": attendance.checkOut ? new Date(attendance.checkOut).toLocaleTimeString('en-IN') : 'N/A',
        "Duration": attendance.duration || 'N/A',
        "Status": attendance.status || 'N/A',
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const fileName = `${userData.name || 'Member'}_Attendance_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(data, fileName);

      toast.success("Attendance data exported successfully!");
    } catch (error) {
      console.error("Error exporting attendance to Excel:", error);
      toast.error("Failed to export attendance data");
    }
  };

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
          <Button type="default" className="export-btn" onClick={exportProgressToExcel}>
            Export Progress Excel
          </Button>
          {/* Optional: Add attendance export button */}
          <Button type="default" className="export-btn" onClick={exportAttendanceToExcel}>
            Export Attendance Excel
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