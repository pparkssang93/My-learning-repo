const solution = (numbers, n) =>
    numbers.reduce((acc, curr) => {
        if (acc > n) return acc;

        return acc + curr;
    });

console.log(solution([34, 5, 71, 29, 100, 34], 123));

// 다른 사람 풀이

function solution(numbers, n) {
    var answer = 0;
    let i = 0;
    while (answer <= n) {
        answer += numbers[i++];
    }
    return answer;
}
