# Promise

비동기 함수에 전달된 콜백함수는 비동기 작업이 완료되면 호출된다.

Promise 객체는 비동기 작업의 **완료 또는 실패**와 그 결과 값을 나타냅니다.

> 🤔 Promise 객체를 사용해 완료 또는 실패에 대한 로직을 따로 구분 할 수 있어서 Promise를 사용하는 거 아닐까??

예를 들어, `createAudioFileAsync()`라는 함수가 있다고 가정해 보겠습니다. 이 함수는 구성 레코드를 주어진 비동기적으로 사운드 파일을 생성하며, 사운드 파일이 성공적으로 생성되면 호출되는 콜백 함수와 오류가 발생하면 호출되는 다른 콜백 함수를 가집니다.

아래는 `createAudioFileAsync()`를 사용하는 코드입니다.

```js
function successCallback(result) {
    console.log("Audio file ready at URL: " + result);
}

function failureCallback(error) {
    console.log("Error generating audio file: " + error);
}

createAudioFileAsync(audioSettings, successCallback, failureCallback);
```

<br/>

`createAudioFileAsync()`가 `Promise`를 반환하도록 다시 작성하면, 그에 따라 콜백을 붙일 수 있다.

```js
createAudioFileAsync(audioSettings).then(successCallback, failureCallback);
```

This convention has **several advantages**. We will explore each one.

<br/>
<br/>
<br/>
<br/>

## Description

`Promise` 는 프로미스가 생성된 시점에는 알려지지 않았을 수도 있는 값을 위한 대리자로, 비동기 연산이 종료된 이후에 결과 값과 실패 사유를 처리하기 위한 처리기를 연결할 수 있습니다. 프로미스를 사용하면 비동기 메서드에서 마치 **동기 메서드처럼 값을 반환**할 수 있습니다. 다만 최종 결과를 반환하는 것이 아니고, 미래의 어떤 시점에 결과를 제공하겠다는 '프로미스(promise)'를 반환합니다.

`Promise`는 다음 중 하나의 상태를 가집니다.

pending(대기): 이행하지도, 거부하지도 않은 초기 상태.
fulfilled(이행): 연산이 성공적으로 완료됨.
rejected(거부): 연산이 실패함.

pending 프로미스는 값과 함께 이행할 수도, 어떤 이유(오류)로 인해 rejected 될 수도 있습니다. 이행이나 거부될 때, 프로미스의 `then` 메서드에 의해 대기열(큐)에 추가된 처리기들이 호출됩니다. 이미 이행했거나 거부된 프로미스에 처리기를 연결해도 호출되므로, 비동기 연산과 처리기 연결 사이에 경합 조건은 없습니다.

프로미스가 이행되거나 거부되었지만 보류 중이 아닌 경우, 프로미스가 확정된 것으로 간주합니다.

![이미지](../../../Img/Web/JS/promise_01.png)

<br/>
<br/>
<br/>
<br/>

## Chaining

A common need is 두 개 이상의 비동기 작업을 순차적으로 실행하는 것. 각 후속 작업은 이전 작업이 성공할 때 시작되며, 이전 단계의 결과를 사용합니다. 예전에는 여러 비동기 작업을 연속으로 수행하면 고전적인 콜백 지옥으로 이어졌습니다.

`then()`, `catch()`, `finally()` 메서드는 약속(Promise)이 처리 완료(settled)된 후 추가 작업을 연결하는 데 사용됩니다.

`then()` 메서드는 최대 두 개의 인수를 받을 수 있으며, 첫 번째 인수는 `fulfilled`된 경우의 콜백 함수이고, 두 번째 인수는 rejected된 경우의 콜백 함수입니다.

`catch()`와 `finally()` 메서드는 내부적으로 `then()`을 호출하여 오류 처리를 덜 번거롭게 만듭니다. 예를 들어, `catch()`는 실제로 이행 핸들러를 전달하지 않은 `then()`과 같습니다. 이 메서드들은 약속을 반환하므로 체인처럼 연결할 수 있습니다.

```js
doSomething(function (result) {
    doSomethingElse(
        result,
        function (newResult) {
            doThirdThing(
                newResult,
                function (finalResult) {
                    console.log(`Got the final result: ${finalResult}`);
                },
                failureCallback
            );
        },
        failureCallback
    );
}, failureCallback);
```

`Promise`를 사용하면 이를 `Promise` 체인을 생성하여 달성할 수 있습니다. `Promise`의` API` 디자인 덕분에, 콜백은 함수에 전달되는 대신 반환된 `Promise` 객체에 붙여집니다.

여기서 중요한 점은 `then()` 함수가 원래의 `Promise`와는 다른 새로운 `Promise`를 반환한다는 것입니다.

```js
const promise = doSomething();
const promise2 = promise.then(successCallback, failureCallback);
```

`promise2`는 `doSomething()`의 완료뿐만 아니라, 당신이 전달한 `successCallback` 또는 `failureCallback`의 완료도 나타냅니다. 이러한 콜백이 다른 비동기 함수를 호출하고, 그 함수가 `Promise`를 반환하는 경우입니다. 이 경우, `promise2`에 추가된 모든 콜백은 `successCallback` 또는 `failureCallback`에서 반환된 `Promise` 대기열에 추가됩니다.

---

If you want a working example to play with, you can use the following template to create any function returning a promise:

```js
function doSomething() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Other things to do before completion of the promise
            console.log("Did something");
            // The fulfillment value of the promise
            resolve("https://example.com/");
        }, 200);
    });
}
```

---

`.then` 패턴을 사용하면, 각 `Promise`가 체인 내의 하나의 비동기 단계의 완료를 나타내는 더 긴 처리 체인을 만들 수 있습니다. 또한, `then`에 전달하는 인자는 선택 사항이며, `catch(failureCallback)`는 `then(null, failureCallback)`의 축약형입니다. 따라서 모든 단계에서 에러 처리 코드가 동일하다면, 체인의 끝에 이를 붙일 수 있습니다.

```js
doSomething()
    .then(function (result) {
        return doSomethingElse(result);
    })
    .then(function (newResult) {
        return doThirdThing(newResult);
    })
    .then(function (finalResult) {
        console.log(`Got the final result: ${finalResult}`);
    })
    .catch(failureCallback);
```

<br/>

> 🤔 Promise 객체를 사용하면 비동기 작업을 순차적으로 작업할 수 있다는 이점이 생기는거 아닐까?

<br/>

You might see this expressed with arrow functions instead:

```js
doSomething()
    .then((result) => doSomethingElse(result))
    .then((newResult) => doThirdThing(newResult))
    .then((finalResult) => {
        console.log(`Got the final result: ${finalResult}`);
    })
    .catch(failureCallback);
```

<br/>

---

Arrow function expressions can have an implicit return; so, `() => x `is short for `() => { return x; }`.

---

<br/>

`doSomethingElse`와 `doThirdThing`은 어떤 값이든 반환할 수 있습니다. 만약 그들이 `Promise`를 반환하면, 그 `Promise`가 해결될 때까지 기다린 후, 다음 콜백은 `Promise` 자체가 아니라 이행된 값을 받게 됩니다.

항상 **`then` 콜백에서 `Promise`를 반환하는 것이 중요합니다.** 비록 그 `Promise`가 항상 `undefined`로 해결되더라도 말입니다. 만약 이전 핸들러가 `Promise`를 시작했지만 그것을 반환하지 않으면, 더 이상 그 `Promise`의 상태를 추적할 수 없게 되며, 이 `Promise`는 "떠 있는(floating)" 상태가 됩니다.

```js
// ❌ Don't use

doSomething()
    .then((url) => {
        // Missing `return` keyword in front of fetch(url).
        fetch(url);
    })
    .then((result) => {
        // result is undefined, because nothing is returned from the previous
        // handler. There's no way to know the return value of the fetch()
        // call anymore, or whether it succeeded at all.
    });
```

`fetch` 호출의 결과(즉, Promise)를 반환함으로써, 우리는 그 완료를 추적할 수 있고, 완료될 때 그 값을 받을 수 있습니다.

```js
doSomething()
    .then((url) => {
        // `return` keyword added
        return fetch(url);
    })
    .then((result) => {
        // result is a Response object
    });
```

Floating promises는 race conditions이 있는 경우 더 심각할 수 있습니다. 만약 마지막 핸들러에서 `Promise`가 반환되지 않으면, 다음 `then` 핸들러가 조기에 호출되고, 이 핸들러가 읽는 값은 불완전할 수 있습니다.

<br/>

---

### Race conditions

두 개 이상의 비동기 작업이 동시에 실행될 때, 그 실행 순서에 따라 결과가 달라지는 상황을 말합니다.

예를 들어, 하나의 비동기 작업이 데이터를 가져오는 동안 다른 작업이 그 데이터를 사용하려고 할 때, 첫 번째 작업이 완료되지 않은 상태에서 두 번째 작업이 실행되면 불완전한 데이터에 접근하게 될 수 있습니다. 이로 인해 예기치 않은 결과나 에러가 발생할 수 있습니다.

따라서, `Promise`를 올바르게 반환하지 않으면, 이전 작업이 완료되기 전에 다음 작업이 실행될 수 있어 Race conditions이 발생할 위험이 커집니다. 이를 방지하기 위해서는 항상 `Promise`를 반환하여 작업의 완료를 확실히 추적하는 것이 중요합니다.

---

<br/>

```js
// ❌ Don't use

const listOfIngredients = [];

doSomething()
    .then((url) => {
        // Missing `return` keyword in front of fetch(url).
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                listOfIngredients.push(data);
            });
    })
    .then(() => {
        console.log(listOfIngredients);
        // listOfIngredients will always be [], because the fetch request hasn't completed yet.
    });
```

`Promise`를 만날 때마다 그것을 반환하고, 그 처리를 다음 then 핸들러로 미루는 것이 좋습니다.

```js
const listOfIngredients = [];

doSomething()
    .then((url) => {
        // `return` keyword now included in front of fetch call.
        return fetch(url)
            .then((res) => res.json())
            .then((data) => {
                listOfIngredients.push(data);
            });
    })
    .then(() => {
        console.log(listOfIngredients);
        // listOfIngredients will now contain data from fetch call.
    });
```

더 나아가, 중첩된 체인을 하나의 단일 체인으로 평탄화할 수 있습니다. 이렇게 하면 코드가 더 간단해지고 에러 처리가 더 쉬워집니다.

```js
doSomething()
    .then((url) => fetch(url))
    .then((res) => res.json())
    .then((data) => {
        listOfIngredients.push(data);
    })
    .then(() => {
        console.log(listOfIngredients);
    });
```

`async`/`await`를 사용하면 더 직관적이고 동기 코드처럼 보이는 코드를 작성할 수 있습니다. 아래는 `async`/`await`를 사용한 동일한 예제입니다:

```js
async function logIngredients() {
    const url = await doSomething();
    const res = await fetch(url);
    const data = await res.json();
    listOfIngredients.push(data);
    console.log(listOfIngredients);
}
```

위 코드가 동기 코드와 정확히 같은 모습이라는 점에 주목하세요. 단지 `Promise` 앞에 `await` 키워드가 있을 뿐입니다. 유일한 단점 중 하나는 `await` 키워드는 잊기 쉬운데, 이는 `await` 키워드를 사용하지 않으면 `Promise`가 반환되지만, 그 `Promise`를 값으로 사용하려고 할 때 문제가 생길 수 있다.

`async`/`await` builds on promises. 예를 들어, `doSomething()`은 이전과 동일한 함수이므로, `Promise`에서 `async`/`await`로 변경하는 데 필요한 리팩토링이 최소화됩니다.

<br/>
<br/>
<br/>
<br/>

## Error handling

콜백 지옥(Chaning section 처음 코드)에서 `failureCallback`이 세 번 호출됐다. 반면, `Promise` 체인에서는 `failureCallback`이 마지막에 한 번만 호출됩니다.

```js
doSomething()
    .then((result) => doSomethingElse(result))
    .then((newResult) => doThirdThing(newResult))
    .then((finalResult) => console.log(`Got the final result: ${finalResult}`))
    .catch(failureCallback);
```

예외가 발생하면, 브라우저는 체인 아래로 내려가면서 `.catch()` 핸들러나 `onRejected`를 찾습니다. 이는 동기 코드의 작동 방식과 매우 유사합니다.

```js
try {
    const result = syncDoSomething();
    const newResult = syncDoSomethingElse(result);
    const finalResult = syncDoThirdThing(newResult);
    console.log(`Got the final result: ${finalResult}`);
} catch (error) {
    failureCallback(error);
}
```

This symmetry with asynchronous code culminates in the `async`/`await` syntax:

```js
async function foo() {
    try {
        const result = await doSomething();
        const newResult = await doSomethingElse(result);
        const finalResult = await doThirdThing(newResult);
        console.log(`Got the final result: ${finalResult}`);
    } catch (error) {
        failureCallback(error);
    }
}
```

`Promises`는 콜백지옥 문제에서 발생하는 근본적인 결함을 해결하며, 던져진 예외와 프로그래밍 오류를 포함한 모든 오류를 잡습니다. 이는 비동기 작업의 함수형 조합에 필수적입니다. 이제 모든 오류는 체인의 끝에 있는 `catch()` 메서드로 처리되며, `async`/`await`를 사용하지 않는 한 거의 항상 `try`/`catch`를 사용할 필요가 없습니다.

<br/>

---

실행 속도를 높이려면 모든 동기 작업을 하나의 핸들러 내에서 수행하는 것이 바람직하며, 그렇지 않으면 모든 핸들러를 순차적으로 실행하는 데 몇 틱이 걸립니다.

---

<br/>
<br/>
<br/>
<br/>

### Nesting

아래 예제에서, 첫 번째 예제는 하나의 `then()` 핸들러의 반환 값 안에 `Promise` 체인이 중첩되어 있는 반면, 두 번째 예제는 완전히 평탄한 체인을 사용합니다. 간단한 `Promise` 체인은 중첩 없이 평평하게 유지하는 것이 가장 좋으며, 중첩은 부주의한 조합의 결과일 수 있습니다.

Nesting은 `catch` 문장의 범위를 제한하는 제어 구조입니다. 구체적으로, 중첩된 `catch`는 **자신의 범위와 그 하위 범위에서만 실패를 잡으며**, 중첩 범위 외부의 체인에서 발생한 오류는 잡지 않습니다. 올바르게 사용하면, 이는 오류 복구의 정밀성을 높여줍니다.

```js
doSomethingCritical()
    .then((result) =>
        doSomethingOptional(result)
            .then((optionalResult) => doSomethingExtraNice(optionalResult))
            .catch((e) => {})
    ) // Ignore if optional stuff fails; proceed.
    .then(() => moreCriticalStuff())
    .catch((e) => console.error(`Critical failure: ${e.message}`));
```

Note that the optional steps here are nested, 중첩은 들여쓰기 때문이 아니라, 단계들 주위에 있는 외부 괄호`(` 및 `)`의 배치로 인해 발생합니다.

내부의 오류 무시 `catch` 핸들러는 `doSomethingOptional()`과 `doSomethingExtraNice()`에서 발생한 실패만 잡습니다. 그 후 코드는 `moreCriticalStuff()`로 계속 진행됩니다. 중요한 점은, 만약 `doSomethingCritical()`이 실패하면, 그 오류는 오직 마지막(외부) `catch`에서만 잡히고, 내부 `catch` 핸들러에 의해 무시되지 않는다는 것입니다.

In `async`/`await`, this code looks like:

```js
async function main() {
    try {
        const result = await doSomethingCritical();
        try {
            const optionalResult = await doSomethingOptional(result);
            await doSomethingExtraNice(optionalResult);
        } catch (e) {
            // Ignore failures in optional steps and proceed.
        }
        await moreCriticalStuff();
    } catch (e) {
        console.error(`Critical failure: ${e.message}`);
    }
}
```

<br/>

---

정교한 오류 처리가 필요하지 않다면, 중첩된 then 핸들러가 필요하지 않을 가능성이 높습니다. 대신, 평탄한 체인을 사용하고 오류 처리 로직을 끝에 배치하세요.

---

<br/>
<br/>
<br/>
<br/>

### Chaining after a catch

실패 후에도 체인을 이어갈 수 있습니다. 즉, `catch`를 사용하여 체인에서 어떤 작업이 실패한 후에도 새로운 작업을 수행할 수 있습니다.

```js
doSomething()
    .then(() => {
        throw new Error("Something failed");

        console.log("Do this");
    })
    .catch(() => {
        console.error("Do that");
    })
    .then(() => {
        console.log("Do this, no matter what happened before");
    });
```

This will output the following text:

```
Initial
Do that
Do this, no matter what happened before
```

The text "Do this" is not displayed because the "Something failed" error caused a rejection.

In async/await, this code looks like:

```js
async function main() {
    try {
        await doSomething();
        throw new Error("Something failed");
        console.log("Do this");
    } catch (e) {
        console.error("Do that");
    }
    console.log("Do this, no matter what happened before");
}
```

<br/>
<br/>
<br/>
<br/>

### Promise rejection events

If a promise rejection event is not handled by any handler, it bubbles to the top of the call stack, 호스트는 이를 드러내야 합니다. 웹에서는 `Promise`가 거부될 때마다 두 가지 이벤트 중 하나가 전역 범위로 전송됩니다(일반적으로 이는 `window`이며, 웹 워커에서 사용되는 경우에는 `Worker` 또는 기타 워커 기반 인터페이스가 됩니다). 두 가지 이벤트는 다음과 같습니다:

-   `unhandledrejection`
    Sent when a promise is rejected but there is no rejection handler available.
-   `rejectionhandled`
    Sent when a handler is attached to a rejected promise that has already caused an `unhandledrejection` event.

두 경우 모두, 이벤트(타입은 PromiseRejectionEvent)는 거부된 `Promise`를 나타내는 `promise` 속성과 `Promise`가 거부된 이유를 제공하는 `reason` 속성을 가지고 있습니다.

이러한 속성들은 `Promise`에 대한 대체 오류 처리를 제공할 수 있게 하며, `Promise` 관리와 관련된 문제를 디버깅하는 데 도움을 줍니다. 이러한 핸들러는 컨텍스트별로 전역적이므로, 모든 오류는 출처에 관계없이 동일한 이벤트 핸들러로 전달됩니다.

`Node.js`에서는 `Promise` 거부 처리가 약간 다릅니다. `Node.js`의 `unhandledRejection` 이벤트에 대한 핸들러를 추가하여 처리합니다(이름의 대소문자 차이에 주목하세요). 예를 들어:

```js
process.on("unhandledRejection", (reason, promise) => {
    // Add code here to examine the "promise" and "reason" values
});
```

Node.js에서는 오류가 콘솔에 기록되는 것을 방지하기 위해(기본적으로 발생하는 동작) `process.on()` 리스너를 추가하는 것만으로 충분합니다. 브라우저 런타임의 `preventDefault()` 메서드와 같은 동등한 기능은 필요하지 않습니다.

그러나 `process.on` 리스너를 추가하더라도 거부된 `Promise`를 처리하는 코드가 없다면, 이 오류는 무시되고 사라지게 됩니다. 따라서 이상적으로는 해당 리스너 내에 거부된 각 `Promise`를 검토하고 실제 코드 버그로 인해 발생하지 않았는지 확인하는 코드를 추가해야 합니다.

<br/>
<br/>
<br/>
<br/>

## Composition

동시적으로 비동기 작업을 실행하기 위한 four composition tools이 있습니다: `Promise.all()`, `Promise.allSettled()`, `Promise.any()`, 그리고 `Promise.race()`입니다.

우리는 다음과 같이 작업을 동시에 시작하고 모든 작업이 완료될 때까지 기다릴 수 있습니다:

```js
Promise.all([func1(), func2(), func3()]).then(([result1, result2, result3]) => {
    // use result1, result2 and result3
});
```

배열의 `Promise` 중 하나가 거부되면, `Promise.all()`은 즉시 반환된 `Promise`를 거부하고 다른 작업을 중단합니다. 이로 인해 예기치 않은 상태나 동작이 발생할 수 있습니다. `Promise.allSettled()`는 모든 작업이 완료될 때까지 기다리도록 보장하는 또 another composition tool입니다.

이들 메서드는 모두 `Promise`를 **동시에 실행**합니다. 즉, 여러 `Promise`가 동시에 시작되며 **서로 기다리지 않습니다.** 순차적인 조합은 몇 가지 기발한 JavaScript를 사용하여 가능하게 합니다:

```js
[func1, func2, func3]
    .reduce((p, f) => p.then(f), Promise.resolve())
    .then((result3) => {
        /* use result3 */
    });
```

In this example, 비동기 함수의 배열을 `Promise` 체인으로 축소합니다. 위의 코드는 다음과 동일합니다:

```js
Promise.resolve()
    .then(func1)
    .then(func2)
    .then(func3)
    .then((result3) => {
        /* use result3 */
    });
```

This can be made into a reusable compose function, which is common in functional programming:

```js
const applyAsync = (acc, val) => acc.then(val);
const composeAsync =
    (...funcs) =>
    (x) =>
        funcs.reduce(applyAsync, Promise.resolve(x));
```

`composeAsync()` 함수는 임의의 개수의 함수를 인수로 받아들이고, the composition pipeline을 통해 전달될 초기 값을 받는 새로운 함수를 반환합니다.

<br/>

---

#### 파이프 라인

데이터가 여러 개의 처리 단계를 거쳐 흐르는 과정.

---

<br/>

```js
const transformData = composeAsync(func1, func2, func3);
const result3 = transformData(data);
```

Sequential composition can also be done more succinctly with async/await:

```js
let result;
for (const f of [func1, func2, func3]) {
    result = await f(result);
}
/* use last result (i.e. result3) */
```

그러나 `Promise`를 순차적으로 조합하기 전에, 정말 필요한지 고려해보아야 합니다. 한 `Promise`의 실행이 다른 `Promise`의 결과에 의존하지 않는 한, 항상 `Promise`를 동시에 실행하는 것이 더 좋습니다. 이렇게 하면 서로 불필요하게 차단되지 않기 때문입니다.

<br/>
<br/>
<br/>
<br/>

## Cancellation

`Promise` 자체에는 취소를 위한 일급 프로토콜이 없지만, 일반적으로 `AbortController`를 사용하여 기본적인 비동기 작업을 직접 취소할 수 있습니다.

<br/>
<br/>
<br/>
<br/>

## Creating a Promise around an old callback API

`Promise`는 생성자를 사용하여 처음부터 만들 수 있습니다. 이는 old API를 감싸기 위해서만 필요합니다.

이상적인 세상에서는 모든 비동기 함수가 이미 `Promise`를 반환할 것입니다. 그러나 일부 `API`는 여전히 success and/or failure 콜백을 예전 방식으로 전달할 수 도 있다. 가장 뚜렷한 예로 `setTimeout()` 함수가 있습니다:

```js
setTimeout(() => saySomething("10 seconds passed"), 10 * 1000);
```

Mixing old-style callbacks and promises is problematic. 만약 `saySomething()`이 실패하거나 프로그래밍 오류가 발생하면, 이를 잡아낼 방법이 없습니다. 이는 `setTimeout()`의 설계에 내재된 문제입니다.

다행히도 우리는 `setTimeout()`을 `Promise`로 감쌀 수 있습니다. 최선의 방법은 콜백을 받는 함수를 가능한 가장 낮은 수준에서 감싸고, 이후에는 직접 호출하지 않는 것입니다.

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(10 * 1000)
    .then(() => saySomething("10 seconds"))
    .catch(failureCallback);
```

`Promise` 생성자는 `Promise`를 수동으로 해결(resolve)하거나 거부(reject)할 수 있게 해주는 실행자(executor) 함수를 받습니다. `setTimeout()`은 실제로 실패하지 않기 때문에, 이 경우에는 `reject`를 생략했습니다. 실행자 함수의 작동 방식에 대한 더 많은 정보는 `Promise()` 참조를 참고하세요.

<br/>
<br/>
<br/>
<br/>

## Timing

마지막으로, 등록된 콜백이 호출되는 시점에 대한 더 기술적인 세부 사항을 살펴보겠습니다.

### Guarantees

콜백 기반 API에서 콜백이 호출되는 시점과 방법은 API 구현자에 따라 다릅니다. 예를 들어, 콜백은 동기적으로 호출될 수도 있고 비동기적으로 호출될 수도 있습니다.

```js
// ❌ Don't use
function doSomething(callback) {
    if (Math.random() > 0.5) {
        callback();
    } else {
        setTimeout(() => callback(), 1000);
    }
}
```

The above design는 "Zalgo state"라고 불리는 상황을 초래하기 때문에 강력히 권장되지 않습니다. 비동기 API 설계의 맥락에서 이는 콜백이 일부 경우에는 동기적으로 호출되고 다른 경우에는 비동기적으로 호출되어 호출자에게 혼란을 초래하는 것을 의미합니다. 더 자세한 배경은 이 용어가 처음으로 공식적으로 소개된 "비동기성을 위한 API 설계" 기사를 참조하세요. 이 API 설계는 부작용을 분석하기 어렵게 만듭니다.

```js
let value = 1;
doSomething(() => {
    value = 2;
});
console.log(value); // 1 or 2?
```

반면, `Promise`는 inversion of control의 한 형태입니다. API 구현자는 콜백이 호출되는 시점을 제어하지 않습니다. 대신, 콜백 큐를 유지하고 콜백을 호출할 시점을 결정하는 작업은 `Promise` 구현에 위임됩니다. 이로 인해 API 사용자와 개발자 모두 강력한 의미적 보장을 자동으로 얻습니다. 여기에는 다음과 같은 내용이 포함됩니다:

-   `then()`으로 추가된 콜백은 현재 JavaScript 이벤트 루프의 실행이 완료되기 전에 호출되지 않습니다.
-   이러한 콜백은 `Promise`가 나타내는 비동기 작업의 성공 또는 실패 후에 추가되었더라도 호출됩니다.
-   여러 개의 콜백은 `then()`을 여러 번 호출하여 추가할 수 있습니다.
-   이들은 삽입된 순서대로 하나씩 호출됩니다.

예상치 못한 상황을 피하기 위해, `then()`에 전달된 함수는 이미 해결된(Promise가 fulfilled 상태인) `Promise`일지라도 절대 동기적으로 호출되지 않습니다.

```js
Promise.resolve().then(() => console.log(2));
console.log(1);
// Logs: 1, 2
```

즉시 실행되는 대신, 전달된 함수는 마이크로태스크 큐에 넣어집니다. 이는 나중에 실행된다는 것을 의미합니다(생성한 함수가 종료된 후, JavaScript 실행 스택이 비었을 때). 즉, 이벤트 루프에 제어가 반환되기 직전에 실행됩니다; 즉, 곧 실행됩니다.

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(0).then(() => console.log(4));
Promise.resolve()
    .then(() => console.log(2))
    .then(() => console.log(3));
console.log(1); // 1, 2, 3, 4
```

### Task queues vs microtasks

`Promise` callbacks are handled as **a microtask** whereas `setTimeout()` callbacks are handled as **task queues**.

```js
const promise = new Promise((resolve, reject) => {
    console.log("Promise callback");
    resolve();
}).then((result) => {
    console.log("Promise callback (.then)");
});

setTimeout(() => {
    console.log("event-loop cycle: Promise (fulfilled)", promise);
}, 0);

console.log("Promise (pending)", promise);
```

The code above will output:

```
Promise callback
Promise (pending) Promise {<pending>}
Promise callback (.then)
event-loop cycle: Promise (fulfilled) Promise {<fulfilled>}
```

<br/>
<br/>
<br/>
<br/>
