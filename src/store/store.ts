import { todolistsSlice } from "../redux/todolistsSlice";
import { tasksSlice } from "../redux/tasksSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appSlice, appThunks } from "../redux/appSlice";
import { loginSlice } from "../redux/loginSlice";
import { configureStore } from "@reduxjs/toolkit";
import { dndSlice } from "../redux/dndSlice";

export const store = configureStore({
  reducer: {
    todolists: todolistsSlice,
    tasks: tasksSlice,
    app: appSlice,
    login: loginSlice,
    dnd: dndSlice
  }
});

export type RootReducerType = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootReducerType> = useSelector;

store.dispatch(appThunks.initialiseMeTC());
export default store;
