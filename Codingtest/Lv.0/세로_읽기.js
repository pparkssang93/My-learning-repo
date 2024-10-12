function solution(my_string, m, c) {
    let str = [...my_string];
    let answer = [];

    for (let i = 0; i < my_string.length; i += m) {
        let newArr = str.slice(i, i + m);

        answer.push(newArr[c - 1]);
    }

    return m && c === 1 ? my_string : answer.join("");
}

// 위 코드는 정확성 88.9%가 나왔다.... 뭐가 문제지

// 조건문이 문제였다.

function solution(my_string, m, c) {
    let str = [...my_string];
    let answer = [];

    for (let i = 0; i < my_string.length; i += m) {
        let newArr = str.slice(i, i + m);

        answer.push(newArr[c - 1]);
    }

    return answer.join("");
}

// 다른 사람 풀이

function solution(my_string, m, c) {
    return [...my_string].filter((_, i) => i % m === c - 1).join("");
}

// m이 약수로 주어져서 위 코드가 가능한건가??

console.log(solution("ihrhbakrfpndopljhygc", 4, 2));
