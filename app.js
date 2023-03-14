// const assessmentData = [
//   { questionId: '27ge8yw7ee98w99ew', answer: 1, subjectId: 'yyw673262yg3g287' },
//   { questionId: '27ge8yw7ee98339ew', answer: 2, subjectId: 'yyw673262113g287' },
//   { questionId: '27ge8yw7ee98229ew', answer: 0, subjectId: 'yyw673262233g287' },
//   { questionId: '27ge8yw7ee98wr9ew', answer: 1, subjectId: 'yyw673262453g287' },
//   { questionId: '27ge8yw7ee98ww9ew', answer: 3, subjectId: 'yyw673262893g287' },
// ];

// for (let answer of assessmentData) {
//   if (answer.answer === 1) {
//     answer.correct = true;
//   } else {
//     answer.correct = false;
//   }
// }

// console.log(assessmentData);

function validateBirthDay(dateString) {
  const timestamp = 473040000000; // timestamp for 15 years

  let birthDayInMillis = new Date(dateString).getTime();

  birthDayInMillis = Date.now() - birthDayInMillis;

  if (birthDayInMillis >= timestamp) {
    return null;
  } else {
    return 'You must be 15 years or older';
  }
}

console.log(validateBirthDay('1994-03-17'));

const today = new Date().toLocaleDateString();
console.log(today);
