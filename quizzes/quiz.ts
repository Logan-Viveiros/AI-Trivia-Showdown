export interface Quiz {
  name: string;
  id: string;
  questions: Question[];
}

export interface Question {
  question: string;
  answers: string[];
  correct: number[];
}