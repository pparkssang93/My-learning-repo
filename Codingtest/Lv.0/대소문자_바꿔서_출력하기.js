// 템플릿

// const readline = require("readline");
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// let input = [];

// rl.on("line", function (line) {
//     input = [line];
// }).on("close", function () {
//     str = input[0];
// });

// 나의 풀이
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
    input = [line];
}).on("close", function () {
    str = input[0];

    str.split("").map((ele) => {
        if (ele.toUpperCase() === ele) {
            return ele.toLowerCase();
        } else {
            return ele.toUpperCase();
        }
    });

    console.log(str.join(""));
});

// 다른 사람 풀이

// const readline = require("readline");
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// let input = [];

// rl.on("line", function (line) {
//     input = [line];
// }).on("close", function () {
//     str = input[0].split("");
//     str.forEach((value, index) => {
//         if (value === value.toUpperCase()) {
//             str[index] = value.toLowerCase();
//         } else {
//             str[index] = value.toUpperCase();
//         }
//     });
//     console.log(str.join(""));
// });
