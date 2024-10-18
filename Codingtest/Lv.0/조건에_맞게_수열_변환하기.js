function solution(arr) {
    arr.forEach((ele, i) => {
        if (ele % 2 === 0 && ele >= 50) {
            return (arr[i] /= 2);
        } else if (ele % 2 !== 0 && ele < 50) {
            return (arr[i] *= 2);
        }
    });

    return arr;
}

console.log(solution([1, 2, 3, 100, 99, 98]));

// 다른 사람 풀이

function solution(arr) {
    return arr.map((num) => {
        if (num >= 50 && !(num % 2)) return num / 2;
        if (num < 50 && num % 2) return num * 2;
        return num;
    });
}
