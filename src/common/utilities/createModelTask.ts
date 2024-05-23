import { TaskPriorities, TaskStatuses } from "../enums/enums";
import { TaskType } from "../../api/tasks-api.types";

type ModelForUpdateType = {
  [key: string]: string | TaskStatuses | TaskPriorities;
};
export const createModelTask = (task: TaskType, utilityModel: ModelForUpdateType) => {
  return {
    status: task.status,
    startDate: task.deadline,
    title: task.title,
    priority: task.priority,
    description: task.description,
    deadline: task.deadline,
    ...utilityModel,
  };
};
