# Slice

`String` 값의 `slice()` 메서드는 이 문자열의 일부를 추출하여 이를 **새로운 문자열**로 반환합니다. 원본 문자열은 수정하지 않습니다.

```js
const str = "The quick brown fox jumps over the lazy dog.";

console.log(str.slice(31));
// Expected output: "the lazy dog."
console.log(str);

console.log(str.slice(4, 19));
// Expected output: "quick brown fox"

console.log(str.slice(-4));
// Expected output: "dog."

console.log(str.slice(-9, -5));
// Expected output: "lazy"
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
slice(indexStart);
slice(indexStart, indexEnd);
```

<br/>
<br/>

### Params

-   `indexStart`
    반환될 부분 문자열에 포함될 첫 번째 문자의 인덱스.

-   `indexEnd` Optional
    반환될 부분 문자열에서 제외될 첫 번째 문자열의 인덱스.

<br/>
<br/>

### Return

문자열의 추출된 부분을 담는 새로운 문자열이 반환됩니다.

<br/>
<br/>

`slice()`는 하나의 문자열로부터 텍스트를 추출하고 새 문자열을 반환합니다.

`slice()`는 `indexEnd`를 포함하지 않고 추출합니다. 예를 들어 `str.slice(4, 8)`는 다섯 번째 문자부터 여덟 번째 문자까지 추출합니다(인덱스 4, 5, 6, 7에 해당하는 문자).
