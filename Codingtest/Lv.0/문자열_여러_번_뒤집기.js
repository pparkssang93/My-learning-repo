function solution(my_string, queries) {
    let splitStr = my_string.split("");

    for (const [s, e] of queries) {
        const subArray = splitStr.slice(s, e + 1).reverse();

        for (let i = 0; i < subArray.length; i++) {
            splitStr[s + i] = subArray[i];
        }
    }

    return splitStr.join("");
}

// 문자열은 불변값이니까, 새로운 문자열을 생성해줘야한다.

// 다른 사람 풀이

function solution(my_string, queries) {
    let str = my_string.split("");
    queries.forEach(([start, end]) => {
        const changeStr = str.slice(start, end + 1);

        str.splice(start, changeStr.length, ...changeStr.reverse());
    });
    return str.join("");
}

// splice에 대해 더 배울 수 있었다...

function solution(my_string, queries) {
    const str = [...my_string];

    queries.forEach(([s, e]) => {
        while (s < e) {
            [str[s], str[e]] = [str[e], str[s]];

            s++;
            e--;
        }
    });
    return str.join("");
}

console.log(
    solution("rermgorpsam", [
        [2, 3],
        [0, 7],
        [5, 9],
        [6, 10],
    ])
);

// 구조 분해 할당이 진짜 최고네...
