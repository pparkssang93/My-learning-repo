function solution(arr, stk = [], i = 0) {
    if (i >= arr.length) {
        return stk;
    }

    if (!stk.length) {
        stk.push(arr[i]);
        i += 1;
        return solution(arr, stk, i);
    } else if (stk.length && stk[stk.length - 1] < arr[i]) {
        stk.push(arr[i]);
        i += 1;
        return solution(arr, stk, i);
    } else if (stk.length && stk[stk.length - 1] >= arr[i]) {
        stk.pop();
        return solution(arr, stk, i);
    }
}

// 위 코드는 런타임 에러가 발생.

function solution(arr) {
    let stk = [];
    let i = 0;

    while (arr.length > i) {
        if (!stk.length) {
            stk.push(arr[i]);
            i += 1;
        } else if (stk.length && stk[stk.length - 1] < arr[i]) {
            stk.push(arr[i]);
            i += 1;
        } else if (stk.length && stk[stk.length - 1] >= arr[i]) {
            stk.pop();
        }
    }

    return stk;
}

console.log(solution([1, 4, 2, 5, 3]));

// 다른 사람 풀이

function solution(arr) {
    var stk = [];
    for (let i = 0; i < arr.length; ) {
        if (stk.length === 0) {
            stk.push(arr[i++]);
        } else if (stk[stk.length - 1] < arr[i]) {
            stk.push(arr[i++]);
        } else if (stk[stk.length - 1] >= arr[i]) {
            stk.pop();
        }
    }
    return stk;
}

// 꼭 final-expression이 필요하지 않다.
