import { configureStore } from "@reduxjs/toolkit";

import { userRegister } from "./register/index";
import { allUser } from "./user/allUser";
import { login } from "./auth";
import { plans } from "./plans/indx";
import { gymList } from "./gyms";
import { getImagesUrl } from "./feedback";
import { trainer } from "./trainer";
import { adminDashboard } from "./admin";

export const store = configureStore({
  reducer: {
    [userRegister.reducerPath]: userRegister.reducer,
    [allUser.reducerPath]: allUser.reducer,
    [login.reducerPath]: login.reducer,
    [plans.reducerPath]: plans.reducer,
    [gymList.reducerPath]: gymList.reducer,
    [getImagesUrl.reducerPath]: getImagesUrl.reducer,
    [trainer.reducerPath]: trainer.reducer,
    [adminDashboard.reducerPath]: adminDashboard.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userRegister.middleware)
      .concat(allUser.middleware)
      .concat(login.middleware)
      .concat(plans.middleware)
      .concat(getImagesUrl.middleware)
      .concat(gymList.middleware)
      .concat(trainer.middleware)
      .concat(adminDashboard.middleware)
});