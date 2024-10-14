# Array.prototype.fill()

`Array` 인스턴스의 `fill()` 메서드는 배열의 인덱스 범위 내에 있는 모든 요소를 정적 값으로 변경합니다. 그리고 수정된 배열을 반환합니다.

```js
const array1 = [1, 2, 3, 4];

// Fill with 0 from position 2 until position 4
console.log(array1.fill(0, 2, 4));
// Expected output: Array [1, 2, 0, 0]

// Fill with 5 from position 1
console.log(array1.fill(5, 1));
// Expected output: Array [1, 5, 5, 5]

console.log(array1.fill(6));
// Expected output: Array [6, 6, 6, 6]
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
fill(value);
fill(value, start);
fill(value, start, end);
```

<br/>
<br/>

### Params

-   `value`
    배열을 채울 값입니다. 배열의 모든 요소는 정확히 이 값이 될 것입니다. `value`가 객체인 경우, 배열의 각 슬롯은 해당 객체를 참조합니다.

-   `start` Optional
    채우기를 시작할 `0` 기반 인덱스로, 정수로 변환됩니다.

    -   음수 인덱스는 배열의 끝부터 거꾸로 셉니다. `start < 0`인 경우, `- start + array.length`가 사용됩니다.
    -   `start < -array.length` 또는 `start`가 생략된 경우, `0`이 사용됩니다.
    -   `start >= array.length`이면, 아무 인덱스도 채워지지 않습니다.

-   `end` Optional
    채우기를 끝낼 `0` 기반 인덱스로, 정수로 변환됩니다. `fill()`은 `end`까지 채우며, `end`는 포함하지 않습니다.

        -   음수 인덱스는 배열의 끝부터 거꾸로 셉니다. `end < 0`인 경우, `end + array.length`가 사용됩니다.
        -   `end < -array.length` 이면, 0이 사용됩니다.
        -   `end >= array.length` 이거나 `end`가 생략된 경우, `array.length`가 사용되어 끝까지 모든 인덱스가 채워집니다.
        -   `end`가 정수로 변환된 후, `after`보다 앞에 위치하면, 아무 인덱스도 채워지지 않습니다.

<br/>
<br/>

### Return

`value`로 채워진 변경된 배열입니다.

<br/>
<br/>
<br/>
<br/>

### Description

`fill()` 메서드는 변경 메서드입니다. 이 메서드는 `this`의 `length`는 변경하지 않지만, `this`의 내용은 변경합니다.

`fill()` 메서드는 희소 배열의 빈 슬롯도 `value`로 채웁니다.

`fill()` 메서드는 범용입니다. `this` 값에는 `length` 속성만 있을 것으로 예상합니다. 문자열도 유사 배열이지만, **문자열은 불변이므로 이 메서드를 적용하기에는 적합하지 않습니다.**
