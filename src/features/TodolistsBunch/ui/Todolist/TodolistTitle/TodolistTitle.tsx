// @flow
import * as React from "react";
import EdiatbleSpan from "../../../../../common/components/EditableSpan/EdiatbleSpan";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { TodoUIType } from "../../../../../redux/todolistsSlice";
import { useActions } from "../../../../../common/hooks/useActions";

type Props = {
  todoList: TodoUIType;
};
export const TodolistTitle = ({ todoList }: Props) => {
  const { updateTodoTitleTC, deleteTodoTC } = useActions();
  const removeTodo = () => {
    deleteTodoTC(todoList.id);
  };

  const updTodoTitleHandler = (updTlTitle: string) => {
    updateTodoTitleTC({
      todoListId: todoList.id,
      title: updTlTitle,
    });
  };
  return (
    <h3
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "0 8px",
      }}
    >
      <EdiatbleSpan oldTitle={todoList.title} callback={updTodoTitleHandler} disabled={todoList.entityStatus === "loading"} />
      <IconButton aria-label="delete" onClick={removeTodo} disabled={todoList.entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </h3>
  );
};
