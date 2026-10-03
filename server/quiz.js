export const QUIZ_SIZE = 10;

export function validateQuizAnswers(answers) {
  if (!Array.isArray(answers) || answers.length !== QUIZ_SIZE) {
    throw Object.assign(new Error(`Submit exactly ${QUIZ_SIZE} answers.`), {
      statusCode: 400,
    });
  }

  const questionIds = new Set();
  for (const answer of answers) {
    if (
      !answer ||
      !Number.isInteger(answer.questionId) ||
      answer.questionId < 1 ||
      !Number.isInteger(answer.selectedOption) ||
      answer.selectedOption < 0
    ) {
      throw Object.assign(new Error('Each answer must include a valid questionId and selectedOption.'), {
        statusCode: 400,
      });
    }
    if (questionIds.has(answer.questionId)) {
      throw Object.assign(new Error('A question can only be answered once.'), {
        statusCode: 400,
      });
    }
    questionIds.add(answer.questionId);
  }

  return answers;
}

export function gradeQuizAnswers(answers, questions) {
  validateQuizAnswers(answers);
  if (!Array.isArray(questions) || questions.length !== QUIZ_SIZE) {
    throw Object.assign(new Error('The quiz question set is incomplete or has changed.'), {
      statusCode: 400,
    });
  }

  const questionById = new Map(questions.map((question) => [question.id, question]));
  const correctAnswers = {};
  let score = 0;

  for (const answer of answers) {
    const question = questionById.get(answer.questionId);
    if (!question) {
      throw Object.assign(new Error('One or more submitted questions are invalid.'), {
        statusCode: 400,
      });
    }
    if (
      !Array.isArray(question.options) ||
      !Number.isInteger(question.correct) ||
      question.correct < 0 ||
      question.correct >= question.options.length
    ) {
      throw new Error(`Question ${question.id} has invalid answer data.`);
    }
    if (answer.selectedOption >= question.options.length) {
      throw Object.assign(new Error('A selected option is outside the question’s options.'), {
        statusCode: 400,
      });
    }

    correctAnswers[question.id] = question.correct;
    if (answer.selectedOption === question.correct) score += 1;
  }

  return { score, total: QUIZ_SIZE, correctAnswers };
}
