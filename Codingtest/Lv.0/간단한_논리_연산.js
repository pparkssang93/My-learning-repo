function solution(x1, x2, x3, x4) {
    let x = x1 || x2;
    let y = x3 || x4;

    return x && y;
}

console.log(solution(true, false, false, false));

// 다른 사람 풀이

function solution(x1, x2, x3, x4) {
    return (x1 || x2) && (x3 || x4);
}
