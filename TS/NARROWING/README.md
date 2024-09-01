# 내로잉 Narrowing

```ts
function padLeft(padding: number | string, input: string): string {
    throw new Error("Not implemented yet!");
}
```

만약 padding이 숫자라면, 이는 입력 앞에 추가하고 싶은 공백의 수로 처리됩니다. padding이 문자열이라면, 그냥 입력 앞에 padding을 추가해야 합니다. 이제 padLeft에 숫자가 padding으로 전달되었을 때의  the logic을 구현해 보겠습니다.

```ts
function padLeft(padding: number | string, input: string): string {
    return " ".repeat(padding) + input;
    // Argument of type 'string | number' is not assignable to parameter of type 'number'. Type 'string' is not assignable to type 'number'.Argument of type 'string | number' is not assignable to parameter of type 'number'. Type 'string' is not assignable to type 'number'.
}
```

`padding`에서 오류가 발생하고 있습니다. TypeScript는 우리가 repeat 함수에 `number | string` 타입의 값을 전달하고 있다고 경고하고 있으며, 이는 맞는 말입니다. 다시 말해, 우리는 `padding`이 먼저 숫자인지 명시적으로 확인하지 않았고, 문자열인 경우를 처리하고 있지도 않습니다. 따라서 이제 정확히 그렇게 처리해 보겠습니다.

```ts
function padLeft(padding: number | string, input: string): string {
    if (typeof padding === "number") {
        return " ".repeat(padding) + input;
    }

    return padding + input;
}
```

이 코드가 별로 흥미롭지 않은 JavaScript 코드처럼 보인다면, 그게 바로 의도한 바입니다. 우리가 추가한 주석을 제외하면, 이 TypeScript 코드는 JavaScript와 매우 유사합니다. TypeScript의 타입 시스템은 타입 안전성을 확보하기 위해 지나치게 복잡하게 만들지 않고, 일반적인 JavaScript 코드를 쉽게 작성할 수 있도록 하는 것을 목표로 합니다.

비록 겉보기에는 별것 아닐지라도, 실제로는 많은 일이 진행되고 있습니다. TypeScript가 정적 타입을 사용하여 런타임 값을 분석하는 방식처럼, JavaScript의 런타임 제어 흐름 구조(예: `if/else`, 조건부 삼항, 루프, 진리 검사 등)에 타입 분석을 덧씌워 이러한 타입에 영향을 미칠 수 있습니다.

`if` 검사를 통해 TypeScript는 `typeof padding === "number"`를 보고 이를 **타입 가드**라는 특별한 형태의 코드로 이해합니다. TypeScript는 프로그램이 취할 수 있는 실행 경로를 따라가며 특정 위치에서 값의 가장 구체적인 타입을 분석합니다. 이러한 특별한 검사(타입 가드라고 불림)와 할당을 살펴보며, 선언된 것보다 더 구체적인 타입으로 타입을 정제하는 과정을 **'내로잉(narrowing)'**이라고 합니다.

```ts
function padLeft(padding: number | string, input: string): string {
    if (typeof padding === "number") {
        return " ".repeat(padding) + input;
    }

    return padding + input;
}
```

## `typeof` type guards

JavaScript는 런타임에서 값의 타입에 대한 매우 기본적인 정보를 제공하는 `typeof` 연산자를 지원합니다. TypeScript는 이 연산자가 특정 문자열 집합을 반환할 것으로 기대합니다:

-   `string`
-   `number`
-   `bigint`
-   `boolean`
-   `symbol`
-   `undefined`
-   `object`
-   `function`

우리가 `padLeft`에서 본 것처럼, `typeof`연산자는 여러 JavaScript 라이브러리에서 자주 사용되며, TypeScript는 이를 이해하여 different branches에서 타입을 narrow 할 수 있습니다.

TypeScript에서 `typeof`로 반환된 값에 대한 검사는 타입 가드입니다. TypeScript는 `typeof`가 다양한 값에서 어떻게 작동하는지를 인코딩하고 있기 때문에, JavaScript의 몇 가지 특이점도 알고 있습니다. 예를 들어, 위의 리스트에서 `typeof`는 문자열 'null'을 반환하지 않는다는 점에 주목하세요. 다음 예제를 살펴보세요

```ts
function printAll(strs: string | string[] | null) {
    if (typeof strs === "object") {
        for (const s of strs) {
            // 'strs' is possibly 'null'.
            console.log(s);
        }
    } else if (typeof strs === "string") {
        console.log(strs);
    } else {
        // do nothing
    }
}
```

`printAll` 함수에서 우리는 `strs`가 객체인지 확인하여 배열 타입인지 판단하려고 합니다(여기서 **배열은 JavaScript에서 객체 타입**이라는 점을 다시 강조할 수 있는 좋은 기회입니다). 하지만 실제로 JavaScript에서는 `typeof null`이 object로 반환됩니다!

충분한 경험이 있는 사용자라면 놀라지 않을 수 있지만, 모든 사용자가 JavaScript에서 이 문제를 접해본 것은 아닙니다. 다행히도 TypeScript는 `strs`가 단순히` string[]`가 아닌 `string[]` | `null`로만 좁혀졌음을 알려줍니다.

이것은 우리가 **'진리 검사(truthiness checking)'**라고 부를 수 있는 주제로 자연스럽게 넘어가는 좋은 기회가 될 것입니다.

## Truthiness narrowing

JavaScript에서는 조건문, `&&`, `||`, `if` 문, 불리언 부정(!) 등에서 어떤 표현식도 사용할 수 있습니다. 예를 들어, `if` 문은 항상 조건이 불리언 타입일 것으로 기대하지 않습니다.

```ts
function getUsersOnlineMessage(numUsersOnline: number) {
    if (numUsersOnline) {
        return `There are ${numUsersOnline} online now!`;
    }

    return "Nobody's here. :(";
}
```

JavaScript에서 `if`와 같은 구조는 먼저 조건을 불리언으로 '강제 변환(coerce)'하여 의미를 파악한 다음, 결과가 true인지 false인지에 따라 분기를 선택합니다. 값들 중에는 다음과 같은 것들이 있습니다:

-   `0`
-   `NaN`
-   `""` (the empty string)
-   `0n` (the `bigint` version of zero)
-   `null`
-   `undefined`

모든 값은 false로 강제 변환될 수 있으며, 다른 값들은 true로 강제 변환됩니다. 값을 불리언으로 변환하려면 `Boolean` 함수를 사용하거나, 더 짧은 이중 불리언 부정을 사용할 수 있습니다. 후자의 경우 TypeScript가 좁은 리터럴 불리언 타입인 true로 추론하는 장점이 있으며, 첫 번째 방법은 타입 boolean으로 추론됩니다.

```ts
// both of these result in 'true'
Boolean("hello"); // type: boolean, value: true
!!"world"; // type: true, value: true
```

이러한 동작을 활용하는 것은 꽤 일반적이며, 특히 `null`이나 `undefined`와 같은 값에 대해 방어하는 데 유용합니다. 예를 들어, `printAll` 함수에서 이를 사용하는 것을 시도해 보겠습니다.

```ts
function printAll(strs: string | string[] | null) {
    if (strs && typeof strs === "object") {
        for (const s of strs) {
            console.log(s);
        }
    } else if (typeof strs === "string") {
        console.log(strs);
    }
}
```

우리가 `strs`가 truthy한지 확인함으로써 위의 오류를 없앴다는 점에 주목할 수 있습니다. 이렇게 하면 코드를 실행할 때 발생할 수 있는 불행한 오류를 최소화할 수 있습니다:

하지만 원시 값에 대한 truthiness 체크는 종종 오류를 발생시킬 수 있다는 점을 기억하세요. 예를 들어, printAll을 작성하려는 다른 시도를 고려해 보세요.

```ts
function printAll(strs: string | string[] | null) {
    // !!!!!!!!!!!!!!!!
    // DON'T DO THIS!
    // KEEP READING
    // !!!!!!!!!!!!!!!!

    if (strs) {
        if (typeof strs === "object") {
            for (const s of strs) {
                console.log(s);
            }
        } else if (typeof strs === "string") {
            console.log(strs);
        }
    }
}
```

우리는 함수의 전체 본문을 truthy 체크로 감쌌지만, 이는 미묘한 단점이 있습니다: 빈 문자열 케이스를 올바르게 처리하지 못할 수 있습니다.

TypeScript는 여기서 우리가 손해를 보지 않게 해주지만, 이 동작은 JavaScript에 덜 익숙한 경우 주의할 가치가 있습니다. TypeScript는 종종 버그를 조기에 잡는 데 도움을 줄 수 있지만, 값을 처리하지 않기로 선택하면 지나치게 규정적이지 않으면서도 할 수 있는 일이 제한적입니다. 원하신다면, 이러한 상황을 처리하도록 린터를 설정할 수 있습니다.

마지막으로 truthiness로 좁히는 것에 대한 한 가지 언급은, `!`로 불리언 부정을 사용하면 부정된 분기에서 필터링된다는 것입니다.

```ts
function multiplyAll(values: number[] | undefined, factor: number): number[] | undefined {
    if (!values) {
        return values;
    } else {
        return values.map((x) => x * factor);
    }
}
```

## Equality narrowing

TypeScript는 `switch` 문과 `===`, `!==`, `==`, `!=`와 같은 동등성 검사로 타입을 좁힙니다. 예를 들어:

```ts
function example(x: string | number, y: string | boolean) {
    if (x === y) {
        // We can now call any 'string' method on 'x' or 'y'.
        x.toUpperCase();
        y.toLowerCase();
    } else {
        console.log(x);
        console.log(y);
    }
}
```

위의 예에서 `x`와 `y`가 모두 동일하다는 것을 확인했을 때, TypeScript는 이들의 타입도 같아야 한다는 것을 알고 있었습니다 (일치 연산자를 사용했으니까). `string`은 `x`와 `y`가 가질 수 있는 유일한 공통 타입이므로, TypeScript는 첫 번째 분기에서 `x`와 `y`가 문자열임을 알 수 있습니다.

특정 리터럴 값(변수가 아닌)에 대한 체크도 작동합니다. truthiness 좁히기에 대한 섹션에서, 우리는 빈 문자열을 제대로 처리하지 않아 오류가 발생할 수 있는 `printAll `함수를 작성했습니다. 대신 `null`을 차단하는 특정 체크를 수행함으로써, TypeScript는 여전히 `strs`의 타입에서 `null`을 올바르게 제거합니다.

```ts
function printAll(strs: string | string[] | null) {
    if (strs !== null) {
        if (typeof strs === "object") {
            for (const s of strs) {
                console.log(s);
            }
        } else if (typeof strs === "string") {
            console.log(strs);
        }
    }
}
```

JavaScript의 느슨한 동등성 검사인 `==`와 `!=`도 올바르게 좁혀집니다. 잘 모른다면, 어떤 것이 `== null`인지 확인하는 것은 실제로 해당 값이 `null`인지뿐만 아니라, 잠재적으로 `undefined`인지도 확인합니다. `== undefined`도 마찬가지로, 값이 `null`이거나 `undefined`인지 확인합니다.

```ts
interface Container {
    value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
    // Remove both 'null' and 'undefined' from the type.
    if (container.value != null) {
        console.log(container.value);
        // Now we can safely multiply 'container.value'.
        container.value *= factor;
    }
}
```

## The `in` operator narrowing\

JavaScript에는 **객체나 그 프로토타입 체인에 특정 이름의 속성이 있는지 확인하는 연산자인 `in` 연산자**가 있습니다. TypeScript는 이를 고려하여 잠재적인 타입을 좁히는 방법으로 사용합니다.

예를 들어, 코드에서 `"value" in x`와 같이 `"value"`가 문자열 리터럴이고 `x`가 유니온 타입인 경우, 'true' 분기는 `x`의 타입을 선택적으로 또는 필수적으로 `value` 속성이 있는 타입으로 좁히고, `false` 분기는 선택적이거나 누락된 `value` 속성이 있는 타입으로 좁힙니다.

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        return animal.swim();
    }

    return animal.fly();
}
```

다시 말해, optional properties 좁히기 위해 두 쪽 모두 존재할 수 있습니다. 예를 들어, 인간은 수영도 하고 (적절한 장비가 있다면) 날기도 할 수 있으므로, `in` 체크의 양쪽 모두에 나타나야 합니다.

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
    if ("swim" in animal) {
        animal;
    } else {
        animal;
    }
}
```

## `instanceof` narrowing

JavaScript에는 값이 다른 값의 '인스턴스'인지 여부를 확인하는 연산자가 있습니다. 좀 더 구체적으로, `x instanceof Foo`는 `x`의 프로토타입 체인에 `Foo.prototype`이 포함되어 있는지를 확인합니다. 여기서 깊이 들어가지는 않겠지만, 클래스에 대해 다룰 때 더 많이 보게 될 것입니다. 하지만, `new`로 생성할 수 있는 대부분의 값에 대해서도 유용할 수 있습니다. 여러분이 추측했듯이, `instanceof`는 타입 가드이기도 하며, TypeScript는 `instanceof`로 보호된 분기에서 타입을 좁힙니다.

```ts
function logValue(x: Date | string) {
    if (x instanceof Date) {
        console.log(x.toUTCString());
    } else {
        console.log(x.toUpperCase());
    }
}
```

## Assignments

변수에 값을 할당할 때 TypeScript는 할당문의 오른쪽을 살펴보고 왼쪽의 타입을 적절하게 좁힙니다.

```ts
let x = Math.random() < 0.5 ? 10 : "hello world!";
//  string | number

x = 1;
console.log(x);
//number

x = "goodbye!";
console.log(x);
// string
```

각 할당이 유효하다는 점에 주목하세요. 첫 번째 할당 후 `x`의 관찰된 타입이 `number`로 변경되었음에도 불구하고, 여전히 `x`에 문자열을 할당할 수 있었습니다. 이는 `x`의 선언된 타입이 `string | number`이기 때문이며, 할당 가능성은 항상 선언된 타입에 대해 검사됩니다.

만약 `x`에 `boolean`을 할당했다면, 이는 선언된 타입에 포함되지 않으므로 오류가 발생했을 것입니다.

## Control flow analysis

단순히 모든 변수를 탐색하고 `if`, `while`, 조건문 등에서 타입 가드를 찾는 것 이상의 과정이 있습니다. 예를 들어,

```ts
function padLeft(padding: number | string, input: string) {
    if (typeof padding === "number") {
        return " ".repeat(padding) + input;
    }
    return padding + input;
}
```

`padLeft`는 첫 번째 `if` 블록에서 반환합니다. TypeScript는 이 코드를 분석하여 `padding`이 숫자인 경우 나머지 본문(`return padding + input;`)이 도달할 수 없음을 인식했습니다. 그 결과, 함수의 나머지 부분에서 `padding`의 타입을 `string | number`에서 `string`으로 좁힐 수 있었습니다.

코드의 도달 가능성에 기반한 이러한 분석을 **'제어 흐름 분석(control flow analysis)'** 이라고 하며, TypeScript는 타입 가드와 할당을 만날 때마다 이 흐름 분석을 사용하여 타입을 좁힙니다. 변수가 분석될 때, 제어 흐름은 여러 번 분기하고 다시 합쳐질 수 있으며, 그 시점마다 변수가 다른 타입을 가질 수 있습니다.

```ts
function example() {
    let x: string | number | boolean;

    x = Math.random() < 0.5;
    console.log(x);
    // let x: boolean

    if (Math.random() < 0.5) {
        x = "hello";
        console.log(x);
        // let x: string
    } else {
        x = 100;
        console.log(x);
        // let x: number
    }
    return x;
    // let x: string | number
}
```

## Using type predicates

지금까지 우리는 기존의 JavaScript 구성 요소를 사용하여 타입을 좁히는 방법을 다루어왔습니다. 그러나 때때로 코드 전반에 걸쳐 타입이 **어떻게 변경되는지에 대해 더 직접적인 제어를 원할 수 있습니다.**

**사용자 정의 타입 가드**를 정의하려면, 반환 타입이 **타입 프레디케이트인 함수**를 정의하면 됩니다.

```ts
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}
```

이 예제에서 `pet is Fish`가 우리의 type predicates입니다. type predicates는 **`parameterName is Type` 형태**를 가지며, 여기서 **`parameterName`은 현재 함수 시그니처의 매개변수 이름**이어야 합니다.

`isFish`가 어떤 변수를 인자로 호출될 때마다, TypeScript는 원래 타입이 호환되면 그 변수를 해당 특정 타입으로 좁힙니다.

```ts
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
    pet.swim();
} else {
    pet.fly();
}
```

TypeScript는 `if` 블록에서 `pet`이 `Fish`라는 것만 알 뿐만 아니라, `else` 블록에서는 `Fish`가 아니므로 `Bird`임을 알 수 있습니다.

`isFish` 타입 가드를 사용하여 `Fish | Bird` 배열을 필터링하고 `Fish` 배열을 얻을 수 있습니다.

```ts
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
    if (pet.name === "sharkey") return false;
    return isFish(pet);
});
```

## Assertion functions

Types can also be narrowed using [Assertion functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions).

# Discriminated unions

구분된 유니온

지금까지 살펴본 예제들은 문자열, 불리언, 숫자와 같은 간단한 타입의 변수를 좁히는 데 초점을 맞추었습니다. 이는 일반적이지만, 실제로 JavaScript에서는 약간 더 복잡한 구조를 다루는 경우가 많습니다.

원과 정사각형 같은 도형을 인코딩하려고 한다고 가정해봅시다. 원은 반지름을 추적하고, 정사각형은 변의 길이를 추적합니다. 우리는 어떤 도형을 다루고 있는지를 알리기 위해 `kind`라는 필드를 사용할 것입니다. 이제 `Shape`를 정의하는 첫 번째 시도를 해보겠습니다.

```ts
interface Shape {
    kind: "circle" | "square";
    radius?: number;
    sideLength?: number;
}
```

우리는 `"circle"`과 `"square`"라는 문자열 리터럴 타입의 유니온을 사용하여 도형을 원으로 또는 정사각형으로 처리해야 하는지를 나타내고 있습니다. `string` 대신 `"circle" | "square"`를 사용함으로써 오타 문제를 피할 수 있습니다.

```ts
function handleShape(shape: Shape) {
    // oops!
    if (shape.kind === "rect") {
        // This comparison appears to be unintentional because the types '"circle" | "square"' and '"rect"' have no overlap.
        // ...
    }
}
```

우리는 원이나 정사각형에 따라 적절한 로직을 적용하는 `getArea` 함수를 작성할 수 있습니다. 먼저 원을 다루는 경우부터 시작해 보겠습니다.

```ts
function getArea(shape: Shape) {
    return Math.PI * shape.radius ** 2;
    // 'shape.radius' is possibly 'undefined'.
}
```

Under strictNullChecks that gives us an error. 이는 반지름이 정의되지 않을 수 있기 때문에 적절한 오류입니다. 하지만 `kind` 속성에 대해 적절한 검사를 수행하면 어떻게 될까요?

```ts
function getArea(shape: Shape) {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius ** 2;
        // 'shape.radius' is possibly 'undefined'.
    }
}
```

TypeScript는 여전히 이 상황에서 어떻게 처리해야 할지 모르고 있습니다. 우리는 값에 대해 타입 검사기보다 더 많은 정보를 알고 있는 상황에 도달했습니다. 이때 `shape.radius` 뒤에 비어 있지 않음을 나타내는 **논리 부정 단언(non-null assertion, 즉 `!` 사용)**을 통해 반지름이 확실히 존재한다고 말할 수 있습니다.

```ts
function getArea(shape: Shape) {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius! ** 2;
    }
}
```

하지만 이 방법은 이상적이지 않습니다. 우리는 타입 검사기에게 `shape.radius`가 정의되어 있다고 확신시키기 위해 **비어 있지 않음을 나타내는 단언**(`!`)을 사용해야 했습니다. 그러나 이러한 단언은 코드가 이동할 경우 오류를 일으킬 수 있습니다. 게다가 엄격한 널 검사가 아닌 경우, 선택적 속성은 읽을 때 항상 존재하는 것으로 간주되기 때문에 실수로 해당 필드에 접근할 수 있습니다. 우리는 분명히 더 나은 방법을 찾을 수 있습니다.

이 `Shape`의 인코딩 문제는 타입 검사기가 `kind` 속성을 기반으로 반지름이나 변의 길이가 존재하는지 여부를 알 수 없다는 것입니다 (인터페이스에서 kind로 객체를 구분할 수 없어서?). 우리는 타입 검사기에 우리가 알고 있는 정보를 전달해야 합니다. 이를 염두에 두고 `Shape`를 정의하는 또 다른 시도를 해보겠습니다.

```ts
interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

type Shape = Circle | Square;
```

여기서 우리는 `Shape`를 `kind` 속성의 값이 다른 두 개의 타입으로 제대로 분리했습니다. 하지만 반지름과 변의 길이는 각 타입에서 필수 속성으로 선언되었습니다.

이제 `Shape`의 반지름에 접근하려고 할 때 어떤 일이 발생하는지 살펴봅시다.

```ts
function getArea(shape: Shape) {
    return Math.PI * shape.radius ** 2;
    // Property 'radius' does not exist on type 'Shape'.
    // Property 'radius' does not exist on type 'Square'.
}
```

첫 번째 `Shape` interface와 마찬가지로, 이 경우에도 여전히 오류가 발생합니다. 반지름이 선택적일 때는 반지름 속성이 존재하는지 TypeScript가 알 수 없기 때문에 오류가 발생했습니다. 이제 `Shape`가 유니온 타입이 되었으므로, TypeScript는 `shape`가 `Square`일 수 있다고 말하고, 정사각형에는 반지름이 정의되어 있지 않다고 경고합니다! 두 가지 해석 모두 맞지만, `Shape`의 유니온 인코딩은 `strictNullChecks` 설정에 관계없이 오류를 발생시킵니다.

그렇다면 `kind` 속성을 다시 확인해본다면 어떻게 될까요?

```ts
function getArea(shape: Shape) {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius ** 2;
        // (parameter) shape: Circle
    }
}
```

이제 오류가 사라졌습니다! **유니온의 모든 타입이 리터럴 타입과 공통 속성을 포함**할 때, TypeScript는 이를 **discriminated union**으로 간주하고 유니온의 구성원을 좁힐 수 있습니다.

이 경우, `kind`가 그 공통 속성이었습니다(이는 `Shape`의 구분 속성으로 간주됩니다). `kind` 속성이 "circle"인지 확인함으로써, "circle"이라는 `kind` 속성이 없는 `Shape`의 모든 타입이 걸러졌습니다. 이렇게 해서 `shape`는 `Circle` 타입으로 좁혀졌습니다.

이와 같은 검사는 `switch` 문에서도 잘 작동합니다. 이제 우리는 성가신 비어 있지 않음 단언(`!`) 없이 전체 `getArea` 함수를 작성해 볼 수 있습니다.

```ts
function getArea(shape: Shape) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        // (parameter) shape: Circle
        case "square":
            return shape.sideLength ** 2;
        // (parameter) shape: Square
    }
}
```

여기서 중요한 것은 `Shape`의 인코딩입니다. `Circle`과 `Square`가 실제로 특정한 `kind` 필드를 가진 두 개의 별개의 타입이라는 정보를 TypeScript에 올바르게 전달하는 것이 매우 중요했습니다. 이렇게 하면 우리가 작성한 TypeScript 코드가 그렇지 않았다면 작성했을 JavaScript와 다르지 않게 타입 안전성을 유지할 수 있습니다. 그 결과, 타입 시스템은 "올바른" 방식으로 작동하여 `switch` 문 각 분기에서 타입을 파악할 수 있었습니다.

discriminated unions은 원과 정사각형에 대해 이야기하는 것 이상으로 유용합니다. 이들은 JavaScript에서 네트워크를 통해 메시지를 전송할 때(클라이언트/서버 통신)나 상태 관리 프레임워크에서 변화를 인코딩할 때와 같은 다양한 메시징 체계를 표현하는 데 적합합니다.

# The `never` type

narrowing를 할 때, 유니온의 옵션을 줄여서 모든 가능성을 제거하고 아무것도 남지 않는 상태에 이를 수 있습니다. 그런 경우, TypeScript는 **존재해서는 안 되는 상태**를 나타내기 위해 `never` 타입을 사용합니다.

# Exhaustiveness checking

**포괄성 checking**

`never` 타입은 모든 타입에 할당될 수 있지만, `never` 자체를 제외하고는 어떤 타입도 `never`에 할당될 수 없습니다. (`never` 타입을 가진 변수를 `string`이나 `number` 같은 다른 타입의 변수에 할당할 수 없다.) 이는 좁히기를 사용하고 `never`가 나타나는 것을 통해 `switch` 문에서 포괄적인 검사를 수행할 수 있음을 의미합니다.

예를 들어, 모든 가능한 경우가 처리되었을 때 `getArea` 함수에 기본(default) 케이스를 추가하고 그 경우에 `shape`를 `never`에 할당하려고 해도 오류가 발생하지 않습니다.

```ts
type Shape = Circle | Square;

function getArea(shape: Shape) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
}
```

Adding a new member to the Shape union, will cause a TypeScript error:

```ts
interface Triangle {
    kind: "triangle";
    sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            // Type 'Triangle' is not assignable to type 'never'.
            return _exhaustiveCheck;
    }
}
```

<br/>
<br/>
<br/>

#### MEMO 🤔

-   js는 왜 `null`을 object로 반환하지?
-   `!!` 연산자 - 몰랐던 연산자이다.
-   `!` 연산자 -> boolean을 반대로 바꿔주는 연산자 아닌가? (데이터 뒤에 붙는 `!`) / `!` 논리 부정 단언 (타입스크립트 연산자인가?)
-   타입스크립트로 올바른 타입을 좁혀나가서 동등연산자도 올바르게 동작하는건가??
-   instanceof 연산자 학습.....
-   타입 가드는 자바스크립트 타입을 확인하는 연산자를 통해 타입을 추론하고, 이러한 타입들을 좁혀가는 과정을 내로잉이라고 하는 것 같다.
-   type predicates는 사용자 정의 타입가드.
