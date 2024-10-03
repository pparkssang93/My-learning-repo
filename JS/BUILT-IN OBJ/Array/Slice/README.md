# slice()

`slice()` 메서드는 배열의 begin 부터 end 까지(end 미포함)에 대한 얕은 복사본을 **새로운 배열 객체로 반환**합니다. 원본 배열은 바뀌지 않습니다.

```js
const animals = ["ant", "bison", "camel", "duck", "elephant"];

console.log(animals.slice(2));
// Expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice(1, 5));
// Expected output: Array ["bison", "camel", "duck", "elephant"]

console.log(animals.slice(-2));
// Expected output: Array ["duck", "elephant"]

console.log(animals.slice(2, -1));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice());
// Expected output: Array ["ant", "bison", "camel", "duck", "elephant"]
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
    arr.slice([begin[, end]])
```

<br/>
<br/>

### Params

-   `begin` Optional
    0을 시작으로 하는 추출 시작점에 대한 인덱스를 의미합니다. 음수 인덱스는 배열의 끝에서부터의 길이를 나타냅니다. `slice(-2)` 는 배열에서 마지막 두 개의 엘리먼트를 추출합니다. `begin`이 `undefined`인 경우에는, 0번 인덱스부터 slice 합니다. `begin`이 배열의 길이보다 큰 경우에는, 빈 배열을 반환합니다.

-   `end` Optional
    추출을 종료 할 0 기준 인덱스입니다. `slice` 는 `end` 인덱스를 **제외하고 추출**합니다. 예를 들어, `slice(1,4)`는 두번째 요소부터 네번째 요소까지 (1, 2 및 3을 인덱스로 하는 요소) 추출합니다. 음수 인덱스는 배열의 끝에서부터의 길이를 나타냅니다. 예를들어 `slice(2,-1)` 는 세번째부터 끝에서 두번째 요소까지 추출합니다. `end`가 생략되면 `slice()`는 배열의 끝까지(arr.length) 추출합니다.

만약 `end` 값이 배열의 길이보다 크다면, `slice()`는 배열의 끝까지(arr.length) 추출합니다.

<br/>
<br/>

### Return

추출한 요소를 포함한 새로운 배열.

<br/>
<br/>
<br/>
<br/>

## Description

`slice()`는 원본을 대체하지 않습니다. 원본 배열에서 요소의 얕은 복사본을 반환합니다. 원본 배열의 요소는 다음과 같이 반환 된 배열에 복사됩니다:

객체 참조(및 실제 객체가 아님)의 경우, `slice()`는 객체 참조를 새 배열로 복사합니다. 원본 배열과 새 배열은 모두 동일한 객체를 참조합니다. 참조 된 객체가 변경되면 변경 내용은 새 배열과 원래 배열 모두에서 볼 수 있습니다.
`String` 및 `Number` 객체가 아닌 문자열과 숫자의 경우 `slice()`는 문자열과 숫자를 새 배열에 복사합니다. 한 배열에서 문자열이나 숫자를 변경해도 다른 배열에는 영향을 주지 않습니다.
새 요소를 두 배열 중 하나에 추가해도 다른 배열은 영향을 받지 않습니다.
