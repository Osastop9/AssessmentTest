import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { firebase_db } from "../../firebase";
import { Valuable } from "../interfaces/valuables.interfaces";

export const getValuablesThunk = createAsyncThunk(
  "valuables/list",
  async (_, { dispatch }) => {
    const valuables: Valuable[] = [];
    let total = 0;
    const querySnapshot = await getDocs(collection(firebase_db, "valuables"));

    querySnapshot.forEach((doc) => {
      let data = doc.data();

      let valuable: Valuable = {
        id: doc.id,
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
        photo: data.photo,
      };

      total += parseInt(data.price);
      valuables.push(valuable);
    });

    dispatch(init({ list: valuables, total }));
  }
);

export interface State {
  data: {
    list: Valuable[];
    total: number;
  };
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  data: {
    list: [],
    total: 0,
  },
  loading: "idle",
} as State;

const valuablesSlice = createSlice({
  name: "valuables",
  initialState,
  reducers: {
    init(state, action) {
      state.data.list = action.payload.list;
      state.data.total = action.payload.total;
    },
    addValuable(state, action) {
      state.data.list.push(action.payload);
      state.data.total += parseInt(action.payload.price);
    },
  },
  extraReducers(builder) {
    builder.addCase(getValuablesThunk.pending, (state, action) => {
      state.loading = "pending";
    });

    builder.addCase(getValuablesThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });

    builder.addCase(getValuablesThunk.rejected, (state, action) => {
      state.loading = "failed";
    });
  },
});

export const { init, addValuable } = valuablesSlice.actions;

export default valuablesSlice.reducer;
