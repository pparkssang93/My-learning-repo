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
//     console.log(Number(input[0]) + Number(input[1]));
// });

// 나의 풀이

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
    input = line.split(" ");
}).on("close", function () {
    input[0] = `a = ${input[0]} \n`;
    input[1] = `b = ${input[1]}`;
    console.log(input[0] + input[1]);
});

// 다른 사람 풀이

// const readline = require("readline");
// const rl = readline
//     .createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     })
//     .on("line", function (line) {
//         const [a, b] = line.split(" ");
//         console.log("a =", a);
//         console.log("b =", b);
//     });

// 구조 분해 할당을 이용하니까 더 간단하게 해결 할 수 있다.
