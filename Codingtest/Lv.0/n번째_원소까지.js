function solution(num_list, n) {
    return num_list.slice(0, n);
}

console.log(solution([5, 2, 1, 7, 5], 3));

// 다른 사람 풀이

const solution = (l, n) => l.slice(0, n);
