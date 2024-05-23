import { todolistsAPI } from "../api/todolists-api";
import { ServerResponseStatusType } from "./appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodos } from "../common/actions/common.actions";
import { tasksThunks } from "./tasksSlice";
import { createAppAsyncThunk, dndUniversalIdChanger } from "../common/utilities";
import { ReorderTodoListArgs, TodolistType, UpdateTodoArgs } from "../api/todolists-api.types";

export type FilterValuesType = "all" | "active" | "completed";

export type TodoUIType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: ServerResponseStatusType;
  showTasks: boolean;
};

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodoUIType[],
  reducers: {
    changeTodoFilter(
      state,
      action: PayloadAction<{
        todoListId: string;
        newFilterValue: FilterValuesType;
      }>
    ) {
      const id = state.findIndex((tl) => tl.id === action.payload.todoListId);
      if (id > -1) state[id] = { ...state[id], filter: action.payload.newFilterValue };
    },
    updateEntityStatusTodo(
      state,
      action: PayloadAction<{
        todoId: string;
        entityStatus: ServerResponseStatusType;
      }>
    ) {
      const id = state.findIndex((tl) => tl.id === action.payload.todoId);
      if (id > -1) state[id] = { ...state[id], entityStatus: action.payload.entityStatus };
    },
    showTasks(state, action: PayloadAction<{ todoListId: string }>) {
      const id = state.findIndex((tl) => tl.id === action.payload.todoListId);
      if (id > -1) state[id].showTasks = true;
    },
    reorderTodolist(state, action: PayloadAction<ReorderTodoListArgs>) {
      const { startDragId, endShiftId } = action.payload;
      const dragIndex = state.findIndex((el) => el.id === startDragId);
      const targetIndex = state.findIndex((el) => el.id === endShiftId);

      if (dragIndex > -1 && targetIndex > -1) {
        const draggedItem = state.splice(dragIndex, 1)[0];
        state.splice(targetIndex, 0, draggedItem);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodos, () => {
        return [];
      })
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({
          ...tl,
          filter: "all",
          entityStatus: "idle",
          showTasks: false
        }));
      })
      .addCase(deleteTodoTC.fulfilled, (state, action) => {
        const id = state.findIndex((tl) => tl.id === action.payload.todoListId);
        if (id > -1) state.splice(id, 1);
      })
      .addCase(addTodoTC.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload.newTodolist,
          filter: action.payload.filter,
          entityStatus: action.payload.entityStatus,
          showTasks: action.payload.showTasks
        });
      })
      .addCase(updateTodoTitleTC.fulfilled, (state, action) => {
        const id = state.findIndex((tl) => tl.id === action.payload.todoListId);
        state[id] = { ...state[id], title: action.payload.title };
      })
      .addCase(reorderTodolistTC.fulfilled, (state, action) => {
        const { startDragId, endShiftId } = action.payload;
        const dragIndex = state.findIndex((el) => el.id === startDragId);
        const targetIndex = state.findIndex((el) => el.id === endShiftId);

        if (dragIndex > -1 && targetIndex > -1) {
          const draggedItem = state.splice(dragIndex, 1)[0];
          state.splice(targetIndex, 0, draggedItem);
        }
      });
  },
  selectors: {
    todolists: (sliceState) => sliceState
  }
});

const fetchTodolistsTC = createAppAsyncThunk<{
  todolists: TodolistType[]
}, void>(`${slice.name}/fetchTodolists`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await todolistsAPI.getTodolists();
  res.data.forEach((tl) => {
    dispatch(tasksThunks.fetchTasksTC(tl.id)).then(() => {
      dispatch(todolistsActions.showTasks({ todoListId: tl.id }));
    });
  });
  return { todolists: res.data };
});

const deleteTodoTC = createAppAsyncThunk<{
  todoListId: string
}, string>(`${slice.name}/deleteTodo`, async (todoListId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(
    todolistsActions.updateEntityStatusTodo({
      todoId: todoListId,
      entityStatus: "loading"
    })
  );
  try {
    const res = await todolistsAPI.deleteTodolist(todoListId);
    if (res.data.resultCode === 0) {
      return { todoListId };
    } else {
      return rejectWithValue(res.data);
    }
  } finally {
    dispatch(
      todolistsActions.updateEntityStatusTodo({
        todoId: todoListId,
        entityStatus: "success"
      })
    );
  }
});

const addTodoTC = createAppAsyncThunk<
  {
    newTodolist: TodolistType;
    filter: FilterValuesType;
    entityStatus: ServerResponseStatusType;
    showTasks: boolean;
  },
  string
>(`${slice.name}/addTodo`, async (newTodolistTitle, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await todolistsAPI.createTodolist(newTodolistTitle);
  if (res.data.resultCode === 0) {
    return {
      newTodolist: res.data.data.item,
      filter: "all",
      entityStatus: "idle",
      showTasks: true
    };
  } else {
    return rejectWithValue(res.data);
  }
});

const updateTodoTitleTC = createAppAsyncThunk<UpdateTodoArgs, UpdateTodoArgs>(`${slice.name}/updateTodoTitle`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await todolistsAPI.updateTodolist(args);
  if (res.data.resultCode === 0) {
    return args;
  } else {
    return rejectWithValue(null);
  }
});

const reorderTodolistTC = createAppAsyncThunk<ReorderTodoListArgs, ReorderTodoListArgs>(`${slice.name}/reorderTodolist`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const todolists = getState().todolists;
  dispatch(
    todolistsActions.updateEntityStatusTodo({
      todoId: args.startDragId,
      entityStatus: "loading"
    })
  );
  dispatch(
    todolistsActions.updateEntityStatusTodo({
      todoId: args.endShiftId || "",
      entityStatus: "loading"
    })
  );
  const idToServer = dndUniversalIdChanger(todolists, args);
  try {
    const res = await todolistsAPI.reorderTodolist({
      startDragId: args.startDragId,
      endShiftId: idToServer
    });
    if (res.data.resultCode === 0) {
      return args;
    } else {
      return rejectWithValue(null);
    }
  } finally {
    dispatch(
      todolistsActions.updateEntityStatusTodo({
        todoId: args.startDragId,
        entityStatus: "success"
      })
    );
    dispatch(
      todolistsActions.updateEntityStatusTodo({
        todoId: args.endShiftId ? args.endShiftId : "",
        entityStatus: "success"
      })
    );
  }
});

export const todolistsSlice = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsSelectors = slice.selectors;
export const todolistsThunks = {
  fetchTodolistsTC,
  deleteTodoTC,
  addTodoTC,
  updateTodoTitleTC,
  reorderTodolistTC
};
