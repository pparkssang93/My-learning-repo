// 템플릿

// function solution(str1, str2) {
//     var answer = '';
//     return answer;
// }

function solution(str1, str2) {
    str = str1[0] + str2[0];

    let answer = str.repeat(str1.length);

    return answer;
}

solution("aaaaa", "bbbbb");
solution("aaa", "bbb");

// 왜 객체 + 객체를 하면 string이 되지? 자동으로 형변환이 이뤄지나?
// 위 코드는 테스트 케이스까지는 성공했으나, 채점에서 12.5% 정확성밖에 나오지 않았다. 뭐가 문제일까...?

// 다른 사람 풀이
function solution(str1, str2) {
    var answer = "";
    answer = [...str1].map((s, i) => s + str2[i]).join("");
    return answer;
}

// 처음에는 map 메서드를 고려했지만, 두 개의 문자열을 하나로 합쳐서 그 문자열을 사용해 map을 실행하는 방식이 떠올랐다. 그래서 두 문자열을 번갈아가며 하나의 문자열로 출력하는 것이 불가능하다고 생각했다. 그래서 map을 사용하는 것을 고려하지 않았다. 그런데 왜 문자열 하나로 map을 돌릴 생각은 하지 못했을까...?

// 다른 사람 풀이

function solution(str1, str2) {
    var answer = "";

    for (let i = 0; i < str1.length; i++) {
        answer += str1[i];
        answer += str2[i];
    }

    return answer;
}
