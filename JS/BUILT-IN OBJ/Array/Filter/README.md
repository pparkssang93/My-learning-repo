# Filter

Array 인스턴스의 `filter()` 메서드는 주어진 배열의 일부에 대한 얕은 복사본을 생성하고, 주어진 배열에서 제공된 함수에 의해 구현된 테스트를 통과한 요소로만 필터링 합니다.

```js
const words = ["spray", "elite", "exuberant", "destruction", "present"];

const result = words.filter((word) => word.length > 6);

console.log(result);
// Expected output: Array ["exuberant", "destruction", "present"]

console.log(words);
// Expected output: Array ["spray", "elite", "exuberant", "destruction", "present"]
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
filter(callbackFn);
filter(callbackFn, thisArg);
```

<br/>
<br/>

### Params

-   `callbackFn`: 배열의 각 요소에 대해 실행할 함수입니다. 결과 배열에 요소를 유지하려면 참 값을 반환하고 그렇지 않으면 거짓 값을 반환해야 합니다. 이 함수는 다음 인수를 사용하여 호출됩니다.
    -   `element`: 배열에서 처리 중인 현재 요소.
    -   `index`: 배열에서 처리 중인 현재 요소의 인덱스.
    -   `array`: filter()가 호출된 배열.
-   `thisArg` Optional
    callbackFn을 실행할 때 this 값으로 사용할 값입니다. 순회 메서드를 참조하세요.

### Return

주어진 배열의 일부에 대한 얕은 복사본으로, 주어진 배열에서 제공된 함수에 의해 구현된 테스트를 통과한 요소로만 필터링 합니다. 테스트를 통과한 요소가 없으면 빈 배열이 반환됩니다.

<br/>
<br/>
<br/>
<br/>

## Description

`filter()` 메서드는 순회 메서드입니다. 이 메서드는 배열의 각 요소에 대해 제공된 `callbackFn` 함수를 한 번씩 호출하고, `callbackFn`이 참 값을 반환하는 모든 값으로 새 배열을 구성합니다. `callbackFn` 테스트를 통과하지 못한 배열 요소는 새 배열에 포함되지 않습니다.

`callbackFn`은 값이 할당된 배열 인덱스에 대해서만 호출됩니다. 희소 배열의 빈 슬롯에는 호출되지 않습니다.

`filter()` 메서드는 복사 메서드입니다. 이 메서드는 `this`를 변경하지 않는 대신 원래 배열의 요소와 동일한 요소를 포함하는 얕은 복사본을 반환합니다(일부 필터링 된 요소 제외). 하지만, `callbackFn`으로 제공된 함수는 배열을 변경할 수 있습니다. 그러나 배열의 `length`는 `callbackFn`을 처음 호출하기 전에 저장된다는 점에 유의하세요. 따라서,

`callbackFn`은 `filter()` 호출이 시작되었을 때 배열의 초기 `length` 값을 초과하여 추가된 요소는 방문하지 않습니다.
이미 방문한 인덱스를 변경해도 `callbackFn`이 해당 인덱스에 대해 다시 호출되지 않습니다.
배열의 아직 방문하지 않은 기존 요소가 `callbackFn`에 의해 변경되는 경우, `callbackFn`에 전달된 값은 해당 요소가 방문될 당시의 값이 됩니다. 삭제된 요소는 방문되지 않습니다.
