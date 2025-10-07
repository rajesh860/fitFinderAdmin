import ProfileCard from "../../component/userDetailCom/profileCard";
import BodyStats from "../../component/userDetailCom/bodyStats";
import AttendanceSummary from "../../component/userDetailCom/attendanceSummary/attendance";
import GoalProgress from "../../component/userDetailCom/attendanceSummary/goalProgress";
import AttendanceCalendar from "../../component/userDetailCom/attendanceCalendar";
import ProgressHistory from "../../component/userDetailCom/progressHistoryTable";
import "./styles.scss";
import { useGetUserDetailQuery } from "../../service/user/allUser";
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

const UserDetail = () => {
  const { id } = useParams();

  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: getProgress, refetch } = useGetProgressQuery(id);
  const { data, isLoading, isError } = useGetUserDetailQuery(id);

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

  const membership_end = data?.user?.currentMembership?.membership_end;
  const membership_start = data?.user?.currentMembership?.membership_start;

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

  return (
    <div className="user-detail-container">
      <AddMemberProgress
        handleAddProgress={handleAddProgress}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

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

      <div className="top-col">
        <div className="profile-col">
          <ProfileCard userData={userData} />
        </div>

        <div className="current-progress">
          <h3>Current Progress</h3>
          <BodyStats progress={getProgress?.data?.current} />
          <AttendanceCalendar
            attendanceData={data?.user?.currentMembership?.attendance}
            membership_end={membership_end}
            membership_start={membership_start}
          />
        </div>

        <div className="attendance-summery">
          <AttendanceSummary
            attendanceData={data?.user?.currentMembership?.attendance || []}
          />
          <Insights
            attendanceData={data?.user?.currentMembership?.attendance || []}
          />
          <GoalProgress
            attendanceData={data?.user?.currentMembership?.attendance || []}
            monthlyTarget={30}
          />
        </div>
      </div>

      <div className="footer-table">
        <ProgressHistory progressData={getProgress?.data} />
      </div>
    </div>
  );
};

export default UserDetail;
