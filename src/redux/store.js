import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import { grainsApi } from "./api/grainsApi";
import { cosmeticsApi } from "./api/cosmeticsApi";

export const store = configureStore({
  reducer: {
    app: appReducer,

    [grainsApi.reducerPath]: grainsApi.reducer,
    [cosmeticsApi.reducerPath]: cosmeticsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(grainsApi.middleware, cosmeticsApi.middleware),
});
