# Math.max()

`Math.max()` 정적 메서드는 매개변수로 주어진 숫자 중 가장 큰 수를 반환하거나, 매개변수가 없을 경우 `-Infinity`를 반환합니다.

```js
console.log(Math.max(1, 3, 2));
// Expected output: 3

console.log(Math.max(-1, -3, -2));
// Expected output: -1

const array1 = [1, 3, 2];

console.log(Math.max(...array1));
// Expected output: 3
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
Math.max();
Math.max(value1);
Math.max(value1, value2);
Math.max(value1, value2, /* …, */ valueN);
```

<br/>
<br/>

### Parameters

-   `value1, …, valueN`
    가장 큰 값을 선택하고 반환할 0개 이상의 숫자입니다.

<br/>
<br/>

### Return

주어진 숫자 중 가장 큰 숫자를 반환합니다. 만약 인수 중 하나라도 숫자로 변환한 값이 `NaN`이라면 `NaN`로 반환합니다. 매개변수가 없을 경우 `-Infinity`를 반환합니다.

<br/>
<br/>
<br/>
<br/>

`max()`는 `Math`의 정적 메서드이기 때문에 만든 `Math`객체의 메서드가 아닌 항상 `Math.max()`로 사용해야합니다. (Math는 생성자가 아닙니다).

`Math.max.length`의 값이 2 인데, 이는 이 메서드가 최소 2개의 매개변수를 받도록 설계되었음을 암시합니다.
