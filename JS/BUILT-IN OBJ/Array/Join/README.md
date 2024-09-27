# Join

Array 인스턴스의 `Join()` 메서드는 배열의 모든 요소를 쉼표나 지정된 구분 문자열로 구분하여 연결한 새 문자열을 만들어 반환합니다. 배열에 항목이 하나만 있는 경우, 해당 항목은 구분 기호를 사용하지 않고 반환됩니다.

```js
const elements = ["Fire", "Air", "Water"];

console.log(elements.join());
// Expected output: "Fire,Air,Water"

console.log(elements.join(""));
// Expected output: "FireAirWater"

console.log(elements.join("-"));
// Expected output: "Fire-Air-Water"
```

<br/>
<br/>
<br/>
<br/>

## Syntax

```js
join();
join(separator);
```

<br/>
<br/>

### Params

-   `separator` Optional
    배열의 인접한 요소의 각 쌍을 구분하는 문자열입니다. 생략되면 배열 요소는 쉼표(",")로 구분됩니다.

<br/>
<br/>

### Return

배열의 모든 요소들을 연결한 하나의 문자열을 반환합니다. 만약 `arr.length` 가 0이라면, 빈 문자열을 반환합니다.

```js
const a = ["바람", "물", "불"];
a.join(); // '바람,물,불'
a.join(", "); // '바람, 물, 불'
a.join(" + "); // '바람 + 물 + 불'
a.join(""); // '바람물불'
```
