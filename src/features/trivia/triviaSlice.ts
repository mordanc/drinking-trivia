import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { HttpService } from "../../httpService";
import { Category, Question } from "./types";

interface TriviaState {
  question: Question | undefined;
  loading: boolean;
  selectedAnswer: string;
  selectedCategories: Category[];
  allCategories: Category[];
}

const initialState: TriviaState = {
  question: undefined,
  loading: false,
  selectedAnswer: "",
  selectedCategories: [],
  allCategories: [],
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
    setSelectedAnswer: (state, action: PayloadAction<string>) => {
      return { ...state, selectedAnswer: action.payload };
    },
    setSelectedCategories: (state, action: PayloadAction<Category[]>) => {
      return { ...state, selectedCategories: action.payload };
    },
    setAllCategories: (state, action: PayloadAction<Category[]>) => {
      return { ...state, allCategories: action.payload };
    },
  },
});

export const {
  updateQuestion,
  setIsLoading,
  setSelectedAnswer,
  setSelectedCategories,
  setAllCategories,
} = triviaSlice.actions;

function pickCategory(selectedCategories) {
  var index = Math.floor(Math.random() * selectedCategories.length);
  console.log("PICK CATEGORY: " + selectedCategories[index].name);
  return selectedCategories[index].id;
}

export const fetchQuestion = (): AppThunk => (dispatch, getState) => {
  const state = getState();

  dispatch(setSelectedAnswer(""));
  dispatch(setIsLoading(true));

  const selectedCategories = selectSelectedCategories(state);
  const category = selectedCategories.length
    ? pickCategory(selectedCategories)
    : null;

  HttpService.fetchToken()
    .then((response) => HttpService.fetchQuestion(response.token, category))
    .then((response) => {
      dispatch(setIsLoading(false));
      dispatch(updateQuestion(response.results[0]));
    });
};

export const fetchCategories = (): AppThunk => (dispatch) => {
  HttpService.fetchCategories().then((response) => {
    const categories = response.trivia_categories
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB)
          //sort string ascending
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      })
      .map((category) => ({ ...category, selected: true }));

    dispatch(setAllCategories(categories));
  });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.trivia.value)`
export const selectQuestion = (state: RootState) => state.trivia.question;
export const selectIsLoading = (state: RootState) => state.trivia.loading;
export const selectSelectedAnswer = (state: RootState) =>
  state.trivia.selectedAnswer;
export const selectSelectedCategories = (state: RootState) => {
  const allCategories = selectAllCategories(state);
  const selectedCategories = allCategories.filter(
    (category) => category.selected
  );

  return selectedCategories;
};
export const selectAllCategories = (state: RootState) =>
  state.trivia.allCategories;

export default triviaSlice.reducer;
