import { Dispatch, UnknownAction } from "redux";
import { loginAPI } from "../api/login-api";
import { createSlice, isAnyOf, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { loginActions } from "./loginSlice";
import { todolistsThunks } from "./todolistsSlice";
import { createAppAsyncThunk } from "../common/utilities";
import { tasksThunks } from "./tasksSlice";

export type ServerResponseStatusType = "idle" | "success" | "loading" | "failed";

const slice = createSlice({
  name: "app",
  initialState: {
    statusTodo: "idle" as ServerResponseStatusType,
    statusTask: "idle" as ServerResponseStatusType,
    addStatus: "idle" as ServerResponseStatusType,
    error: null as null | string,
    isInitialized: false,
    searchQuery: "" as string,
    isBlockDragMode: true,
  },
  reducers: {
    setAppTodoStatus(state, action: PayloadAction<{ statusTodo: ServerResponseStatusType }>) {
      state.statusTodo = action.payload.statusTodo;
    },
    setAppStatusTask(state, action: PayloadAction<{ statusTask: ServerResponseStatusType }>) {
      state.statusTask = action.payload.statusTask;
    },
    setAppStatus(state, action: PayloadAction<{ appStatus: ServerResponseStatusType }>) {
      state.addStatus = action.payload.appStatus;
    },
    setAppError(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error;
    },
    setSearchQuery(state, action: PayloadAction<{ searchQuery: string }>) {
      state.searchQuery = action.payload.searchQuery;
    },
    changeBlockDragMode(state, action: PayloadAction<{ isBlockDragMode: boolean }>) {
      state.isBlockDragMode = action.payload.isBlockDragMode;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initialiseMeTC.fulfilled, (state, action) => {
        state.isInitialized = action.payload.value;
      })
      .addCase(initialiseMeTC.rejected, (state, action) => {
        state.isInitialized = true;
      })
      .addCase(tasksThunks.reorderTaskTC.rejected, (state, action) => {
        state.statusTask = "success";
      })
      .addMatcher(isPending, (state, action) => {
        state.statusTodo = "loading";
        state.addStatus = "loading";
        state.statusTask = "loading";
      })
      .addMatcher(isRejected, (state, action: any) => {
        state.statusTodo = "failed";
        state.addStatus = "failed";
        state.statusTask = "failed";
        if (action.payload) {
          if (
            action.type === todolistsThunks.addTodoTC.rejected.type ||
            action.type === tasksThunks.addTaskTC.rejected.type ||
            action.type === appThunks.initialiseMeTC.rejected.type
          ) {
            return;
          }
          state.error = action.payload.messages[0];
        } else {
          state.error = action.error.message ? action.error.message : "Some error occurred";
        }
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.statusTodo = "success";
        state.addStatus = "success";
        state.statusTask = "success";
      })
      .addMatcher(isAnyOf(appThunks.initialiseMeTC.rejected, appThunks.initialiseMeTC.fulfilled), (state, action) => {
        state.isInitialized = true;
      });
  },
  selectors: {
    selectAddStatus: (sliceState) => sliceState.addStatus,
    statusTodo: (sliceState) => sliceState.statusTodo,
    statusTask: (sliceState) => sliceState.statusTask,
    isInitialized: (sliceState) => sliceState.isInitialized,
    error: (sliceState) => sliceState.error,
    searchQuery: (sliceState) => sliceState.searchQuery,
    isBlockDragMode: (sliceState) => sliceState.isBlockDragMode,
  },
});

export const appSlice = slice.reducer;

export const appActions = slice.actions;
export const appSelectors = slice.selectors;
export type AppInitialState = ReturnType<typeof slice.getInitialState>;

const initialiseMeTC = createAppAsyncThunk<{ value: boolean }, undefined>(`${slice.name}/initialiseMe`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  const res = await loginAPI.initialiseMe();

  if (res.data.resultCode === 0) {
    dispatch(loginActions.setIsLoggedInAC({ value: true }));
    dispatch(todolistsThunks.fetchTodolistsTC());
    return { value: true };
  } else {
    return rejectWithValue(null);
  }
});

export const appThunks = { initialiseMeTC };
