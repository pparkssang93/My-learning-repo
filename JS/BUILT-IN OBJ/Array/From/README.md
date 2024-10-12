# Array.from()

`Array.from()` 정적 메서드는 순회 가능 또는 유사 배열 객체에서 얕게 복사된 새로운 **Array 인스턴스를 생성**합니다.

```js
console.log(Array.from("foo"));
// Expected output: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], (x) => x + x));
// Expected output: Array [2, 4, 6]
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
Array.from(arrayLike);
Array.from(arrayLike, mapFn);
Array.from(arrayLike, mapFn, thisArg);
```

<br/>
<br/>

### Params

-   `arrayLike`
    배열로 변환할 순회 가능 또는 유사 배열 객체입니다.

-   `mapFn` Optional
    배열의 모든 요소에 대해 호출할 함수입니다. 이 함수를 제공하면 배열에 추가할 모든 값이 이 함수를 통해 먼저 전달되고, `mapFn`의 반환 값이 대신 배열에 추가됩니다. 이 함수는 다음 인수를 사용하여 호출됩니다.

    -   `element`
        배열에서 처리 중인 현재 요소.

    -   `index`
        배열에서 처리 중인 현재 요소의 인덱스.

-   `thisArg` Optional
    `mapFn` 실행 시에 `this`로 사용할 값입니다.

<br/>
<br/>

### Return

새로운 `Array` 인스턴스입니다.

<br/>
<br/>
<br/>
<br/>

### Description

다음과 같은 경우에 `Array.from()`을 사용하면 `Array`를 만들 수 있습니다.

-   순회 가능 객체(`Map`, `Set`과 같은 객체)인 경우. 또는 객체가 순회 가능이 아니라면,
-   유사 배열 객체(`length` 속성과 인덱싱된 요소가 있는 객체).

순회 가능이 아니거나 유사 배열이 아닌 일반 객체를 배열로 변환하려면(속성 키, 값 또는 둘을 모두 열거하여) `Object.keys()`, `Object.values()`, 또는 `Object.entries()`를 사용해야 합니다. 비동기 순회 가능을 배열로 변환하려면 `Array.fromAsync()`를 사용합니다.

`Array.from()`은 희소 배열을 생성하지 않습니다. `arrayLike` 객체에 일부 인덱스 속성이 누락된 경우, 새 배열에서 해당 속성은 `undefined`가 됩니다.

`Array.from()`에는 생성되는 배열의 각 요소에 대해 함수를 실행할 수 있는 `map()`과 비슷한 선택적 매개변수 `mapFn`이 있습니다. 좀 더 명확하게 설명하자면, `Array.from(obj, mapFn, thisArg)`는 중간 배열을 생성하지 않는다는 점과 배열이 아직 생성 중이기 때문에 전체 배열 없이 두 개의 인수`(element, index)`만 받는다는 점을 제외하면 `Array.from(obj).map(mapFn, thisArg)`과 동일한 결과를 가져옵니다.

`Array.from()` 메서드는 범용 팩토리 메서드입니다. 예를 들어, `Array`의 하위 클래스가 `from()` 메서드를 상속하는 경우, 상속된 `from()` 메서드는 `Array` 인스턴스 대신 하위 클래스의 새 인스턴스를 반환합니다. 실제로 `this` 값은 새 배열의 길이를 나타내는 단일 인수를 받는 모든 생성자 함수가 될 수 있습니다. 순회 가능이 `arrayLike`로 전달되면 인수 없이 생성자가 호출되고, 배열형 객체가 전달되면 배열형 객체의 정규화된 `length`를 사용하여 생성자가 호출됩니다. 최종 `length`는 순회가 완료되면 다시 설정됩니다. `this` 값이 생성자 함수가 아닌 경우, 일반 `Array` 생성자가 대신 사용됩니다.
