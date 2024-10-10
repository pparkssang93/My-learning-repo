function solution(intStrs, k, s, l) {
    let answer = [];

    intStrs.forEach((ele) => {
        const toNum = Number(ele.slice(s, s + l));
        return toNum > k ? answer.push(toNum) : null;
    });

    return answer;
}

// 다른 사람 풀이

function solution(intStrs, k, s, l) {
    return intStrs.map((v) => +v.slice(s, s + l)).filter((v) => v > k);
}

// 배열이었는데... 문자열이라고 착각했다... 메소드 체이닝 사용해서 풀었으면 훨씬 깔끔했다. +연산자로 바로 숫자로 변환...

console.log(solution(["0123456789", "9876543210", "9999999999999"], 50000, 5, 5));
