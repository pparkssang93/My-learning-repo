function solution(num_list, n) {
    return num_list.map((ele, i) => (i % n === 0 ? ele : null)).filter((ele) => ele !== null);
}

console.log(solution([4, 2, 6, 1, 7, 6], 2));

// 다른 사람 풀이

const solution = (num_list, n) => num_list.filter((_, i) => !(i % n));

const solution = (arr, d) => arr.filter((_, idx) => idx % d === 0);
