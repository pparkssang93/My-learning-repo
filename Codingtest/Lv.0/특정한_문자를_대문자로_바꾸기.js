const solution = (my_string, alp) =>
    [...my_string].map((ele) => (ele.includes(alp) ? ele.toUpperCase() : ele)).join("");

console.log(solution("programmers", "p"));

// 다른 사람 풀이

const solution2 = (s, a) => s.replaceAll(a, a.toUpperCase());
