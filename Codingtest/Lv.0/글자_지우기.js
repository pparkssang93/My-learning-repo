function solution(my_string, indices) {
    let newStr = my_string.split("");

    indices.forEach((ele) => {
        newStr[ele] = "";
    });

    return newStr.join("");
}

// 다른 사람 풀이

function solution(m, a) {
    var answer = "";

    for (let i = 0; i < m.length; i++) {
        if (!a.includes(i)) {
            answer += m[i];
        }
    }

    return answer;
}

console.log(solution("apporoograpemmemprs", [1, 16, 6, 15, 0, 10, 11, 3]));
