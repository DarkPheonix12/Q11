export const SET_LOADING = "SET_LOADING";
export const SET_REQUEST_ACTIVE = "SET_REQUEST_ACTIVE";
export const SET_OVERLAY_VISIBILITY = "SET_OVERLAY_VISIBILITY";
export const SET_SAVING_TO_CLOUD = "SET_SAVING_TO_CLOUD";

export interface AppState {
  loading: boolean;
  isRequestActive: boolean;
  isSavingToCloud: boolean;
}

export interface SetLoading {
  type: typeof SET_LOADING;
  payload: boolean;
}

export interface SetRequestActive {
  type: typeof SET_REQUEST_ACTIVE;
  payload: boolean;
}

export interface SetSavingToCloud {
  type: typeof SET_SAVING_TO_CLOUD;
  payload: boolean;
}

export type AppStateActionTypes =
  | SetLoading
  | SetRequestActive
  | SetSavingToCloud;
