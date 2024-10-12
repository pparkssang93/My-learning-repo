# String.prototype.startsWith()

`startsWith()`는 String 값의 메서드로, 어떤 문자열의 문자로 시작하는지 확인하여 결과를 적절하게 true 혹은 false로 반환합니다.

```js
const str1 = "Saturday night plans";

console.log(str1.startsWith("Sat"));
// Expected output: true

console.log(str1.startsWith("Sat", 3));
// Expected output: false
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
startsWith(searchString);
startsWith(searchString, position);
```

<br/>
<br/>

### Params

-   `searchString`
    이 문자열의 시작 부분에서 검색할 문자. 정규식이 될 수 없습니다. 정규식이 아닌 모든 값은 문자열로 강제로 변환되므로 이를 생략하거나 `undefined`를 전달하면 `startsWith()`가 `"undefined"` 문자열을 검색하게 되는데, 이는 원하는 경우가 거의 없습니다.

-   `position` Optional
    `searchString`이 발견될 것으로 예상되는 시작 위치(`searchString`의 첫 번째 문자의 인덱스)입니다. 기본값은 0입니다.

<br/>
<br/>

### Return

true or false

<br/>
<br/>

### Error

-   `TypeError`
    `searchString`이 정규식일 경우.

<br/>
<br/>
<br/>
<br/>

## Description

`startsWith` 메소드로 어떤 문자열이 다른 문자열로 시작하는지 확인 할 수 있습니다. **대소문자를 구분**합니다.
