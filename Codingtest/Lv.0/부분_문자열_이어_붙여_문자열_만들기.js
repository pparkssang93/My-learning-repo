function solution(my_strings, parts) {
    return parts.map(([s, e], i) => my_strings[i].slice(s, e + 1)).join("");
}

console.log(
    solution(
        ["progressive", "hamburger", "hammer", "ahocorasick"],
        [
            [0, 4],
            [1, 2],
            [3, 5],
            [7, 7],
        ]
    )
);

// 다른 사람 풀이

function solution(my_strings, parts) {
    return my_strings.reduce((result, str, i) => {
        const [s, e] = parts[i];
        return result + str.substring(s, e + 1);
    }, "");
}
