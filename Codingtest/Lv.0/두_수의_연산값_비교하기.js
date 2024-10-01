// 템플릿

// function solution(a, b) {
//     var answer = 0;
//     return answer;
// }

// 나의 풀이
function solution(a, b) {
    let answer = Math.max(Number(`${a}${b}`), 2 * a * b);

    return answer;
}

solution(2, 91);

// 다른 사람 풀이

function solution(a, b) {
    let num1 = parseInt(a + "" + b + "");
    let num2 = 2 * a * b;
    return num1 > num2 ? num1 : num2;
}
