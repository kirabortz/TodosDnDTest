import React, { useCallback, useMemo } from "react";
import { AddItemForm } from "../../../../common/components/AddItemForm/AddItemForm";
import Typography from "@mui/material/Typography";
import { Paper, TextareaAutosize } from "@mui/material";
import { tasksSelectors } from "../../../../redux/tasksSlice";
import { Task } from "./Task/Task";
import { TodoUIType } from "../../../../redux/todolistsSlice";
import Skeleton from "@mui/material/Skeleton";
import { useAppSelector } from "../../../../store/store";
import { appSelectors } from "../../../../redux/appSlice";
import { TaskStatuses } from "../../../../common/enums/enums";
import { useActions } from "../../../../common/hooks/useActions";
import { FilterTasksButton } from "./FilterTasksButton";
import { TodolistTitle } from "./TodolistTitle/TodolistTitle";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSelector } from "react-redux";

type Props = {
  todolist: TodoUIType;
};

export const Todolist = React.memo(({ todolist }: Props) => {
  const { addTaskTC } = useActions();

  let allTodoTasks = useAppSelector((state) => tasksSelectors.tasksById(state, todolist.id));
  const isBlockDragMode = useSelector(appSelectors.isBlockDragMode);

  let tasksIds = useMemo(() => allTodoTasks.map((task) => task.id), [allTodoTasks]);
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: todolist.id,
    data: {
      type: "Todolist",
      todolist,
    },
    disabled: isBlockDragMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const addTask = useCallback(
    (newTaskTitle: string) => {
      return addTaskTC({
        todoListId: todolist.id,
        title: newTaskTitle,
      }).unwrap();
    },
    [todolist.id]
  );

  if (todolist.filter === "completed") {
    allTodoTasks = allTodoTasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  if (todolist.filter === "active") {
    allTodoTasks = allTodoTasks.filter((t) => t.status === TaskStatuses.New);
  }

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style}>
        <Paper elevation={6} style={{ padding: "30px", borderRadius: "10px", opacity: 0.3, backgroundColor: "lightgreen" }}>
          <TodolistTitle todoList={todolist} />
          <AddItemForm callback={addTask} disabled={todolist.entityStatus === "loading"} placeholderText={"task"} />
          <Skeleton>
            <div>somehing</div>
          </Skeleton>
          <FilterTasksButton todoList={todolist} />
        </Paper>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Paper elevation={6} style={{ padding: "30px", borderRadius: "10px" }}>
        <TodolistTitle todoList={todolist} />
        <AddItemForm callback={addTask} disabled={todolist.entityStatus === "loading"} placeholderText={"task"} />
        {allTodoTasks.length !== 0 ? (
          <SortableContext items={tasksIds}>
            <ul>
              {allTodoTasks.map((t) => {
                return todolist.entityStatus === "loading" ? (
                  <Skeleton key={t.id}>
                    <Task key={t.id} task={t} todoListId={todolist.id} />
                  </Skeleton>
                ) : (
                  <Task key={t.id} task={t} todoListId={todolist.id} />
                );
              })}
            </ul>
          </SortableContext>
        ) : todolist.showTasks ? (
          <p>Nothing to show</p>
        ) : (
          <Typography variant="h3">
            <Skeleton />
          </Typography>
        )}
        <FilterTasksButton todoList={todolist} />
      </Paper>
    </div>
  );
});
