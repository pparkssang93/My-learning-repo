function solution(num_list, n) {
    let answer = [...num_list.slice(n), ...num_list.slice(0, n)];
    return answer;
}

console.log(solution([2, 1, 6], 1));

// 다른 사람 풀이

function solution(num_list, n) {
    num_list.push(...num_list.splice(0, n));
    return num_list;
}

function solution(num_list, n) {
    num_list.unshift(...num_list.splice(n));
    return num_list;
}
