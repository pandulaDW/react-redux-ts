import { Action } from "redux";
import { RootState } from "./store";

interface RecorderState {
  dateStart: string;
}

// Actions -----
const START = "recorder/start";
const STOP = "recorder/stop";

// Action types -----
type StartAction = Action<typeof START>;
type StopAction = Action<typeof STOP>;
type Actions = StartAction | StopAction;

// action creators --------
export const start = (): StartAction => ({
  type: START,
});

export const stop = (): StopAction => ({
  type: STOP,
});

// initial state
const initialState: RecorderState = {
  dateStart: "",
};

// selector functions
export const selectRecorderState = (rootState: RootState) => rootState.recorder;
export const selectDateStart = (rootState: RootState) =>
  selectRecorderState(rootState).dateStart;

// reducer --------
const recorderReducer = (
  state: RecorderState = initialState,
  action: Actions
) => {
  switch (action.type) {
    case START:
      return { ...state, dateStart: new Date().toISOString() };
    case STOP:
      return { ...state, dateStart: "" };
    default:
      return state;
  }
};

export default recorderReducer;
