function solution(n) {
    let answer = [];

    while (n !== 1) {
        if (n % 2 === 0) {
            answer.push(n);
            n /= 2;
        } else if (n % 2 !== 0) {
            answer.push(n);
            n = 3 * n + 1;
        }
    }

    if (n === 1) {
        answer.push(1);
    }

    return answer;
}

console.log(solution(10));

// 다른 사람 풀이

function solution(n, arr = []) {
    arr.push(n);
    if (n === 1) return arr;
    if (n % 2 === 0) return solution(n / 2, arr);
    return solution(3 * n + 1, arr);
}

// 재귀 함수를 이럴 때 사용해도 되는거구나...
