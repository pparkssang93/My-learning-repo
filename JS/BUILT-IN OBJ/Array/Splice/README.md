# Array.prototype.splice()

`splice()` 메서드는 배열의 내용을 변경하여 기존 요소를 제거하거나 교체하고, 새로운 요소를 추가하는 방식으로 배열을 수정합니다.

원본 배열을 변경하지 않고 특정 구간을 제거하거나 교체한 새로운 배열을 만들려면 `toSpliced()`를 사용하세요. 배열을 수정하지 않고 일부를 접근하려면 `slice()`를 사용하세요.

```js
const months = ["Jan", "March", "April", "June"];
months.splice(1, 0, "Feb");
// Inserts at index 1
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "June"]

months.splice(4, 1, "May");
// Replaces 1 element at index 4
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "May"]
```

## Syntax

```js
splice(start);
splice(start, deleteCount);
splice(start, deleteCount, item1);
splice(start, deleteCount, item1, item2);
splice(start, deleteCount, item1, item2, /* …, */ itemN);
```

<br/>
<br/>

### Params

-   `start`
    배열을 변경하기 시작할 제로 기반 인덱스입니다. 이 값은 정수로 변환됩니다.

    -   음수 인덱스는 배열의 끝에서부터 계산됩니다. 만약 `-array.length <= start < 0`인 경우, `start + array.length`가 사용됩니다.

    -   만약 `start < -array.length`인 경우, `0`이 사용됩니다.

    -   만약 `start >= array.length`인 경우, 삭제할 요소가 없지만, 메서드는 제공된 만큼의 요소를 추가하는 기능으로 작동합니다.

    -   만약 `start`가 생략되면(즉, `splice()`가 인자 없이 호출되면), 아무 요소도 삭제되지 않습니다. 이는 `undefined`를 전달하는 것과 다르며, `undefined`는 `0`으로 변환됩니다.

-   `deleteCount` (Optional)

    시작 위치에서 제거할 배열의 요소 수를 나타내는 정수입니다.

    `deleteCount`가 생략되거나, 그 값이 `start`로 지정된 위치 이후의 요소 수보다 크거나 같으면, `start`부터 배열의 끝까지 모든 요소가 삭제됩니다. 그러나 `itemN` 매개변수를 전달하려면, `deleteCount`를 `Infinity`로 설정해야 모든 요소가 삭제됩니다. 명시적으로 `undefined`를 전달하면 `0`으로 변환되기 때문입니다.

    만약 `deleteCount`가 `0`이거나 음수인 경우, 아무 요소도 제거되지 않습니다. 이 경우에는 최소한 하나의 새로운 요소를 지정해야 합니다.

-   `item1, …, itemN` (Optional)

    `start`부터 배열에 추가할 요소들입니다.

    요소를 지정하지 않으면, `splice()`는 배열에서 요소만 제거하게 됩니다.

<br/>
<br/>

### Return

삭제된 요소들을 포함하는 배열입니다.

만약 하나의 요소만 제거된 경우, 하나의 요소로 이루어진 배열이 반환됩니다.

만약 아무 요소도 제거되지 않은 경우, 빈 배열이 반환됩니다.

<br/>
<br/>
<br/>
<br/>

### Description

`splice()` 메서드는 변형 메서드입니다. 이 메서드는 배열의 내용을 변경할 수 있습니다. 삽입할 요소의 수와 제거할 요소의 수가 다르면, 배열의 길이도 변경됩니다. 동시에, 새로운 배열 인스턴스를 반환하기 위해 `[Symbol.species]`를 사용합니다.

삭제된 부분이 희소(sparse)한 경우, `splice()`가 반환하는 배열도 희소하게 되며, 해당 인덱스는 빈 슬롯으로 남아 있습니다.

`splice()` 메서드는 일반적입니다. 이 메서드는 `this` 값이 길이 속성과 정수 인덱스 속성을 가지고 있기를 기대합니다. 문자열도 배열처럼 보이지만, 이 메서드는 문자열에 적용하기에 적합하지 않습니다. 그 이유는 문자열이 불변(immutable)하기 때문입니다.
