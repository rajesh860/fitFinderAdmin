import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../mainLayout/index";
import MemberRegistrationForm from "../component/form/newMember/index";
import AllUser from "../pages/user/allUser";
import UserDetail from "../pages/user/userDetail";
import LoginPage from "../pages/login/index";
import FeedbackPage from "../pages/feedBackForm";
import AllGymList from "../pages/allGyms/index";
import AllPendingGymList from "../pages/pendingGyms";
import CreatePlanForm from "../pages/createPlan/index";
import GymDetailPage from "../pages/gymDetail/index";
import ThankYouScreen from "../pages/thankyou";
import AllPlan from "../pages/allPlan";
import GymProfile from "../pages/gymProfile";
import NewEnquiry from "../pages/enquiry/index";
import CompletedEnquiry from "../pages/enquiry/completedEnquiry";
import BookingEnquiry from "../pages/enquiry/bookingEnquiry";
import Dashboard from "../pages/dashboard";
import CreatePlanName from "../pages/createPlanName";
import FeesCollection from "../pages/feesCollection";
import TrainerRegisterForm from "../pages/trainerRegister";
import TrainerList from "../pages/trainerList";
import TrainerDetail from "../pages/trainerList/trainerDetail";
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  // {
  //   path: "/feedback/:branchId",
  //   element: <FeedbackPage />,
  // },
  // {
  //   path: "/thankyou",
  //   element: <ThankYouScreen />,
  // },
  {
    path: "/",
    element: <MainLayout />,
    // loader: rootLoader,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/members/new",
        element: <MemberRegistrationForm />,
      },
      {
        path: "/enquiry/pending",
        element: <NewEnquiry />,
      },
      {
        path: "/enquiry/completed",
        element: <CompletedEnquiry />,
      },
      {
        path: "/enquiry/booking",
        element: <BookingEnquiry />, //
      },
      {
        path: "/users",
        element: <AllUser />,
      },
      {
        path: "/user-detail/:id",
        element: <UserDetail />,
      },
      {
        path: "/all-gyms",
        element: <AllGymList />,
      },
      {
        path: "/new-registration",
        element: <AllPendingGymList />,
      },
      {
        path: "/create-gym-plan",
        element: <CreatePlanForm />,
      },
      {
        path: "/user-attendence",
        element: <CreatePlanForm />,
      },
      {
        path: "/gym-detail/:id",
        element: <GymDetailPage />,
      },
      {
        path: "/all-plan",
        element: <AllPlan />,
      },

      {
        path: "/gym-profile",
        element: <GymProfile />,
      },
      {
        path: "/create-plan-name",
        element: <CreatePlanName />,
      },
      {
        path: "/fees-collection",
        element: <FeesCollection />,
      },
      {
        path: "/trainers/new",
        element: <TrainerRegisterForm />,
      },
      {
        path: "/trainers",
        element: <TrainerList />,
      },
      {
        path: "/trainer/:id",
        element: <TrainerDetail />,
      },
      // {
      //   path: "*",
      //   element: <GymProfile />,
      // },
    ],
  },
]);
