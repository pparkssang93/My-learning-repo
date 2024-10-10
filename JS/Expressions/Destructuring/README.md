# Destructuring assignment 구조 분해 할당

구조 분해 할당 구문은 배열이나 객체의 속성을 **해체**하여 그 값을 개별 변수에 담을 수 있게 하는 JavaScript 표현식입니다.

```js
let a, b, rest;
[a, b] = [10, 20];

console.log(a);
// Expected output: 10

console.log(b);
// Expected output: 20

[a, b, ...rest] = [10, 20, 30, 40, 50];

console.log(rest);
// Expected output: Array [30, 40, 50]
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
var a, b, rest;
[a, b] = [10, 20];
console.log(a); // 10
console.log(b); // 20

[a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(a); // 10
console.log(b); // 20
console.log(rest); // [30, 40, 50]

({ a, b } = { a: 10, b: 20 });
console.log(a); // 10
console.log(b); // 20

// Stage 4(finished) proposal
({ a, b, ...rest } = { a: 10, b: 20, c: 30, d: 40 });
console.log(a); // 10
console.log(b); // 20
console.log(rest); // {c: 30, d: 40}
```

<br/>
<br/>
<br/>
<br/>

## Description

객체 및 배열 리터럴 표현식을 사용하면 쉽게 데이터 뭉치를 만들 수 있습니다.

```js
var x = [1, 2, 3, 4, 5];
```

구조 분해 할당의 구문은 위와 비슷하지만, 대신 할당문의 좌변에서 사용하여, **원래 변수에서 어떤 값을 분해해 할당할지 정의합니다.**

```js
var x = [1, 2, 3, 4, 5];
var [y, z] = x;
console.log(y); // 1
console.log(z); // 2
```

<br/>
<br/>
<br/>
<br/>

### Binding and assignment

객체와 배열 구조 분해에서 두 가지 종류의 구조 분해 패턴이 있습니다: 바인딩 패턴과 할당 패턴으로, 약간 다른 문법을 가지고 있습니다.

**바인딩 패턴**

바인딩 패턴에서는 패턴이 선언 키워드(예: var, let, const)로 시작합니다. 그런 다음, 각 개별 속성은 변수에 바인딩되거나 추가로 구조 분해되어야 합니다.

```js
const obj = { a: 1, b: { c: 2 } };
const {
    a,
    b: { c: d },
} = obj;
// Two variables are bound: `a` and `d`
```

모든 변수는 동일한 선언을 공유하므로, 일부 변수를 재할당 가능하게 하고 다른 변수는 읽기 전용으로 만들고 싶다면, 구조 분해를 두 번 해야 할 수도 있습니다. 한 번은 let으로, 한 번은 const로 구조 분해해야 합니다.

```js
const obj = { a: 1, b: { c: 2 } };
const { a } = obj; // a is constant
let {
    b: { c: d },
} = obj; // d is re-assignable
```

In many other syntaxes where the language binds a variable for you, you can use a binding destructuring pattern. These include:

-   The looping variable of `for...in` `for...of`, and `for await...of` loops;
-   `Function` parameters
-   The `catch` binding variable.

**할당 패턴**

할당 패턴에서는 패턴이 키워드로 시작하지 않습니다. 각 구조 분해된 속성은 할당 대상에 할당됩니다. 이 대상은 `var` 또는 `let`으로 미리 선언된 변수일 수도 있고, 다른 객체의 속성일 수도 있습니다. 일반적으로 할당 표현식의 왼쪽에 올 수 있는 모든 것이 해당 대상이 될 수 있습니다.

```js
const numbers = [];
const obj = { a: 1, b: 2 };
({ a: numbers[0], b: numbers[1] } = obj);
// The properties `a` and `b` are assigned to properties of `numbers`
```

❌ Not valid syntax

```js
const numbers = [];
const obj = { a: 1, b: 2 };
const { a: numbers[0], b: numbers[1] } = obj;

// This is equivalent to:
//   const numbers[0] = obj.a;
//   const numbers[1] = obj.b;
// Which definitely is not valid.
```

할당 패턴은 오직 할당 연산자의 왼쪽에만 사용할 수 있습니다. +=나 \*=와 같은 복합 할당 연산자와 함께 사용할 수는 없습니다.

<br/>
<br/>
<br/>
<br/>

### Default value

각 구조 분해된 속성은 기본값을 가질 수 있습니다. 기본값은 속성이 존재하지 않거나 값이 `undefined`일 때 사용됩니다. 속성의 값이 `null`인 경우에는 기본값이 사용되지 않습니다.

```js
const [a = 1] = []; // a is 1
const { b = 2 } = { b: undefined }; // b is 2
const { c = 2 } = { c: null }; // c is null
```

기본값은 어떤 표현식도 될 수 있습니다. 이 기본값은 필요할 때만 평가됩니다.

```js
const { b = console.log("hey") } = { b: 2 };
// Does not log anything, because `b` is defined and there's no need
// to evaluate the default value.
```

<br/>
<br/>
<br/>
<br/>

### Array destructuring

**Basic variable assignment**

```js
const foo = ["one", "two", "three"];

const [red, yellow, green] = foo;
console.log(red); // "one"
console.log(yellow); // "two"
console.log(green); // "three"
```

<br/>
<br/>

**Swapping variables**

두 변수의 값을 하나의 구조 분해 표현식으로 교환할 수 있습니다.
구조 분해 할당 없이 두 값을 교환하려면 임시 변수가 필요합니다.

```js
let a = 1;
let b = 3;

[a, b] = [b, a];
console.log(a); // 3
console.log(b); // 1

const arr = [1, 2, 3];
[arr[2], arr[1]] = [arr[1], arr[2]];
console.log(arr); // [1, 3, 2]
```

<br/>
<br/>

**Parsing an array returned from a function**

항상 함수에서 배열을 반환하는 것이 가능했습니다. 구조 분해 할당을 사용하면 배열 반환 값을 더 간결하게 처리할 수 있습니다.

이 예제에서 `f()`는 `[1, 2]`라는 값을 return, 이는 구조 분해 할당을 사용하여 한 줄로 파싱할 수 있습니다.

```js
function f() {
    return [1, 2];
}

const [a, b] = f();
console.log(a); // 1
console.log(b); // 2
```

<br/>
<br/>

**Ignoring some returned values**

```js
function f() {
    return [1, 2, 3];
}

const [a, , b] = f();
console.log(a); // 1
console.log(b); // 3

const [c] = f();
console.log(c); // 1
```

You can also ignore all returned values:

```js
[, ,] = f();
```

<br/>
<br/>

**Using a binding pattern as the rest property**

배열 구조 분해 할당의 나머지(rest) 속성은 또 다른 배열 또는 객체 바인딩 패턴이 될 수 있습니다. 내부 구조 분해는 나머지 요소를 수집한 후 생성된 배열에서 값을 추출하므로, 이렇게 하면 원래의 반복 가능한 객체에서 존재하는 속성에 접근할 수 없습니다.

```js
const [a, b, ...{ length }] = [1, 2, 3];
console.log(a, b, length); // 1 2 1
```

```js
const [a, b, ...[c, d]] = [1, 2, 3, 4];
console.log(a, b, c, d); // 1 2 3 4
```

이러한 바인딩 패턴은 각 나머지(rest) 속성이 목록에서 마지막에 있는 한 중첩될 수 있습니다.

반면, 객체 구조 분해 할당에서는 나머지(rest) 속성으로 오직 식별자만 사용할 수 있다.

```js
const { a, ...{ b } } = { a: 1, b: 2 };
// SyntaxError: `...` must be followed by an identifier in declaration contexts

let a, b;
({ a, ...{ b } } = { a: 1, b: 2 });
// SyntaxError: `...` must be followed by an assignable reference in assignment contexts
```

<br/>
<br/>
<br/>
<br/>

### Object destructuring

**Basic assignment**

```js
const user = {
    id: 42,
    isVerified: true,
};

const { id, isVerified } = user;

console.log(id); // 42
console.log(isVerified); // true
```

<br/>
<br/>

**Assigning to new variable names**

객체에서 속성을 추출하여 객체 속성과 다른 이름의 변수에 할당할 수 있다.

```js
const o = { p: 42, q: true };
const { p: foo, q: bar } = o;

console.log(foo); // 42
console.log(bar); // true
```

Here, for example, `const { p: foo } = o` takes from the object `o` the property named `p` and assigns it to a local variable named `foo`.

<br/>
<br/>

**Assigning to new variable names and providing default values**

A property can be both

-   객체에서 추출되어 객체 속성과 다른 이름의 변수에 할당된다.
-   추출된 값이 `undefined`일 경우 기본값이 할당된다.

```js
const { a: aa = 10, b: bb = 5 } = { a: 3 };

console.log(aa); // 3
console.log(bb); // 5
```

<br/>
<br/>

**Unpacking properties from objects passed as a function parameter**

함수 매개변수로 전달된 객체는 변수로 추출될 수 있으며, 이렇게 추출된 변수는 함수 본문 내에서 접근할 수 있습니다. 객체 할당과 마찬가지로, 구조 분해 할당 문법을 사용하면 새 변수의 이름이 원래 속성과 같거나 다를 수 있으며, 원래 객체가 해당 속성을 정의하지 않은 경우 기본값을 할당할 수 있습니다.

Consider this object, which contains information about a user.

```js
const user = {
    id: 42,
    displayName: "jdoe",
    fullName: {
        firstName: "Jane",
        lastName: "Doe",
    },
};
```

여기서는 전달된 객체의 속성을 같은 이름의 변수로 추출하는 방법을 보여줍니다. 매개변수 값인 `{ id }`는 함수에 전달된 객체의 `id` 속성을 같은 이름의 변수로 추출해야 함을 나타내며, 이 변수는 함수 내에서 사용할 수 있습니다.

```js
function userId({ id }) {
    return id;
}

console.log(userId(user)); // 42
```

추출된 변수의 이름을 정의할 수 있습니다. 여기에서는 `displayName`이라는 속성을 추출하고, 이를 함수 본문에서 사용하기 위해 `dname`으로 이름을 변경합니다.

```js
function userDisplayName({ displayName: dname }) {
    return dname;
}

console.log(userDisplayName(user)); // "jdoe"
```

중첩된 객체도 추출할 수 있습니다. 아래 예제에서는 `fullname.firstName` 속성이 `name`이라는 변수로 추출되는 모습을 보여줍니다.

```js
function whois({ displayName, fullName: { firstName: name } }) {
    return `${displayName} is ${name}`;
}

console.log(whois(user)); // "jdoe is Jane"
```

<br/>
<br/>

**Setting a function parameter's default value**

기본값은 `=`를 사용하여 지정할 수 있으며, 전달된 객체에 지정된 속성이 존재하지 않을 경우 변수 값으로 사용됩니다.

아래에서는 기본 크기가 `'big'`, 기본 좌표가 `x: 0, y: 0`, 그리고 기본 반지름이 `25`인 함수를 보여줍니다.

```js
function drawChart({ size = "big", coords = { x: 0, y: 0 }, radius = 25 } = {}) {
    console.log(size, coords, radius);
    // do some chart drawing
}

drawChart({
    coords: { x: 18, y: 30 },
    radius: 30,
});
```

위의 `drawChart` 함수 signature에서 구조 분해 할당의 왼쪽 부분은 기본값으로 빈 객체 `= {}`를 가지고 있습니다.

기본값 없이 함수를 작성할 수도 있었겠지만, 기본값을 생략하면 함수 호출 시 최소한 하나의 인자를 제공해야 합니다. 현재 형태에서는 `drawChart()`를 호출할 때 매개변수를 제공하지 않아도 되지만, 기본값이 없으면 최소한 빈 객체 리터럴인 `{}`를 제공해야 합니다.

자세한 내용은 기본 매개변수 > 기본값 할당이 있는 구조 분해 매개변수를 참조하세요.

<br/>
<br/>

**Nested object and array destructuring**

```js
const metadata = {
    title: "Scratchpad",
    translations: [
        {
            locale: "de",
            localizationTags: [],
            lastEdit: "2014-04-14T08:43:37",
            url: "/de/docs/Tools/Scratchpad",
            title: "JavaScript-Umgebung",
        },
    ],
    url: "/en-US/docs/Tools/Scratchpad",
};

const {
    title: englishTitle, // rename
    translations: [
        {
            title: localeTitle, // rename
        },
    ],
} = metadata;

console.log(englishTitle); // "Scratchpad"
console.log(localeTitle); // "JavaScript-Umgebung"
```

<br/>
<br/>

**For of iteration and destructuring**

```js
const people = [
    {
        name: "Mike Smith",
        family: {
            mother: "Jane Smith",
            father: "Harry Smith",
            sister: "Samantha Smith",
        },
        age: 35,
    },
    {
        name: "Tom Jones",
        family: {
            mother: "Norah Jones",
            father: "Richard Jones",
            brother: "Howard Jones",
        },
        age: 25,
    },
];

for (const {
    name: n,
    family: { father: f },
} of people) {
    console.log(`Name: ${n}, Father: ${f}`);
}

// "Name: Mike Smith, Father: Harry Smith"
// "Name: Tom Jones, Father: Richard Jones"
```

<br/>
<br/>

**Computed object property names and destructuring**

Computed property names, like on object literals, can be used with destructuring.

```Js
const key = "z";
const { [key]: foo } = { z: "bar" };

console.log(foo); // "bar"
```

**Invalid JavaScript identifier as a property name**

Destructuring can be used with property names that are not valid JavaScript identifiers by providing an alternative identifier that is valid.

```js
const foo = { "fizz-buzz": true };
const { "fizz-buzz": fizzBuzz } = foo;

console.log(fizzBuzz); // true
```

<br/>
<br/>

**Destructuring primitive values**

객체 구조 분해는 거의 속성 접근과 동일합니다. 즉, 원시 값을 구조 분해하려고 하면 해당 값이 해당하는 래퍼 객체로 감싸지고, 그 래퍼 객체에서 속성에 접근하게 됩니다.

```js
const { a, toFixed } = 1;
console.log(a, toFixed); // undefined ƒ toFixed() { [native code] }
```

Same as accessing properties, destructuring null or undefined throws a `TypeError`.

```js
const { a } = undefined; // TypeError: Cannot destructure property 'a' of 'undefined' as it is undefined.
const { b } = null; // TypeError: Cannot destructure property 'b' of 'null' as it is null.
```

<br/>
<br/>

**Combined array and object destructuring**

배열과 객체 구조 분해 할당은 함께 사용할 수 있습니다. 예를 들어, 아래의 `props` 배열에서 세 번째 요소를 가져오고, 그 요소의 객체에서 `name` 속성을 가져오고 싶다면, 다음과 같이 할 수 있습니다:

```js
const props = [
    { id: 1, name: "Fizz" },
    { id: 2, name: "Buzz" },
    { id: 3, name: "FizzBuzz" },
];

const [, , { name }] = props;

console.log(name); // "FizzBuzz"
```
