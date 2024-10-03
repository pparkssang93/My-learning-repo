const solution = (a, d, included) => {
    let answer = 0;
    let score;

    included.forEach((ele, idx) => {
        if (idx === 0) score = a;
        else score += d;

        if (ele) answer += score;
    });

    return answer;
};

solution(3, 4, [true, false, false, true, true]);

// 다른 사람 풀이

function solution(a, d, included) {
    return included.reduce((acc, flag, i) => {
        return flag ? acc + a + d * i : acc;
    }, 0);
}
solution(3, 4, [true, false, false, true, true]);
