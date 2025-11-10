import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../mainLayout";
import LoginPage from "../pages/login";
import FeedbackPage from "../pages/feedBackForm";
import ThankYouScreen from "../pages/thankyou";

// ✅ Pages (Gym / Member)
import Dashboard from "../pages/dashboard";
import MemberRegistrationForm from "../component/form/newMember";
import NewEnquiry from "../pages/enquiry";
import CompletedEnquiry from "../pages/enquiry/completedEnquiry";
import BookingEnquiry from "../pages/enquiry/bookingEnquiry";
import AllUser from "../pages/user/allUser";
import UserDetail from "../pages/user/userDetail";
import CreatePlanForm from "../pages/createPlan";
import AllPlan from "../pages/allPlan";
import CreatePlanName from "../pages/createPlanName";
import FeesCollection from "../pages/feesCollection";
import GymProfile from "../pages/gymProfile";
import TrainerRegisterForm from "../pages/trainerRegister";
import TrainerList from "../pages/trainerList";
import TrainerDetail from "../pages/trainerList/trainerDetail";
import GymDetailPage from "../pages/gymDetail";
import AllGymList from "../pages/allGyms";
import AllPendingGymList from "../pages/pendingGyms";

// ✅ Admin Dashboard
import AdminDashboard from "../pages/dashboard/adminDashboard"; // your new dashboard component
import GymRegister from "../pages/gymRegister";

// ✅ Get user role
const userRole = localStorage.getItem("userRole");

// ===========================
// 🧩 ROUTE GROUPS
// ===========================

// --- Gym / Member Routes ---
const gymRoutes = [
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
    element: <BookingEnquiry />,
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
    path: "/create-gym-plan",
    element: <CreatePlanForm />,
  },
  {
    path: "/all-plan",
    element: <AllPlan />,
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
    path: "/gym-profile",
    element: <GymProfile />,
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
];

// --- Admin Routes ---
const adminRoutes = [
  {
    path: "/",
    element: <AdminDashboard />,
  },
  {
    path: "/gym-register",
    element: <GymRegister />,
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
    path: "/gym-detail/:id",
    element: <GymDetailPage />,
  },
  {
    path: "/users",
    element: <AllUser />,
  },
  {
    path: "/user-detail/:id",
    element: <UserDetail />,
  },
  // you can easily add more admin routes here
];

// ===========================
// 🌐 MAIN ROUTER CONFIG
// ===========================
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/feedback/:branchId",
    element: <FeedbackPage />,
  },
  {
    path: "/thankyou",
    element: <ThankYouScreen />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: userRole === "admin" ? adminRoutes : gymRoutes,
  },
]);
