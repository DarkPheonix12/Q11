import { AppStateActionTypes, AppState } from "./appStateTypes";

const appState: AppState = {
  loading: true, // set to true by default, gets set to false when firebase onAuthStateChange finishes initialization
  isRequestActive: false,
  isSavingToCloud: false,
};

const appStateReducer = (
  state = appState,
  action: AppStateActionTypes
): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_REQUEST_ACTIVE":
      return {
        ...state,
        isRequestActive: action.payload,
      };
    case "SET_SAVING_TO_CLOUD":
      return {
        ...state,
        isSavingToCloud: action.payload,
      };
    default:
      return state;
  }
};

export default appStateReducer;
