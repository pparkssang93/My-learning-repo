function solution(num, n) {
    let answer = num % n === 0 ? 1 : 0;

    return answer;
}

solution(98, 2);
solution(34, 3);

// 다른 사람 풀이

function solution(num, n) {
    return num % n === 0 ? 1 : 0;
}
