function solution(n) {
    let odd = 0;
    let even = 0;

    for (let i = 1; i <= n; i++) {
        i % 2 === 0 ? (even += i * i) : (odd += i);
    }

    return n % 2 === 0 ? even : odd;
}

console.log(solution(10));

// 다른 사람 풀이
// n이 짝수일 때는 등차수열의 합 공식을 적용하였고, n이 홀수일 때는 자연수 거듭 제곱의 합을 구하는 공식을 적용한 것으로 보입니다. 반복문과 조건문을 활용하지 않는 멋진 풀이네요.
function solution(n) {
    if (n % 2 === 1) return ((n + 1) / 2) * ((n + 1) / 2);
    else return (n * (n + 1) * (n + 2)) / 6;
}

function solution(n) {
    const array = Array(n)
        .fill()
        .map((x, idx) => idx + 1);
    return n % 2 === 0
        ? array.reduce((a, b) => (b % 2 === 0 ? a + Math.pow(b, 2) : a), 0)
        : array.reduce((a, b) => (b % 2 === 0 ? a : a + b), 0);
}
