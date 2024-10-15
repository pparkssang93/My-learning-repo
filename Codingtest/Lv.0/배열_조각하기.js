function solution(arr, query) {
    let currentArr = arr;

    for (let i = 0; i < query.length; i++) {
        const index = query[i];

        if (i % 2 === 0) {
            currentArr = currentArr.slice(0, index + 1);
        } else {
            currentArr = currentArr.slice(index);
        }
    }

    return currentArr;
}

console.log(solution([0, 1, 2, 3, 4, 5], [4, 1, 2]));

// 다른 사람 풀이

const solution = (a, q, n = 0) =>
    n < q.length ? solution(!(n % 2) ? a.slice(0, q[n] + 1) : a.slice(q[n]), q, n + 1) : a.length ? a : [-1];

// n이 q.length 작으면 solution 재귀함수를 호출하고
// n이 크면 a.length를 체크하고 a가 비어있으면 [-1] 반환 a가 있으면 a 반환
// wow..... 대단하다
