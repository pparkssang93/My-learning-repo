function solution(arr, queries) {
    let answer = [];

    queries.forEach(([a, b, c]) => {
        const sliceArr = arr.slice(a, b + 1);

        const filterArr = sliceArr.filter((num) => num > c);

        if (filterArr.length > 0) {
            return answer.push(Math.min(...filterArr));
        } else {
            return answer.push(-1);
        }
    });

    return answer;
}

console.log(
    solution(
        [0, 1, 2, 4, 3],
        [
            [0, 4, 2],
            [0, 3, 2],
            [0, 2, 2],
        ]
    )
);

// 최대값보다 작은 값을 어떻게 구해야 할 지 잘 모르겠다. -> 기준 값보다 높은 숫자를 필터링해서 거기서 최소값을 구함

// 다른 사람 풀이

function solution(arr, queries) {
    return queries.map(
        ([s, e, k]) =>
            arr
                .slice(s, e + 1)
                .filter((n) => n > k)
                .sort((a, b) => a - b)[0] || -1
    );
}
