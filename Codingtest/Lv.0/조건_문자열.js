function solution(ineq, eq, n, m) {
    let answer;
    answer = eq === "=" ? eval(`${n} ${ineq}${eq} ${m}`) : eval(`${n} ${ineq} ${m}`);

    return answer ? 1 : 0;
}

solution("<", "=", 20, 50);

// eval은 사용하지 말자......

// 다른 사람 풀이

const operations = {
    ">=": (n, m) => n >= m,
    "<=": (n, m) => n <= m,
    ">!": (n, m) => n > m,
    "<!": (n, m) => n < m,
};

function solution(ineq, eq, n, m) {
    const op = operations[ineq + eq];
    return Number(op(n, m));
}
