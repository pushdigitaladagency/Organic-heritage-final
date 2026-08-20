import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSection: "landing",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedSection: (state, action) => {
      state.selectedSection = action.payload;
    },
  },
});

export const { setSelectedSection } = appSlice.actions;

export default appSlice.reducer;