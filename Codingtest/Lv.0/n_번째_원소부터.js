function solution(num_list, n) {
    return num_list.slice(n - 1);
}

console.log(solution([2, 1, 6], 3));

// 다른 사람 풀이

function solution(list, n) {
    return list.splice(n - 1, list.length);
}
