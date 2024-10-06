function solution(num_list) {
    const [lastBefore, last] = num_list.slice(-2);

    lastBefore < last ? num_list.push(last - lastBefore) : num_list.push(last * 2);

    return num_list;
}

// 다른 사람 풀이

function solution(num_list) {
    const [a, b] = [...num_list].reverse();

    return [...num_list, a > b ? a - b : a * 2];
}

console.log(solution([2, 1, 6]));
