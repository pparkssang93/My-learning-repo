function solution(numLog) {
    let answer = [];

    numLog.reduce((acc, curr) => {
        if (acc + 1 === curr) {
            answer.push("w");
            acc += 1;

            return acc;
        } else if (acc - 1 === curr) {
            answer.push("s");
            acc -= 1;

            return acc;
        } else if (acc + 10 === curr) {
            answer.push("d");
            acc += 10;

            return acc;
        } else if (acc - 10 === curr) {
            answer.push("a");
            acc -= 10;

            return acc;
        }
    });

    return answer.join("");
}

console.log(solution([0, 1, 0, 10, 0, 1, 0, 10, 0, -1, -2, -1]));

// 더해진 값이나 뺴진 값을 어떻게 구해야 할지 잘 모르겠다. -> 1, -1, 10, -10 그 다음 값과 비교해서 얼마나 더해지고 빼졌는지 확인할 수 있었다.

// 다른 사람 풀이

function solution(numLog) {
    const convert = {
        1: "w",
        "-1": "s",
        10: "d",
        "-10": "a",
    };

    // ESLint나 프리티어 때문에 1, 10 키값의 큰 따옴표가 사라지는 것 같다.

    return numLog
        .slice(1)
        .map((v, i) => {
            return convert[v - numLog[i]];
        })
        .join("");
}

// 배열 인덱스의 앞과 뒤를 비교해서 합과 차를 구했네.... wow
