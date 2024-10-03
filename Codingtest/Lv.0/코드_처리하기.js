const solution = function (code) {
    let mode = 0;
    let ret = "";

    code.split("").forEach((ele, idx) => {
        if (ele === "1") {
            mode = +!mode;
            return;
        } else if (mode === 0 && idx % 2 === 0) {
            ret += ele;
            return ret;
        } else if (mode === 1 && idx % 2 !== 0) {
            ret += ele;
            return ret;
        }
    });

    return ret ? ret : "EMPTY";
};

// 다른 사람 풀이
function solution(code) {
    let answer = "";
    let mode = 0;

    for (let i = 0; i < code.length; i += 1) {
        if (Number(code[i]) === 1) {
            mode = mode === 1 ? 0 : 1;
        }
        if (Number(code[i]) !== 1 && i % 2 === mode) {
            answer += code[i];
        }
    }
    return answer.length > 0 ? answer : "EMPTY";
}

// 삼항 연산자는 표현식으로 평가되어 할당 연산자의 오른쪽 피연산자로 사용할 수 있다.
// 표현식? 표현식이 사용되는 곳에서는 항상 어떤 값이 평가되거나 반환된다.
