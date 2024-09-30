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
//     n = Number(input[0]);
// });

//  나의 풀이
const readline = require("readline");
const rl = readline
    .createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    .on("line", function (line) {
        line % 2 === 0 ? console.log(`${line} is even`) : console.log(`${line} is odd`);
    });

// 다른 사람 풀이

// const readline = require("readline");
// const rl = readline
//     .createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     })
//     .on("line", function (line) {
//         const result = Number(line) % 2 ? "odd" : "even";
//         console.log(line, "is", result);
//     });

//  -----------------------------------------

// rl.on('line', function (line) {
//     input = line.split(' ');
// }).on('close', function () {
//     n = Number(input[0]);
//     let str = n;
//     str += (n%2===0) ? " is even" : " is odd";
//     console.log(str);
// });
