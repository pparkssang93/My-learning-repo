function solution(start_num, end_num) {
    let answer = [];

    for (let i = start_num; i <= end_num; i++) {
        answer.push(i);
    }

    return answer;
}

// 다른 사람 풀이

function solution(start, end) {
    return Array.from({ length: end - start + 1 }, () => {
        return start++;
    });
}

console.log(solution(3, 10));

// {length: end - start + 1} js mdn from 페이지에 보면 숫자 시퀸스 생성하는 방법이라고 설명이 되어있다.
