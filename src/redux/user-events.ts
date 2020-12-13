import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { selectDateStart } from "./recorder";
import { RootState } from "./store";

// Event Object definition -------------------------
export interface UserEvent {
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

// Action constants --------------------------------
const LOAD_REQUEST = "userEvent/load_request";
const LOAD_SUCCESS = "userEvent/load_success";
const LOAD_FAILURE = "userEvent/load_failure";
const CREATE_REQUEST = "userEvent/create_request";
const CREATE_SUCCESS = "userEvent/create_success";
const CREATE_FAILURE = "userEvent/create_failure";
const DELETE_REQUEST = "userEvent/delete_request";
const DELETE_SUCCESS = "userEvent/delete_success";
const DELETE_FAILURE = "userEvent/delete_failure";

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
interface CreateRequestAction extends Action<typeof CREATE_REQUEST> {}
interface CreateRequestSuccess extends Action<typeof CREATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}
interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {}
interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> {}
interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
  payload: { id: UserEvent["id"] };
}
interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {}

// Thunk action type ---------------------------------
type ThunkActionType<T extends Action> = ThunkAction<
  void,
  RootState,
  undefined,
  T
>;

type LoadUserThunkType = ThunkActionType<
  LoadRequestAction | LoadSuccessAction | LoadFailureAction
>;
type CreateUserThunkType = ThunkActionType<
  CreateRequestAction | CreateRequestSuccess | CreateFailureAction
>;
type DeleteUserThunkType = ThunkActionType<
  DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction
>;

// Thunk action creators ------------------------------
export const loadUserEvents = (): LoadUserThunkType => {
  return async (dispatch, _) => {
    dispatch({ type: LOAD_REQUEST });
    try {
      const response = await fetch("http://localhost:3001/events");
      const events: UserEvent[] = await response.json();
      dispatch({ type: LOAD_SUCCESS, payload: { events } });
    } catch (err) {
      dispatch({ type: LOAD_FAILURE, error: "Failed to load events." });
    }
  };
};

export const createUserEvent = (): CreateUserThunkType => {
  return async (dispatch, getState) => {
    dispatch({ type: CREATE_REQUEST });
    try {
      const dateStart = selectDateStart(getState());
      const event: Omit<UserEvent, "id"> = {
        title: "No name",
        dateStart,
        dateEnd: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3001/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      const createdEvent: UserEvent = await response.json();
      dispatch({ type: CREATE_SUCCESS, payload: { event: createdEvent } });
    } catch (err) {
      dispatch({ type: CREATE_FAILURE });
    }
  };
};

export const deleteUserEvent = (id: UserEvent["id"]): DeleteUserThunkType => {
  return async (dispatch, getState) => {
    dispatch({ type: DELETE_REQUEST });

    try {
      const response = await fetch(`http://localhost:3001/events${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        dispatch({ type: DELETE_SUCCESS, payload: { id: id } });
      }
    } catch (err) {
      dispatch({ type: DELETE_FAILURE });
    }
  };
};

// Selector functions -------------------------------
const selectUserEventsState = (rootState: RootState) => rootState.userEvents;

export const selectUserEventsArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map((id) => state.byIds[id]);
};

// Reducer --------------------------------------------
const userEventsReducer = (
  state: UserEventsState = initialState,
  action: LoadSuccessAction | CreateRequestSuccess | DeleteSuccessAction
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
    case CREATE_SUCCESS:
      const { event } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, event.id],
        byIds: { ...state.byIds, [event.id]: event },
      };
    case DELETE_SUCCESS:
      const { id } = action.payload;
      const newState = {
        ...state,
        byIds: { ...state.byIds },
        allIds: state.allIds.filter((el) => el !== id),
      };
      delete newState.byIds[id];
      return newState;
    default:
      return state;
  }
};

export default userEventsReducer;
