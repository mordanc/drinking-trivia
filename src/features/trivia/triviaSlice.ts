import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { HttpService } from "../../httpService";
import { Question } from "./types";

interface TriviaState {
  value: number;
  question: Question | undefined;
  loading: boolean;
}

const initialState: TriviaState = {
  value: 0,
  question: undefined,
  loading: false,
};

export const triviaSlice = createSlice({
  name: "trivia",
  initialState,
  reducers: {
    updateQuestion: (state, action: PayloadAction<Question>) => {
      return { ...state, question: action.payload };
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      return { ...state, loading: action.payload };
    },
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  updateQuestion,
  setIsLoading,
} = triviaSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = (amount: number): AppThunk => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

export const fetchQuestion = (): AppThunk => (dispatch) => {
  dispatch(setIsLoading(true));
  HttpService.fetchToken()
    .then((response) => HttpService.fetchQuestion(response.token))
    .then((response) => {
      dispatch(setIsLoading(false));
      dispatch(updateQuestion(response.results[0]));
    });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.trivia.value)`
export const selectCount = (state: RootState) => state.trivia.value;
export const selectQuestion = (state: RootState) => state.trivia.question;
export const selectIsLoading = (state: RootState) => state.trivia.loading;

export default triviaSlice.reducer;
