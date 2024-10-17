function solution(num_list) {
    const newArr = [0, ...num_list];
    let odd = 0;
    let even = 0;

    newArr.forEach((num, idx) => {
        idx % 2 === 0 ? (even += num) : (odd += num);
    });

    return odd > even ? odd : even;
}

console.log(solution([4, 2, 6, 1, 7, 6]));

// 다른 사람 풀이

function solution(num_list) {
    let odd = 0;
    let even = 0;

    num_list.forEach((x, i) => (i % 2 == 0 ? (even += x) : (odd += x)));

    return Math.max(odd, even);
}
