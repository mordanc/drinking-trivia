import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import triviaReducer from "../components/triviaSlice";

export const store = configureStore({
  reducer: {
    trivia: triviaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
