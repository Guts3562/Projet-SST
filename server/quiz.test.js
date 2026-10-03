import assert from 'node:assert/strict';
import test from 'node:test';
import { gradeQuizAnswers, QUIZ_SIZE, validateQuizAnswers } from './quiz.js';

const questions = Array.from({ length: QUIZ_SIZE }, (_, index) => ({
  id: index + 1,
  options: ['A', 'B', 'C', 'D'],
  correct: index % 4,
}));

const answersFor = (selectedOption = 0) =>
  questions.map((question) => ({
    questionId: question.id,
    selectedOption,
  }));

test('grades submitted answers against the server question bank', () => {
  const answers = questions.map((question) => ({
    questionId: question.id,
    selectedOption: question.correct,
  }));

  assert.deepEqual(gradeQuizAnswers(answers, questions), {
    score: QUIZ_SIZE,
    total: QUIZ_SIZE,
    correctAnswers: Object.fromEntries(
      questions.map((question) => [question.id, question.correct]),
    ),
  });
});

test('rejects a client-supplied score instead of answer details', () => {
  assert.throws(
    () => validateQuizAnswers({ score: 10, total: 10 }),
    { statusCode: 400 },
  );
});

test('rejects incomplete, duplicate, malformed, and out-of-range submissions', () => {
  assert.throws(() => validateQuizAnswers(answersFor().slice(0, -1)), {
    statusCode: 400,
  });

  const duplicate = answersFor();
  duplicate[1].questionId = duplicate[0].questionId;
  assert.throws(() => validateQuizAnswers(duplicate), { statusCode: 400 });

  const malformed = answersFor();
  malformed[0].selectedOption = -1;
  assert.throws(() => validateQuizAnswers(malformed), { statusCode: 400 });

  const outOfRange = answersFor();
  outOfRange[0].selectedOption = 4;
  assert.throws(() => gradeQuizAnswers(outOfRange, questions), {
    statusCode: 400,
  });
});

test('rejects questions not belonging to the server question set', () => {
  const answers = answersFor();
  answers[0].questionId = 999;
  assert.throws(() => gradeQuizAnswers(answers, questions), {
    statusCode: 400,
  });
});
