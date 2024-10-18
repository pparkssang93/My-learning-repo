function solution(num_list, idx = 0, sum = 0) {
    if (num_list.length <= idx) return sum;

    let count = sum;

    while (num_list[idx] !== 1) {
        if (num_list[idx] % 2 === 0) {
            num_list[idx] /= 2;
        } else if (num_list[idx] % 2 !== 0) {
            num_list[idx] = (num_list[idx] - 1) / 2;
        }
        count += 1;
    }

    idx += 1;
    return solution(num_list, idx, count);
}

console.log(solution([12, 4, 15, 1, 14]));

// 다른 사람 풀이

function solution(num_list) {
    return num_list.map((v) => v.toString(2).length - 1).reduce((a, c) => a + c);
}

function solution(num_list) {
    var answer = 0;
    num_list.forEach((num) => {
        while (num !== 1) {
            if (num % 2 == 0) {
                num = num / 2;
                answer = answer + 1;
            } else {
                num = (num - 1) / 2;
                answer = answer + 1;
            }
        }
    });
    return answer;
}

function solution(num_list) {
    return num_list.reduce((acc, cur) => {
        let count = 0;
        while (cur !== 1) {
            cur = cur % 2 ? (cur - 1) / 2 : cur / 2;
            count++;
        }
        return acc + count;
    }, 0);
}
