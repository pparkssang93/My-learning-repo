# Array.prototype.includes()

`Array` 인스턴스의 `includes()` 메서드는 배열의 항목에 특정 값이 포함되어 있는지를 판단하여 적절히 `true` 또는 `false`를 반환합니다.

```js
const array1 = [1, 2, 3];

console.log(array1.includes(2));
// Expected output: true

const pets = ["cat", "dog", "bat"];

console.log(pets.includes("cat"));
// Expected output: true

console.log(pets.includes("at"));
// Expected output: false
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
includes(searchElement);
includes(searchElement, fromIndex);
```

<br/>
<br/>

### Params

-   `searchElement`
    찾을 값입니다.

-   `fromIndex` Optional
    검색을 시작할 0 기반 인덱스로, 정수로 변환됩니다.

    -   음수 인덱스는 배열의 끝부터 거꾸로 셉니다. 즉, `fromIndex < 0`이면, `fromIndex + array.length`가 사용됩니다. 그러나, 이 경우에도 배열은 여전히 앞에서 뒤로 검색됩니다.

    -   `fromIndex < -array.length`이거나 `fromIndex`가 생략되면, 0이 사용되어 전체 배열이 검색됩니다.

    -   `fromIndex >= array.length` 이면, 배열은 검색되지 않고 `false`가 반환됩니다.

<br/>
<br/>

### Return

배열(또는 `fromIndex`를 지정했다면, `fromIndex` 인덱스로 표시된 배열의 일부) 내에서 `searchElement` 값이 발견되면 `true` 불리언 값이 반환됩니다.

<br/>
<br/>
<br/>
<br/>

### Description

`includes()` 메서드는 `SameValueZero` 알고리즘을 사용하여 `searchElement`를 배열의 요소와 비교합니다. `0` 값은 부호에 관계없이 모두 동일한 것으로 간주됩니다. (즉, -0은 0과 같지만), `false`는 `0`과 같은 것으로 간주되지 않습니다. `NaN`은 올바르게 검색될 수 있습니다.

희소 배열에 사용할 경우, `include()` 메서드는 빈 슬롯을 `undefined`로 간주하고 순회합니다.

`includes()` 메서드는 범용입니다. `this` 값에는 `length` 속성과 정수 키 속성만 있을 것으로 예상합니다.
