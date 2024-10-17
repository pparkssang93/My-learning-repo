function solution(arr, queries) {
    queries.forEach(([s, e]) => {
        for (let i = s; i <= e; i++) {
            arr[i] += 1;
        }
    });

    return arr;
}

console.log(
    solution(
        [0, 1, 2, 3, 4],
        [
            [0, 1],
            [1, 2],
            [2, 3],
        ]
    )
);

// 다른 사람 풀이

function solution(arr, queries) {
    queries.forEach(([s, e]) => {
        while (s <= e) arr[s++]++;
    });
    return arr;
}

function solution(arr, queries) {
    for (let [s, e] of queries) for (let i = s; i <= e; i++) arr[i]++;
    return arr;
}
