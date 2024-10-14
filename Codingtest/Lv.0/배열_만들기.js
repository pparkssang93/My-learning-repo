function solution(n, k) {
    let answer = [];

    for (let i = 1; i * k <= n; i++) {
        answer.push(i * k);
    }

    return answer;
}

console.log(solution(10, 3));

// 다른 사람 풀이

function solution(n, k) {
    var answer = [];
    for (let i = k; i <= n; i += k) {
        answer.push(i);
    }
    return answer;
}
