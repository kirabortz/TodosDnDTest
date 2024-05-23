import React, { ChangeEvent, useCallback } from "react";
import EdiatbleSpan from "../../../../../common/components/EditableSpan/EdiatbleSpan";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { appSelectors, ServerResponseStatusType } from "../../../../../redux/appSlice";
import { TaskStatuses } from "../../../../../common/enums/enums";
import { styled } from "styled-components";
import { useActions } from "../../../../../common/hooks/useActions";
import { tasksSelectors, TasksWithEntityStatusType } from "../../../../../redux/tasksSlice";
import s from "./Task.module.css";
import { useAppSelector } from "../../../../../store/store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSelector } from "react-redux";

type Props = {
  todoListId: string;
  task: TasksWithEntityStatusType;
};

export const Task = ({ task, todoListId }: Props) => {
  const { deleteTaskTC, updateTaskTC } = useActions();
  const tasks = useAppSelector(tasksSelectors.tasksState)[todoListId];
  const isBlockDragMode = useSelector(appSelectors.isBlockDragMode);
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task: tasks[tasks.findIndex((t) => t.id === task.id)],
    },
    disabled: isBlockDragMode,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    // transition,
  };

  const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let checkToGo = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTaskTC({
      todoListId,
      taskId: task.id,
      model: { status: checkToGo },
    });
  };

  const onRemoveTaskHandler = () => {
    deleteTaskTC({ todoListId, taskId: task.id });
  };

  const onUpdTaskTitleHandler = (updTaskTitle: string) => {
    updateTaskTC({
      todoListId,
      taskId: task.id,
      model: { title: updTaskTitle },
    });
  };

  const isTaskCompleted = task.status === TaskStatuses.Completed;

  if (isDragging) {
    const styleIfDragging = { opacity: 0.3, backgroundColor: "lightgreen", minHeight: "40px" };
    return <li className={isTaskCompleted ? s.isDone : ""} ref={setNodeRef} style={{ ...style, ...styleIfDragging }} {...attributes} {...listeners} />;
  }
  return (
    <li className={isTaskCompleted ? s.isDone : ""} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <input type="checkbox" checked={isTaskCompleted} onChange={onChangeTaskStatusHandler} disabled={task.entityStatus === "loading"} />
      <EdiatbleSpan oldTitle={task.title} callback={onUpdTaskTitleHandler} disabled={task.entityStatus === "loading"} />
      <IconButton aria-label="delete" onClick={onRemoveTaskHandler} disabled={task.entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </li>
  );
};
