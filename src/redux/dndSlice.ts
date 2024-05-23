import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoUIType } from "./todolistsSlice";
import { TasksWithEntityStatusType } from "./tasksSlice";
import { TaskType } from "../api/tasks-api.types";

type initStateType = {
  activeTodo: TodoUIType | null;
  activeTask: TasksWithEntityStatusType | null;
  memoActiveTodoId: string | null;
  memoOverTodoId: string | null;
  memoActiveTaskCopy: TaskType | null | undefined;
};

const slice = createSlice({
  name: "dnd",
  initialState: {
    activeTodo: null,
    activeTask: null,
    memoActiveTodoId: null,
    memoOverTodoId: null,
    memoActiveTaskCopy: null,
  } as initStateType,
  reducers: {
    setActiveTodo: (state, action) => {
      state.activeTodo = action.payload;
    },
    setActiveTask: (state, action) => {
      state.activeTask = action.payload;
    },
    setMemoActiveTodoId: (state, action) => {
      state.memoActiveTodoId = action.payload;
    },
    setMemoOverTodoId: (state, action) => {
      state.memoOverTodoId = action.payload;
    },
    setMemoActiveTaskCopy: (state, action) => {
      state.memoActiveTaskCopy = action.payload;
    },
    setMemoData: (
      state,
      action: PayloadAction<{
        memoActiveTodoId: string | null;
        memoOverTodoId: string | null;
      }>
    ) => {
      state.memoActiveTodoId = action.payload.memoActiveTodoId;
      state.memoOverTodoId = action.payload.memoOverTodoId;
    },
  },
  selectors: {
    activeTodo: (sliceState) => sliceState.activeTodo,
    activeTask: (sliceState) => sliceState.activeTask,
    memoActiveTodoId: (sliceState) => sliceState.memoActiveTodoId,
    memoOverTodoId: (sliceState) => sliceState.memoOverTodoId,
    memoActiveTaskCopy: (sliceState) => sliceState.memoActiveTaskCopy,
  },
});

export const dndSlice = slice.reducer;
export const dndActions = slice.actions;
export const dndSelectors = slice.selectors;
