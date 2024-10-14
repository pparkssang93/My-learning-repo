function solution(start_num, end_num) {
    let answer = [];
    for (let i = start_num; i >= end_num; i--) {
        answer.push(i);
    }

    return answer;
}

console.log(solution(10, 3));

// 다른 사람 풀이

function solution(start, end) {
    var answer = [];
    do {
        answer.push(start);
        start--;
    } while (start >= end);
    return answer;
}
