# JSON.stringify()

`JSON.stringify()` 정적 메서드는 JavaScript 값을 JSON 문자열로 변환합니다. 이때, 선택적으로 a replacer function이 지정된 경우 해당 함수를 통해 값을 변경할 수 있고, 대체 배열이 지정된 경우 지정된 속성만 포함하여 문자열로 변환할 수 있습니다.

```js
console.log(JSON.stringify({ x: 5, y: 6 }));
// Expected output: '{"x":5,"y":6}'

console.log(JSON.stringify([new Number(3), new String("false"), new Boolean(false)]));
// Expected output: '[3,"false",false]'

console.log(JSON.stringify({ x: [10, undefined, function () {}, Symbol("")] }));
// Expected output: '{"x":[10,null,null,null]}'

console.log(JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)));
// Expected output: '"2006-01-02T15:04:05.000Z"'
```

<br/>
<br/>
<br/>

## SYNTAX

```js
JSON.stringify(value);
JSON.stringify(value, replacer);
JSON.stringify(value, replacer, space);
```

<br/>

### Params

-   `value`
    The value to convert to a JSON string.

-   `replacer`
    이 함수는 문자열화 과정의 동작을 변경하거나, 출력에 포함될 값의 속성을 지정하는 문자열과 숫자 배열을 사용할 수 있습니다. 만약 `replacer`가 배열이라면, 이 배열에 포함된 값 중 문자열이나 숫자가 아닌 요소들(기본형 또는 래퍼 객체 포함), 예를 들어 `Symbol` 값 등은 완전히 무시됩니다. `replacer`가 함수나 배열이 아닌 경우(예: `null`이거나 제공되지 않은 경우), 객체의 모든 문자열 키 속성이 결과 `JSON` 문자열에 포함됩니다.

-   `space`
    이 값은 출력되는 JSON 문자열에 공백(들여쓰기, 줄바꿈 문자 등)을 추가하여 가독성을 높이기 위한 문자열 또는 숫자입니다.

    만약 숫자인 경우, 들여쓰기에 사용할 공백 문자의 개수를 나타내며, 최대 10으로 제한됩니다(즉, 10보다 큰 값은 10으로 처리됩니다). 1 미만의 값은 공백을 사용하지 않음을 의미합니다.

    문자열인 경우, 이 문자열(10자보다 길면 첫 10자)이 모든 중첩 객체나 배열 앞에 삽입됩니다.

    `space`가 문자열이나 숫자가 아닌 경우(기본형 또는 래퍼 객체 모두 가능)—예를 들어 `null`이거나 지정되지 않은 경우—공백은 사용되지 않습니다.

<br/>

### Return

주어진 값을 표현하는 JSON 문자열 또는 `undefined`입니다.

<br/>

### Exceptions

-   `typeError`
    Thrown in one of the following cases:

        -   `value` contains a circular reference (value에 순환 참조가 포함된 경우).
        -   A BigInt `value` is encountered (value에 BigInt 값이 포함된 경우).

<br/>
<br/>
<br/>

## Description

`JSON.stringify()`는 값을 해당 값이 나타내는 JSON 표기법으로 변환합니다. 값은 다음 방식으로 문자열화됩니다:

-   `Boolean`, `Number`, `String`, 그리고 `BigInt` 객체(Object()로 얻을 수 있음)는 문자열화 과정에서 해당 기본 값으로 변환됩니다.

-   `BigInt` 값을 직렬화하려고 하면 오류가 발생합니다. 그러나 `BigInt`에 `toJSON()` 메서드가 있는 경우(예: `BigInt.prototype.toJSON = ...`와 같은 방식으로 추가하는 경우), 해당 메서드가 직렬화 결과를 제공합니다. 이러한 제한은 올바른 직렬화(및 그에 따른 역직렬화) 동작이 항상 사용자에 의해 명시적으로 제공되도록 보장하기 위한 것입니다.

-   `undefined`, `Function`, 그리고 `Symbol` 값은 유효한 `JSON` 값이 아닙니다. 변환 중에 이러한 값이 발견되면, 객체 안에 있을 경우 무시되고, 배열 안에 있을 경우 `null`로 변경됩니다. `JSON.stringify()`에 `JSON.stringify(() => {})` 또는 `JSON.stringify(undefined)`처럼 "순수한" 값을 전달하면 `undefined`를 반환할 수 있습니다.

-   `Infinity`와 `NaN`, 그리고 `null` 값은 모두 `null`로 간주됩니다. (그러나 이전 항목의 값들과 달리 이들은 절대 무시되지 않습니다.)

-   배열은 배열로 직렬화되며(대괄호로 감싸짐), 0부터 길이 - 1까지(포함) 배열 인덱스만 직렬화됩니다. 다른 속성은 무시됩니다.

-   `JSON.rawJSON()`으로 생성된 특수 원시 JSON 객체는 그 객체가 포함하고 있는 원시 JSON 텍스트로 직렬화됩니다(원시 JSON 속성인 rawJSON에 접근하여).

-   다른 객체에 대한 내용은 다음과 같습니다:

    -   모든 `Symbol` 키 속성은 완전히 무시됩니다. 이는 `replacer` 매개변수를 사용할 때도 마찬가지입니다.

    -   값에 `toJSON()` 메서드가 있는 경우, 이 메서드가 어떤 데이터가 직렬화될지를 정의합니다. 즉, 객체가 직렬화되는 대신, 호출 시 반환되는 `toJSON()` 메서드의 값이 직렬화됩니다. `JSON.stringify()`는 `toJSON()`을 한 개의 매개변수(키)를 사용하여 호출합니다. 이 매개변수는 replacer 함수의 키 매개변수와 동일한 의미를 가집니다:

    -   이 객체가 속성 값인 경우, 속성 이름 배열에 있는 경우, 배열의 인덱스(문자열 형태) `JSON.stringify()`가 이 객체에 직접 호출된 경우, 빈 문자열 `Date` 객체는 `toJSON()` 메서드를 구현하여 문자열(즉, `date.toISOString()`과 동일)을 반환합니다. 따라서 `Date` 객체는 문자열로 직렬화됩니다.

    -   오직 열거 가능한 자신의 속성만 방문됩니다. 이는 `Map`, `Set` 등의 객체가 `{}`로 변환된다는 것을 의미합니다. `replacer` 매개변수를 사용하여 더 유용한 형태로 직렬화할 수 있습니다.

    -   속성은 `Object.keys()`와 동일한 알고리즘을 사용하여 방문됩니다. 이 알고리즘은 명확한 순서를 가지며, 구현 간에 안정적입니다. 예를 들어, 같은 객체에 대해 `JSON.stringify()`를 호출하면 항상 동일한 문자열을 생성하며, `JSON.parse(JSON.stringify(obj))`는 원래 객체와 동일한 키 순서를 가진 객체를 생성합니다(객체가 완전히 JSON으로 직렬화 가능하다고 가정할 때).

<br/>

### The replacer parameter

`replacer` 매개변수는 함수 또는 배열일 수 있습니다.

-   **As an array,** 배열의 요소는 결과 `JSON` 문자열에 포함될 객체의 속성 이름을 나타냅니다. 문자열 및 숫자 값만 고려되며, `Symbol` 키는 무시됩니다.

-   **As a function,** 이 함수는 두 개의 매개변수를 받습니다: 키와 직렬화되는 값. 키가 발견된 객체는 `replacer`의 `this` 컨텍스트로 제공됩니다.

`replacer` 함수는 직렬화되는 초기 객체에 대해서도 호출되며, 이 경우 키는 빈 문자열(`""`)입니다. 그 다음에는 직렬화되는 객체나 배열의 각 속성에 대해 호출됩니다. 배열 인덱스는 문자열 형태로 키로 제공됩니다. 현재 속성 값은 `replacer`의 반환 값으로 대체되어 문자열화됩니다. 이는 다음을 의미합니다:

-   숫자, 문자열, 불리언, 또는 null을 반환하면, 해당 값이 직접 직렬화되어 속성의 값으로 사용됩니다. (BigInt를 반환하면 오류가 발생합니다.)
-   `Function`, `Symbol`, 또는 `undefined`를 반환하면, 해당 속성은 출력에 포함되지 않습니다.
-   다른 객체를 반환하면, 그 객체는 재귀적으로 직렬화되며 각 속성에 대해 `replacer` 함수가 호출됩니다.

<br/>
<br/>
<br/>

## Example

### Using JSON.stringify

```js
JSON.stringify({}); // '{}'
JSON.stringify(true); // 'true'
JSON.stringify("foo"); // '"foo"'
JSON.stringify([1, "false", false]); // '[1,"false",false]'
JSON.stringify([NaN, null, Infinity]); // '[null,null,null]'
JSON.stringify({ x: 5 }); // '{"x":5}'

JSON.stringify(new Date(1906, 0, 2, 15, 4, 5));
// '"1906-01-02T15:04:05.000Z"'

JSON.stringify({ x: 5, y: 6 });
// '{"x":5,"y":6}'
JSON.stringify([new Number(3), new String("false"), new Boolean(false)]);
// '[3,"false",false]'

// String-keyed array elements are not enumerable and make no sense in JSON
const a = ["foo", "bar"];
a["baz"] = "quux"; // a: [ 0: 'foo', 1: 'bar', baz: 'quux' ]
JSON.stringify(a);
// '["foo","bar"]'

JSON.stringify({ x: [10, undefined, function () {}, Symbol("")] });
// '{"x":[10,null,null,null]}'

// Standard data structures
JSON.stringify([new Set([1]), new Map([[1, 2]]), new WeakSet([{ a: 1 }]), new WeakMap([[{ a: 1 }, 2]])]);
// '[{},{},{},{}]'

// TypedArray
JSON.stringify([new Int8Array([1]), new Int16Array([1]), new Int32Array([1])]);
// '[{"0":1},{"0":1},{"0":1}]'
JSON.stringify([new Uint8Array([1]), new Uint8ClampedArray([1]), new Uint16Array([1]), new Uint32Array([1])]);
// '[{"0":1},{"0":1},{"0":1},{"0":1}]'
JSON.stringify([new Float32Array([1]), new Float64Array([1])]);
// '[{"0":1},{"0":1}]'

// toJSON()
JSON.stringify({
    x: 5,
    y: 6,
    toJSON() {
        return this.x + this.y;
    },
});
// '11'

// Symbols:
JSON.stringify({ x: undefined, y: Object, z: Symbol("") });
// '{}'
JSON.stringify({ [Symbol("foo")]: "foo" });
// '{}'
JSON.stringify({ [Symbol.for("foo")]: "foo" }, [Symbol.for("foo")]);
// '{}'
JSON.stringify({ [Symbol.for("foo")]: "foo" }, (k, v) => {
    if (typeof k === "symbol") {
        return "a symbol";
    }
});
// undefined

// Non-enumerable properties:
JSON.stringify(
    Object.create(null, {
        x: { value: "x", enumerable: false },
        y: { value: "y", enumerable: true },
    })
);
// '{"y":"y"}'

// BigInt values throw
JSON.stringify({ x: 2n });
// TypeError: BigInt value can't be serialized in JSON
```

<br/>

### Using a function as replacer

```js
function replacer(key, value) {
    // Filtering out properties
    if (typeof value === "string") {
        return undefined;
    }
    return value;
}

const foo = {
    foundation: "Mozilla",
    model: "box",
    week: 45,
    transport: "car",
    month: 7,
};
JSON.stringify(foo, replacer);
// '{"week":45,"month":7}'
```

`replacer`가 초기 객체와 빈 문자열 속성을 가진 키를 구별하려면(둘 다 빈 문자열을 키로 가지며 잠재적으로 객체를 값으로 가질 수 있기 때문에), 반복 횟수를 추적해야 합니다. 만약 반복 횟수가 첫 번째 반복을 초과하면, 이는 진정한 빈 문자열 키입니다.

```js
function makeReplacer() {
    let isInitial = true;

    return (key, value) => {
        if (isInitial) {
            isInitial = false;
            return value;
        }
        if (key === "") {
            // Omit all properties with name "" (except the initial object)
            return undefined;
        }
        return value;
    };
}

const replacer = makeReplacer();
console.log(JSON.stringify({ "": 1, b: 2 }, replacer)); // "{"b":2}"
```

<br/>

### Using an array as replacer

```js
const foo = {
    foundation: "Mozilla",
    model: "box",
    week: 45,
    transport: "car",
    month: 7,
};

JSON.stringify(foo, ["week", "month"]);
// '{"week":45,"month":7}', only keep "week" and "month" properties
```

<br/>

### Using the space parameter

Indent the output with one space:

```js
console.log(JSON.stringify({ a: 2 }, null, " "));
/*
{
 "a": 2
}
*/
```

탭 문자를 사용하면 표준적인 가독성 높은 출력 형태를 모방할 수 있습니다:

```js
console.log(JSON.stringify({ uno: 1, dos: 2 }, null, "\t"));
/*
{
	"uno": 1,
	"dos": 2
}
*/
```

<br/>

### toJSON() behavior

Defining `toJSON()` for an object allows overriding its serialization behavior.

```js
const obj = {
    data: "data",

    toJSON(key) {
        return key ? `Now I am a nested object under key '${key}'` : this;
    },
};

JSON.stringify(obj);
// '{"data":"data"}'

JSON.stringify({ obj });
// '{"obj":"Now I am a nested object under key 'obj'"}'

JSON.stringify([obj]);
// '["Now I am a nested object under key '0'"]'
```
