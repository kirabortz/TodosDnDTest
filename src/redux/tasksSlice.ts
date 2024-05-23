import { tasksApi } from "../api/tasks-api";
import { ServerResponseStatusType } from "./appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodos } from "../common/actions/common.actions";
import { todolistsThunks } from "./todolistsSlice";
import { createAppAsyncThunk, dndUniversalIdChanger } from "../common/utilities";
import { CreateTaskArgs, DeleteTaskArgs, ReorderTasksArgs, TaskType, UpdateTaskType } from "../api/tasks-api.types";
import { dndIdChangerForTaskAcrossTodos } from "../common/utilities/dragAndDropIdChangerFunctions";

export type TaskStateType = {
  [todoListId: string]: TasksWithEntityStatusType[];
};

export type TasksWithEntityStatusType = TaskType & {
  entityStatus: ServerResponseStatusType;
};

const slice = createSlice({
    name: "tasks",
    initialState: {} as TaskStateType,
    reducers: {
      updateTaskEntityStatus(
        state,
        action: PayloadAction<{
          todoListId: string;
          taskId: string | undefined;
          entityStatus: ServerResponseStatusType;
        }>
      ) {
        const tasks = state[action.payload.todoListId];
        const id = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (id > -1) {
          tasks[id] = { ...tasks[id], entityStatus: action.payload.entityStatus };
        }
      },
      reorderTask(state, action: PayloadAction<ReorderTasksArgs>) {
        const { todoListId, startDragId, endShiftId } = action.payload;
        const dragIndex = state[todoListId].findIndex((t) => t.id === startDragId);
        const targetIndex = state[todoListId].findIndex((t) => t.id === endShiftId);
        if (dragIndex > -1 && targetIndex > -1) {
          const draggedItem = state[todoListId].splice(dragIndex, 1)[0];
          state[todoListId].splice(targetIndex, 0, draggedItem);
        }
      },
      moveTaskAcrossTodolists(
        state,
        action: PayloadAction<{
          todoListId: string;
          endTodoListId: string;
          startDragId: string;
          endShiftId: string | null;
        }>
      ) {
        const { startDragId, endShiftId, todoListId, endTodoListId } = action.payload;

        const startTodolistTasks = state[todoListId];
        const endTodolistTasks = state[endTodoListId];


        const startTaskIndex = startTodolistTasks.findIndex((task) => task.id === startDragId);
        const endTaskIndex = endTodolistTasks.findIndex((task) => task.id === endShiftId);

        const draggedTask = startTodolistTasks[startTaskIndex];
        draggedTask.todoListId = endTodoListId;

        if (!draggedTask) {
          console.warn(`Task with id ${startDragId} not found`);
          return;
        }

        startTodolistTasks.splice(startTaskIndex, 1);

        if (endShiftId) {
          endTodolistTasks.splice(endTaskIndex, 0, draggedTask);
        } else {
          endTodolistTasks.push(draggedTask);
        }
      },
      moveTaskInEmptyTodolists(
        state,
        action
          :
          PayloadAction<{
            todoListId: string;
            endTodoListId: string;
            startDragId: string;
          }>
      ) {
        const { startDragId, todoListId, endTodoListId } = action.payload;

        const endTodolistTasks = state[endTodoListId];
        const taskToPut = state[todoListId].find((task) => task.id === startDragId);

        const startTodolistTasks = state[todoListId];
        startTodolistTasks.splice(
          startTodolistTasks.findIndex((task) => task.id === startDragId),
          1
        );

        if (taskToPut) {
          endTodolistTasks.unshift(taskToPut);
          taskToPut.todoListId = endTodoListId;
        }
      }

    },
    extraReducers: (builder) => {
      builder
        .addCase(todolistsThunks.addTodoTC.fulfilled, (state, action) => {
          state[action.payload.newTodolist.id] = [];
        })
        .addCase(todolistsThunks.deleteTodoTC.fulfilled, (state, action) => {
          delete state[action.payload.todoListId];
        })
        .addCase(todolistsThunks.fetchTodolistsTC.fulfilled, (state, action) => {
          action.payload.todolists.forEach((tl) => {
            state[tl.id] = [];
          });
        })
        .addCase(clearTasksAndTodos, () => {
          return {};
        })
        .addCase(fetchTasksTC.fulfilled, (state, action) => {
          const { todolistId, tasks } = action.payload;
          state[todolistId] = tasks.map((t) => ({ ...t, entityStatus: "idle" }));
          return state;
        })
        .addCase(addTaskTC.fulfilled, (state, action) => {
          state[action.payload.task.todoListId].unshift({
            ...action.payload.task,
            entityStatus: "idle"
          });
        })
        .addCase(updateTaskTC.fulfilled, (state, action) => {
          const tasks = state[action.payload.todoListId];
          const id = tasks.findIndex((t) => t.id === action.payload.taskId);
          if (id > -1) {
            tasks[id] = { ...tasks[id], ...action.payload.model };
          }
        })
        .addCase(deleteTaskTC.fulfilled, (state, action) => {
          const id = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId);
          if (id > -1) state[action.payload.todoListId].splice(id, 1);
        });
    },
    selectors: {
      tasksState: (sliceState) => sliceState as TaskStateType,
      tasksById: (sliceState, todoId: string) => sliceState[todoId] as TasksWithEntityStatusType[]
    }

  })
;

export const tasksActions = slice.actions;

export const tasksSlice = slice.reducer;
export const tasksSelectors = slice.selectors;

const fetchTasksTC = createAppAsyncThunk<
  {
    todolistId: string;
    tasks: TaskType[];
  },
  string
>(`${slice.name}/fetchTasks`, async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await tasksApi.getTasks(todolistId);
  const tasks = res.data.items;
  return { todolistId: todolistId, tasks };
});

const deleteTaskTC = createAppAsyncThunk<DeleteTaskArgs, DeleteTaskArgs>(`${slice.name}/deleteTask`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.taskId,
      entityStatus: "loading"
    })
  );
  try {
    const res = await tasksApi.deleteTask(args);
    if (res.data.resultCode === 0) {
      return { todoListId: args.todoListId, taskId: args.taskId };
    } else {
      return rejectWithValue(null);
    }
  } finally {
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.taskId,
        entityStatus: "success"
      })
    );
  }
});
const addTaskTC = createAppAsyncThunk<
  {
    task: TaskType;
  },
  CreateTaskArgs
>(`${slice.name}/addTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await tasksApi.createTask(arg);
  if (res.data.resultCode === 0) {
    const task = res.data.data.item;
    return { task };
  } else {
    return rejectWithValue(res.data);
  }
});
const addTaskDnDTC = createAppAsyncThunk<
  {
    task: TaskType;
  },
  CreateTaskArgs
>(`${slice.name}/addTaskDnDTC`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await tasksApi.createTask(arg);
  if (res.data.resultCode === 0) {
    const task = res.data.data.item;
    return { task };
  } else {
    return rejectWithValue(null);
  }
});
const updateTaskTC = createAppAsyncThunk<
  { todoListId: string; taskId: string; model: UpdateTaskType },
  {
    todoListId: string;
    taskId: string;
    model: Partial<UpdateTaskType>;
  }
>(`${slice.name}/updateTask`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const state = getState();
  const task = state.tasks[args.todoListId].find((tl) => tl.id === args.taskId);
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.taskId,
      entityStatus: "loading"
    })
  );

  if (!task) {
    throw new Error("Task not found in the state");
  }

  const apiModel: UpdateTaskType = { ...task, ...args.model };
  try {
    const res = await tasksApi.updateTask(args.todoListId, args.taskId, apiModel);
    if (res.data.resultCode === 0) {
      return {
        todoListId: args.todoListId,
        taskId: args.taskId,
        model: apiModel
      };
    } else {
      return rejectWithValue(null);
    }
  } finally {
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.taskId,
        entityStatus: "success"
      })
    );
  }
});

const updateTaskDnDTC = createAppAsyncThunk<
  { todoListId: string; taskId: string; model: UpdateTaskType },
  {
    todoListId: string;
    task: TaskType;
    model: Partial<UpdateTaskType>;
  }
>(`${slice.name}/updateTask`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.task.id,
      entityStatus: "loading"
    })
  );

  if (!args.task) {
    throw new Error("Task not found in the state");
  }

  const apiModel: UpdateTaskType = { ...args.task, ...args.model };
  try {
    const res = await tasksApi.updateTask(args.todoListId, args.task.id, apiModel);
    if (res.data.resultCode === 0) {
      return {
        todoListId: args.todoListId,
        taskId: args.task.id,
        model: apiModel
      };
    } else {
      return rejectWithValue(null);
    }
  } finally {
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.task.id,
        entityStatus: "success"
      })
    );
  }
});

const reorderTaskTC = createAppAsyncThunk<undefined, ReorderTasksArgs>(`${slice.name}/reorderTasksSoloTodoDnDTC`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const tasks = getState().tasks[args.todoListId];
  const idToServer = dndUniversalIdChanger(tasks, args);
  const res = await tasksApi.reorderTasks({
    todoListId: args.todoListId,
    startDragId: args.startDragId,
    endShiftId: idToServer
  });
  if (res.data.resultCode === 0) {
    return undefined;
  } else {
    return rejectWithValue(null);
  }
});

const reorderTaskAcrossTodosTC = createAppAsyncThunk<
  undefined,
  {
    todoListId: string;
    startDragId: string;
    endShiftId: string;
  }
>(`${slice.name}/reorderTasksDnDByOrderTC`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const tasks = getState().tasks[args.todoListId];
  const idToServer = dndIdChangerForTaskAcrossTodos({
    tasks,
    endShiftId: args.endShiftId
  });

  const res = await tasksApi.reorderTasks({
    todoListId: args.todoListId,
    startDragId: args.startDragId,
    endShiftId: idToServer
  });
  if (res.data.resultCode === 0) {
    return undefined;
  } else {
    return rejectWithValue(null);
  }
});

export const tasksThunks = {
  fetchTasksTC,
  addTaskTC,
  updateTaskTC,
  updateTaskDnDTC,
  deleteTaskTC,
  reorderTaskTC,
  addTaskDnDTC,
  reorderTaskAcrossTodosTC
};
