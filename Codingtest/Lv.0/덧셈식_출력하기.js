// 템플릿

// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// let input = [];

// rl.on('line', function (line) {
//     input = line.split(' ');
// }).on('close', function () {
//     console.log(Number(input[0]) + Number(input[1]));
// });

// 나의 풀이

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let input = ["4 5"];
let a, b;

rl.on("line", function (line) {
    [a, b] = line.split(" ");
}).on("close", function () {
    console.log(`${a} + ${b} = ${Number(a) + Number(b)}`);
});

// 다른 사람 풀이

// const readline = require("readline");
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// let a, b;

// rl.on("line", function (line) {
//     [a, b] = line.split(" ").map(Number);
// }).on("close", function () {
//     console.log(`${a} + ${b} = ${a + b}`);
// });
