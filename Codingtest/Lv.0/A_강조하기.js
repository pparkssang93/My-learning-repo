const solution = (myString) => {
    return myString
        .split("")
        .map((ele) => (ele === "a" || ele === "A" ? ele.toUpperCase() : ele.toLowerCase()))
        .join("");
};

console.log(solution("PrOgRaMmErS"));

// 다른 사람 풀이

const solution2 = (s) => s.toLowerCase().replaceAll("a", "A");

function solution(myString) {
    return [...myString].map((str) => (["a", "A"].includes(str) ? "A" : str.toLowerCase())).join("");
}

// includes로 쉽게 표현할 수 있었네...
