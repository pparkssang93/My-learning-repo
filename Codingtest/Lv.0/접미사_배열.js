function solution(my_string) {
    let answer = [];

    for (let i = 0; i < my_string.length; i++) {
        const sliceStr = my_string.slice(i, my_string.length);
        answer.push(sliceStr);
    }

    return answer.sort();
}

console.log(solution("banana"));

// 다른 사람 풀이

function solution(my_string) {
    return Array.from(my_string)
        .map((_, i) => my_string.substring(i))
        .sort();
}
