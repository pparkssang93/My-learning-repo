# The state structure

state를 구조화할 때 고려해야 할 몇 가지 팁은 다음과 같습니다.

<br/>
<br/>
<br/>
<br/>

## Principles for structuring state

상태를 가지고 있는 컴포넌트를 작성할 때, 얼마나 많은 state variables를 사용할지와 그 데이터의 형태에 대해 선택해야 합니다. 비록 최적의 상태 구조 없이도 올바른 프로그램을 작성할 수 있지만, 더 나은 선택을 할 수 있도록 안내하는 몇 가지 원칙이 있습니다:

1. **Group related state.** 두 개 이상의 상태 변수를 항상 동시에 업데이트한다면, 이를 하나의 상태 변수로 병합하는 것을 고려하세요.
2. **Avoid contradictions in state.** 여러 several pieces of state이 서로 모순되거나 “disagree” 구조는 실수의 여지를 남깁니다. 이를 피하도록 노력하세요.
3. **Avoid redundant state.** 렌더링 중에 컴포넌트의 props나 기존 상태 변수를 통해 정보를 계산할 수 있다면, 그 정보를 컴포넌트의 state에 넣지 않아야 합니다.
4. **Avoid duplication in state.** 동일한 데이터가 여러 상태 변수나 중첩된 객체 내에서 중복되면 동기화하기 어렵습니다. 가능한 한 중복을 줄이세요.
5. **Avoid deeply nested state.** 깊이 있는 계층 구조의 state는 업데이트하기 불편합니다. 가능하다면 state를 평면적으로 구조화하는 것을 선호하세요.

이 원칙의 목표는 실수를 유발하지 않으면서 state를 쉽게 업데이트할 수 있도록 하는 것입니다. state에서 중복되고 불필요한 데이터를 제거하면 모든 조각이 동기화된 상태를 유지할 수 있습니다. 이는 데이터베이스 엔지니어가 버그 발생 가능성을 줄이기 위해 데이터베이스 구조를 "정규화"하고자 하는 것과 유사합니다. 알버트 아인슈타인의 말을 바꿔 말하자면, “당신의 상태를 가능한 한 간단하게 만들되, 더 단순하게 만들지 마세요.”

이제 이러한 원칙이 실제로 어떻게 적용되는지 살펴보겠습니다.

<br/>
<br/>
<br/>
<br/>

### Group related state

때때로 단일 상태 변수와 여러 상태 변수 중에서 어떤 것을 사용할지 고민할 수 있습니다.

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);

// or

const [position, setPosition] = useState({ x: 0, y: 0 });
```

기술적으로는 이 두 접근 방식을 모두 사용할 수 있습니다. 그러나 두 개의 상태 변수가 **항상 함께 변경**된다면, 이를 하나의 상태 변수로 통합하는 것이 좋습니다. 이렇게 하면 항상 동기화를 유지하는 것을 잊지 않게 됩니다. 예를 들어, 커서를 이동할 때 빨간 점의 두 좌표가 모두 업데이트되는 상황에서 그렇습니다.

```js
import { useState } from "react";

export default function MovingDot() {
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });
    return (
        <div
            onPointerMove={(e) => {
                setPosition({
                    x: e.clientX,
                    y: e.clientY,
                });
            }}
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    left: -10,
                    top: -10,
                    width: 20,
                    height: 20,
                }}
            />
        </div>
    );
}
```

데이터를 객체나 배열로 그룹화해야 하는 또 다른 경우는 필요한 상태의 개수를 모를 때입니다. 예를 들어, 사용자가 사용자 정의 필드를 추가할 수 있는 폼이 있을 때 유용합니다.

<br/>
<br/>

**CAUTION**

If your state variable is an object, 다른 필드를 명시적으로 복사하지 않고는 단일 필드만 업데이트할 수 없다는 점을 기억하세요. 예를 들어, 위의 예제에서 `setPosition({ x: 100 })`를 사용하면 `y` 속성이 없어진다! 대신, `x`만 설정하려면 `setPosition({ ...position, x: 100 })`를 사용하거나, 두 개의 상태 변수로 나누어 `setX(100)`을 사용할 수 있습니다.

<br/>
<br/>
<br/>
<br/>

### Avoid contradictions in state

Here is a hotel feedback form with isSending and isSent state variables:

```js
import { useState } from "react";

export default function FeedbackForm() {
    const [text, setText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSending(true);
        await sendMessage(text);
        setIsSending(false);
        setIsSent(true);
    }

    if (isSent) {
        return <h1>Thanks for feedback!</h1>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <p>How was your stay at The Prancing Pony?</p>
            <textarea disabled={isSending} value={text} onChange={(e) => setText(e.target.value)} />
            <br />
            <button disabled={isSending} type="submit">
                Send
            </button>
            {isSending && <p>Sending...</p>}
        </form>
    );
}

// Pretend to send a message.
function sendMessage(text) {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}
```

While this code works, "불가능한" 상태가 발생할 수 있는 여지를 남깁니다. 예를 들어, `setIsSent`와 `setIsSending`을 함께 호출하는 것을 잊으면, `isSending`과 `isSent`가 동시에 `true`인 상황에 처할 수 있습니다. 컴포넌트가 복잡해질수록 무슨 일이 있었는지 이해하기 더 어려워집니다.

`isSending`과 `isSent`는 동시에 `true`일 수 없으므로, 이들을 `'typing'` (초기), `'sending'`, `'sent'`의 세 가지 유효한 state 중 하나를 가질 수 있는 단일 상태 변수로 대체하는 것이 더 좋습니다.

```js
import { useState } from "react";

export default function FeedbackForm() {
    const [text, setText] = useState("");
    const [status, setStatus] = useState("typing");

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("sending");
        await sendMessage(text);
        setStatus("sent");
    }

    const isSending = status === "sending";
    const isSent = status === "sent";

    if (isSent) {
        return <h1>Thanks for feedback!</h1>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <p>How was your stay at The Prancing Pony?</p>
            <textarea disabled={isSending} value={text} onChange={(e) => setText(e.target.value)} />
            <br />
            <button disabled={isSending} type="submit">
                Send
            </button>
            {isSending && <p>Sending...</p>}
        </form>
    );
}

// Pretend to send a message.
function sendMessage(text) {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}
```

You can still declare some constants for readability:

```js
const isSending = status === "sending";
const isSent = status === "sent";
```

But they’re not state variables, 서로 동기화되지 않는 것에 대해 걱정할 필요가 없습니다.

<br/>
<br/>
<br/>
<br/>

### Avoid redundant state

컴포넌트의 props나 기존 상태 변수를 사용하여 렌더링 중에 정보를 계산할 수 있다면, 그 정보를 컴포넌트의 상태에 넣지 말아야 합니다.

```js
import { useState } from "react";

export default function Form() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [fullName, setFullName] = useState("");

    function handleFirstNameChange(e) {
        setFirstName(e.target.value);
        setFullName(e.target.value + " " + lastName);
    }

    function handleLastNameChange(e) {
        setLastName(e.target.value);
        setFullName(firstName + " " + e.target.value);
    }

    return (
        <>
            <h2>Let’s check you in</h2>
            <label>
                First name: <input value={firstName} onChange={handleFirstNameChange} />
            </label>
            <label>
                Last name: <input value={lastName} onChange={handleLastNameChange} />
            </label>
            <p>
                Your ticket will be issued to: <b>{fullName}</b>
            </p>
        </>
    );
}
```

이 폼에는 세 개의 state variables가 있습니다: firstName, lastName, 그리고 fullName입니다. 그러나 fullName은 중복입니다. firstName과 lastName을 사용하여 렌더링 중에 항상 fullName을 계산할 수 있으므로, state에서 제거해야 합니다.

```js
import { useState } from "react";

export default function Form() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const fullName = firstName + " " + lastName;

    function handleFirstNameChange(e) {
        setFirstName(e.target.value);
    }

    function handleLastNameChange(e) {
        setLastName(e.target.value);
    }

    return (
        <>
            <h2>Let’s check you in</h2>
            <label>
                First name: <input value={firstName} onChange={handleFirstNameChange} />
            </label>
            <label>
                Last name: <input value={lastName} onChange={handleLastNameChange} />
            </label>
            <p>
                Your ticket will be issued to: <b>{fullName}</b>
            </p>
        </>
    );
}
```

Here, fullName is not a state variable. Instead, it’s calculated during render:

```js
const fullName = firstName + " " + lastName;
```

그 결과, the change handlers는 이를 업데이트하기 위해 특별한 작업을 할 필요가 없습니다. `setFirstName`이나 `setLastName`을 호출하면 재렌더링이 발생하고, 그 후 새로운 데이터에서 `fullName`이 계산됩니다.

<br/>
<br/>

**DEEP DIVE**

**Don’t mirror props in state**

중복 state의 일반적인 예는 다음과 같은 코드입니다:

```js
function Message({ messageColor }) {
    const [color, setColor] = useState(messageColor);
}
```

Here, a color state variable is initialized to the `messageColor prop`. 문제는 부모 컴포넌트가 나중에 다른 `messageColor` 값을 전달할 경우(예: 'blue' 대신 'red'), 색상 상태 변수가 업데이트되지 않는다는 것입니다! **state는 처음 렌더링할 때만 초기화됩니다.**

이 때문에 일부 `prop`을 상태 변수로 "미러링"하는 것은 혼란을 초래할 수 있습니다. 대신, 코드에서 `messageColor prop`을 직접 사용하세요. 더 짧은 이름을 부여하고 싶다면, 상수를 사용하면 됩니다.

```js
function Message({ messageColor }) {
    const color = messageColor;
}
```

This way it won’t get out of sync with the prop passed from the parent component.

부모 컴포넌트 state props를 **"미러링"하는 것은 특정 prop의 모든 업데이트를 무시하고 싶을 때만 의미**가 있습니다. 관례적으로, 새로운 값이 무시된다는 것을 명확히 하기 위해 prop 이름을 initial 또는 default로 시작하는 것이 좋습니다.

```js
function Message({ initialColor }) {
    // The `color` state variable holds the *first* value of `initialColor`.
    // Further changes to the `initialColor` prop are ignored.
    const [color, setColor] = useState(initialColor);
}
```

<br/>
<br/>
<br/>
<br/>

### Avoid duplication in state

This menu list component lets you choose a single travel snack out of several:

```js
import { useState } from "react";

const initialItems = [
    { title: "pretzels", id: 0 },
    { title: "crispy seaweed", id: 1 },
    { title: "granola bar", id: 2 },
];

export default function Menu() {
    const [items, setItems] = useState(initialItems);
    const [selectedItem, setSelectedItem] = useState(items[0]);

    return (
        <>
            <h2>What's your travel snack?</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.title}{" "}
                        <button
                            onClick={() => {
                                setSelectedItem(item);
                            }}
                        >
                            Choose
                        </button>
                    </li>
                ))}
            </ul>
            <p>You picked {selectedItem.title}.</p>
        </>
    );
}
```

현재 선택된 항목은 `selectedItem` 상태 변수에 객체로 저장됩니다. 그러나 이것은 좋지 않습니다: `selectedItem`의 내용은 `items` 목록 안의 항목 중 하나와 동일한 객체입니다. 이는 항목에 대한 **정보가 두 곳에 중복되어 있다**는 것을 의미합니다.

Why is this a problem? Let’s make each item editable:

```js
import { useState } from "react";

const initialItems = [
    { title: "pretzels", id: 0 },
    { title: "crispy seaweed", id: 1 },
    { title: "granola bar", id: 2 },
];

export default function Menu() {
    const [items, setItems] = useState(initialItems);
    const [selectedItem, setSelectedItem] = useState(items[0]);

    function handleItemChange(id, e) {
        setItems(
            items.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        title: e.target.value,
                    };
                } else {
                    return item;
                }
            })
        );
    }

    return (
        <>
            <h2>What's your travel snack?</h2>
            <ul>
                {items.map((item, index) => (
                    <li key={item.id}>
                        <input
                            value={item.title}
                            onChange={(e) => {
                                handleItemChange(item.id, e);
                            }}
                        />{" "}
                        <button
                            onClick={() => {
                                setSelectedItem(item);
                            }}
                        >
                            Choose
                        </button>
                    </li>
                ))}
            </ul>
            <p>You picked {selectedItem.title}.</p>
        </>
    );
}
```

먼저 항목에서 "Choose"를 클릭한 후 편집하면 입력값은 업데이트되지만, 아래의 레이블은 **수정 사항을 반영하지 않는다는 점에 주목**하세요. 이는 상태가 중복되어 있고, `selectedItem`을 업데이트하는 것을 잊었기 때문입니다.

`selectedItem`을 업데이트할 수도 있지만, 더 쉬운 해결책은 중복을 제거하는 것입니다. 이 예제에서는 중복을 생성하는 `selectedItem` 객체 대신, 상태에 `selectedId`를 저장하고, 그 `ID`를 가진 항목을 찾기 위해 `items` 배열을 검색하여 `selectedItem`을 얻습니다.

```js
import { useState } from "react";

const initialItems = [
    { title: "pretzels", id: 0 },
    { title: "crispy seaweed", id: 1 },
    { title: "granola bar", id: 2 },
];

export default function Menu() {
    const [items, setItems] = useState(initialItems);
    const [selectedId, setSelectedId] = useState(0);

    const selectedItem = items.find((item) => item.id === selectedId);

    function handleItemChange(id, e) {
        setItems(
            items.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        title: e.target.value,
                    };
                } else {
                    return item;
                }
            })
        );
    }

    return (
        <>
            <h2>What's your travel snack?</h2>
            <ul>
                {items.map((item, index) => (
                    <li key={item.id}>
                        <input
                            value={item.title}
                            onChange={(e) => {
                                handleItemChange(item.id, e);
                            }}
                        />{" "}
                        <button
                            onClick={() => {
                                setSelectedId(item.id);
                            }}
                        >
                            Choose
                        </button>
                    </li>
                ))}
            </ul>
            <p>You picked {selectedItem.title}.</p>
        </>
    );
}
```

The state used to be duplicated like this:

-   `items = [{ id: 0, title: 'pretzels'}, ...]`
-   `selectedItem = {id: 0, title: 'pretzels'}`

But after the change it’s like this:

-   `items = [{ id: 0, title: 'pretzels'}, ...]`
-   `selectedId = 0`

The duplication is gone, 이제 the essential state만 유지하게 되었습니다!

이제 선택된 항목을 편집하면 아래 메시지가 즉시 업데이트됩니다. 이는 `setItems`가 재렌더링을 트리거하고, `items.find(...)`가 업데이트된 제목을 가진 항목을 찾기 때문입니다. 선택된 항목을 상태에 저장할 필요가 없었고, 오직 선택된 `ID`만이 필수적입니다. 나머지는 렌더링 중에 계산할 수 있었습니다.

<br/>
<br/>
<br/>
<br/>

### Avoid deeply nested state

Imagine a travel plan consisting of planets, continents, and countries. 이 state를 중첩된 객체와 배열을 사용하여 구조화하고 싶을 수도 있습니다. 다음 예와 같이 말이죠:

```js
import { useState } from "react";
const initialTravelPlan = {
    id: 0,
    title: "(Root)",
    childPlaces: [
        {
            id: 1,
            title: "Earth",
            childPlaces: [
                {
                    id: 2,
                    title: "Africa",
                    childPlaces: [
                        {
                            id: 3,
                            title: "Botswana",
                            childPlaces: [],
                        },
                        {
                            id: 4,
                            title: "Egypt",
                            childPlaces: [],
                        },
                        {
                            id: 5,
                            title: "Kenya",
                            childPlaces: [],
                        },
                        {
                            id: 6,
                            title: "Madagascar",
                            childPlaces: [],
                        },
                        {
                            id: 7,
                            title: "Morocco",
                            childPlaces: [],
                        },
                        {
                            id: 8,
                            title: "Nigeria",
                            childPlaces: [],
                        },
                        {
                            id: 9,
                            title: "South Africa",
                            childPlaces: [],
                        },
                    ],
                },
                {
                    id: 10,
                    title: "Americas",
                    childPlaces: [
                        {
                            id: 11,
                            title: "Argentina",
                            childPlaces: [],
                        },
                        {
                            id: 12,
                            title: "Brazil",
                            childPlaces: [],
                        },
                        {
                            id: 13,
                            title: "Barbados",
                            childPlaces: [],
                        },
                        {
                            id: 14,
                            title: "Canada",
                            childPlaces: [],
                        },
                        {
                            id: 15,
                            title: "Jamaica",
                            childPlaces: [],
                        },
                        {
                            id: 16,
                            title: "Mexico",
                            childPlaces: [],
                        },
                        {
                            id: 17,
                            title: "Trinidad and Tobago",
                            childPlaces: [],
                        },
                        {
                            id: 18,
                            title: "Venezuela",
                            childPlaces: [],
                        },
                    ],
                },
                {
                    id: 19,
                    title: "Asia",
                    childPlaces: [
                        {
                            id: 20,
                            title: "China",
                            childPlaces: [],
                        },
                        {
                            id: 21,
                            title: "India",
                            childPlaces: [],
                        },
                        {
                            id: 22,
                            title: "Singapore",
                            childPlaces: [],
                        },
                        {
                            id: 23,
                            title: "South Korea",
                            childPlaces: [],
                        },
                        {
                            id: 24,
                            title: "Thailand",
                            childPlaces: [],
                        },
                        {
                            id: 25,
                            title: "Vietnam",
                            childPlaces: [],
                        },
                    ],
                },
                {
                    id: 26,
                    title: "Europe",
                    childPlaces: [
                        {
                            id: 27,
                            title: "Croatia",
                            childPlaces: [],
                        },
                        {
                            id: 28,
                            title: "France",
                            childPlaces: [],
                        },
                        {
                            id: 29,
                            title: "Germany",
                            childPlaces: [],
                        },
                        {
                            id: 30,
                            title: "Italy",
                            childPlaces: [],
                        },
                        {
                            id: 31,
                            title: "Portugal",
                            childPlaces: [],
                        },
                        {
                            id: 32,
                            title: "Spain",
                            childPlaces: [],
                        },
                        {
                            id: 33,
                            title: "Turkey",
                            childPlaces: [],
                        },
                    ],
                },
                {
                    id: 34,
                    title: "Oceania",
                    childPlaces: [
                        {
                            id: 35,
                            title: "Australia",
                            childPlaces: [],
                        },
                        {
                            id: 36,
                            title: "Bora Bora (French Polynesia)",
                            childPlaces: [],
                        },
                        {
                            id: 37,
                            title: "Easter Island (Chile)",
                            childPlaces: [],
                        },
                        {
                            id: 38,
                            title: "Fiji",
                            childPlaces: [],
                        },
                        {
                            id: 39,
                            title: "Hawaii (the USA)",
                            childPlaces: [],
                        },
                        {
                            id: 40,
                            title: "New Zealand",
                            childPlaces: [],
                        },
                        {
                            id: 41,
                            title: "Vanuatu",
                            childPlaces: [],
                        },
                    ],
                },
            ],
        },
        {
            id: 42,
            title: "Moon",
            childPlaces: [
                {
                    id: 43,
                    title: "Rheita",
                    childPlaces: [],
                },
                {
                    id: 44,
                    title: "Piccolomini",
                    childPlaces: [],
                },
                {
                    id: 45,
                    title: "Tycho",
                    childPlaces: [],
                },
            ],
        },
        {
            id: 46,
            title: "Mars",
            childPlaces: [
                {
                    id: 47,
                    title: "Corn Town",
                    childPlaces: [],
                },
                {
                    id: 48,
                    title: "Green Hill",
                    childPlaces: [],
                },
            ],
        },
    ],
};

function PlaceTree({ place }) {
    const childPlaces = place.childPlaces;
    return (
        <li>
            {place.title}
            {childPlaces.length > 0 && (
                <ol>
                    {childPlaces.map((place) => (
                        <PlaceTree key={place.id} place={place} />
                    ))}
                </ol>
            )}
        </li>
    );
}

export default function TravelPlan() {
    const [plan, setPlan] = useState(initialTravelPlan);
    const planets = plan.childPlaces;
    return (
        <>
            <h2>Places to visit</h2>
            <ol>
                {planets.map((place) => (
                    <PlaceTree key={place.id} place={place} />
                ))}
            </ol>
        </>
    );
}
```

이제 이미 방문한 장소를 삭제하는 버튼을 추가한다고 가정해 보겠습니다. 어떻게 진행할까요? 중첩된 상태를 업데이트하려면 변경된 부분에서부터 위로 올라가며 객체의 복사본을 만들어야 합니다. 깊게 중첩된 장소를 삭제하려면 해당 장소의 전체 부모 장소 체인을 복사해야 합니다. 이런 코드는 매우 장황할 수 있습니다.

상태가 너무 중첩되어 쉽게 업데이트할 수 없다면, “flat” 하는 것을 고려해 보세요. 데이터를 재구성하는 한 가지 방법은 각 장소가 자식 장소의 배열을 가지는 트리 구조 대신, 각 장소가 자식 장소 ID의 배열을 가지도록 하는 것입니다. 그런 다음 각 장소 ID를 해당 장소에 매핑하여 저장합니다.

이러한 데이터 재구성이 데이터베이스 테이블을 보는 것과 비슷할 수 있습니다.

```js
import { useState } from "react";

const initialTravelPlan = {
    0: {
        id: 0,
        title: "(Root)",
        childIds: [1, 42, 46],
    },
    1: {
        id: 1,
        title: "Earth",
        childIds: [2, 10, 19, 26, 34],
    },
    2: {
        id: 2,
        title: "Africa",
        childIds: [3, 4, 5, 6, 7, 8, 9],
    },
    3: {
        id: 3,
        title: "Botswana",
        childIds: [],
    },
    4: {
        id: 4,
        title: "Egypt",
        childIds: [],
    },
    5: {
        id: 5,
        title: "Kenya",
        childIds: [],
    },
    6: {
        id: 6,
        title: "Madagascar",
        childIds: [],
    },
    7: {
        id: 7,
        title: "Morocco",
        childIds: [],
    },
    8: {
        id: 8,
        title: "Nigeria",
        childIds: [],
    },
    9: {
        id: 9,
        title: "South Africa",
        childIds: [],
    },
    10: {
        id: 10,
        title: "Americas",
        childIds: [11, 12, 13, 14, 15, 16, 17, 18],
    },
    11: {
        id: 11,
        title: "Argentina",
        childIds: [],
    },
    12: {
        id: 12,
        title: "Brazil",
        childIds: [],
    },
    13: {
        id: 13,
        title: "Barbados",
        childIds: [],
    },
    14: {
        id: 14,
        title: "Canada",
        childIds: [],
    },
    15: {
        id: 15,
        title: "Jamaica",
        childIds: [],
    },
    16: {
        id: 16,
        title: "Mexico",
        childIds: [],
    },
    17: {
        id: 17,
        title: "Trinidad and Tobago",
        childIds: [],
    },
    18: {
        id: 18,
        title: "Venezuela",
        childIds: [],
    },
    19: {
        id: 19,
        title: "Asia",
        childIds: [20, 21, 22, 23, 24, 25],
    },
    20: {
        id: 20,
        title: "China",
        childIds: [],
    },
    21: {
        id: 21,
        title: "India",
        childIds: [],
    },
    22: {
        id: 22,
        title: "Singapore",
        childIds: [],
    },
    23: {
        id: 23,
        title: "South Korea",
        childIds: [],
    },
    24: {
        id: 24,
        title: "Thailand",
        childIds: [],
    },
    25: {
        id: 25,
        title: "Vietnam",
        childIds: [],
    },
    26: {
        id: 26,
        title: "Europe",
        childIds: [27, 28, 29, 30, 31, 32, 33],
    },
    27: {
        id: 27,
        title: "Croatia",
        childIds: [],
    },
    28: {
        id: 28,
        title: "France",
        childIds: [],
    },
    29: {
        id: 29,
        title: "Germany",
        childIds: [],
    },
    30: {
        id: 30,
        title: "Italy",
        childIds: [],
    },
    31: {
        id: 31,
        title: "Portugal",
        childIds: [],
    },
    32: {
        id: 32,
        title: "Spain",
        childIds: [],
    },
    33: {
        id: 33,
        title: "Turkey",
        childIds: [],
    },
    34: {
        id: 34,
        title: "Oceania",
        childIds: [35, 36, 37, 38, 39, 40, 41],
    },
    35: {
        id: 35,
        title: "Australia",
        childIds: [],
    },
    36: {
        id: 36,
        title: "Bora Bora (French Polynesia)",
        childIds: [],
    },
    37: {
        id: 37,
        title: "Easter Island (Chile)",
        childIds: [],
    },
    38: {
        id: 38,
        title: "Fiji",
        childIds: [],
    },
    39: {
        id: 40,
        title: "Hawaii (the USA)",
        childIds: [],
    },
    40: {
        id: 40,
        title: "New Zealand",
        childIds: [],
    },
    41: {
        id: 41,
        title: "Vanuatu",
        childIds: [],
    },
    42: {
        id: 42,
        title: "Moon",
        childIds: [43, 44, 45],
    },
    43: {
        id: 43,
        title: "Rheita",
        childIds: [],
    },
    44: {
        id: 44,
        title: "Piccolomini",
        childIds: [],
    },
    45: {
        id: 45,
        title: "Tycho",
        childIds: [],
    },
    46: {
        id: 46,
        title: "Mars",
        childIds: [47, 48],
    },
    47: {
        id: 47,
        title: "Corn Town",
        childIds: [],
    },
    48: {
        id: 48,
        title: "Green Hill",
        childIds: [],
    },
};

function PlaceTree({ id, placesById }) {
    const place = placesById[id];
    const childIds = place.childIds;
    return (
        <li>
            {place.title}
            {childIds.length > 0 && (
                <ol>
                    {childIds.map((childId) => (
                        <PlaceTree key={childId} id={childId} placesById={placesById} />
                    ))}
                </ol>
            )}
        </li>
    );
}

export default function TravelPlan() {
    const [plan, setPlan] = useState(initialTravelPlan);
    const root = plan[0];
    const planetIds = root.childIds;
    return (
        <>
            <h2>Places to visit</h2>
            <ol>
                {planetIds.map((id) => (
                    <PlaceTree key={id} id={id} placesById={plan} />
                ))}
            </ol>
        </>
    );
}
```

이제 상태가 "평면화"되었고(또는 "정규화"라고도 함), 중첩된 항목을 업데이트하는 것이 더 쉬워졌습니다.

이제 장소를 제거하려면 두 개의 상태 레벨만 업데이트하면 됩니다:

1. 제거된 ID를 자식 ID 배열에서 제외하도록 부모 장소의 업데이트된 버전을 만들어야 합니다.
2. 루트 "테이블" 객체의 업데이트된 버전에는 부모 장소의 업데이트된 버전을 포함해야 합니다.

Here is an example of how you could go about it:

```js
import { useState } from "react";
import { initialTravelPlan } from "./places.js";

export default function TravelPlan() {
    const [plan, setPlan] = useState(initialTravelPlan);

    function handleComplete(parentId, childId) {
        const parent = plan[parentId];
        // Create a new version of the parent place
        // that doesn't include this child ID.
        const nextParent = {
            ...parent,
            childIds: parent.childIds.filter((id) => id !== childId),
        };
        // Update the root state object...
        setPlan({
            ...plan,
            // ...so that it has the updated parent.
            [parentId]: nextParent,
        });
    }

    const root = plan[0];
    const planetIds = root.childIds;
    return (
        <>
            <h2>Places to visit</h2>
            <ol>
                {planetIds.map((id) => (
                    <PlaceTree key={id} id={id} parentId={0} placesById={plan} onComplete={handleComplete} />
                ))}
            </ol>
        </>
    );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
    const place = placesById[id];
    const childIds = place.childIds;
    return (
        <li>
            {place.title}
            <button
                onClick={() => {
                    onComplete(parentId, id);
                }}
            >
                Complete
            </button>
            {childIds.length > 0 && (
                <ol>
                    {childIds.map((childId) => (
                        <PlaceTree
                            key={childId}
                            id={childId}
                            parentId={id}
                            placesById={placesById}
                            onComplete={onComplete}
                        />
                    ))}
                </ol>
            )}
        </li>
    );
}
```

상태를 원하는 만큼 중첩할 수 있지만, 이를 "평면화"하면 많은 문제를 해결할 수 있습니다. 상태를 업데이트하기가 더 쉬워지고, 중첩된 객체의 서로 다른 부분에 중복이 발생하지 않도록 보장하는 데 도움이 됩니다.

때때로, 중첩된 상태의 일부를 자식 컴포넌트로 이동시켜 상태 중첩을 줄일 수 있습니다. 이는 like whether an item is hovered 같이 저장할 필요가 없는 일시적인 UI 상태에 잘 작동합니다.

<br/>
<br/>

**DEEP DIVE**

**Improving memory usage**
메모리 사용량 개선

이상적으로는 메모리 사용량을 개선하기 위해 삭제된 항목(그리고 그 자식 항목들!)을 "테이블" 객체에서 제거해야 합니다. 이 버전은 그렇게 구현되어 있으며, 업데이트 로직을 더 간결하게 만들기 위해 Immer를 사용합니다.

<br/>
<br/>
<br/>
<br/>

#### MEMO 🤔

-   state는 처음 렌더링할 때만 초기화됩니다.
-   미러링? 특정 prop의 값을 상태 변수로 복사하여 사용하는 것을 의미합니다. 이는 해당 prop의 업데이트를 무시하고, 초기화된 값만 사용하고 싶을 때 사용됩니다.
-   Immer 라이브러리가 좋은가??
