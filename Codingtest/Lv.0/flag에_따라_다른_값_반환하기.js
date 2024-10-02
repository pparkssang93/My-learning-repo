function solution(a, b, flag) {
    return flag ? a + b : a - b;
}

solution(-4, 7, true);

console.log(solution(-4, 7, true));

// 다른 사람 풀이

const solution = (a, b, flag) => (flag ? a + b : a - b);
