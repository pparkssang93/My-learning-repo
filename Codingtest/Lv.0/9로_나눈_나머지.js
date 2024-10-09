function solution(number) {
    let answer = 0;

    [...number].forEach((num) => {
        if (number[0] === "0") return;

        answer += Number(num);
    });

    return answer % 9;
}

console.log(solution("78720646226947352489"));

// Number 생성자를 쓰면 if 조건문이 필요 없겠구나...

// 다른 사람 풀이

const solution = (n) => BigInt(n) % 9n;

// 댓글 : 답은 정수를 9로 나눈 나머지를 구하는거니까 안더해도 됩니다 -> "이 사실을 이용하여"라는 지문이 있어서, 구현도 각 자리의 숫자를 더한 후에 9로 나눈 나머지를 구하도록 코드를 구현해야 하는 것 아닌가요?
