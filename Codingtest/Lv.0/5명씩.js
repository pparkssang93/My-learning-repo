function solution(names) {
    return names.filter((_, idx) => idx % 5 === 0);
}

console.log(solution(["nami", "ahri", "jayce", "garen", "ivern", "vex", "jinx"]));

// 다른 사람 풀이

function solution(names) {
    const groups = [];
    let i = 0;
    while (i < names.length) {
        groups.push(names.slice(i, i + 5));
        i += 5;
    }
    return groups.map((group) => group[0]);
}
