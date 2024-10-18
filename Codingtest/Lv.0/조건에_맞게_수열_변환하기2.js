function checkArr(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
}

function solution(arr) {
    let count = 0;

    while (true) {
        let newArr = arr.map((ele) => {
            if (ele < 50 && ele % 2 !== 0) {
                return ele * 2 + 1;
            } else if (ele >= 50 && ele % 2 === 0) {
                return ele / 2;
            }

            return ele;
        });

        if (checkArr(arr, newArr)) {
            return count;
        }

        arr = newArr;
        count++;
    }
}

console.log(solution([1, 2, 3, 100, 99, 98]));

// 재귀 함수를 생각했지만, 어떤 기준으로 멈출지 가늠이 안 잡힌다.

// 다른 사람 풀이

function solution(arr) {
    var answer = 0;
    let before = [-1];

    while (!arr.every((e, idx) => e == before[idx])) {
        before = [...arr];

        arr = arr.map((e) => {
            if ((e >= 50) & (e % 2 == 0)) return e / 2;
            if ((e < 50) & (e % 2 != 0)) return e * 2 + 1;
            return e;
        });
        answer++;
    }
    return answer - 1;
}

// while (!arr.every((e, idx) => e == before[idx]))은 arr의 모든 원소가 before 배열의 같은 인덱스 원소와 같지 않을 때까지 반복합니다
