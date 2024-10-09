# Object.Values()

`Object.values()` 메소드는 전달된 파라미터 객체가 가지는 (열거 가능한) 속성의 값들로 이루어진 배열을 리턴합니다. 이 배열은 for...in 구문과 동일한 순서를 가집니다. (for in 반복문은 프로토타입 체인 또한 열거한다는 점에서 차이가 있습니다.)

```js
const object1 = {
    a: "somestring",
    b: 42,
    c: false,
};

console.log(Object.values(object1));
// Expected output: Array ["somestring", 42, false]
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
Object.values(obj);
```

<br/>
<br/>

### Params

-   `obj`
    배열로 변환할 열거 가능한 속성을 가지는 객체

<br/>
<br/>

### Return

전달된 객체의 속성 값들을 포함하는 배열

<br/>
<br/>
<br/>
<br/>

### Description

`Object.values()` 는 파라미터로 전달된 객체가 가지는 열거 가능한 속성의 값들로 구성된 배열을 반환합니다. 배열의 값들 순서는 오브젝트의 속성을 `for in` 구문등으로 반복한 결과와 동일합니다. (참고로 for in 구문은 순서를 보장하지 않습니다)
