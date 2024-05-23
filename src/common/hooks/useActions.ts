import { useMemo } from "react";
import { ActionCreatorsMapObject, bindActionCreators } from "redux";
import { useAppDispatch } from "../../store/store";
import { appThunks } from "../../redux/appSlice";
import { loginThunks } from "../../redux/loginSlice";
import { tasksActions, tasksThunks } from "../../redux/tasksSlice";
import { todolistsActions, todolistsThunks } from "../../redux/todolistsSlice";
import { dndActions } from "../../redux/dndSlice";

const actionsAll = {
  ...appThunks,
  ...loginThunks,
  ...tasksThunks,
  ...todolistsThunks,
  ...todolistsActions,
  ...tasksActions,
  ...dndActions,
}

type AllActions = typeof actionsAll;

export const useActions = () => {
  const dispatch = useAppDispatch();

  return useMemo(() => bindActionCreators<AllActions, RemapActionCreators<AllActions>>(actionsAll, dispatch), [dispatch]);
};


type ReplaceReturnType<T> = T extends (...args: any[]) => any ? (...args: Parameters<T>) => ReturnType<ReturnType<T>> : () => T;

type RemapActionCreators<T extends ActionCreatorsMapObject> = {
  [K in keyof T]: ReplaceReturnType<T[K]>;
};
