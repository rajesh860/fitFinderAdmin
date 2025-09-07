import {
  createBrowserRouter,
} from "react-router-dom";
import MainLayout from "../mainLayout/index"
import MemberRegistrationForm from "../component/form/newMember/index"
import AllUser from "../pages/user/allUser";
import UserDetail from "../pages/user/userDetail";
import LoginPage from "../pages/login/index";
import FeedbackPage from "../pages/feedBackForm";
import AllGymList from "../pages/allGyms/index"
import AllPendingGymList from "../pages/pendingGyms";
import CreatePlanForm from "../pages/createPlan/index";
import GymDetailPage from "../pages/gymDetail/index";
import ThankYouScreen from "../pages/thankyou";
import AllPlan from "../pages/allPlan";
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
    // loader: rootLoader,
    children: [
     
      {
        path: "/members/new",
        element: <MemberRegistrationForm />,
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
     
     
    ],
  },
]);