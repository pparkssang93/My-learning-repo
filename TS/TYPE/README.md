# 타입 TYPE

## 원시타입 The primitives

-   **string**은 `"Hello, world"`와 같은 문자열 값을 나타냅니다
-   **number**은 `42`와 같은 숫자를 나타냅니다. JavaScript는 정수를 위한 런타임 값을 별도로 가지지 않으므로, `int` 또는 `float`과 같은 것은 존재하지 않습니다. 모든 수는 단순히 `number`입니다
-   **boolean**은 `true`와 `false`라는 두 가지 값만을 가집니다

## Arrays

`[1, 2, 3]`과 같은 배열의 타입을 지정할 때 `number[]` 구문을 사용할 수 있습니다. 이 구문은 모든 타입에서 사용할 수 있습니다. 위 타입은 `Array<number>`와 같은 형태로 적을 수 있으며, 동일한 의미를 가집니다.

`number[]` = `Array<number>`

`[number]`는 전혀 다른 의미를 가집니다.

## any

TypeScript는 `any`라고 불리는 특별한 타입을 가지고 있으며, 특정 값으로 인하여 타입 검사 오류가 발생하는 것을 원하지 않을 때 사용할 수 있습니다.

어떤 값의 타입이 `any`이면, 해당 값에 대하여 임의의 속성에 접근할 수 있고(이때 반환되는 값의 타입도 `any`입니다), 함수인 것처럼 호출할 수 있고, 다른 임의 타입의 값에 할당하거나(받거나), 그 밖에도 구문적으로 유효한 것이라면 무엇이든 할 수 있습니다.

```ts
let obj: any = { x: 0 };

// 아래 이어지는 코드들은 모두 오류 없이 정상적으로 실행됩니다.
// `any`를 사용하면 추가적인 타입 검사가 비활성화되며,
// 당신이 TypeScript보다 상황을 더 잘 이해하고 있다고 가정합니다.

obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

`any` 타입은 코드상의 특정 라인에 문제가 없다고 **TypeScript를 안심시킨다는 목적**, 긴 타입을 새로 정의하고 싶지 않을 때 유용하게 사용할 수 있습니다.

### noImplicitAny

타입이 지정되지 않은 값에 대해 TypeScript가 문맥으로부터 그 타입을 추론할 수 없다면, 컴파일러는 기본적으로 any 타입을 부여합니다.

하지만 이러한 상황은 일반적으로 선호되지 않습니다. 이유는 any가 타입 검사가 이루어지지 않기 때문입니다. 컴파일러 플래그 noImplicitAny를 사용하면 **암묵적으로 any로 간주되는 모든 경우에 오류가 발생**합니다.

## Type Annotations on Variables

`const`, `var`, 또는 `let` 등을 사용하여 변수를 선언할 때, 변수의 타입을 명시적으로 지정하기 위하여 타입 표기를 추가할 수 있으며 이는 선택 사항입니다.

```ts
let myName: string = "Alice";
```

하지만 대부분의 경우, 타입 표기는 필요하지 않습니다. 가능하다면 TypeScript는 자동으로 코드 내의 있는 타입들을 추론하고자 시도합니다. 예를 들어, 변수의 타입은 해당 변수의 초깃값의 타입을 바탕으로 추론됩니다. TypeScript tries to automatically infer the types in your code.

## Functions

함수는 JavaScript에서 데이터를 주고 받는 주요 수단입니다. TypeScript에서는 함수의 입력 및 출력 타입을 지정할 수 있습니다.

### Parameter Type Annotations

함수를 선언할 때, 함수가 허용할 매개변수 타입을 선언하기 위하여 각 매개변수 뒤에 타입을 표기할 수 있습니다. 매개변수 타입은 매개변수 이름 뒤에 표기합니다.

```ts
// 매개변수 타입 표기
function greet(name: string) {
    console.log("Hello, " + name.toUpperCase() + "!!");
}
```

When a parameter has a type annotation, 해당 함수에 대한 인자는 검사가 이루어집니다.

매개변수에 타입을 표기하지 않았더라도, 여전히 TypeScript는 올바른 개수의 인자가 전달되었는지 여부를 검사합니다.

### Return Type Annotations

You can also add return type annotations. 반환 타입은 매개변수 목록 뒤에 표기합니다.

```ts
function getFavoriteNumber(): number {
    return 26;
}
```

변수의 타입 표기와 마찬가지로, 반환 타입은 표기하지 않아도 되는 것이 일반적입니다. 왜냐하면 TypeScript가 해당 함수에 들어있는 `return` 문을 바탕으로 반환 타입을 추론할 것이기 때문입니다. 위 예시에서 사용된 타입 표기는 큰 의미를 갖지 않습니다. 때에 따라 문서화를 목적으로, 또는 코드의 잘못된 수정을 미연에 방지하고자, 혹은 지극히 개인적인 선호에 의하여 명시적인 타입 표기를 수행하는 코드도 존재합니다.

### Functions Which Return Promises

If you want to annotate the return type of a function which returns a promise, you should use the `Promise` type:

```ts
async function getFavoriteNumber(): Promise<number> {
    return 26;
}
```

### Anonymous Functions\

익명 함수는 함수 선언과는 조금 다릅니다. 함수가 코드상에서 위치한 곳을 보고 해당 함수가 어떻게 호출될지 알아낼 수 있다면, TypeScript는 해당 함수의 매개 변수에 자동으로 타입을 부여합니다.

```ts
// 아래 코드에는 타입 표기가 전혀 없지만, TypeScript는 버그를 감지할 수 있습니다.
const names = ["Alice", "Bob", "Eve"];

// 함수에 대한 문맥적 타입 부여
names.forEach(function (s) {
    console.log(s.toUppercase());

    // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});

// 화살표 함수에도 문맥적 타입 부여는 적용됩니다
names.forEach((s) => {
    console.log(s.toUppercase());

    // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
```

매개 변수 `s`에는 타입이 표기되지 않았음에도 불구하고, TypeScript는 `s`의 타입을 알아내기 위하여 배열의 추론된 타입과 더불어 `forEach` 함수의 타입을 활용하였습니다.

이 과정은 contextual typing(문맥적 타입 부여)라고 불리는데, 왜냐하면 함수가 실행되는 문맥을 통하여 해당 함수가 가져야 하는 타입을 알 수 있기 때문입니다. 추론 규칙과 비슷하게, 이 과정이 어떻게 일어나는지를 명시적으로 배울 필요는 없지만, 이것이 실제로 일어나는 과정이라는 것을 이해하면 타입 표기가 불필요한 경우를 구분하는 데에 도움이 됩니다.

## Object Types

원시 타입을 제외하고 가장 많이 마주치는 타입은 객체 타입입니다. 객체는 프로퍼티를 가지는 JavaScript 값을 말하는데, 대부분의 경우가 이에 해당하죠! 객체 타입을 정의하려면, 해당 객체의 프로퍼티들과 각 프로퍼티의 타입들을 나열하기만 하면 됩니다.

예를 들어, 아래 함수는 좌표로 보이는 객체를 인자로 받고 있습니다.

```ts
// 매개 변수의 타입은 객체로 표기되고 있습니다.
function printCoord(pt: { x: number; y: number }) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 3, y: 7 });
```

위에서 매개변수는 `x`와 `y`라는 두 개의 프로퍼티로 이루어진 타입으로 표기되고 있는데, 두 값은 모두 `number` 타입입니다. 각 프로퍼티를 구분할 때 `,` 또는 `;`를 사용할 수 있고, 가장 마지막에 위치한 구분자의 표기는 선택 사항입니다.

각 프로퍼티의 타입 표기 또한 선택 사항입니다. 만약 타입을 지정하지 않는다면, 해당 프로퍼티는 `any` 타입으로 간주합니다.

### Optional Properties

객체 타입은 일부 또는 모든 프로퍼티의 타입을 **선택적인 타입**, 즉 옵셔널로 지정할 수 있습니다. 프로퍼티 이름 뒤에 `?`를 붙이면 됩니다.

```ts
function printName(obj: { first: string; last?: string }) {
    // ...
}

// 둘 다 OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

JavaScript에서는 존재하지 않는 프로퍼티에 접근하였을 때, 런타임 오류가 발생하지 않고 `undefined` 값을 얻게 됩니다. 이 때문에 **옵셔널 프로퍼티를 읽었을 때, 해당 값을 사용하기에 앞서 `undefined`인지 여부를 확인해야 합니다.**

```ts
function printName(obj: { first: string; last?: string }) {
    // 오류 - `obj.last`의 값이 제공되지 않는다면 프로그램이 멈추게 됩니다!
    console.log(obj.last.toUpperCase());

    // 'obj.last' is possibly 'undefined'.'obj.last' is possibly 'undefined'.
    if (obj.last !== undefined) {
        // OK
        console.log(obj.last.toUpperCase());
    }

    // 최신 JavaScript 문법을 사용하였을 때 또 다른 안전한 코드
    console.log(obj.last?.toUpperCase());
}
```

## Union Types

TypeScript의 타입 시스템에서는 기존의 타입을 기반으로 **다양한 연산자를 사용하여 새로운 타입을 만들 수 있습니다.** 몇몇 타입들을 사용하는 법을 알았으니, 이제 이 타입들을 *조합하여* 흥미로운 방식으로 사용해 볼 시간입니다.

### Defining a Union Type

타입을 조합하는 첫 번째 방법은 유니언 타입을 사용하는 것입니다. 유니언 타입은 서로 다른 두 개 이상의 타입들을 사용하여 만드는 것으로, 유니언 타입의 값은 타입 조합에 사용된 타입 중 무엇이든 하나를 타입으로 가질 수 있습니다. 조합에 사용된 각 타입을 유니언 타입의 멤버라고 부릅니다.

문자열 또는 숫자를 받을 수 있는 함수를 작성해보겠습니다.

```ts
function printId(id: number | string) {
    console.log("Your ID is: " + id);
}

// OK
printId(101);

// OK
printId("202");

// 오류
printId({ myID: 22342 });

// Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
```

### Working with Union Types

유니언 타입에 맞는 값을 제공하는 것은 간단합니다. 유니언 타입의 멤버 중 하나에 해당하는 타입을 제공하면 됩니다. 유니언 타입인 값이 코드상에 존재할 때, 이를 어떻게 사용해야 할까요?

TypeScript에서 유니언을 다룰 때는 해당 유니언 타입의 모든 멤버에 대하여 유효한 작업일 때에만 허용됩니다. 예를 들어 `string | number`라는 유니언 타입의 경우, `string` 타입에만 유효한 메서드는 사용할 수 없습니다.

```ts
function printId(id: number | string) {
    console.log(id.toUpperCase());

    // Property 'toUpperCase' does not exist on type 'string | number'. Property 'toUpperCase' does not exist on type 'number'.Property 'toUpperCase' does not exist on type 'string | number'. Property 'toUpperCase' does not exist on type 'number'.
}
```

The solution is to narrow the union with code, 이는 타입 표기가 없는 JavaScript에서 벌어지는 일과 동일합니다. **Narrowing**란 TypeScript가 코드 구조를 바탕으로 어떤 값을 보다 구체적인 타입으로 추론할 수 있을 때 발생합니다.

예를 들어, TypeScript는 오직 `string` 값만이 `typeof` 연산의 결괏값으로 `"string"`을 가질 수 있다는 것을 알고 있습니다.

```ts
function printId(id: number | string) {
    if (typeof id === "string") {
        // In this branch, id is of type 'string'
        console.log(id.toUpperCase());
    } else {
        // Here, id is of type 'number'
        console.log(id);
    }
}

// OR

function welcomePeople(x: string[] | string) {
    if (Array.isArray(x)) {
        // 여기에서 'x'는 'string[]' 타입입니다
        console.log("Hello, " + x.join(" and "));
    } else {
        // 여기에서 'x'는 'string' 타입입니다
        console.log("Welcome lone traveler " + x);
    }
}
```

`else` 분기 문에서는 별도 처리를 하지 않아도 된다는 점에 유의하시기 바랍니다. `x`의 타입이 `string[]`가 아니라면, `x`의 타입은 반드시 `string`일 것입니다.

때로는 유니언의 모든 멤버가 무언가 공통점을 가질 수도 있습니다. 에를 들어, 배열과 문자열은 둘 다 `slice` 메서드를 내장합니다. 유니언의 모든 type이 어떤 프로퍼티를 **공통으로 가진다면,** 좁히기 없이도 해당 프로퍼티를 사용할 수 있게 됩니다.

```ts
// 반환 타입은 'number[] | string'으로 추론됩니다
function getFirstThree(x: number[] | string) {
    return x.slice(0, 3);
}
```

## Type Aliases

지금까지는 객체 타입과 유니언 타입을 사용할 때 직접 해당 타입을 표기하였습니다. 이는 편리하지만, 똑같은 타입을 한 번 이상 **재사용하거나 또 다른 이름으로 부르고 싶은 경우**도 존재합니다.

타입 별칭은 바로 이런 경우를 위하여 존재하며, 타입을 위한 이름을 제공합니다. 타입 별칭의 구문은 아래와 같습니다.

```ts
type Point = {
    x: number;
    y: number;
};

// 앞서 사용한 예제와 동일한 코드입니다

function printCoord(pt: Point) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

타입 별칭을 사용하면 단지 객체 타입이 아닌 모든 타입에 대하여 새로운 이름을 부여할 수 있습니다. 예를 들어, 아래와 같이 유니언 타입에 대하여 타입 별칭을 부여할 수도 있습니다.

```ts
type ID = number | string;`
```

타입 별칭은 단지 별칭에 지나지 않는다는 점에 유의하시기 바랍니다. 즉, 타입 별칭을 사용하여도 동일 타입에 대하여 각기 구별되는 “여러 버전”을 만드는 것은 아닙니다. 별칭을 사용하는 것은, 별도로 이름 붙인 타입을 새로 작성하는 것입니다. 다시 말해, 아래 코드는 틀린 것처럼 보일 수 있지만, TypeScript에서는 이것이 정상인데 그 이유는 각각의 타입들이 동일 타입에 대한 별칭들이기 때문입니다.

```ts
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
    return sanitize(str);
}

// 보안 처리를 마친 입력을 생성
let userInput = sanitizeInput(getInput());

// 물론 새로운 문자열을 다시 대입할 수도 있습니다
userInput = "new input";
```

## Interfaces

인터페이스는 객체 타입을 만드는 또 다른 방법입니다.

```ts
interface Point {
    x: number;
    y: number;
}

function printCoord(pt: Point) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

타입 별칭을 사용한 경우와 마찬가지로, 위 예시 코드는 마치 타입이 없는 임의의 익명 객체를 사용하는 것처럼 동작합니다. TypeScript는 오직 `printCoord`에 전달된 값의 구조에만 관심을 가집니다. 즉, 예측된 프로퍼티를 가졌는지 여부만을 따집니다. 이처럼, 타입이 가지는 구조와 능력에만 관심을 가진다는 점은 TypeScript가 구조적 타입 시스템이라고 불리는 이유입니다.

### Differences Between Type Aliases and Interfaces

타입 별칭과 인터페이스는 매우 유사하며, 대부분의 경우 둘 중 하나를 자유롭게 선택하여 사용할 수 있습니다. `interface`가 가지는 대부분의 기능은 `type`에서도 동일하게 사용 가능합니다. 이 둘의 가장 핵심적인 차이는, Type Aliases은 새 프로퍼티를 추가하도록 개방될 수 없는 반면, Interfaces의 경우 항상 확장될 수 있다는 점입니다.

#### Interfaces

**Extending an interface**

```ts
interface Animal {
    name: string;
}

interface Bear extends Animal {
    honey: boolean;
}
const bear = getBear();
bear.name;
bear.honey;
```

**Adding new fields to an existing interface**

```ts
interface Window {
    title: string;
}

interface Window {
    ts: TypeScriptAPI;
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

#### Type

**Extending a type via intersections**

```ts
type Animal = {
    name: string;
};

type Bear = Animal & {
    honey: boolean;
};

const bear = getBear();
bear.name;
bear.honey;
```

**A type cannot be changed after being created**

```typescript
type Window = {
    title: string;
};

type Window = {
    ts: TypeScriptAPI;
};

// Error: Duplicate identifier 'Window'.
```

잘 모르겠다면, 우선 `interface`를 사용하고 이후 문제가 발생하였을 때 `type`을 사용하기 바랍니다.

## Type Assertions

TypeScript보다 당신이 어떤 값의 타입에 대한 정보를 더 잘 아는 경우도 존재합니다.

예를 들어 코드상에서 `document.getElementById`가 사용되는 경우, TypeScript는 이때 `HTMLElement` 중에 무언가가 반환된다는 것만을 알 수 있는 반면에, 당신은 페이지 상에서 사용되는 ID로는 언제나 `HTMLCanvasElement`가 반환된다는 사실을 이미 알고 있을 수도 있습니다.

이런 경우, 타입 단언을 사용하면 타입을 좀 더 구체적으로 명시할 수 있습니다.

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Like a type annotation, 타입 단언은 컴파일러에 의해 제거되며 코드의 런타임 동작에는 영향을 주지 않습니다.

`< >`를 사용하는 것 또한 (코드가 `.tsx` 파일이 아닌 경우) 가능하며, 이는 동일한 의미를 가집니다.

```ts
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

타입 단언은 컴파일 시간에 제거되므로, 타입 단언에 관련된 검사는 런타임 중에 이루어지지 않습니다. 타입 단언이 틀렸더라도 예외가 발생하거나 `null`이 생성되지 않을 것입니다.

TypeScript only allows type assertions which convert to a more specific or less specific version of a type. 이러한 규칙은 아래와 같은 “불가능한” 강제 변환을 방지합니다.

```ts
const x = "hello" as number;

// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
```

이 규칙이 때로는 지나치게 보수적으로 작용하여, 복잡하기는 하지만 유효할 수 있는 강제 변환이 허용되지 않기도 합니다. 이런 경우, 두 번의 단언을 사용할 수 있습니다. `any`(또는 이후에 소개할 `unknown`)로 우선 변환한 뒤, 그다음 원하는 타입으로 변환하면 됩니다.

```ts
const a = expr as any as T;
```

## Literal Types

`string`과 `number`와 같은 일반적인 타입 이외에도, *구체적인* 문자열과 숫자 값을 지정할 수 있습니다.

이를 이해하려면, JavaScript에서 변수 선언에 제공되는 다양한 방법들을 떠올려보시기 바랍니다. `var`와 `let` 모두 변수에 저장 가능한 값의 종류를 변경할 수 있으며, **`const`는 이것이 불가능합니다.** 이러한 특징들은 TypeScript가 리터럴 값을 위한 타입을 생성하는 방식에 그대로 반영됩니다.

```ts
let changingString = "Hello World";
changingString = "Olá Mundo";
// 변수 `changingString`은 어떤 문자열이든 모두 나타낼 수 있으며,
// 이는 TypeScript의 타입 시스템에서 문자열 타입 변수를 다루는 방식과 동일합니다.
let changingString: string;

const constantString = "Hello World";
// 변수 `constantString`은 오직 단 한 종류의 문자열만 나타낼 수 있으며,
// 이는 리터럴 타입의 표현 방식입니다.

const constantString: "Hello World";
```

```ts
let x: "hello" = "hello";

// OK
x = "hello";
x = "howdy";

Type '"howdy"' is not assignable to type '"hello"'.
```

단 하나의 값만을 가질 수 있는 변수는 그다지 쓸모가 없죠!

하지만 리터럴을 유니언과 함께 사용하면, 보다 유용한 개념들을 표현할 수 있게 됩니다. 예를 들어, 특정 종류의 값들만을 인자로 받을 수 있는 함수를 정의하는 경우가 있습니다.

```ts
function printText(s: string, alignment: "left" | "right" | "center") {
    // ...
}

printText("Hello, world", "left");
printText("G'day, mate", "centre");
// Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.

function compare(a: string, b: string): -1 | 0 | 1 {
    return a === b ? 0 : a > b ? 1 : -1;
}
```

물론, 리터럴이 아닌 타입과도 함께 사용할 수 있습니다.

```ts
interface Options {
    width: number;
}

function configure(x: Options | "auto") {
    // ...
}

configure({ width: 100 });
configure("auto");
configure("automatic");
// Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

또 하나의 리터럴 타입이 있습니다. 바로 `boolean` 리터럴 타입입니다. `boolean` 리터럴에는 오직 두 개의 타입만이 존재하며, 이는 익히 예상하셨듯이 `true`와 `false입니다. `boolean` 타입 자체는 사실 단지 `true | false` 유니언 타입의 별칭입니다.

### Literal Inference

객체를 사용하여 변수를 초기화하면, TypeScript는 해당 객체의 프로퍼티는 이후에 그 값이 변화할 수 있다고 가정합니다. 예를 들어, 아래와 같은 코드를 작성하는 경우를 보겠습니다.

```ts
const obj = { counter: 0 };

if (someCondition) {
    obj.counter = 1;
}
```

기존에 값이 `0`이었던 필드에 `1`을 대입하였을 때 TypeScript는 이를 오류로 간주하지 않습니다. 이를 달리 말하면 `obj.counter`는 반드시 `number` 타입을 가져야 하며, `0` 리터럴 타입을 가질 수 없다는 의미입니다. 왜냐하면 타입은 읽기 및 쓰기 두 동작을 결정하는 데에 사용되기 때문입니다.

동일한 사항이 문자열에도 적용됩니다.

```ts
const req = { url: "https://example.com", method: "GET" };

handleRequest(req.url, req.method);
// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

위 예시에서 `req.method`는 `string`으로 추론되지, `"GET"`으로 추론되지 않습니다. `req`의 생성 시점과 `handleRequest`의 호출 시점 사이에도 얼마든지 코드 평가가 발생할 수 있고, 이때 `req.method`에 `"GUESS"`와 같은 새로운 문자열이 대입될 수도 있으므로, TypeScript는 위 코드에 오류가 있다고 판단합니다.

이러한 경우를 해결하는 데에는 두 가지 방법이 있습니다.

1. 둘 중에 한 위치에 타입 단언을 추가하여 추론 방식을 변경할 수 있습니다.

```ts
// step 1:
const req = { url: "https://example.com", method: "GET" as "GET" };

// step 2
handleRequest(req.url, req.method as "GET");
```

**step 1**은 `req.method`가 항상 리터럴 타입 `"GET"`이기를 의도하며, 이에 따라 해당 필드에 `"GUESS"`와 같은 값이 대입되는 경우를 미연에 방지하겠다”는 것을 의미합니다.

**step 2** I know for other reasons that `req.method` has the value `"GET"`

2. `as const`를 사용하여 객체 전체를 리터럴 타입으로 변환할 수 있습니다.

```ts
const req = { url: "https://example.com", method: "GET" } as const;

handleRequest(req.url, req.method);
```

`as const` 접미사는 일반적인 `const`와 유사하게 작동하는데, 해당 객체의 모든 프로퍼티에 `string` 또는 `number`와 같은 보다 일반적인 타입이 아닌 리터럴 타입의 값이 대입되도록 보장합니다.

## `null`과 `undefined`

JavaScript에는 빈 값 또는 초기화되지 않은 값을 가리키는 두 가지 원시값이 존재합니다. 바로 `null`과 `undefined`입니다.

TypeScript에는 각 값에 대응하는 동일한 이름의 두 가지 타입이 존재합니다. 각 타입의 동작 방식은 `strictNullChecks` 옵션의 설정 여부에 따라 달라집니다.

### `strictNullChecks`

**`strictNullChecks`가 설정되지 않았을 때**

`strictNullChecks`가 설정되지 않았다면, 어떤 값이 `null` 또는 `undefined`일 수 있더라도 해당 값에 평소와 같이 접근할 수 있으며, `null`과 `undefined`는 모든 타입의 변수에 대입될 수 있습니다. 이는 Null 검사를 하지 않는 언어(C#, Java 등)의 동작 방식과 유사합니다. Null 검사의 부재는 버그의 주요 원인이 되기도 합니다. 별다른 이유가 없다면, 코드 전반에 걸쳐 **`strictNullChecks` 옵션을 설정하는 것을 항상 권장**합니다.

**`strictNullChecks` 설정되었을 때**

`strictNullChecks`가 설정되었다면, 어떤 값이 `null` 또는 `undefined`일 때, 해당 값과 함께 메서드 또는 프로퍼티를 사용하기에 앞서 해당 값을 테스트해야 합니다. 옵셔널 프로퍼티를 사용하기에 앞서 `undefined` 여부를 검사하는 것과 마찬가지로,  **Narrowing** 통하여 `null`일 수 있는 값에 대한 검사를 수행할 수 있습니다.

```ts
function doSomething(x: string | undefined) {
    if (x === undefined) {
        // 아무 것도 하지 않는다
    } else {
        console.log("Hello, " + x.toUpperCase());
    }
}
```

### Non-null Assertion Operator (Postfix `!`)

TypeScript에서는 명시적인 검사를 하지 않고도 타입에서 `null`과 `undefined`를 제거할 수 있는 특별한 구문을 제공합니다. 표현식 뒤에 `!`를 작성하면 해당 값이 `null` 또는 `undefined`가 아니라고 타입 단언하는 것입니다.

```ts
function liveDangerously(x?: number | undefined) {
    // 오류 없음
    console.log(x!.toFixed());
}
```

다른 타입 단언과 마찬가지로 이 구문은 코드의 런타임 동작을 변화시키지 않으므로, `!` 연산자는 반드시 해당 값이 `null` 또는 `undefined`가 아닌 경우에만 사용해야 합니다.

## Enums

열거형은 **TypeScript가 JavaScript에 추가하는 기능**으로, 어떤 값이 이름이 있는 상수 집합에 속한 값 중 하나일 수 있도록 제한하는 기능입니다. 대부분의 TypeScript 기능과 달리, 이 기능은 JavaScript에 타입 수준이 아닌, 언어와 런타임 수준에 추가되는 기능입니다. 따라서 열거형이 무엇인지는 알 필요가 있겠으나, 그 사용법을 명확하게 파악하지 않았다면 실제 사용은 보류하는 것이 좋습니다.
