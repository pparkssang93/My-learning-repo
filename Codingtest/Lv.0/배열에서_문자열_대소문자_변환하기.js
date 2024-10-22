function solution(strArr) {
    return strArr.map((_, idx) => {
        if (idx % 2 === 0) {
            return strArr[idx].toLowerCase();
        } else {
            return strArr[idx].toUpperCase();
        }
    });
}

console.log(solution(["AAA", "BBB", "CCC", "DDD"]));

// 다른 사람 풀이

function solution(strArr) {
    return strArr.map((v, i) => (i % 2 === 0 ? v.toLowerCase() : v.toUpperCase()));
}
