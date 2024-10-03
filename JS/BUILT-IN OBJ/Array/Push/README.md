# push()

`push()` 메서드는 배열의 **끝에 하나 이상의 요소를 추가**하고, 배열의 **새로운 길이를 반환**합니다.

```js
const animals = ["pigs", "goats", "sheep"];

const count = animals.push("cows");
console.log(count);
// Expected output: 4
console.log(animals);
// Expected output: Array ["pigs", "goats", "sheep", "cows"]

animals.push("chickens", "cats", "dogs");
console.log(animals);
// Expected output: Array ["pigs", "goats", "sheep", "cows", "chickens", "cats", "dogs"]
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
    arr.push(element1[, ...[, elementN]])
```

<br/>
<br/>

### Params

-   `elementN`
    배열의 끝에 추가할 요소.

<br/>
<br/>

### Return

호출한 배열의 새로운 `length` 속성.

<br/>
<br/>
<br/>
<br/>

## Description

`push` 메서드는 배열 끝에 여러 값을 추가합니다.

`push`는 의도적으로 제네릭합니다. 배열을 닯은 객체에 `call()` 또는 `apply()`로 사용될 수 있다. `push` 메서드는 주어진 값을 입력하는 것을 어디에 시작할 것인지를 결정하기 위해 `length` 속성에 의존한다. 만약 `length` 속성이 숫자로 변환 될 수 없다면 인덱스는 `0`을 사용한다. `length` 가 생성되게 될 경우에 길이 값이 존재하지 않을 가능성을 포함한다.

`String`(문자열)이 변경할 수 없는 것처럼 비록 이 명령어의 어플리케이션들이 적합하지 않다고 할지라도 단지 원래 배열 같은 객체는 `strings`이다.
