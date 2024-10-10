function solution(my_string, is_suffix) {
    if (is_suffix.length > my_string.length) return 0;

    let newArr = Array.from(my_string, (_, i) => {
        return my_string.slice(i, my_string.length);
    });

    return newArr.find((ele) => is_suffix === ele) ? 1 : 0;
}

console.log(solution("banana", "nan"));

// 다른 사람 풀이

const solution = (str, suff) => (str.endsWith(suff) ? 1 : 0);

function solution(my_string, is_suffix) {
    return my_string.slice(my_string.length - is_suffix.length) === is_suffix ? 1 : 0;
}
