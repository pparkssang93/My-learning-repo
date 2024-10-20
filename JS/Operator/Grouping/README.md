# Grouping operator ( )

The grouping `( )` operator는 표현식에서 평가의 우선 순위를 제어합니다. 또한 특정 문법 구조에서 모호성이나 구문 오류가 발생할 수 있는 경우, 임의의 표현식을 담는 용도로도 사용됩니다.

```js
console.log(1 + 2 * 3); // 1 + 6
// Expected output: 7

console.log((1 + 2) * 3); // 3 * 3
// Expected output: 9

console.log(1 * 3 + 2 * 3); // 3 + 6
// Expected output: 9
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
\(expression\)
```

<br/>
<br/>

### Params

-   `expression`
    평가될 모든 표현식, 쉼표로 연결된 표현식을 포함합니다.

<br/>
<br/>
<br/>
<br/>

## Description

괄호 연산자는 표현식을 감싸는 괄호 한 쌍으로 구성되어 내용을 그룹화합니다. 이 연산자는 일반적인 연산자 우선 순위를 무시하여, 우선 순위가 낮은 연산자(쉼표 연산자처럼 낮은)도 우선 순위가 높은 연산자보다 **먼저 평가**될 수 있도록 합니다.

<br/>
<br/>
<br/>
<br/>

## Examples

### Using the grouping operator

```js
const a = 1;
const b = 2;
const c = 3;

// default precedence
a + b * c; // 7
// evaluated by default like this
a + \(b * c\); // 7

// now overriding precedence
// addition before multiplication
(a + b) * c; // 9

// which is equivalent to
a * c + b * c; // 9
```

위 예제에서 연산자가 평가되는 순서는 변경되었지만, 피연산자가 평가되는 순서는 변하지 않았습니다.

예를 들어, 아래 코드에서는 함수 호출인 a(), b(), c()가 연산자 순서가 고려되기 전에 왼쪽에서 오른쪽으로(정상적인 평가 순서) 평가됩니다.

```js
a() * (b() + c());
```

함수 a가 먼저 호출되고, 그 다음에 함수 b가 호출되며, 마지막으로 함수 c가 호출됩니다.

> 🤔 함수 호출에는 the grouping operator 상관없이 왼쪽에서 오른쪽으로 평가된다는 얘기같다.

<br/>
<br/>

### Using the grouping operator to eliminate parsing ambiguity

the grouping operator를 사용하여 구문 모호성 제거하기

표현식 문장은 `function` 키워드로 시작할 수 없습니다. 왜냐하면 파서가 이를 함수 선언의 시작으로 인식하기 때문입니다. 이는 다음의 IIFE 문법이 유효하지 않음을 의미합니다.

```js
// ❌ Don't use

function () {
  // code
}();
```

the grouping operator는 이 모호성을 제거하는 데 사용될 수 있습니다. 왜냐하면 파서가 왼쪽 괄호를 보면 이후에 오는 것이 선언이 아니라 표현식이어야 한다는 것을 알기 때문입니다.

```js
(function () {
    // code
})();
```

모호성을 제거하기 위해 `void` 연산자도 사용할 수 있습니다.

화살표 함수 표현식의 body(즉, return 키워드 없이 직접 표현식을 반환하는 경우)에서는 the grouping operator를 사용하여 객체 리터럴 표현식을 반환할 수 있습니다. 그렇지 않으면 왼쪽 중괄호가 함수 본체의 시작으로 해석될 수 있습니다.

```js
const f = () => ({ a: 1 });
```

숫자 리터럴에서 속성에 접근할 때, 속성 접근자 `.`가 소수점이 모호할 수 있습니다. 숫자에 이미 소수점이 없는 경우에는 더욱 그렇습니다. 이 모호성을 제거하기 위해 정수 리터럴을 괄호로 감쌀 수 있습니다.

```js
(1).toString(); // "1"
```

<br/>
<br/>

### Grouping operator and automatic semicolon insertion

Grouping operator는 자동 세미콜론 삽입(ASI) 문제를 완화할 수 있습니다. 예를 들어, `return` 키워드와 반환되는 표현식 사이에 줄 바꿈이 있을 수 없습니다:

```js
// ❌ Don't use

function sum(a, b) {
    return;
    a + b;
}
```

이 코드는 `undefined`를 반환합니다. 왜냐하면 `return` 키워드 바로 뒤에 세미콜론이 삽입되어 함수가 즉시 반환되기 때문에 `a + b`를 평가하지 않기 때문입니다. 반환되는 표현식이 길고 포맷팅을 유지하고 싶다면, Grouping operator를 사용하여 `return` 키워드 뒤에 표현식이 따라온다는 것을 나타내고 세미콜론 삽입을 방지할 수 있습니다.

```js
function sum(a, b) {
    return \(a + b\);
}
```

However, grouping may also introduce ASI hazards. 만약 한 줄이 왼쪽 괄호로 시작하고 이전 줄이 표현식으로 끝나면, 파서는 줄 바꿈 전에 세미콜론을 삽입하지 않습니다. 왜냐하면 이것이 함수 호출의 중간일 수 있기 때문입니다. 예를 들어:

```js
const a = 1

\n

(1).toString();
```

This code would be parsed as:

```js
const a = 1(1).toString();
```

이로 인해 "TypeError: 1 is not a function" 오류가 발생합니다. 만약 당신의 코딩 스타일이 세미콜론을 사용하지 않는다면, 한 줄이 왼쪽 괄호로 시작할 때는 세미콜론으로 앞에 붙이는 것을 기억하세요. 이 관행은 여러 포매터와 스타일 가이드에서 권장되며, `Prettier`와 `standard`도 포함됩니다.
