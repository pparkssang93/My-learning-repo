function solution(my_string) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    const alphabetObj = [...alphabet].reduce((acc, curr) => {
        acc[curr] = 0;
        return acc;
    }, {});

    [...my_string].forEach((ele) => {
        alphabetObj[ele] += 1;
    });

    return Object.values(alphabetObj);
}

// 다른 사람 풀이

function solution(m) {
    var answer = [];
    let al = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let a = [];
    a.length = 52;
    a.fill(0);

    m.split("").map((n) => {
        a[al.indexOf(n)] += 1;
    });

    return a;
}

// length 속성에 값을 할당할 수 있구나...
// al.indexOf를 통해 답 배열에 숫자를 더하고 있다... 와우

console.log(solution("Programmers"));
