import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { getStyles } from "../../../styles";
import { appActions, appSelectors } from "../../../redux/appSlice";
import { useAppDispatch } from "../../../store/store";
import { useSelector } from "react-redux";

export type AddItemFormProps = {
  callback: (newTitle: string) => Promise<any>;
  disabled?: boolean;
  width?: string;
  placeholderText: string;
};

export const AddItemForm = React.memo((props: AddItemFormProps) => {
  const [newTitle, setNewTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const isBlockDragMode = useSelector(appSelectors.isBlockDragMode);
  const onClickAddItemHandler = () => {
    if (newTitle.trim() !== "") {
      props
        .callback(newTitle.trim())
        .then((res) => {
          setNewTitle("");
        })
        .catch((err) => {
          setError(err.messages[0]);
        });
    } else {
      setNewTitle("");
      setError("Title is required");
    }
  };
  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const titleTyping = e.currentTarget.value;
    setNewTitle(titleTyping);
    titleTyping.length !== 0 && setError("");
    dispatch(appActions.changeBlockDragMode({ isBlockDragMode: true }));
  };
  const onEnterKeyAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && onClickAddItemHandler();
  };

  const onFocusHandler = () => {
    dispatch(appActions.changeBlockDragMode({ isBlockDragMode: true }));
  };
  const onBlurHandler = () => {
    dispatch(appActions.changeBlockDragMode({ isBlockDragMode: false }));
  };

  useEffect(() => {
    if (newTitle === "") {
      dispatch(appActions.changeBlockDragMode({ isBlockDragMode: false }));
    }
  }, []);

  return (
    <div style={{ display: "flex", width: props.width }}>
      <TextField
        id="outlined-basic"
        error={!!error}
        label={error ? error : `Type title for ${props.placeholderText}`}
        variant="outlined"
        value={newTitle}
        onChange={onNewTitleChangeHandler}
        onKeyDown={onEnterKeyAddItem}
        className={error ? "error" : ""}
        disabled={props.disabled}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        sx={{ flexBasis: "100%" }}
      />
      <Button onClick={onClickAddItemHandler} variant="contained" style={getStyles(props.disabled)} disabled={props.disabled}>
        +
      </Button>
      {/*{error && <div className={'error-message'}>Title is required</div>}*/}
    </div>
  );
});
