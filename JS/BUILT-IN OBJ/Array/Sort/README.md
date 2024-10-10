# Array.prototype.sort()

`sort()` 메서드는 배열의 요소를 적절한 위치에 정렬한 후 그 배열을 반환합니다. 정렬은 stable sort가 아닐 수 있습니다. 기본 정렬 순서는 문자열의 유니코드 코드 포인트를 따릅니다.

정렬 속도와 복잡도는 각 구현방식에 따라 다를 수 있습니다.

```js
const months = ["March", "Jan", "Feb", "Dec"];
months.sort();
console.log(months);
// Expected output: Array ["Dec", "Feb", "Jan", "March"]

const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1);
// Expected output: Array [1, 100000, 21, 30, 4]
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
arr.sort([compareFunction]);
```

<br/>
<br/>

### Params

-   `compareFunction` Optional
    정렬 순서를 정의하는 함수. 생략하면 배열은 각 요소의 문자열 변환에 따라 각 문자의 유니 코드 코드 포인트 값에 따라 정렬됩니다.

### Return

정렬한 배열. **원 배열이 정렬**되는 것에 유의하세요. 복사본이 만들어지는 것이 아닙니다.

<br/>
<br/>
<br/>
<br/>

### Description

`compareFunction`이 제공되지 않으면 요소를 문자열로 변환하고 유니 코드 코드 포인트 순서로 문자열을 비교하여 정렬됩니다. 예를 들어 "바나나"는 "체리"앞에옵니다. 숫자 정렬에서는 9가 80보다 앞에 오지만 숫자는 문자열로 변환되기 때문에 "80"은 유니 코드 순서에서 "9"앞에옵니다.

`compareFunction`이 제공되면 배열 요소는 compare 함수의 반환 값에 따라 정렬됩니다. `a`와 `b`가 비교되는 두 요소라면,

-   `compareFunction(a, b)`이 `0`보다 작은 경우 `a`를 `b`보다 낮은 색인으로 정렬합니다. 즉, `a`가 먼저옵니다.
-   `compareFunction(a, b)`이 `0`을 반환하면 `a`와 `b`를 서로에 대해 변경하지 않고 모든 다른 요소에 대해 정렬합니다. 참고 : ECMAscript 표준은 이러한 동작을 보장하지 않으므로 모든 브라우저(예 : Mozilla 버전은 적어도 2003 년 이후 버전 임)가 이를 존중하지는 않습니다.
-   `compareFunction(a, b)`이 `0`보다 큰 경우, `b`를 `a`보다 낮은 인덱스로 소트합니다.
-   `compareFunction(a, b)`은 요소 `a`와 `b`의 특정 쌍이 두 개의 인수로 주어질 때 항상 동일한 값을 반환해야합니다. 일치하지 않는 결과가 반환되면 정렬 순서는 정의되지 않습니다.

```js
function compare(a, b) {
  if (a is less than b by some ordering criterion) {
    return -1;
  }
  if (a is greater than b by the ordering criterion) {
    return 1;
  }
  // a must be equal to b
  return 0;
}
```

`compareFunction`은 리턴 값에 따라 sort.
