function solution(q, r, code) {
    let newCode = [...code];

    return newCode.filter((_, i) => i % q === r).join("");
}

console.log(solution(3, 1, "qjnwezgrpirldywt"));

// 다른 사람 풀이

function solution(q, r, code) {
    return [...code].filter((_, i) => i % q === r).join("");
}

function solution(q, r, code) {
    let answer = "";
    for (let i = r; i < code.length; i += q) answer += code[i];
    return answer;
}
