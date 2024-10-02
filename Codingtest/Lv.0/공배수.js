// 나의 풀이

function solution(number, n, m) {
    if (number % n !== 0) {
        return 0;
    } else if (number % m !== 0) {
        return 0;
    } else {
        return 1;
    }
}

solution(60, 2, 3);
solution(55, 10, 5);

// 다른 사람 풀이
function solution(number, n, m) {
    return +!(number % n || number % m);
}

function solution(number, n, m) {
    return number % n === 0 ? (number % m === 0 ? 1 : 0) : 0;
}

function solution(number, n, m) {
    return number % n === 0 && number % m === 0 ? 1 : 0;
}
