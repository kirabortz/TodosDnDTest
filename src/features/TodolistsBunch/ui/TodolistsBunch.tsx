import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RootReducerType, useAppSelector } from "../../../store/store";
import { todolistsSelectors } from "../../../redux/todolistsSlice";
import { Grid, Pagination } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { Navigate, useSearchParams } from "react-router-dom";
import { appSelectors } from "../../../redux/appSlice";
import { loginSelectors } from "../../../redux/loginSlice";
import { AddItemForm } from "../../../common/components";
import { useActions } from "../../../common/hooks/useActions";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { SortableContext } from "@dnd-kit/sortable";
import { DndContextHOC } from "../../../common/components/DndContextHOC/DndContextHOC";

type TodolistsBunchProps = {};
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  const { addTodoTC } = useActions();

  const [searchParams, setSearchParams] = useSearchParams();

  const todolists = useAppSelector((state) => todolistsSelectors.todolists(state));
  const statusAddTodo = useAppSelector((state) => appSelectors.statusTodo(state));
  const isLoggedIn = useAppSelector((state) => loginSelectors.isLoggedIn(state));
  const searchQuery = useSelector<RootReducerType, string>((state) => state.app.searchQuery);
  const todolistIds = useMemo(() => todolists.map((tl) => tl.id), [todolists]);

  // Paginaton
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState(3);
  const [query, setQuery] = useState("");

  const theme: any = useTheme();

  useEffect(() => {
    const searchQueryParams: { search?: string } = searchQuery !== "" ? { search: searchQuery } : {};
    const pageQueryParams: { pageQ?: string } = page.toString() !== "1" ? { pageQ: page.toString() } : {};
    const allQuery = { ...searchQueryParams, ...pageQueryParams };
    setSearchParams(allQuery);
  }, [page, searchQuery]);

  const styles = {
    ul: {
      "& .MuiPaginationItem-root": {
        backgroundColor: theme.palette.mode === "dark" ? "#ffffff" : "#171717",
        color: theme.palette.mode === "dark" ? "#171717" : "#ffffff",
        "&.Mui-selected": {
          color: "#fbb538",
          fontWeight: "700"
        }
      },
      "& li": {
        border: "none"
      }
    }
  };

  const addTodo = useCallback((newTodoTitle: string) => {
    return addTodoTC(newTodoTitle).unwrap();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  const displayedTodolists = todolists.slice((Number(page) - 1) * pageCount, Number(page) * pageCount);
  return (
    <DndContextHOC>
      <Grid container style={{ padding: "20px" }} alignItems={"center"}>
        <AddItemForm callback={addTodo} width={"100%"} placeholderText={"todolist-card"} />
      </Grid>
      <Grid container spacing={3} justifyContent={"space-evenly"}>
        <SortableContext items={todolistIds}>
          {displayedTodolists
            .filter((e) => (searchParams.get("search") ? e.title.includes(searchParams.get("search") ?? "") : e))
            .map((tl) => {
              return (
                <Grid item key={tl.id}>
                  <Todolist key={tl.id} todolist={tl} />
                </Grid>
              );
            })}
        </SortableContext>
      </Grid>
      <Stack spacing={2} direction={"column"} sx={{ marginTop: "20px" }}>
        <Box
          sx={{
            ...styles.ul,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Pagination
            count={Math.ceil(todolists.length / pageCount)}
            shape="circular"
            variant="outlined"
            onChange={(e, num) => setPage(num)}
            hideNextButton={true}
            hidePrevButton={true}
          />
        </Box>
      </Stack>
    </DndContextHOC>
  );
};
