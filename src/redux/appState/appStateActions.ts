import {
  SetRequestActive,
  SetLoading,
  SetSavingToCloud,
} from "./appStateTypes";

export const setLoading = (isLoading: boolean): SetLoading => ({
  type: "SET_LOADING",
  payload: isLoading,
});

export const setRequestActive = (
  isRequestActive: boolean
): SetRequestActive => ({
  type: "SET_REQUEST_ACTIVE",
  payload: isRequestActive,
});

export const setSavingToCloud = (
  isSavingToCloud: boolean
): SetSavingToCloud => ({
  type: "SET_SAVING_TO_CLOUD",
  payload: isSavingToCloud,
});
