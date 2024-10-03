const solution = (num_list) => {
    let multiply = num_list.reduce((acc, curr) => acc * curr);

    const sum = num_list.reduce((acc, curr) => acc + curr);

    return sum ** 2 > multiply ? 1 : 0;
};

// 다른 사람 풀이

function solution(num_list) {
    let accMul = 1;
    let accSum = 0;
    for (const num of num_list) {
        accMul *= num;
        accSum += num;
    }
    return accMul < accSum ** 2 ? 1 : 0;
}
