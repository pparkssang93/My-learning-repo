function solution(my_string, index_list) {
    return index_list.map((ele) => my_string[ele]).join("");
}

console.log(solution("cvsgiorszzzmrpaqpe", [16, 6, 5, 3, 12, 14, 11, 11, 17, 12, 7]));

// 다른 사람 풀이

function solution(my_string, index_list) {
    return index_list.reduce((result, i) => result + my_string[i], "");
}
