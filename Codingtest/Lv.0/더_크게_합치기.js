// 템플릿
// function solution(a, b) {
//     var answer = 0;
//     return answer;
// }

// 나의 풀이
function solution(a, b) {
    const aPlusB = Number(`${a}${b}`);
    const bPlusA = Number(`${b}${a}`);
    let answer = 0;

    if (aPlusB > bPlusA) {
        answer = aPlusB;
        return answer;
    } else if (aPlusB === bPlusA) {
        answer = aPlusB;
        return answer;
    } else {
        answer = bPlusA;
        return answer;
    }
}

solution(9, 91);

// 다른 사람 풀이
function solution(a, b) {
    return Math.max(Number(`${a}${b}`), Number(`${b}${a}`));
}
