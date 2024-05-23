import { appActions, AppInitialState, appSlice, ServerResponseStatusType } from "../../redux/appSlice";
let startState: AppInitialState;
beforeEach(() => {
  startState = {
    statusTodo: "idle",
    statusTask: "idle",
    addStatus: "idle",
    error: null,
    isInitialized: false,
    searchQuery: "",
    isBlockDragMode: false,
  };
});

test("correct error should be set", () => {
  const endState = appSlice(startState, appActions.setAppError({ error: "test error" }));
  expect(endState.error).toBe("test error");
});

test("correct status should be set", () => {
  const endState = appSlice(startState, appActions.setAppStatus({ appStatus: "loading" }));
  expect(endState.addStatus).toBe("loading");
});
