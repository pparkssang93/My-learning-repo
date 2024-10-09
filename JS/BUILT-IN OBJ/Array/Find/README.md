# Array.prototype.find()

`Array` 인스턴스의 `find()` 메서드는 제공된 배열에서 제공된 테스트 함수를 만족하는 첫 번째 요소를 반환합니다. 테스트 함수를 만족하는 값이 없으면 `undefined`가 반환됩니다.

-   배열에서 찾은 요소의 인덱스가 필요한 경우, `findIndex()`를 사용하세요.
-   값의 인덱스를 찾아야 하는 경우, `indexOf()`를 사용하세요. (findIndex()와 유사하지만, 테스트 함수를 사용하는 것 대신 각 요소가 값과 동일한지 확인합니다.)
-   배열에 값이 존재하는지 찾아야 하는 경우, `includes()`를 사용하세요. 이 역시 테스트 함수를 사용하는 것 대신 각 요소가 값과 동일한지 확인합니다.
-   제공된 테스트 함수를 만족하는 요소가 있는지 찾아야 하는 경우, `some()`을 사용하세요.
-   만약 주어진 테스트 함수를 만족하는 모든 요소를 찾고 싶으면 `filter()`을 사용하세요.

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
find(callbackFn);
find(callbackFn, thisArg);
```

<br/>
<br/>

### Params

-   `callback`
    배열의 각 요소에 대해 실행할 함수입니다. 일치하는 요소를 찾았으면 참 값을 반환하고, 그렇지 않으면 거짓 값을 반환해야 합니다. 함수는 다음 인수를 사용하여 호출됩니다.

    -   `element`
        배열에서 현재 처리되고 있는 요소.

    -   `index`
        배열에서 현재 처리되고 있는 요소의 인덱스.

    -   array
        `find()`가 호출된 배열.

-   `thisArg` Optional
    callbackFn을 실행할 때 this로 사용할 값입니다. 순회 메서드를 참조하세요.

<br/>
<br/>

### Return

제공된 테스트 함수를 만족하는 배열의 첫 번째 요소입니다. 테스트 함수를 만족하는 요소가 없으면, `undefined`가 반환됩니다.

<br/>
<br/>
<br/>
<br/>

### Description

`find()` 메서드는 순회 메서드입니다. 이 메서드는 `callbackFn`이 참 같은 값을 반환할 때까지, 오름차순 인덱스로 순서로 배열의 각 요소에 대해 제공된 `callbackFn` 함수를 한 번씩 호출합니다. 그런 다음 `find()`는 해당 요소를 반환하고 배열 순회를 중지합니다. `callbackFn`이 참 같은 값을 반환하지 않으면, `find()`는 `undefined`를 반환합니다. 더 자세한 정보는 순회 메서드 섹션을 보시기 바랍니다. 이 섹션에는 이러한 메서드가 일반적으로 어떻게 동작하는지 설명하고 있습니다.

`callbackFn`은 값이 할당된 인덱스뿐만 아니라 배열의 모든 인덱스에 대해 호출됩니다. 희소 배열의 빈 슬롯은 `undefined`와 동일하게 동작합니다.

`find()` 메서드는 범용입니다. `this` 값에는 `length` 속성과 정수 키 속성만 있을 것으로 예상합니다.
