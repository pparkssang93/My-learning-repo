function solution(arr, queries) {
    queries.forEach(([s, e, k]) => {
        arr.slice(s, e + 1).filter((ele, idx) => {
            if (Number.isInteger(idx / k)) {
                arr[idx] += 1;
                return arr;
            }
        });
    });

    return arr;
}

// i 인덱스가 k의 배수인지 확인하기 위해 Number.isInteger 메서드 사용. 배수가 맞으면 정수가 나올 거라고 생각했다.

// 위 코드는 테스트 케이스는 통과인데, 최종에서 정확도가 0%다.

function solution(arr, queries) {
    for (const [s, e, k] of queries) {
        for (let i = s; i <= e; i++) {
            if (i % k === 0) {
                arr[i] += 1;
            }
        }
    }
    return arr;
}

console.log(
    solution(
        [0, 1, 2, 4, 3],
        [
            [0, 4, 1],
            [0, 3, 2],
            [0, 3, 3],
        ]
    )
);
