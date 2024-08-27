# 컴포넌트 Component

-   one of the core concepts of React.
-   UI를 구축하는 기초.
-   reusable UI

## Defining a component

-   리액트 컴포넌트는 **마크업**을 추가할 수 있는 자바스크립트 함수

```js
export default function Profile() {
    return <img src="https://i.imgur.com/MK3eW3Am.jpg" alt="Katherine Johnson" />;
}
```

-   return 키워드와 같은 줄에 있지 않다면, 반드시 괄호로 감싸야 합니다.

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

```js
return (
    <div>
        <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
    </div>
);
```

## Using a component

-   다른 컴포넌트 안에서 중첩해서 사용할 수 있다.

```js
function Profile() {
    return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
}

export default function Gallery() {
    return (
        <section>
            <h1>Amazing scientists</h1>
            <Profile />
            <Profile />
            <Profile />
        </section>
    );
}
```

🔴 Never define a component inside another component!

```js
export default function Gallery() {
    function Profile() {
        // ...
    }
    // ...
}
```

✅ Declare components at the top level

```js
export default function Gallery() {
    // ...
}

function Profile() {
    // ...
}
```

## the browser sees

대소문자에 따라 브라우저가 인식하는게 다르다.

-   `<section>` is lowercase, so React knows we refer to an **HTML tag**.
-   `<Profile />` starts with a capital `P`, so React knows that we want to use our **component** called `Profile`.

```js
<section>
    <h1>Amazing scientists</h1>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

## Exporting and importing a component 

1.  **Make** a new JS file to put the components in.
2.  **Export** your function component from that file (using either default or named  exports).
3.  **Import** it in the file where you’ll use the component (using the corresponding technique for importing default or named exports).

<br/>

> #### Default & Named export

##### Default

-   하나의 파일에 export가 하나만 존재할 수 있다.
-   `import Banana from './Button.js'`라고 작성해도 동일한 defalut export를 제공받습니다.

##### Named

-   원하는 만큼 export 할 수 있다
-   named export는 양쪽의 이름이 일치해야 한다.

| Syntax  | Export statement                      | Import statement                        |
| ------- | ------------------------------------- | --------------------------------------- |
| Default | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named   | `export function Button() {}`         | `import { Button } from './Button.js';` |

## Keeping Components Pure

일부 JavaScript 함수는 순수 함수입니다. 순수 함수는 오직 계산만을 수행하고 그 이상은 하지 않습니다. 컴포넌트를 순수 함수로만 작성하면 코드베이스가 커질수록 혼란스러운 버그와 예측할 수 없는 동작을 피할 수 있습니다. 하지만 이러한 이점을 얻기 위해서는 따라야 할 몇 가지 규칙이 있습니다

### 🤔 순수 함수?

순수 함수는 **입력값에 따라 항상 동일한 출력을 반환하고, 외부 상태를 변경하지 않는 것**

1. **동일한 입력에 대해 항상 동일한 출력**: 같은 인자를 넣었을 때 항상 같은 결과를 내야 합니다.
2. **No sideeffects**: 함수가 실행될 때 외부의 상태(전역 변수, 파일 시스템 등)를 변경하지 않아야 합니다.

-   순수 함수: `function add(a, b) { return a + b; }` (항상 같은 입력에 대해 같은 결과를 반환)
-   비순수 함수: `let count = 0; function increment() { count++; }` (외부 변수 `count`를 변경하므로 부작용이 있음)

React는 이 개념을 중심으로 설계되었습니다. React는 당신이 작성하는 모든 컴포넌트가 순수 함수라고 가정합니다.

```js
function Recipe({ drinkers }) {
    return (
        <ol>
            <li>Boil {drinkers} cups of water.</li>
            <li>
                Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.
            </li>
            <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
        </ol>
    );
}

export default function App() {
    return (
        <section>
            <h1>Spiced Chai Recipe</h1>
            <h2>For two</h2>
            <Recipe drinkers={2} />
            <h2>For a gathering</h2>
            <Recipe drinkers={4} />
        </section>
    );
}
```

`drinkers={2}`를 Recipe에 전달하면 항상 2컵의 물이 포함된 JSX를 반환합니다.

`drinkers={4}`를 전달하면 항상 4컵의 물이 포함된 JSX를 반환합니다.

마치 수학 공식처럼요.

컴포넌트를 레시피라고 생각할 수 있습니다. 레시피를 따르고 요리 과정에서 새로운 재료를 추가하지 않으면 **매번 같은 요리**를 만들 수 있습니다. 그 "요리"는 컴포넌트가 React에 렌더링할 JSX입니다.

## Side Effects: (un)intended consequences 

컴포넌트는 **오직 JSX만 반환**해야 하며, 렌더링 이전에 존재했던 객체나 변수를 변경해서는 안 됩니다.

Here is a component that breaks this rule:

```js
let guest = 0;

function Cup() {
    // Bad: changing a preexisting variable!
    guest = guest + 1;
    return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
    return (
        <>
            <Cup />
            <Cup />
            <Cup />
        </>
    );
}
```

이 컴포넌트는 자신 외부에 선언된 guest 변수를 읽고 쓰고 있습니다. 이는 이 컴포넌트를 여러 번 호출할 경우 서로 다른 JSX가 생성된다는 것을 의미한다. 게다가, 다른 컴포넌트가 `guest`를 읽으면 렌더링 시점에 따라 서로 다른 JSX를 생성하게 됩니다.

y = 2x라는 공식을 다시 생각해보면, x = 2일지라도 y = 4라고 예측할 수 없다.

You can fix this:

```js
function Cup({ guest }) {
    return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
    return (
        <>
            <Cup guest={1} />
            <Cup guest={2} />
            <Cup guest={3} />
        </>
    );
}
```

<br/>
<br/>
<br/>

<span style="font-weight:bold; color:rgb(70, 142, 242)">DEEP DIVE</span>

**Detecting impure calculations with StrictMode**

React there are three kinds of inputs that you can read while rendering: **props, state, and context.** should always treat these inputs as **read-only**.

사용자 입력에 반응하여 무언가를 변경하고 싶다면, 변수를 수정하는 대신 state를 설정해야 한다. 컴포넌트가 렌더링되는 동안 기존 변수나 객체를 변경해서는 안 됩니다.

React는 개발 중에 각 컴포넌트의 함수를 두 번 호출하는 "엄격 모드(Strict Mode)"를 제공합니다. 컴포넌트 함수를 두 번 호출함으로써 엄격 모드는 이러한 규칙을 위반하는 컴포넌트를 찾는 데 도움을 줍니다.

원래의 예제에서 "Guest #2", "Guest #4", "Guest #6"이 표시된 반면, "Guest #1", "Guest #2", "Guest #3"이 표시되지 않았음을 주목하세요. 원래 함수는 불순했기 때문에 두 번 호출하면 문제가 발생했습니다. 그러나 수정된 순수 버전은 함수가 매번 두 번 호출되더라도 잘 작동합니다. 순수 함수는 단지 계산만 하므로, 두 번 호출해도 아무것도 변경되지 않습니다. 마치 double(2)을 두 번 호출해도 반환 값이 변하지 않듯이, y = 2x를 두 번 풀어도 y의 값이 변하지 않습니다. 같은 입력, 같은 출력. 항상 그렇습니다.

엄격 모드는 프로덕션 환경에서는 아무런 영향을 미치지 않으므로, 사용자에게 앱을 느리게 만들지 않습니다. 엄격 모드를 적용하려면, `루트 컴포넌트`를 `<React.StrictMode>`로 감싸면 됩니다. 일부 프레임워크는 기본적으로 이렇게 설정합니다.

### Local mutation: Your component’s little secret

순수 함수는 함수의 범위를 벗어난 변수나 호출 전에 생성된 객체를 변형하지 않기 때문에 순수합니다. 그러나 렌더링 중에 방금 생성한 변수와 객체를 변경하는 것은 완전히 괜찮습니다. 아래 예제에서는 빈 배열`[]`을 생성하고 이를 cups 변수에 할당한 다음, 그 안에 열 개의 컵을 추가하고 있습니다:

```js
function Cup({ guest }) {
    return <h2>Tea cup for guest #{guest}</h2>;
}

function TeaGathering() {
    let cups = [];
    for (let i = 1; i <= 12; i++) {
        cups.push(<Cup key={i} guest={i} />);
    }
    return cups;
}
```

만약 cups 변수나 `[]`배열이 `TeaGathering` 함수 외부에서 생성되었다면, 이는 큰 문제가 될 것입니다! 그 경우, 배열에 항목을 추가함으로써 기존 객체를 변경하게 됩니다.

하지만 이러한 객체들이 `TeaGathering` 내부의 같은 렌더링 과정에서 생성되었기 때문에 괜찮습니다. `TeaGathering` 외부의 코드에서는 이 일이 발생했다는 사실을 전혀 알 수 없습니다. **local mutation**이라고 한다.

## Where you can cause side effects

함수형 프로그래밍이 순수성에 많이 의존하지만, 어딘가에서 반드시 무언가가 변경되어야 합니다. 이러한 변경—**화면 업데이트, 애니메이션 시작, 데이터 변경**—은 side effects이라고 한다. 이들은 **렌더링 중에 발생하지 않고** "옆에서" 일어나는 일들입니다.

React에서 side effects는 일반적으로 **이벤트 핸들러 내부**에 위치합니다. 이벤트 핸들러는 사용자가 행동을 취할 때 React가 실행하는 함수입니다. 예를 들어, 버튼을 클릭할 때 실행됩니다. 이벤트 핸들러는 컴포넌트 내부에서 정의되지만, 렌더링 중에는 실행되지 않습니다! 따라서 이벤트 핸들러는 순수할 필요가 없습니다.

모든 다른 옵션을 다 써보고도 부작용에 적합한 이벤트 핸들러를 찾지 못했다면, 컴포넌트의 반환된 JSX에 **useEffect 호출을 통해 부작용을 연결**할 수 있습니다. 이는 React에게 렌더링 후에, side effects가 허용되는 시점에 이를 실행하라고 지시하는 것입니다. 하지만 이 접근법은 마지막 수단으로 사용해야 합니다.

When possible, try to express your logic with rendering alone. You’ll be surprised how far this can take you!

<br/>
<br/>
<br/>

<span style="font-weight:bold; color:rgb(70, 142, 242)">DEEP DIVE</span>

**Why does React care about purity?**

1. 컴포넌트가 다른 환경에서 실행될 수 있습니다. 예를 들어, 서버에서 실행될 수 있습니다! 동일한 입력에 대해 항상 같은 결과를 반환하므로, 하나의 컴포넌트가 여러 사용자 요청을 처리할 수 있습니다.
2. 입력이 변경되지 않은 컴포넌트의 렌더링을 건너뛰어 **성능을 개선**할 수 있습니다. 순수 함수는 항상 동일한 결과를 반환하므로 캐시하기에 안전합니다.
3. If some data changes in the middle of rendering a deep component tree, React can restart rendering without wasting time to finish the outdated render. Purity makes it safe to stop calculating at any time.

우리가 개발하는 모든 새로운 React 기능은 순수성을 활용합니다. 데이터 가져오기, 애니메이션, 성능 개선 등에서 컴포넌트를 순수하게 유지하는 것은 React 패러다임의 힘을 발휘하게 합니다.

#### MEMO 🤔

-   React component는 순수해야한다. -> 외부에 의존하면 안된다. -> 각 컴포넌트는 독립성을 가져야한다는건가???
-   React component는 오로지 JSX만 return 해야한다.
-   local mutation은 같은 함수 내부에서 변형이 이뤄지는 것을 의미한다.
-   side effects 마지막 문장은 리액트 성능을 올릴 수 있는 문장인 것 같은데.. side effects에 맞는 이벤트 핸들러를 찾고 -> 이벤트 핸들러는 렌더링 중 실행되지 않는다. -> side effects를 최소화 하고 props와 state 위주로 UI를 구성
