# Array.prototype.reduce()

`reduce()` 메서드는 배열의 각 요소에 대해 주어진 리듀서 (reducer) 함수를 실행하고, 하나의 결과값을 반환합니다.

```js
const array1 = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);

console.log(sumWithInitial);
// Expected output: 10
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
reduce(callbackFn);
reduce(callbackFn, initialValue);
```

<br/>
<br/>

### Params

-   `callbackFn`: 배열의 각 요소에 대해 실행되는 함수입니다.
    -   `accumulator`: 콜백의 반환값을 누적합니다. 콜백의 이전 반환값 또는, 콜백의 첫 번째 호출이면서 `initialValue`를 제공한 경우에는 `initialValue`의 값입니다.
    -   `currentValue`: 처리할 현재 요소.
    -   `currentIndex` (optional): 처리할 현재 요소의 인덱스. `initialValue`를 제공한 경우 0, 아니면 **1부터 시작**합니다.
    -   `array` (optional): `reduce()`를 호출한 배열.
-   `initialValue` (optional): `callback`의 최초 호출에서 첫 번째 인수에 제공하는 값. **초기값을 제공하지 않으면 배열의 첫 번째 요소를 사용**합니다. **빈 배열에서 초기값 없이 `reduce()`를 호출하면 오류가 발생**합니다.

<br/>
<br/>

### Params

누적 계산의 결과 값.

<br/>
<br/>
<br/>
<br/>

## Description

`reduce()`는 빈 요소를 제외하고 배열 내에 존재하는 각 요소에 대해 callback 함수를 한 번씩 실행하는데, 콜백 함수는 다음의 네 인수를 받습니다:

콜백의 최초 호출 때 `accumulator`와 `currentValue`는 다음 두 가지 값 중 하나를 가질 수 있습니다. 만약 `reduce()` 함수 호출에서 `initialValue`를 제공한 경우, `accumulator`는 `initialValue`와 같고 `currentValue`는 배열의 첫 번째 값과 같습니다. `initialValue`를 제공하지 않았다면, `accumulator`는 배열의 첫 번째 값과 같고 `currentValue`는 두 번째와 같습니다.

<br/>
<br/>
<br/>
<br/>

#### MEMO 🤔

-   `map`은 배열의 각 요소를 하나하나 활용할 때 유용할 것 같고, `reduce`는 배열을 하나의 결과로 출력하고 싶을 때 사용하는게 좋지 않을까?
-   빈 배열이면 무조건 초기값을 줘야한다.
