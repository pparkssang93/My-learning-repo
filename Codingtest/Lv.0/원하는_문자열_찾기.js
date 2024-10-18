function solution(myString, pat) {
    if (pat.length > myString.length) return 0;

    const strLowerCase = myString.toLowerCase();
    const patLowerCase = pat.toLowerCase();

    return strLowerCase.includes(patLowerCase) ? 1 : 0;
}

console.log(solution("aaAA", "aaaaa"));

// 다른 사람 풀이

function solution(myString, pat) {
    return myString.toUpperCase().includes(pat.toUpperCase()) ? 1 : 0;
}

// 댓글: 사실 +() 사용하면 타입까지 같이 해결해줍니다. => return +(myString.toUpperCase().includes(pat.toUpperCase()));

function solution(myString, pat) {
    return [...myString.matchAll(new RegExp(pat, "ig"))].length >= 1 ? 1 : 0;
}
