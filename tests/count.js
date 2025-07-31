import { readFile } from "fs/promises";

function occurrences(string, subString) {
  if (subString.length <= 0) return string.length + 1;
  var n = 0,
    pos = 0;
  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += subString.length;
    } else break;
  }
  return n;
}

const paths = [
  "index.test.js",
  "resolver.test.js",
  "tokenizer.test.js",
  "utils.test.js",
];
async function countOccurrences(words) {
  let count = 0;
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const str = await readFile("./tests/" + path);
    for (let j = 0; j < words.length; j++) {
      count += occurrences(str, words[j]);
    }
  }
  return count;
}

let count = await countOccurrences(["describe", "it"]);
console.log("Test Amount: " + count);
count = await countOccurrences([
  "ok",
  "equal",
  "throws",
  "doesNotThrow",
  "deepEqual",
]);
console.log("Assertion Amount: " + count);
