import { createSlice } from "@reduxjs/toolkit";

export const utilsSlice = createSlice({
  name: "utlis",
  initialState: {
    componentKey: "",
    shouldcomponentRemount: false,
  },
  reducers: {
    setComponentKey: (state, action) => {
      state.componentKey = action.payload;
    },

    setShouldComponentRemount: (state, action) => {
      state.shouldcomponentRemount = action.payload;
    },
  },
});

export const { setComponentKey, setShouldComponentRemount } =
  utilsSlice.actions;

export default utilsSlice.reducer;
