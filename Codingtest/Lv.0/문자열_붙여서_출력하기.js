// 템플릿
// const readline = require("readline");
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// let input = [];

// rl.on("line", function (line) {
//     input = line.split(" ");
// }).on("close", function () {
//     str1 = input[0];
//     str2 = input[1];
// });

// 나의 풀이

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on("line", function (line) {
    line = line.split(" ").join("");
    console.log(line);
});

// 다른 사람 풀이

// const readline = require("readline");
// const rl = readline
//     .createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     })
//     .on("line", function (line) {
//         const strArr = line.split(" ");
//         console.log(strArr.join(""));
//     });
