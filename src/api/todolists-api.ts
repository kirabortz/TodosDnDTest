import { instance } from "../common/instance/instance";
import { BasicResponseType } from "../common/types";
import { ReorderTodoListArgs, TodolistType, UpdateTodoArgs } from "./todolists-api.types";

export const todolistsAPI = {
  getTodolists() {
    return instance.get<Array<TodolistType>>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<BasicResponseType<{ item: TodolistType }>>("todo-lists", { title });
  },
  deleteTodolist(id: string) {
    return instance.delete<BasicResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(args: UpdateTodoArgs) {
    return instance.put<BasicResponseType>(`todo-lists/${args.todoListId}`, {
      title: args.title,
    });
  },
  reorderTodolist(args: ReorderTodoListArgs) {
    return instance.put<BasicResponseType>(`todo-lists/${args.startDragId}/reorder`, { putAfterItemId: args.endShiftId });
  },
};
