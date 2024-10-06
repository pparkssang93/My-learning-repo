function solution(arr, queries) {
    for (let i = 0; i < queries.length; i++) {
        const [q0, q1] = queries[i];

        const originQ0 = arr[q0];
        const originQ1 = arr[q1];

        arr[q0] = originQ1;
        arr[q1] = originQ0;
    }

    return arr;
}

console.log(
    solution(
        [0, 1, 2, 3, 4],
        [
            [0, 3],
            [1, 2],
            [1, 4],
        ]
    )
);

// 다른 사람 풀이

function solution(arr, queries) {
    queries.forEach(([a, b]) => {
        [arr[a], arr[b]] = [arr[b], arr[a]];
    });
    return arr;
}

// WOW...비구조화 할당을 저런식으로도 사용할 수 있구만
