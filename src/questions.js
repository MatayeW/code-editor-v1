const questions = [
  {
    id: 1,
    title: "Sum to N",
    concept: "Loops",
    difficulty: "Easy",
    xp: 30,
    description:
      "Write a function sumToN(n) that returns the sum of all whole numbers from 1 up to n. If n is 0, return 0.",
    functionName: "sumToN",
    starterCode: "function sumToN(n) {\n  // write your code here\n\n}",
    hint: "Start with a total of 0, then use a for loop from 1 up to n and add each number to the total.",
    visibleTests: [
      { input: [5], expected: 15 },
      { input: [1], expected: 1 },
      { input: [10], expected: 55 },
    ],
    hiddenTests: [
      { input: [0], expected: 0 },
      { input: [100], expected: 5050 },
    ],
  },
  {
    id: 2,
    title: "Vowel Counter",
    concept: "Strings",
    difficulty: "Easy",
    xp: 30,
    description:
      "Write a function vowelCount(text) that returns how many vowels (a, e, i, o, u) are in the text. Capital letters count too.",
    functionName: "vowelCount",
    starterCode: "function vowelCount(text) {\n  // write your code here\n\n}",
    hint: "Change the text to lowercase first, then check each letter to see if it is one of the letters in 'aeiou'.",
    visibleTests: [
      { input: ["hello"], expected: 2 },
      { input: ["JavaScript"], expected: 3 },
      { input: ["rhythm"], expected: 0 },
    ],
    hiddenTests: [
      { input: [""], expected: 0 },
      { input: ["AEIOU aeiou"], expected: 10 },
    ],
  },
  {
    id: 3,
    title: "Remove Duplicates",
    concept: "Arrays",
    difficulty: "Easy",
    xp: 40,
    description:
      "Write a function removeDuplicates(arr) that returns a new array with the repeated values removed. Keep the first time each value appears, in the same order.",
    functionName: "removeDuplicates",
    starterCode:
      "function removeDuplicates(arr) {\n  // write your code here\n\n}",
    hint: "A Set only keeps unique values. Try turning the array into a Set, then back into an array.",
    visibleTests: [
      { input: [[1, 2, 2, 3, 3, 3]], expected: [1, 2, 3] },
      { input: [["a", "b", "a"]], expected: ["a", "b"] },
      { input: [[5, 5, 5]], expected: [5] },
    ],
    hiddenTests: [
      { input: [[]], expected: [] },
      { input: [[4, 1, 4, 2, 1]], expected: [4, 1, 2] },
    ],
  },
];

export default questions;