# Object.keys

`Object.keys()` 메서드는 주어진 객체의 속성 이름들을 일반적인 반복문과 동일한 순서로 순회되는 열거할 수 있는 배열로 반환합니다.

```js
const object1 = {
    a: "somestring",
    b: 42,
    c: false,
};

console.log(Object.keys(object1));
// Expected output: Array ["a", "b", "c"]
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
Object.keys(obj);
```

<br/>
<br/>

### Params

-   `obj`
    객체

<br/>
<br/>

### Return

주어진 객체 자체의 열거 가능한 문자열로된 속성 키를 나타내는 문자열 배열.

<br/>
<br/>
<br/>
<br/>

### Description

`Object.keys()`는 `object` 에서 직접 찾은 열거 가능한 문자열 키 속성 이름에 해당하는 문자열을 요소로 하는 배열을 반환합니다. 이는 `for...in` 루프가 프로토타입 체인의 속성도 열거한다는 점을 제외하면 `for...in` 루프를 사용하여 반복하는 것과 동일합니다. `Object.keys()`가 반환하는 배열의 순서는 `for...in` 루프에서 제공하는 것과 동일합니다.

속성 값이 필요한 경우 `Object.values()`를 대신 사용하시기 바랍니다. 속성 키와 값이 모두 필요한 경우 `Object.entries()`를 대신 사용하시기 바랍니다.
