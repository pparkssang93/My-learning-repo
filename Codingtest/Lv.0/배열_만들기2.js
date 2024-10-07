function solution(l, r) {
    let answer = [];

    for (let i = l; i <= r; i++) {
        let stringNum = i.toString();

        if (/^[50]+$/.test(stringNum)) {
            answer.push(i);
        }
    }

    if (answer.length === 0) {
        answer.push(-1);
    }

    return answer;
}

console.log(solution(5, 50));

// 다른 사람 풀이

function* gen50() {
    let i = 1;

    while (true) {
        yield Number(Number(i).toString(2)) * 5;
        i++;
    }
}
function solution(l, r) {
    const n = gen50();
    let a = 0;
    const arr = [];

    while (a < l) {
        a = n.next().value;
    }
    while (a <= r) {
        arr.push(a);
        a = n.next().value;
    }

    return arr.length ? arr : [-1];
}

// 5와 0으로만 이루어진 수를 5로 나누어보고 1, 10, 101 .. 이런식으로 1과 0으로만 이루어져서 이진수이지 않을까 했는데.. 활용할 방법을 몰랐다.. 와우 그리고 function 키워드 뒤에 붙은 아스트로크와 yield에 대한 학습이 필요하다.

function solution(l, r, arr = []) {
    for (let i = l; i <= r; i++) {
        if (i.toString().replaceAll(/[05]/g, "") === "") arr.push(i);
    }
    return arr.length ? arr : [-1];
}
