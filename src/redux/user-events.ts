import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";

// Event Object definition -------------------------
interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

// Reducer State definition -------------------------
interface UserEventsState {
  byIds: Record<UserEvent["id"], UserEvent>;
  allIds: UserEvent["id"][];
}

// Initial State ------------------------------------
const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
};

// Action definitions --------------------------------
const LOAD_REQUEST = "userEvent/load_request";
const LOAD_SUCCESS = "userEvent/load_success";
const LOAD_FAILURE = "userEvent/load_failure";

// Action types --------------------------------------
interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}
interface LoadFailureAction extends Action<typeof LOAD_FAILURE> {
  error: string;
}
interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}

// Thunk action type ---------------------------------
type LoadUserThunkType = ThunkAction<
  void,
  RootState,
  undefined,
  LoadRequestAction | LoadSuccessAction | LoadFailureAction
>;

// Thunk action creator ------------------------------
export const loadUserEvents = (): LoadUserThunkType => {
  return async (dispatch, getState) => {
    dispatch({ type: LOAD_REQUEST });
    try {
      const response = await fetch("http://loclhost:3001/events");
      const events: UserEvent[] = await response.json();
      dispatch({ type: LOAD_SUCCESS, payload: { events } });
    } catch (err) {
      dispatch({ type: LOAD_FAILURE, error: "Failed to load events." });
    }
  };
};

// Reducer --------------------------------------------
const userEventsReducer = (
  state: UserEventsState = initialState,
  action: LoadSuccessAction
) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;
      return {
        ...state,
        allIds: events.map((el) => el.id),
        byIds: events.reduce<UserEventsState["byIds"]>((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {}),
      };
    default:
      return state;
  }
};

export default userEventsReducer;
