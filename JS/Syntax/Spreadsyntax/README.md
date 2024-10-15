# Spread syntax (...)

전개 구문(`...`)은 배열이나 문자열과 같은 반복 가능한 객체(iterable)를, 함수 호출 시 필요한 0개 이상의 인수나 배열 리터럴에서 **필요한 요소로 확장**할 수 있게 해줍니다. 객체 리터럴에서는 전개 구문이 객체의 속성을 열거하고, 생성되는 객체에 키-값 쌍을 추가합니다.

전개 구문은 Rest parameters과 정확히 동일한 형태를 가지고 있습니다. 어떤 면에서는 전개 구문이 나머지 구문의 반대라고 할 수 있습니다. 전개 구문은 배열을 그 요소로 "확장"하는 반면, 나머지 구문은 여러 요소를 수집하여 "응축"하여 단일 요소로 만듭니다.

나머지 매개변수(rest parameters)와 나머지 속성(rest property)을 참고하세요.

```js
function sum(x, y, z) {
    return x + y + z;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers));
// Expected output: 6

console.log(sum.apply(null, numbers));
// Expected output: 6
```

<br/>
<br/>
<br/>
<br/>

## SYNTAX

```js
myFunction(a, ...iterableObj, b)
[1, ...iterableObj, '4', 'five', 6]
{ ...obj, key: 'value' }
```

<br/>
<br/>
<br/>
<br/>

## Description

**전개 구문은 객체나 배열의 모든 요소를 새로운 배열이나 객체에 포함해야 하거나, 함수 호출의 인수 목록에서 각각의 요소를 하나씩 적용해야 할 때 사용될 수 있습니다.** There are three distinct places that accept the spread syntax:

-   Function arguments list (`myFunction(a, ...iterableObj, b)`)
-   Array literals (`[1, ...iterableObj, '4', 'five', 6]`)
-   Object literals (`{ ...obj, key: 'value' }`)

Although the syntax looks the same, 약간 다른 의미를 가지고 있습니다.

Only iterable values, like Array and String, can be spread in array literals and argument lists. Many objects are not iterable, 여기에는 Symbol.iterator 메서드가 없는 모든 일반 객체가 포함됩니다.

```js
❌ Don't use

const obj = { key1: "value1" };
const array = [...obj]; // TypeError: obj is not iterable
```

반면, spreading in object 값의 고유 속성을 열거합니다. 일반적인 배열의 경우, 모든 인덱스는 열거 가능한 고유 속성이므로, 배열은 객체로 전개될 수 있습니다.

```js
const array = [1, 2, 3];
const obj = { ...array }; // { 0: 1, 1: 2, 2: 3 }
```

**All primitives can be spread in objects.** 오직 문자열만이 열거 가능한 고유 속성을 가지고 있으며, 다른 원시값을 전개하면 새로운 객체에 속성이 생성되지 않습니다.

```js
const obj = { ...true, ..."test", ...10 };
// { '0': 't', '1': 'e', '2': 's', '3': 't' }
```

함수 호출에서 전개 구문을 사용할 때, 자바스크립트 엔진의 인수 길이 제한을 초과할 가능성에 유의해야 합니다. 자세한 내용은 `Function.prototype.apply()`를 참조하세요.

<br/>
<br/>
<br/>
<br/>

## Array Examples

### Copying an array

```js
const arr = [1, 2, 3];
const arr2 = [...arr]; // like arr.slice()

arr2.push(4);
// arr2 becomes [1, 2, 3, 4]
// arr remains unaffected
```

Spread syntax effectively goes one level deep while copying an array. 따라서 다차원 배열을 복사하는 데는 적합하지 않을 수 있습니다. `Object.assign()`도 마찬가지 - 자바스크립트에는 깊은 복사(deep clone)를 수행하는 기본적인 방법이 없습니다. 웹 API 메서드인 `structuredClone()`은 특정 지원되는 유형의 값을 깊게 복사할 수 있게 해줍니다. 더 자세한 내용은 얕은 복사(shallow copy)를 참조하세요.

```js
❌ Don't use
const a = [[1], [2], [3]];
const b = [...a];

b.shift().shift();
// 1

// Oh no! Now array 'a' is affected as well:
console.log(a);
// [[], [2], [3]]
```

<br/>
<br/>

### A better way to concatenate arrays

`Array.prototype.concat()` is often used to concatenate an array to the end of an existing array. Without spread syntax, this is done as:

```js
let arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];

// Append all items from arr2 onto arr1
arr1 = arr1.concat(arr2);
```

With spread syntax this becomes:

```js
let arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];

arr1 = [...arr1, ...arr2];
// arr1 is now [0, 1, 2, 3, 4, 5]
```

`Array.prototype.unshift()` is often used to insert an array of values at the start of an existing array. Without spread syntax, this is done as:

```js
const arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];

//  Prepend all items from arr2 onto arr1
Array.prototype.unshift.apply(arr1, arr2);
console.log(arr1); // [3, 4, 5, 0, 1, 2]
```

With spread syntax, this becomes:

```js
let arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];

arr1 = [...arr2, ...arr1];
console.log(arr1); // [3, 4, 5, 0, 1, 2]
```

---

`unshift()`와 달리, 이는 원래의 `arr1` 배열을 제자리에서 수정하는 대신 새로운 `arr1`을 생성합니다.

<br/>
<br/>

### Conditionally adding values to an array

조건 연산자를 사용하여 조건에 따라 배열 리터럴에서 요소를 존재하게 하거나 없앨 수 있습니다.

```js
const isSummer = false;
const fruits = ["apple", "banana", ...(isSummer ? ["watermelon"] : [])];
// ['apple', 'banana']
```

When the condition is `false`, we spread an empty array, so that nothing gets added to the final array. Note that this is different from the following:

```js
const fruits = ["apple", "banana", isSummer ? "watermelon" : undefined];
// ['apple', 'banana', undefined]
```

이 경우, `isSummer`가 `false`일 때 추가적인 `undefined` 요소가 배열에 추가되며, and this element will be visited by methods such as `Array.prototype.map()`.

<br/>
<br/>
<br/>
<br/>

## Object Examples

### Copying and merging objects

```js
const obj1 = { foo: "bar", x: 42 };
const obj2 = { bar: "baz", y: 13 };

const mergedObj = { ...obj1, ...obj2 };
// { foo: "bar", x: 42, bar: "baz", y: 13 }
```

A single spread는 원래 객체의 얕은 복사를 생성합니다(단, 열거할 수 없는 속성은 제외되며 프로토타입도 복사되지 않음). 이는 배열을 복사하는 것과 유사합니다.

```js
const clonedObj = { ...obj1 };
// { foo: "bar", x: 42 }
```

<br/>
<br/>

### Overriding properties

한 객체가 다른 객체에 전개되거나 여러 객체가 하나의 객체에 전개될 때, 동일한 이름의 속성이 발견되면, 해당 속성은 **마지막에 할당된 값을 가지며** 원래 설정된 위치에 남아 있게 됩니다.

```js
const obj1 = { foo: "bar", x: 42 };
const obj2 = { foo: "baz", y: 13 };

const mergedObj = { x: 41, ...obj1, ...obj2, y: 9 }; // { x: 42, foo: "baz", y: 9 }
```

### Conditionally adding properties to an object

조건 연산자를 사용하여 조건에 따라 객체 리터럴에서 요소를 존재하게 하거나 없앨 수 있습니다.

```js
const isSummer = false;
const fruits = {
    apple: 10,
    banana: 5,
    ...(isSummer ? { watermelon: 30 } : {}),
};
// { apple: 10, banana: 5 }
```

The case where the condition is `false` is an empty object, so that nothing gets spread into the final object. Note that this is different from the following:

```js
const fruits = {
    apple: 10,
    banana: 5,
    watermelon: isSummer ? 30 : undefined,
};
// { apple: 10, banana: 5, watermelon: undefined }
```

이 경우, `watermelon` 속성은 항상 존재하며 will be visited by methods such as `Object.keys()`.

원시값도 객체에 전개될 수 있고, 모든 `falsy` 값이 열거 가능한 속성을 가지지 않는다는 점을 고려할 때, 논리 `AND` 연산자를 간단히 사용할 수 있습니다.

```js
const isSummer = false;
const fruits = {
    apple: 10,
    banana: 5,
    ...(isSummer && { watermelon: 30 }),
};
```

이 경우, `isSummer`가 `falsy` 값인 경우 `fruits` 객체에 속성이 생성되지 않습니다.
