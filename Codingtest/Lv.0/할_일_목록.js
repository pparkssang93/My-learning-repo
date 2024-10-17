const solution = (todo_list, finished) => todo_list.filter((_, idx) => finished[idx] !== true);

console.log(solution(["problemsolving", "practiceguitar", "swim", "studygraph"], [true, false, true, false]));

// 다른 사람 풀이

function solution(todo_list, finished) {
    var answer = [];
    for (let i = 0; i < todo_list.length; i++) {
        if (finished[i] === false) {
            answer.push(todo_list[i]);
        }
    }
    return answer;
}
