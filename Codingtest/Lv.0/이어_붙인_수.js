const solution = (num_list) => {
    let even = "";
    let odd = "";

    num_list.forEach((ele) => {
        ele % 2 === 0 ? (even += `${ele}`) : (odd += `${ele}`);
    });

    return Number(even) + Number(odd);
};

//  다른 사람 풀이

function solution(num_list) {
    const { odds, evens } = num_list.reduce(
        ({ odds, evens }, num) => {
            if (num % 2 === 0) {
                evens.push(num);
            } else {
                odds.push(num);
            }
            return { odds, evens };
        },
        { odds: [], evens: [] }
    );
    return Number(odds.join("")) + Number(evens.join(""));
}
