function solution(n, [a, b, c], num_list) {
    switch (n) {
        case 1:
            return num_list.slice(0, b + 1);
        case 2:
            return num_list.slice(a);
        case 3:
            return num_list.slice(a, b + 1);
        case 4:
            let newArr = [];

            for (let i = a; i <= b; i += c) {
                newArr.push(num_list[i]);
            }

            return newArr;
    }
}

console.log(solution(4, [1, 6, 2], [1, 2, 3, 4, 5, 6, 7, 8, 9]));

// 다른 사람 풀이

function solution(n, slicer, num_list) {
    let [a, b, c] = [...slicer];

    switch (n) {
        case 1:
            return num_list.slice(0, b + 1);
        case 2:
            return num_list.slice(a);
        case 3:
            return num_list.slice(a, b + 1);
        case 4:
            return num_list.slice(a, b + 1).filter((_, idx) => !(idx % c));
    }
}

const slices = {
    1: (num_list, [a, b, c]) => num_list.slice(0, b + 1),
    2: (num_list, [a, b, c]) => num_list.slice(a),
    3: (num_list, [a, b, c]) => num_list.slice(a, b + 1),
    4: (num_list, [a, b, c]) => num_list.slice(a, b + 1).filter((_, i) => i % c === 0),
};

function solution(n, slicer, num_list) {
    return slices[n](num_list, slicer);
}
