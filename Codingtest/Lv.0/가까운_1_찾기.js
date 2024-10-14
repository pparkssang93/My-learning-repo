function solution(arr, idx) {
    let answer = 0;

    for (let i = idx; i < arr.length; i++) {
        if (arr[i] === 1) {
            answer = i;
            return answer;
        }
    }

    return answer ? answer : -1;
}

console.log(solution([1, 0, 0, 1, 0, 0], 4));

// 다른 사람 풀이

const solution = (a, i) => a.indexOf(1, i);

// indexOf 메서드를 활용하면... 한 줄이면 끝이네...
