# Array.prototype.findIndex()

Array 인스턴스의 `findIndex()` 메서드는 주어진 판별 함수를 만족하는 배열의 첫 번째 요소에 대한 인덱스를 반환합니다. 만족하는 요소가 없으면 -1을 반환합니다.

```js
const array1 = [5, 12, 8, 130, 44];

const found = array1.find((element) => element > 10);

console.log(found);
// Expected output: 12
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
findIndex(callbackFn);
findIndex(callbackFn, thisArg);
```

<br/>
<br/>

### Params

-   callbackFn
    배열의 각 요소마다 실행할 함수입니다. 일치하는 요소가 발견되었음을 나타내는 true 값을 반환하고 그렇지 않으면 falsy 값을 반환해야합니다. 함수는 다음과 같은 인수와 함께 호출됩니다.

    -   element
        배열에서 처리 중인 현재 요소입니다.

    -   index
        배열에서 처리 중인 현재 요소의 인덱스입니다.

    -   array
        `findIndex()` 함수가 호출된 배열입니다.

-   `thisArg` Optional
    `callbackFn`을 실행할 때 `this`로 사용할 값입니다. 순회 메서드를 참고하세요.

<br/>
<br/>

### Return

테스트를 통과하는 첫 번째 요소의 인덱스입니다. 일치하는 요소가 없으면 `-1`을 반환합니다.

<br/>
<br/>
<br/>
<br/>

### Description

`findIndex()`는 순회 메서드입니다. `callbackFn` 함수를 배열의 각 요소에 대해 오름차순 인덱스 순서로 한 번씩 호출하고, `callbackFn`이 truthy 을 반환할 때까지 반복합니다. 그런 다음 `findIndex()`는 해당 요소의 인덱스를 반환하고 배열 반복을 중단합니다. `callbackFn`이 truthy을 반환하지 않으면 `findIndex()`는 -1을 반환합니다.

보편적으로 이들 메서드가 동작하는 방법을 알고 싶으시다면 순회 메서드 섹션을 읽어보시기 바랍니다.

`callbackFn`은 배열의 값이 할당된 인덱스 뿐만이 아닌 모든 인덱스에 대해 호출됩니다. 희소 배열의 빈 슬롯은 undefined와 동일하게 동작합니다.

`findIndex()` 메서드는 범용메서드 입니다. `this` 값에 `length` 속성과 정수 키 속성 만을 기대합니다.
