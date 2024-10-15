function solution(arr) {
    const arrLength = arr.filter((ele) => ele === 2).length;

    if (arrLength === 0) {
        return [-1];
    } else if (arrLength === 1) {
        return [2];
    } else if (arrLength >= 2) {
        const first = arr.findIndex((ele) => ele === 2);
        const last = arr.lastIndexOf(2);
        return arr.slice(first, last + 1);
    }
}

console.log(solution([1, 2, 1, 2, 1, 10, 2, 1]));

// 다른 사람 풀이

function solution(arr) {
    const from = arr.indexOf(2);
    const end = arr.lastIndexOf(2);

    return from === -1 ? [-1] : arr.slice(from, end + 1);
}

// 2가 하나면 첫번 째 요소와 마지막 요소 하나니까... 그냥 slice해도 상관없겠구나..
