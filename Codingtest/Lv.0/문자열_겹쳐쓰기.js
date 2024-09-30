// 템플릿
// function solution(my_string, overwrite_string, s) {
//     var answer = "";
//     return answer;
// }

// 나의 풀이
function solution(my_string, overwrite_string, s) {
    let answer = my_string.slice(s);

    if (answer.length > overwrite_string.length) {
        let count = answer.length - overwrite_string.length;
        const endOfWord = my_string.slice(-count);
        return my_string.replace(answer, overwrite_string) + endOfWord;
    }

    answer = my_string.replace(answer, overwrite_string);

    return answer;
}

console.log(solution("He11oWor1d", "lloWorl", 2));
console.log(solution("Program29b8UYP", "merS123", 7));

// 다른 사람 풀이

function solution(my_string, overwrite_string, s) {
    return my_string.slice(0, s) + overwrite_string + my_string.slice(s + overwrite_string.length);
}

console.log(solution("He11oWor1d", "lloWorl", 2));

// slice 메서드는 새로운 문자열을 반환하니까 그냥 더해도 상관없었던 문제였네....
