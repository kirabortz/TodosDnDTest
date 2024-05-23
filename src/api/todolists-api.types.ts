
export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type UpdateTodoArgs = {
  todoListId: string;
  title: string;
};

export type ReorderTodoListArgs = {
  startDragId: string;
  endShiftId: string | null;
};
