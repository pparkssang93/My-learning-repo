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
//     str = input[0];
//     n = Number(input[1]);
// });

// 나의 풀이

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
    const [str, count] = line.split(" ");
    console.log(str.repeat(count));
});

// 다른 사람 풀이

// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// let input = [];

// rl.on('line', function (line) {
//     input = line.split(' ');
// }).on('close', function () {
//     str = input[0];
//     n = Number(input[1]);
//     console.log(str.repeat(n));
// });
