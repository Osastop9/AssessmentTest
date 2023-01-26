import { configureStore } from "@reduxjs/toolkit";
import valuablesReducer from "./valuables.slice";

const store = configureStore({
  reducer: {
    valuables: valuablesReducer
  }
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

