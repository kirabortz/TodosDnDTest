// @flow
import * as React from "react";
import Button from "@material-ui/core/Button";
import { FilterValuesType, TodoUIType } from "../../../../redux/todolistsSlice";
import { useActions } from "../../../../common/hooks/useActions";

type Props = {
  todoList: TodoUIType;
};
export const FilterTasksButton = ({ todoList }: Props) => {
  const { filter } = todoList;
  const { changeTodoFilter } = useActions();

  const changeTodoFilterHandler = (filter: FilterValuesType) => {
    changeTodoFilter({ todoListId: todoList.id, newFilterValue: filter });
  };

  return (
    <>
      <Button
        variant={filter === "all" ? "contained" : "outlined"}
        color="primary"
        onClick={() => {
          changeTodoFilterHandler("all");
        }}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "contained" : "outlined"}
        color="error"
        onClick={() => {
          changeTodoFilterHandler("active");
        }}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "contained" : "outlined"}
        color="success"
        onClick={() => {
          changeTodoFilterHandler("completed");
        }}
      >
        Completed
      </Button>
    </>
  );
};
