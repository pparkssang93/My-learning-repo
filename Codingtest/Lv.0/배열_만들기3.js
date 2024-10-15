function solution(arr, intervals) {
    let answer = [];

    intervals.forEach(([a, b]) => {
        for (let i = a; i <= b; i++) {
            answer.push(arr[i]);
        }
    });

    return answer;
}

console.log(
    solution(
        [1, 2, 3, 4, 5],
        [
            [1, 3],
            [0, 4],
        ]
    )
);

// 다른 사람 풀이

function solution(arr, intervals) {
    const [[a, b], [c, d]] = intervals;

    return [...arr.slice(a, b + 1), ...arr.slice(c, d + 1)];
}

// slice와 전개 구문을 이용해 배열을 합칠 수 있구나...
// 원래는 slice를 사용했더니 2중 배열이 나와서 저 위 코드로 변경했는데... wow
