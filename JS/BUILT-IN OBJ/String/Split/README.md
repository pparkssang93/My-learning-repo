# Split

String 객체를 지정한 `구분자`를 이용하여 여러 개의 문자열로 나눕니다.

```js
const str = "The quick brown fox jumps over the lazy dog.";

const words = str.split(" ");
console.log(words[3]);
// Expected output: "fox"

const chars = str.split("");
console.log(chars[8]);
// Expected output: "k"

const strCopy = str.split();
console.log(strCopy);
// Expected output: Array ["The quick brown fox jumps over the lazy dog."]
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
split();
split(separator);
split(separator, limit);
```

<br/>
<br/>

### Params

-   `separator` Optional
    원본 문자열을 끊어야 할 부분을 나타내는 문자열을 나타냅니다. 실제 문자열이나 정규표현식을 받을 수 있습니다. 문자열 유형의 `separator`가 두 글자 이상일 경우 그 부분 문자열 전체가 일치해야 끊어집니다. `separator`가 생략되거나 `str`에 등장하지 않을 경우, 반환되는 배열은 원본 문자열을 유일한 원소로 가집니다. `separator`가 빈 문자열일 경우 `str`의 각각의 문자가 배열의 원소 하나씩으로 변환됩니다.

-   `limit` Optional
    끊어진 문자열의 최대 개수를 나타내는 정수입니다. 이 매개변수를 전달하면 `split()` 메서드는 주어진 `separator`가 등장할 때마다 문자열을 끊지만 배열의 원소가 `limit`개가 되면 멈춥니다. 지정된 한계에 도달하기 전에 문자열의 끝까지 탐색했을 경우 `limit`개 미만의 원소가 있을 수도 있습니다. 남은 문자열은 새로운 배열에 포함되지 않습니다.

<br/>
<br/>

### Return

주어진 문자열을 `separator`마다 끊은 부분 문자열을 담은 Array.

<br/>
<br/>
<br/>
<br/>

문자열에서 `separator`가 등장하면 해당 부분은 삭제되고 남은 문자열이 배열로 반환됩니다. `separator`가 등장하지 않거나 생략되었을 경우 배열은 원본 문자열을 유일한 원소로 가집니다. `separator`가 빈 문자열일 경우, `str`은 문자열의 모든 문자를 원소로 가지는 배열로 변환됩니다. `separator`가 원본 문자열의 처음이나 끝에 등장할 경우 반환되는 배열도 빈 문자열로 시작하거나 끝납니다. 그러므로 원본 문자열에 `separator` 하나만이 포함되어 있을 경우 빈 문자열 두 개를 원소로 가지는 배열이 반환됩니다.
