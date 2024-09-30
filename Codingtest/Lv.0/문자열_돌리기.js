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
const rl = readline
    .createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    .on("line", function (line) {
        line = line.split("").join("\n");
        console.log(line);
    });

// 다른 사람 풀이

// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// let input = [];

// rl.on('line', function (line) {
//     input = [line];
// }).on('close',function(){
//     str = input[0];
//     [...str].forEach(c => console.log(c))
// });
