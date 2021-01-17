export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  category: "string";
  correct_answer: string;
  difficulty: Difficulty;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export type Category = {
  id: number;
  name: string;
};
