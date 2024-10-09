function solution(a, b, c, d) {
    const newArr = [a, b, c, d].reduce((acc, curr) => {
        if (acc[curr]) {
            acc[curr] += 1;
        } else {
            acc[curr] = 1;
        }

        return acc;
    }, {});

    const keys = Object.keys(newArr).map(Number);
    const values = Object.values(newArr);

    console.log(values);

    if (keys.length === 1) {
        answer = keys[0] * 1111;
        return answer;
    } else if (values.includes(3)) {
        const p = keys.find((num) => newArr[num] === 3);
        const q = keys.find((num) => newArr[num] === 1);
        answer = (10 * p + q) ** 2;
        return answer;
    } else if (values.includes(2) && keys.length === 2) {
        const p = keys[0];
        const q = keys[1];

        answer = (p + q) * Math.abs(p - q);
        return answer;
    } else if (values.includes(2) && keys.length === 3) {
        const [q, r] = keys.filter((ele) => newArr[ele] !== 2);

        answer = q * r;

        return answer;
    } else if (keys.length === 4) {
        answer = Math.min(...keys);
        return answer;
    }
}

console.log(solution(6, 4, 2, 5));

// 다른 사람 풀이

function solution(a, b, c, d) {
    if (a === b && a === c && a === d) return 1111 * a;

    if (a === b && a === c) return (10 * a + d) ** 2;
    if (a === b && a === d) return (10 * a + c) ** 2;
    if (a === c && a === d) return (10 * a + b) ** 2;
    if (b === c && b === d) return (10 * b + a) ** 2;

    if (a === b && c === d) return (a + c) * Math.abs(a - c);
    if (a === c && b === d) return (a + b) * Math.abs(a - b);
    if (a === d && b === c) return (a + b) * Math.abs(a - b);

    if (a === b) return c * d;
    if (a === c) return b * d;
    if (a === d) return b * c;
    if (b === c) return a * d;
    if (b === d) return a * c;
    if (c === d) return a * b;

    return Math.min(a, b, c, d);
}

function count(arr) {
    const counter = new Map();
    for (const num of arr) {
        counter.set(num, (counter.get(num) || 0) + 1);
    }
    const sortedByCnt = [...counter.keys()].sort((a, b) => counter.get(b) - counter.get(a));
    const maxCnt = Math.max(...counter.values());
    return [sortedByCnt, maxCnt];
}

function solution(a, b, c, d) {
    const [arr, maxCnt] = count([a, b, c, d]);
    const [p, q, r, s] = arr;
    if (arr.length === 1) {
        return p * 1111;
    }
    if (arr.length === 2) {
        return maxCnt === 2 ? (p + q) * Math.abs(p - q) : (10 * p + q) ** 2;
    }
    if (arr.length === 3) {
        return q * r;
    }
    return Math.min(p, q, r, s);
}

function solution(a, b, c, d) {
    const map = new Map();
    for (const data of [a, b, c, d]) {
        map.set(data, (map.get(data) || 0) + 1);
    }

    const sortedArr = [...map].sort((a, b) => {
        if (a[1] === b[1]) return b[0] - a[0];
        else return b[1] - a[1];
    });

    if (map.size === 1) return 1111 * sortedArr[0][0];
    else if (map.size === 3) return sortedArr[1][0] * sortedArr[2][0];
    else if (map.size === 4) return sortedArr[3][0];
    else if (sortedArr[0][1] === 3) return (10 * sortedArr[0][0] + sortedArr[1][0]) ** 2;
    else return (sortedArr[0][0] + sortedArr[1][0]) * (sortedArr[0][0] - sortedArr[1][0]);
}
