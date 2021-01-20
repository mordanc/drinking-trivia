import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { HttpService } from "../httpService";
import { Category, Question } from "./types";

interface TriviaState {
  question: Question | undefined;
  loading: boolean;
  selectedAnswer: string;
  selectedCategories: Category[];
  allCategories: Category[];
  isHost: boolean;
  roomName: string;
  connectedUsers: any[];
  userBetAmount: number;
  isHotseat: boolean;
}

const initialState: TriviaState = {
  question: undefined,
  loading: false,
  selectedAnswer: "",
  selectedCategories: [],
  allCategories: [],
  isHost: false,
  roomName: "",
  connectedUsers: [],
  userBetAmount: 0,
  isHotseat: false,
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
    setIsHost: (state, action: PayloadAction<boolean>) => {
      return { ...state, isHost: action.payload };
    },
    setRoomName: (state, action: PayloadAction<string>) => {
      return { ...state, roomName: action.payload };
    },
    addUserToList: (state, action: PayloadAction<any>) => {
      const user = action.payload;
      const newList = [...state.connectedUsers];
      newList.push(user);

      return { ...state, connectedUsers: newList };
    },
    removeUserFromList: (state, action: PayloadAction<any>) => {
      const user = action.payload;
      const newList = state.connectedUsers.filter(({ id }) => id !== user.id);

      return { ...state, connectedUsers: newList };
    },
    updateUserBetAmount: (state, action: PayloadAction<number>) => {
      return { ...state, userBetAmount: action.payload };
    },
    updateIsHotseat: (state, action: PayloadAction<boolean>) => {
      return { ...state, isHotseat: action.payload };
    },
  },
});

export const {
  updateQuestion,
  setIsLoading,
  setSelectedAnswer,
  setSelectedCategories,
  setAllCategories,
  setIsHost,
  setRoomName,
  addUserToList,
  removeUserFromList,
  updateUserBetAmount,
  updateIsHotseat,
} = triviaSlice.actions;

function pickCategory(selectedCategories) {
  var index = Math.floor(Math.random() * selectedCategories.length);
  console.log("PICK CATEGORY: " + selectedCategories[index].name);
  return selectedCategories[index].id;
}

export const fetchQuestion = (emitFn): AppThunk => (dispatch, getState) => {
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
      emitFn(response.results[0]);
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
export const selectIsHost = (state: RootState) => state.trivia.isHost;
export const selectRoomName = (state: RootState) => state.trivia.roomName;
export const selectConnectedUsers = (state: RootState) =>
  state.trivia.connectedUsers;
export const selectUserBetAmount = (state: RootState) =>
  state.trivia.userBetAmount;
export const selectIsHotseat = (state: RootState) => state.trivia.isHotseat;

export default triviaSlice.reducer;
