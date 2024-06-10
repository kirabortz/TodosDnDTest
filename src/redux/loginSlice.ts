import { loginAPI } from "../api/login-api";
import { createSlice, isFulfilled, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../common/utilities";
import { todolistsThunks } from "./todolistsSlice";
import { LoginParamsType } from "../api/login-api.types";

const slice = createSlice({
  name: "login",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isFulfilled(loginThunks.loginTC), (state, action: PayloadAction<{ value: boolean }>) => {
      state.isLoggedIn = action.payload.value;
    });
  },
  selectors: {
    isLoggedIn: (sliceState) => sliceState.isLoggedIn,
  },
});

export const loginSlice = slice.reducer;
export const loginActions = slice.actions;
export const loginSelectors = slice.selectors;

const loginTC = createAppAsyncThunk<{ value: boolean }, LoginParamsType>(`${slice.name}/login`, async (data, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await loginAPI.login(data);
  if (res.data.resultCode === 0) {
    //@ts-expect-error
    localStorage.setItem("sn-token", res.data.data.token);
    dispatch(todolistsThunks.fetchTodolistsTC());
    return { value: true };
  } else {
    return rejectWithValue(null);
  }
});

const logoutTC = createAppAsyncThunk<{ value: boolean }, undefined>(`${slice.name}/logout`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await loginAPI.logout();
  if (res.data.resultCode === 0) {
    localStorage.removeItem("sn-token");
    dispatch(loginActions.setIsLoggedInAC({ value: false }));
    return { value: true };
  } else {
    return rejectWithValue(null);
  }
});

export const loginThunks = { loginTC, logoutTC };
