function solution(my_string, s, e) {
    const newStrArr = [...my_string];

    while (s < e) {
        [newStrArr[e], newStrArr[s]] = [[newStrArr[s]], newStrArr[e]];

        s++;
        e--;
    }

    return newStrArr.join("");
}

console.log(solution("Progra21Sremm3", 6, 12));

// 다른 사람 풀이

function solution(my_string, s, e) {
    var answer = "";
    var str = my_string.substring(s, e + 1);
    var newStr = str.split("").reverse().join("");

    answer = my_string.replace(str, newStr);
    return answer;
}
