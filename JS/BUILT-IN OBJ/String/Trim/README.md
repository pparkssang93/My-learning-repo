# Trim

`String` 값의 `trim()` 메서드는 이 문자열의 양쪽 끝에서 공백을 제거하고, 원래 문자열을 수정하지 않고 새 문자열을 반환합니다.

한 쪽 끝에서만 공백을 제거한 새 문자열을 반환하려면 `trimStart()` 또는 `trimEnd()`를 사용합니다.

```js
const greeting = "   Hello world!   ";

console.log(greeting);
// Expected output: "   Hello world!   ";

console.log(greeting.trim());
// Expected output: "Hello world!";
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
trim();
```

<br/>
<br/>

### No parameters

<br/>
<br/>

### Return

문자열 양 끝 공백이 제거된 새로운 문자열이 반환되며, 공백은 공백 문자와 줄 바꿈 문자를 포함합니다.

`str`의 시작이나 끝에 공백이 없더라도, 여전히 새로운 문자열이 반환되며, 이는 사실상 `str`의 복사본입니다.
