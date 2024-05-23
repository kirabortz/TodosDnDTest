import { AppDispatch, RootReducerType } from "../../store/store";
import { BasicResponseType } from "../types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootReducerType;
  dispatch: AppDispatch;
  rejectValue: BasicResponseType | null;
}>();
