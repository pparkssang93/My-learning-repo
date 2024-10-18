function solution(num_list) {
    if (num_list.length <= 10) {
        return num_list.reduce((acc, curr) => acc * curr);
    } else {
        return num_list.reduce((acc, curr) => acc + curr);
    }
}

console.log(solution([2, 3, 4, 5]));

// 다른 사람 풀이

const solution = (n) => n.reduce((a, v) => (n.length > 10 ? a + v : a * v));

function solution(num_list) {
    const mult = (acc, v) => acc * v;
    const add = (acc, v) => acc + v;

    return num_list.length > 10 ? num_list.reduce(add, 0) : num_list.reduce(mult, 1);
}
