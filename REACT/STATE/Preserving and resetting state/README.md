# Preserving and Resetting State

state는 컴포넌트 간에 격리되어 있습니다. React는 UI 트리에서 각 state가 어느 컴포넌트에 속하는지를 추적합니다. state를 유지할 시점과 리렌더링 간에 state를 초기화할 시점을 조절할 수 있습니다.

<br/>
<br/>
<br/>
<br/>

## State is tied to a position in the render tree

state는 렌더 트리의 위치에 연결되어 있습니다.

React는 UI의 컴포넌트 구조를 위해 렌더 트리를 생성합니다. 컴포넌트에 state를 부여할 때, 그 state가 컴포넌트 내부에 "lives"한다고 생각할 수 있습니다. 하지만 실제로 state는 React 내부에 저장됩니다. React는 each piece of state을 렌더 트리에서 해당 컴포넌트의 위치에 따라 올바른 컴포넌트와 연결합니다.

여기서는 `<Counter />` JSX 태그가 하나만 있지만, 두 개의 서로 다른 위치에서 렌더링됩니다:

```js
import { useState } from "react";

export default function App() {
    const counter = <Counter />;
    return (
        <div>
            {counter}
            {counter}
        </div>
    );
}

function Counter() {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>{score}</h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

Here’s how these look as a tree:

![이미지](/IMG/REACT/STATE/preserving-resetting-state_01.png)

These are two separate counters because each is rendered at its own position in the tree. React를 사용할 때 이러한 위치를 항상 고려할 필요는 없지만, 작동 방식을 이해하는 데 유용할 수 있습니다. React에서는 화면의 각 컴포넌트가 완전히 isolated state를 가집니다. 예를 들어, 두 개의 `Counter` 컴포넌트를 나란히 렌더링하면 각 컴포넌트는 독립적인 점수와 hover state를 갖게 됩니다.

두 카운터를 클릭해보면 서로 영향을 미치지 않는다는 것을 알 수 있습니다.

```js
import { useState } from "react";

export default function App() {
    return (
        <div>
            <Counter />
            <Counter />
        </div>
    );
}

function Counter() {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>{score}</h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

보시다시피, 한 카운터가 업데이트될 때, 오직 그 컴포넌트의 state만 업데이트됩니다.

React will keep the state around for as long as you render the same component at the same position in the tree. 이를 확인하기 위해 두 카운터를 증가시킨 다음, "Render the second counter" 체크박스를 해제하여 두 번째 컴포넌트를 제거하고, 다시 체크하여 다시 추가해보세요.

```js
import { useState } from "react";

export default function App() {
    const [showB, setShowB] = useState(true);
    return (
        <div>
            <Counter />
            {showB && <Counter />}
            <label>
                <input
                    type="checkbox"
                    checked={showB}
                    onChange={(e) => {
                        setShowB(e.target.checked);
                    }}
                />
                Render the second counter
            </label>
        </div>
    );
}

function Counter() {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>{score}</h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

두 번째 카운터의 렌더링을 중지하는 순간, 그 state가 완전히 사라지는 것을 주목하세요. 이는 React가 **컴포넌트를 제거할 때 해당 state를 파괴**하기 때문입니다.

“Render the second counter”를 체크하면 두 번째 카운터와 그 state가 처음부터 초기화되어(점수 = 0) DOM에 추가됩니다.

React는 컴포넌트가 UI 트리의 특정 위치에서 렌더링되는 동안 그 state를 유지합니다. 만약 컴포넌트가 제거되거나 동일한 위치에 다른 컴포넌트가 렌더링되면, React는 해당 state를 파괴한다.

<br/>
<br/>
<br/>
<br/>

## Same component at the same position preserves state

In this example, there are two different `<Counter />` tags:

```js
import { useState } from "react";

export default function App() {
    const [isFancy, setIsFancy] = useState(false);
    return (
        <div>
            {isFancy ? <Counter isFancy={true} /> : <Counter isFancy={false} />}
            <label>
                <input
                    type="checkbox"
                    checked={isFancy}
                    onChange={(e) => {
                        setIsFancy(e.target.checked);
                    }}
                />
                Use fancy styling
            </label>
        </div>
    );
}

function Counter({ isFancy }) {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }
    if (isFancy) {
        className += " fancy";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>{score}</h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

체크박스를 체크하거나 해제할 때, 카운터 state는 초기화되지 않습니다. `isFancy`가 `true`이든 `false`이든, 항상 루트 App 컴포넌트에서 반환된 `div`의 첫 번째 자식으로 `<Counter />`가 존재합니다.

![이미지](/IMG/REACT/STATE/preserving-resetting-state_02.png)

같은 위치에 있는 동일한 컴포넌트이므로, React의 입장에서는 같은 카운터로 간주됩니다.

<br/>
<br/>

**CAUTION**

React에게 중요한 것은 JSX 마크업이 아니라 UI 트리에서의 위치라는 점을 기억하세요! 이 컴포넌트는 `if` 문 안과 밖에 서로 다른 `<Counter />` JSX 태그가 있는 두 개의 반환 절을 가지고 있습니다.

```js
import { useState } from "react";

export default function App() {
    const [isFancy, setIsFancy] = useState(false);
    if (isFancy) {
        return (
            <div>
                <Counter isFancy={true} />
                <label>
                    <input
                        type="checkbox"
                        checked={isFancy}
                        onChange={(e) => {
                            setIsFancy(e.target.checked);
                        }}
                    />
                    Use fancy styling
                </label>
            </div>
        );
    }
    return (
        <div>
            <Counter isFancy={false} />
            <label>
                <input
                    type="checkbox"
                    checked={isFancy}
                    onChange={(e) => {
                        setIsFancy(e.target.checked);
                    }}
                />
                Use fancy styling
            </label>
        </div>
    );
}

function Counter({ isFancy }) {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }
    if (isFancy) {
        className += " fancy";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>{score}</h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

체크박스를 체크할 때 state가 초기화될 것이라고 예상할 수 있지만, 그렇지 않습니다! 이는 두 `<Counter />` 태그가 동일한 위치에서 렌더링되기 때문입니다. **React는 함수 내에서 조건을 어떻게 배치하는지 알지 못합니다. React가 "보는" 것은 반환하는 트리뿐입니다.**

두 경우 모두, App 컴포넌트는 `<Counter />`를 첫 번째 자식으로 갖는 `<div>`를 반환합니다. React에게 이 두 카운터는 동일한 "주소"를 가지고 있습니다: 루트의 첫 번째 자식의 첫 번째 자식입니다. 이렇게 React는 이전 렌더와 다음 렌더 사이에서 이들을 연결합니다. logic을 어떻게 구조화하든 상관없이 말이죠.

<br/>
<br/>
<br/>
<br/>

## Different components at the same position reset state

In this example, ticking the checkbox will replace `<Counter>` with a `<p>`:

```js
import { useState } from "react";

export default function App() {
    const [isPaused, setIsPaused] = useState(false);
    return (
        <div>
            {isPaused ? <p>See you later!</p> : <Counter />}
            <label>
                <input
                    type="checkbox"
                    checked={isPaused}
                    onChange={(e) => {
                        setIsPaused(e.target.checked);
                    }}
                />
                Take a break
            </label>
        </div>
    );
}

function Counter() {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>{score}</h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

여기에서는 같은 위치에서 서로 다른 컴포넌트 유형 간에 전환하고 있습니다. 처음에 `<div>`의 첫 번째 자식은 `Counter`였습니다. 하지만 `p`로 교체했을 때, React는 UI 트리에서 `Counter`를 제거하고 그 state를 파괴했습니다.

또한, 동일한 위치에서 다른 컴포넌트를 렌더링할 때, 해당 서브트리의 전체 상태가 초기화됩니다. 이 동작을 확인하려면 카운터를 증가시킨 후 체크박스를 체크해보세요.

```js
import { useState } from "react";

export default function App() {
    const [isFancy, setIsFancy] = useState(false);
    return (
        <div>
            {isFancy ? (
                <div>
                    <Counter isFancy={true} />
                </div>
            ) : (
                <section>
                    <Counter isFancy={false} />
                </section>
            )}
            <label>
                <input
                    type="checkbox"
                    checked={isFancy}
                    onChange={(e) => {
                        setIsFancy(e.target.checked);
                    }}
                />
                Use fancy styling
            </label>
        </div>
    );
}

function Counter({ isFancy }) {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }
    if (isFancy) {
        className += " fancy";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>{score}</h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

체크박스를 클릭하면 카운터 state가 초기화됩니다. 비록 `Counter`를 렌더링하더라도, `<div>`의 첫 번째 자식이 `<div>`에서 `<section>`으로 변경됩니다. 자식 `<div>`가 DOM에서 제거되면서, 그 아래의 전체 트리(카운터와 그 상태를 포함하여)도 함께 파괴됩니다.

![이미지](/IMG/REACT/STATE/preserving-resetting-state_03.png)

![이미지](/IMG/REACT/STATE/preserving-resetting-state_04.png)

일반적인 규칙으로, **리렌더링 간에 state를 유지하고 싶다면 트리의 구조가 서로 일치**해야 합니다. 구조가 다르면 state가 파괴되는데, 이는 React가 트리에서 컴포넌트를 제거할 때 상태를 삭제하기 때문입니다.

<br/>
<br/>

**CAUTION**

이것이 바로 컴포넌트 함수 정의를 중첩해서는 안 되는 이유입니다. 여기서 `MyTextField` 컴포넌트 함수는 `MyComponent` 안에 정의되어 있습니다.

```js
import { useState } from "react";

export default function MyComponent() {
    const [counter, setCounter] = useState(0);

    function MyTextField() {
        const [text, setText] = useState("");

        return <input value={text} onChange={(e) => setText(e.target.value)} />;
    }

    return (
        <>
            <MyTextField />
            <button
                onClick={() => {
                    setCounter(counter + 1);
                }}
            >
                Clicked {counter} times
            </button>
        </>
    );
}
```

Every time you click the button, the input state disappears! 이는 `MyComponent`가 렌더링될 때마다 다른 `MyTextField` 컴포넌트가 생성되기 때문입니다. 동일한 위치에서 다른 컴포넌트를 렌더링하므로, React는 아래의 모든 state를 초기화합니다. 이로 인해 버그와 성능 문제가 발생할 수 있습니다. 이러한 문제를 피하려면 항상 컴포넌트 함수를 최상위 수준에서 선언하고, 정의를 중첩하지 않아야 합니다.

<br/>
<br/>
<br/>
<br/>

## Resetting state at the same position

기본적으로 React는 컴포넌트가 같은 위치에 있을 때 state를 유지합니다. 일반적으로 이것은 원하는 동작이므로 기본 동작으로 설정되어 있습니다. 하지만 때때로 컴포넌트의 state를 초기화하고 싶을 수 있습니다. 두 플레이어가 각 턴 동안 점수를 기록할 수 있는 이 앱을 고려해보세요:

```js
import { useState } from "react";

export default function Scoreboard() {
    const [isPlayerA, setIsPlayerA] = useState(true);
    return (
        <div>
            {isPlayerA ? <Counter person="Taylor" /> : <Counter person="Sarah" />}
            <button
                onClick={() => {
                    setIsPlayerA(!isPlayerA);
                }}
            >
                Next player!
            </button>
        </div>
    );
}

function Counter({ person }) {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>
                {person}'s score: {score}
            </h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

현재 플레이어를 변경할 때 점수가 유지됩니다. 두 개의 카운터가 같은 위치에 나타나므로 React는 이들을 같은 카운터로 간주하며, `person` prop만 변경된 것으로 인식합니다.

하지만 이 앱에서는 개념적으로 두 개의 별도 카운터여야 합니다. UI에서 같은 위치에 나타날 수 있지만, 하나는 테일러를 위한 카운터이고 다른 하나는 사라를 위한 카운터입니다.

이들 사이를 전환할 때 상태를 초기화하는 두 가지 방법이 있습니다:

1. 컴포넌트를 다른 위치에서 렌더링하기
2. 각 컴포넌트에 명시적인 식별자를 key로 부여하기

<br/>
<br/>

### Option 1: Rendering a component in different positions

If you want these two Counters to be independent, you can render them in two different positions:

```js
import { useState } from "react";

export default function Scoreboard() {
    const [isPlayerA, setIsPlayerA] = useState(true);
    return (
        <div>
            {isPlayerA && <Counter person="Taylor" />}
            {!isPlayerA && <Counter person="Sarah" />}
            <button
                onClick={() => {
                    setIsPlayerA(!isPlayerA);
                }}
            >
                Next player!
            </button>
        </div>
    );
}

function Counter({ person }) {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>
                {person}'s score: {score}
            </h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

-   처음에 `isPlayerA`는 `true`입니다. 그래서 첫 번째 위치에는 `Counter` state가 있고, 두 번째 위치는 비어 있습니다.
-   "다음 플레이어" 버튼을 클릭하면 첫 번째 위치의 state는 지워지고, 두 번째 위치에는 이제 `Counter`가 포함됩니다.

각 `Counter`의 state는 DOM에서 제거될 때마다 파괴됩니다. 그래서 버튼을 클릭할 때마다 상태가 초기화되는 이유입니다.

이 솔루션은 같은 위치에 렌더링된 독립적인 컴포넌트가 몇 개 없을 때 편리합니다. 이 예제에서는 두 개만 있으므로 JSX에서 두 개를 각각 렌더링하는 것이 번거롭지 않습니다.

<br/>
<br/>
<br/>
<br/>

### Option 2: Resetting state with a key

컴포넌트의 state를 초기화하는 또 다른, 더 일반적인 방법이 있습니다.

리스트를 렌더링할 때 `key`를 본 적이 있을 것입니다. 키는 리스트에만 해당되는 것이 아닙니다! **`key`를 사용하여 React가 어떤 컴포넌트를 구별할 수 있도록 할 수 있습니다.** 기본적으로 **React는 부모 내에서의 순서(“첫 번째 카운터”, “두 번째 카운터”)를 사용하여 컴포넌트를 구별**합니다. 하지만 키를 사용하면 React에게 이것이 단순한 첫 번째 카운터나 두 번째 카운터가 아니라 특정 카운터, 예를 들어 테일러의 카운터임을 알릴 수 있습니다. 이렇게 하면 React는 트리의 어디에서든 테일러의 카운터를 인식할 수 있습니다!

이 예제에서는 두 개의 `<Counter />`가 JSX에서 같은 위치에 나타나더라도 상태를 공유하지 않습니다.

```js
import { useState } from "react";

export default function Scoreboard() {
    const [isPlayerA, setIsPlayerA] = useState(true);
    return (
        <div>
            {isPlayerA ? <Counter key="Taylor" person="Taylor" /> : <Counter key="Sarah" person="Sarah" />}
            <button
                onClick={() => {
                    setIsPlayerA(!isPlayerA);
                }}
            >
                Next player!
            </button>
        </div>
    );
}

function Counter({ person }) {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = "counter";
    if (hover) {
        className += " hover";
    }

    return (
        <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <h1>
                {person}'s score: {score}
            </h1>
            <button onClick={() => setScore(score + 1)}>Add one</button>
        </div>
    );
}
```

테일러와 사라 사이를 전환할 때 state가 유지되지 않습니다. 이는 그들에게 서로 다른 `key`를 부여했기 때문입니다.

**`key`를 지정하면 React에게 부모 내에서의 순서 대신 `key` 자체를 위치의 일부로 사용하라고 알리는 것입니다.** 이 때문에 JSX에서 같은 위치에 렌더링하더라도 React는 이들을 두 개의 서로 다른 카운터로 인식하므로 state를 공유하지 않습니다. 카운터가 화면에 나타날 때마다 그 state가 생성되고, 제거될 때마다 state가 파괴됩니다. 이들 사이를 전환할 때마다 state가 계속 초기화됩니다.

Remember that keys are not globally unique. They only specify the position within the parent.

<br/>
<br/>
<br/>
<br/>

## Resetting a form with a key

`key`를 사용하여 state를 초기화하는 것은 **폼을 다룰 때 특히 유용**합니다.

이 채팅 앱에서 `<Chat>` 컴포넌트는 텍스트 입력 state를 포함하고 있습니다.

```js
import { useState } from "react";

function Chat({ contact }) {
    const [text, setText] = useState("");
    return (
        <section className="chat">
            <textarea value={text} placeholder={"Chat to " + contact.name} onChange={(e) => setText(e.target.value)} />
            <br />
            <button>Send to {contact.email}</button>
        </section>
    );
}

function ContactList({ selectedContact, contacts, onSelect }) {
    return (
        <section className="contact-list">
            <ul>
                {contacts.map((contact) => (
                    <li key={contact.id}>
                        <button
                            onClick={() => {
                                onSelect(contact);
                            }}
                        >
                            {contact.name}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

const contacts = [
    { id: 0, name: "Taylor", email: "taylor@mail.com" },
    { id: 1, name: "Alice", email: "alice@mail.com" },
    { id: 2, name: "Bob", email: "bob@mail.com" },
];

export default function Messenger() {
    const [to, setTo] = useState(contacts[0]);
    return (
        <div>
            <ContactList contacts={contacts} selectedContact={to} onSelect={(contact) => setTo(contact)} />
            <Chat contact={to} />
        </div>
    );
}
```

입력란에 내용을 입력한 후 "Alice" 또는 "Bob"을 눌러 다른 수신자를 선택해 보세요. 그러면 입력 state가 유지되는 것을 알 수 있습니다. 이는 `<Chat>`이 트리의 같은 위치에서 렌더링되기 때문입니다.

많은 앱에서는 이것이 원하는 동작일 수 있지만, 채팅 앱에서는 그렇지 않습니다! 사용자가 실수로 클릭하여 잘못된 사람에게 이미 입력한 메시지를 보내는 것을 원하지 않습니다. 이를 해결하기 위해 `key`를 추가해야 합니다.

```js
<Chat key={to.id} contact={to} />
```

이렇게 하면 다른 수신자를 선택할 때 `<Chat>` 컴포넌트가 처음부터 새로 생성되며, 그 아래의 모든 state도 포함됩니다. React는 또한 DOM 요소를 재사용하는 대신 새로 생성합니다.

<br/>
<br/>

**DEEP DIVE**

**Preserving state for removed components**

In a real chat app, you’d probably want to recover the input state when the user selects the previous recipient again. 더 이상 보이지 않는 컴포넌트의 state를 "살아 있게" 유지하는 몇 가지 방법이 있습니다:

1. 현재 채팅만이 아니라 모든 채팅을 렌더링하되, CSS로 나머지를 숨길 수 있습니다. 이렇게 하면 채팅이 트리에서 제거되지 않으므로 local state가 유지됩니다. 이 솔루션은 간단한 UI에서는 잘 작동하지만, 숨겨진 트리가 크고 많은 DOM 노드를 포함하고 있다면 성능이 느려질 수 있습니다.

2. state를 부모 컴포넌트로 끌어올려 각 수신자에 대한 대기 중인 메시지를 저장할 수 있습니다. 이렇게 하면 자식 컴포넌트가 제거되더라도 중요 정보는 부모가 유지하므로 상관없습니다. 이것이 가장 일반적인 솔루션입니다.

3. React state 외에 다른 소스를 사용할 수도 있습니다. 예를 들어, 사용자가 페이지를 실수로 닫더라도 메시지 초안이 지속되기를 원할 것입니다. 이를 구현하기 위해 `<Chat>` 컴포넌트가 `localStorage`에서 읽어 초기 state를 설정하고, 초안도 그곳에 저장하도록 할 수 있습니다.

<br/>
<br/>
<br/>
<br/>
