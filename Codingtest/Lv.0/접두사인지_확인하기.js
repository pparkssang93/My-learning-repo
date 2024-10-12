function solution(my_string, is_prefix) {
    let newArr = Array.from(my_string, (_, i) => {
        return my_string.slice(0, i + 1);
    });

    return newArr.find((ele) => is_prefix === ele) ? 1 : 0;
}

console.log(solution("banana", "ban"));

// 다른 사람 풀이

function solution(my_string, is_prefix) {
    return +my_string.startsWith(is_prefix);
}

console.log(solution("banana", "ban"));
