# Map

`map()` 메서드는 배열 내의 모든 요소 각각에 대하여 주어진 **함수를 호출한 결과를 모아 새로운 배열을 반환**합니다.

```js
const array1 = [1, 4, 9, 16];

// Pass a function to map
const map1 = array1.map((x) => x * 2);

console.log(map1);
// Expected output: Array [2, 8, 18, 32]
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
    arr.map(callback(currentValue[, index[, array]])[, thisArg])
```

<br/>
<br/>

### Params

-   `callback`
    새로운 배열 요소를 생성하는 함수. 다음 세 가지 인수를 가집니다.

    -   `currentValue`
        처리할 현재 요소.

    -   `index` Optional
        처리할 현재 요소의 인덱스.

    -   `array` Optional
        map()을 호출한 배열.

-   `thisArg` Optional
    `callback`을 실행할 때 `this`로 사용되는 값.

<br/>
<br/>

### Return

배열의 각 요소에 대해 실행한 `callback`의 결과를 모은 새로운 배열.

<br/>
<br/>
<br/>
<br/>

`map`은 `callback` 함수를 각각의 요소에 대해 한번씩 순서대로 불러 그 함수의 반환값으로 새로운 배열을 만듭니다. callback 함수는 (undefined도 포함해서) 배열 값이 들어있는 인덱스에 대해서만 호출됩니다. 즉, 값이 삭제되거나 아직 값이 할당/정의되지 않은 인덱스에 대해서는 호출되지 않습니다.

`callback` 함수는 호출될 때 대상 요소의 값, 그 요소의 인덱스, 그리고 map을 호출한 원본 배열 3개의 인수를 전달받습니다.

`thisArg` 매개변수가 `map`에 전달된 경우 `callback` 함수의 `this`값으로 사용됩니다. 그 외의 경우 `undefined`값이 `this` 값으로 사용됩니다. `callback` 함수에서 최종적으로 볼 수 있는 `this` 값은 함수 내 `this`를 정하는 일반적인 규칙에 따라 결정됩니다.

`map`은 호출한 **배열의 값을 변형하지 않습니다.** 단, `callback` 함수에 의해서 변형될 수는 있습니다.

`map`이 처리할 요소의 범위는 첫 `callback`을 호출하기 전에 정해집니다. `map`이 시작한 이후 배열에 추가되는 요소들은 `callback`을 호출하지 않습니다. 배열에 존재하는 요소들의 값이 바뀐 경우 `map`이 방문하는 시점의 값이 `callback`에 전달됩니다. `map`이 시작되고, 방문하기 전에 삭제된 요소들은 방문하지 않습니다.

명세서에 정의된 알고리즘으로 인해 map을 호출한 배열의 중간이 비어있는 경우, 결과 배열 또한 동일한 인덱스를 빈 값으로 유지합니다.
