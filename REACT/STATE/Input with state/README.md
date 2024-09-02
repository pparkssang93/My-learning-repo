# Input with state

UI의 개별 요소를 직접 조작하는 대신, 컴포넌트가 가질 수 있는 다양한 상태를 설명하고, 사용자 입력에 따라 이 states 사이를 전환합니다.

## How declarative UI compares to imperative

When you design UI interactions, 아마도 사용자 행동에 따라 UI가 어떻게 변화하는지에 대해 생각할 것입니다. 예를 들어, 사용자가 답변을 제출할 수 있는 폼을 고려해 보세요:

1. 폼에 무언가를 입력하면 "제출" 버튼이 활성화됩니다.
2. "제출" 버튼을 누르면 폼과 버튼이 비활성화되고, a spinner가 나타납니다.
3. 네트워크 요청이 성공하면 폼이 숨겨지고 "감사합니다" 메시지가 나타납니다.
4. 네트워크 요청이 실패하면 오류 메시지가 나타나고, 폼이 다시 활성화됩니다.

명령형 프로그래밍에서는 위의 동작이 상호작용을 구현하는 방식과 직접적으로 연결됩니다. 즉, 발생한 사건에 따라 UI를 조작하기 위한 정확한 지시를 작성해야 합니다. 이를 다른 방식으로 생각해보면, 자동차에 탑승한 사람에게 가고자 하는 방향을 하나하나 지시하는 것과 같습니다.

> 명령형 프로그래밍?  
> 프로그램의 상태 변화를 명령어의 순서로 기술하는 방식을 말합니다. 즉, 개발자가 컴퓨터에게 어떤 작업을 어떻게 수행할지를 단계별로 지시하는 방식입니다.

그들은 당신이 가고자 하는 방향을 모르고, 단지 당신의 명령을 따릅니다. (만약 방향을 잘못 지시하면 잘못된 곳에 도착하게 됩니다!) 명령형 프로그래밍이라고 불리는 이유는 스피너부터 버튼까지 각 요소를 "명령"해야 하며, 컴퓨터에게 UI를 어떻게 업데이트할지를 알려줘야 하기 때문입니다.

이 명령형 UI 프로그래밍의 예에서는 폼이 React 없이 구축되었고, 오직 브라우저 DOM만을 사용합니다.

```html
<form id="form">
    <h2>City quiz</h2>
    <p>What city is located on two continents?</p>
    <textarea id="textarea"></textarea>
    <br />
    <button id="button" disabled>Submit</button>
    <p id="loading" style="display: none">Loading...</p>
    <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
    * {
        box-sizing: border-box;
    }
    body {
        font-family: sans-serif;
        margin: 20px;
        padding: 0;
    }
</style>
```

```js
function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

명령형으로 UI를 조작하는 것은 단순한 예제에서는 충분히 잘 작동하지만, 더 복잡한 시스템에서는 관리하기가 기하급수적으로 어려워집니다. 예를 들어, 여러 가지 폼으로 가득한 페이지를 업데이트한다고 상상해 보세요. 새로운 UI 요소나 상호작용을 추가하려면 기존 코드를 모두 면밀히 확인하여 버그를 도입하지 않았는지 확인해야 합니다(예를 들어, 무언가를 보여주거나 숨기는 것을 잊는 경우).

React는 이러한 문제를 해결하기 위해 만들어졌습니다.

React에서는 UI를 직접 조작하지 않습니다. 즉, 컴포넌트를 직접 활성화하거나 비활성화하거나 표시하거나 숨기지 않습니다. 대신, 보여주고 싶은 내용을 선언하면 React가 UI를 업데이트하는 방법을 알아냅니다. 택시에 올라타서 운전사에게 가고 싶은 곳을 말하는 것과 비슷합니다. 운전사에게 어디로 돌아가라고 말하는 것이 아니라, 그들에게 목적지를 알려주는 것입니다. 운전사는 당신을 그곳으로 데려가는 것이 자신의 일이므로, 당신이 고려하지 않았던 지름길을 알 수도 있습니다!

## Thinking about UI declaratively

React에서 어떻게 사고해야 하는지를 더 잘 이해하기 위해, 아래에서 이 UI를 React로 다시 구현하는 과정을 살펴보겠습니다:

1. **Identify** your component’s different visual states
2. **Determine** what triggers those state changes 상태 변화를 유발하는 요소 결정하기
3. **Represent** the state in memory using `useState`
4. **Remove** any non-essential state variables
5. **Connect** the event handlers to set the state

<br/>
<br/>
<br/>
<br/>

### Step 1. Identify your component’s different visual states

React는 디자인과 컴퓨터 과학의 교차점에 위치하므로, 이 두 가지 아이디어는 영감을 주는 원천이 됩니다.

우선, 사용자가 볼 수 있는 UI의 다양한 "state"를 시각화해야 합니다:

-   **Empty**: Form has a disabled “Submit” button.
-   **Typing**: Form has an enabled “Submit” button.
-   **Submitting**: Form is completely disabled. Spinner is shown.
-   **Success**: “Thank you” message is shown instead of a form.
-   **Error**: Same as Typing state, but with an extra error message.

디자이너처럼, 논리를 추가하기 전에 다양한 상태에 대한 "목업"을 만들고 싶을 것입니다. For example, here is a mock for just the visual part of the form. This mock is controlled by a prop called status with a default value of 'empty':

```js
export default function Form({ status = "empty" }) {
    if (status === "success") {
        return <h1>That's right!</h1>;
    }
    return (
        <>
            <h2>City quiz</h2>
            <p>In which city is there a billboard that turns air into drinkable water?</p>
            <form>
                <textarea />
                <br />
                <button>Submit</button>
            </form>
        </>
    );
}
```

그 prop의 이름은 원하는 대로 바꿀 수 있으며, 이름은 중요하지 않습니다. status = 'empty'를 status = 'success'로 수정해보면 성공 메시지가 나타나는 것을 확인할 수 있습니다. 목업(mocking)은 논리를 연결하기 전에 UI를 빠르게 반복(iterate)할 수 있게 해줍니다. 다음은 동일한 컴포넌트의 더 구체화된 프로토타입이며, 여전히 status prop에 의해 "제어"되고 있습니다.

<br/>
<br/>

**Deep Dive**

**Displaying many visual states at once**

If a component has a lot of visual states, it can be convenient to show them all on one page:

```js
function Form({ status }) {
    if (status === "success") {
        return <h1>That's right!</h1>;
    }
    return (
        <form>
            <textarea disabled={status === "submitting"} />
            <br />
            <button disabled={status === "empty" || status === "submitting"}>Submit</button>
            {status === "error" && <p className="Error">Good guess but a wrong answer. Try again!</p>}
        </form>
    );
}

let statuses = ["empty", "typing", "submitting", "success", "error"];

export default function App() {
    return (
        <>
            {statuses.map((status) => (
                <section key={status}>
                    <h4>Form ({status}):</h4>
                    <Form status={status} />
                </section>
            ))}
        </>
    );
}
```

Pages like this are often called “living styleguides” or “storybooks”.

<br/>
<br/>
<br/>
<br/>

### Step 2: Determine what triggers those state changes

You can trigger state updates in response to two kinds of inputs:

-   **Human inputs**, like clicking a button, typing in a field, navigating a link.
-   **Computer inputs**, like a network response arriving, a timeout completing, an image loading.

두 경우 모두 UI를 업데이트하기 위해 state variables를 설정해야 합니다. 개발 중인 폼에서는 몇 가지 다양한 입력에 따라 상태를 변경해야 합니다:

-   **Changing the text input**(human) 텍스트 상자가 비어 있느냐에 따라 Empty 상태에서 Typing 상태로 전환하거나 그 반대로 전환해야 합니다.
-   **Clicking the Submit button**(human) 제출 버튼을 클릭하면 Submitting 상태로 전환해야 합니다.
-   **Successful network response**(computer) should switch it to the Success state.
-   **Failed network response**(computer) should switch it to the Error state with the matching error message.

이 흐름을 시각화하는 데 도움이 되도록, 각 상태를 레이블이 있는 원으로 그려보고 두 상태 간의 변화를 화살표로 표시해 보세요. 이렇게 여러 흐름을 스케치하면 구현하기 전에도 많은 버그를 정리할 수 있습니다.

![이미지](/IMG/REACT/STATE/input-with-state_01.png)

<br/>
<br/>
<br/>
<br/>

### Step 3: Represent the state in memory with useState

Next you’ll need to represent the visual states of your component in memory with useState. Simplicity is key: each piece of state is a “moving piece”, and you want as few “moving pieces” as possible. More complexity leads to more bugs!

Start with the state that absolutely must be there. For example, you’ll need to store the answer for the input, and the error (if it exists) to store the last error:

다음으로, `useState`를 사용하여 컴포넌트의 시각적 상태를 메모리에 표현해야 합니다. Simplicity is key: 각 state는 "moving piece"이며, 가능한 한 적은 "moving piece"를 원해야 합니다. 복잡성이 증가할수록 버그도 더 많아집니다!

먼저 반드시 필요한 상태부터 시작하세요. 예를 들어, 입력에 대한 답변과 마지막 오류를 저장하기 위해 오류(존재하는 경우)를 저장해야 합니다.

```js
const [answer, setAnswer] = useState("");
const [error, setError] = useState(null);
```

그 다음, 표시하고자 하는 the visual states 중 어떤 것을 나타낼지를 표현하는 상태 변수를 추가해야 합니다. 메모리에서 이를 표현하는 방법은 보통 하나 이상이 있으므로, 여러 방법을 실험해볼 필요가 있습니다.

가장 좋은 방법을 즉시 생각해내기 어렵다면, 가능한 모든 시각적 상태가 포함되도록 충분한 상태를 먼저 추가하는 것으로 시작하세요.

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Your first idea likely won’t be the best, but that’s ok—refactoring state is a part of the process!

<br/>
<br/>
<br/>
<br/>

### Step 4: Remove any non-essential state variables

You want to avoid duplication in the state content so you’re only tracking what is essential.
Spending a little time on refactoring your state structure will make your components easier to understand,  
목표는 메모리의 상태가 사용자가 보고 싶어 하는 유효한 UI를 나타내지 않도록 하는 것입니다. (예를 들어, 오류 메시지를 표시하면서 입력을 비활성화하면 사용자가 오류를 수정할 수 없게 됩니다!)

다음은 state variables에 대해 스스로 질문할 수 있는 몇 가지 사항입니다:

-   **Does this state cause a paradox?** 예를 들어, `isTyping`과 `isSubmitting`이 동시에 `true`일 수는 없습니다.역설은 보통 state가 충분히 제한되지 않았음을 의미합니다. 두 개의 불리언에는 네 가지 가능한 조합이 있지만, 유효한 상태와 일치하는 것은 세 가지뿐입니다. "불가능한" 상태를 제거하기 위해 이 두 가지를 결합하여 `'typing'`, `'submitting'`, 또는 `'success'` 중 하나의 값이어야 하는 상태로 만들 수 있습니다.
-   **Is the same information available in another state variable already?** Another paradox: `isEmpty`와 `isTyping`이 동시에 `true`일 수는 없습니다. 이들을 별도의 상태 변수로 만들면 동기화가 풀려서 버그를 유발할 위험이 있습니다. 다행히도 `isEmpty`를 제거하고 대신 `answer.length === 0`을 체크할 수 있습니다.
-   **Can you get the same information from the inverse of another state variable?** `isError`는 필요하지 않습니다. 대신 `error !== null`을 체크하면 됩니다.

After this clean-up, you’re left with 3 (down from 7!) essential state variables:

```js
const [answer, setAnswer] = useState("");
const [error, setError] = useState(null);
const [status, setStatus] = useState("typing"); // 'typing', 'submitting', or 'success'
```

You know they are essential, because you can’t remove any of them without breaking the functionality.

<br/>
<br/>

**Deep Dive**

**Eliminating “impossible” states with a reducer**
“불가능한” 상태를 리듀서를 사용하여 제거하기

이 세 개의 변수는 이 폼의 상태를 충분히 잘 표현합니다. 그러나 여전히 완전히 이해되지 않는 중간 상태가 있습니다. 예를 들어, 상태가 'success'일 때는 null이 아닌 오류가 존재하는 것이 의미가 없습니다. 상태를 더 정확하게 모델링하기 위해 이를 리듀서로 추출할 수 있습니다. reducer는 **여러 상태 변수를 단일 객체로 통합하고 모든 관련 로직을 정리**할 수 있게 해줍니다!

<br/>
<br/>
<br/>
<br/>

### Step 5: Connect the event handlers to set state

상태를 업데이트하는 이벤트 핸들러를 생성하세요.

```js
import { useState } from "react";

export default function Form() {
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("typing");

    if (status === "success") {
        return <h1>That's right!</h1>;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("submitting");
        try {
            await submitForm(answer);
            setStatus("success");
        } catch (err) {
            setStatus("typing");
            setError(err);
        }
    }

    function handleTextareaChange(e) {
        setAnswer(e.target.value);
    }

    return (
        <>
            <h2>City quiz</h2>
            <p>In which city is there a billboard that turns air into drinkable water?</p>
            <form onSubmit={handleSubmit}>
                <textarea value={answer} onChange={handleTextareaChange} disabled={status === "submitting"} />
                <br />
                <button disabled={answer.length === 0 || status === "submitting"}>Submit</button>
                {error !== null && <p className="Error">{error.message}</p>}
            </form>
        </>
    );
}

function submitForm(answer) {
    // Pretend it's hitting the network.
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let shouldError = answer.toLowerCase() !== "lima";
            if (shouldError) {
                reject(new Error("Good guess but a wrong answer. Try again!"));
            } else {
                resolve();
            }
        }, 1500);
    });
}
```

Although this code is longer than the original imperative example,it is much less fragile.

모든 상호작용을 state changes로 표현하면, 기존의 시각적 상태를 깨뜨리지 않고 나중에 새로운 시각적 상태를 도입할 수 있습니다. 또한 각 상태에서 무엇을 표시해야 하는지를 상호작용의 로직을 변경하지 않고도 바꿀 수 있게 해줍니다.
