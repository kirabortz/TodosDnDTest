import { TasksWithEntityStatusType } from "../../redux/tasksSlice";

export function dndUniversalIdChanger<T extends { id: string }, R extends { startDragId: string; endShiftId: string | null }>(array: T[], args: R) {
  const startId = array.findIndex((item, index) => item.id === args.startDragId && index >= 0);
  const endId = array.findIndex((item, index) => item.id === args.endShiftId && index >= 0);

  if (endId > 0 && endId <= startId) {
    return array[endId - 1].id;
  } else if (endId > startId) {
    return args.endShiftId;
  } else {
    return null;
  }
}
export function dndIdChangerForTaskAcrossTodos(args: { tasks: TasksWithEntityStatusType[]; endShiftId: string }) {
  const endIndex = args.tasks.findIndex((item, index) => item.id === args.endShiftId && index >= 0);
  if (endIndex === 0) {
    return null;
  } else if (endIndex === args.tasks.length) {
    return args.tasks[endIndex].id;
  } else {
    return args.tasks[endIndex - 1].id;
  }
}


