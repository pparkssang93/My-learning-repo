const leftRight = {
    l: (arr, i) => arr.slice(0, i),
    r: (arr, i) => arr.slice(i, arr.length),
};

function solution(str_list) {
    const index = str_list.findIndex((ele) => {
        if (ele === "l") {
            return ele;
        } else if (ele === "r") {
            return ele;
        }
    });

    return index === -1 ? -1 : leftRight[str_list[index]](str_list, index);
}

// 위 코드는 정확도가 55%... 뭐가 문제일까?

function solution(str_list) {
    const leftRight = str_list.find((ele) => {
        if (ele === "l" || ele === "r") return true;
        else false;
    });

    if (!leftRight) return [];

    const index = str_list.findIndex((ele) => ele === leftRight);

    if (leftRight === "l") {
        return str_list.slice(0, index);
    } else if (leftRight === "r") {
        return str_list.slice(index + 1, str_list.length);
    }
}

console.log(solution(["u", "u"]));

// 위 코드는 90% ....
// ㅣ, r이 없으면 빈배열 반환이었다....

// 다른 사람 풀이

function solution(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "l") return arr.slice(0, i);
        if (arr[i] === "r") return arr.slice(i + 1);
    }
    return [];
}

// 아직 멀었다... 이렇게 간단하게 끝낼 수 있는 문제였는데...

function solution(str_list) {
    const idx = str_list.findIndex((el) => el === "l" || el === "r");
    return str_list[idx] === "l" ? str_list.slice(0, idx) : str_list[idx] === "r" ? str_list.slice(idx + 1) : [];
}

// 삼항 연산자를 연결해서 빈 배열까지 리턴
