function solution(my_string, n) {
    return my_string.slice(-n);
}

console.log(solution("ProgrammerS123", 11));

// 다른 사람 풀이

function solution(my_string, n) {
    var answer = my_string.slice(-1 * n);
    return answer;
}
