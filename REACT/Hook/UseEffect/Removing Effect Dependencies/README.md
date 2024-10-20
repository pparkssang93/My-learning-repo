# Removing Effect Dependencies

When you write an Effect, the linter will verify that you’ve included every reactive value (like props and state) that the Effect reads in the list of your Effect’s dependencies(Effect를 작성할 때, 린터는 Effect가 읽는 모든 반응적 값(예: props와 state)이 Effect의 의존성 목록에 포함되어 있는지 확인합니다). This ensures that your Effect remains synchronized with the latest props and state of your component. Unnecessary dependencies may cause your Effect to run too often, or even create an infinite loop. Follow this guide to review and remove unnecessary dependencies from your Effects.

<br/>
<br/>
<br/>

## Dependencies should match the code

When you write an Effect, you first specify how to start and stop whatever you want your Effect to be doing:

```js
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
        // ...
    });
}
```

Then, if you leave the Effect dependencies empty (`[]`), the linter will suggest the correct dependencies:

```js
import { useState, useEffect } from "react";
export function createConnection(serverUrl, roomId) {
    // A real implementation would actually connect to the server
    return {
        connect() {
            console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + "...");
        },
        disconnect() {
            console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
        },
    };
}

const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
    }, []); // <-- Fix the mistake here!
    return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
    const [roomId, setRoomId] = useState("general");
    return (
        <>
            <label>
                Choose the chat room:{" "}
                <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                    <option value="general">general</option>
                    <option value="travel">travel</option>
                    <option value="music">music</option>
                </select>
            </label>
            <hr />
            <ChatRoom roomId={roomId} />
        </>
    );
}
```

❌ Lint Error

React Hook useEffect has a missing dependency: 'roomId'. Either include it or remove the dependency array.

Fill them in according to what the linter says:

```js
function ChatRoom({ roomId }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
    }, [roomId]); // ✅ All dependencies declared
    // ...
}
```

Effects “react” to reactive values. Since `roomId` is a reactive value (it can change due to a re-render), the linter verifies that you’ve specified it as a dependency. If `roomId` receives a different value, React will re-synchronize your Effect. This ensures that the chat stays connected to the selected room and “reacts” to the dropdown:

```js
import { useState, useEffect } from "react";

export function createConnection(serverUrl, roomId) {
    // A real implementation would actually connect to the server
    return {
        connect() {
            console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + "...");
        },
        disconnect() {
            console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
        },
    };
}

const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
    }, [roomId]);
    return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
    const [roomId, setRoomId] = useState("general");
    return (
        <>
            <label>
                Choose the chat room:{" "}
                <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                    <option value="general">general</option>
                    <option value="travel">travel</option>
                    <option value="music">music</option>
                </select>
            </label>
            <hr />
            <ChatRoom roomId={roomId} />
        </>
    );
}
```

<br/>

### To remove a dependency, prove that it’s not a dependency

Notice that you can’t “choose” the dependencies of your Effect. Every reactive value used by your Effect’s code must be declared in your dependency list. The dependency list is determined by the surrounding code (Effect의 의존성을 "선택"할 수 없다는 점을 주목하세요. Effect 코드에서 사용된 모든 반응적 값은 반드시 의존성 목록에 선언되어야 합니다. 의존성 목록은 주변 코드에 의해 결정됩니다):

```js
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
    // This is a reactive value
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
        connection.connect();
        return () => connection.disconnect();
    }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
    // ...
}
```

Reactive values include props and all variables and functions declared directly inside of your component. Since `roomId` is a reactive value, you can’t remove it from the dependency list. The linter wouldn’t allow it:

```js
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
    }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
    // ...
}
```

And the linter would be right! Since `roomId` may change over time, this would introduce a bug in your code.

To remove a dependency, “prove” to the linter that it doesn’t need to be a dependency. For example, you can move `roomId` out of your component to prove that it’s not reactive and won’t change on re-renders:

```js
const serverUrl = "https://localhost:1234";
const roomId = "music"; // Not a reactive value anymore

function ChatRoom() {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
    }, []); // ✅ All dependencies declared
    // ...
}
```

Now that `roomId` is not a reactive value (and can’t change on a re-render), it doesn’t need to be a dependency:

```js
import { useState, useEffect } from "react";

export function createConnection(serverUrl, roomId) {
    // A real implementation would actually connect to the server
    return {
        connect() {
            console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + "...");
        },
        disconnect() {
            console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
        },
    };
}
const serverUrl = "https://localhost:1234";
const roomId = "music";

export default function ChatRoom() {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
    }, []);
    return <h1>Welcome to the {roomId} room!</h1>;
}
```

This is why you could now specify an empty (`[]`) dependency list. Your Effect really doesn’t depend on any reactive value anymore, so it really doesn’t need to re-run when any of the component’s props or state change.

<br/>

### To change the dependencies, change the code

You might have noticed a pattern in your workflow:

1. First, you change the code of your Effect or how your reactive values are declared (먼저, Effect의 코드나 반응적 값이 선언되는 방식을 변경합니다).
2. Then, you follow the linter and adjust the dependencies to match the code you have changed (그런 다음, 린터를 따라 의존성을 조정하여 변경한 코드와 일치시킵니다).
3. If you’re not happy with the list of dependencies, you go back to the first step (and change the code again) (의존성 목록이 마음에 들지 않으면 다시 첫 번째 단계로 돌아가서 코드를 다시 수정합니다).

The last part is important. If you want to change the dependencies, change the surrounding code first. You can think of the dependency list as a list of all the reactive values used by your Effect’s code. You don’t choose what to put on that list. The list describes your code. To change the dependency list, change the code.

This might feel like solving an equation(이것은 마치 방정식을 푸는 것처럼 느껴질 수 있습니다). You might start with a goal (for example, to remove a dependency), and you need to “find” the code matching that goal. Not everyone finds solving equations fun(방정식을 푸는 것을 재미있다고 생각하지 않는 사람이 많듯이), and the same thing could be said about writing Effects! Luckily, there is a list of common recipes that you can try below.

<br/>

---

### 💥 Pitfall

If you have an existing codebase, you might have some Effects that suppress the linter like this (린터를 억제하는 일부 Effect를 이렇게 작성했을 수 있습니다):

```js
useEffect(() => {
    // ...
    // 🔴 Avoid suppressing the linter like this:
    // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

When dependencies don’t match the code, there is a very high risk of introducing bugs. By suppressing the linter, you “lie” to React about the values your Effect depends on.

Instead, use the techniques below.

---

<br/>

---

### Deep dive

**Why is suppressing the dependency linter so dangerous?**

Suppressing the linter leads to very unintuitive bugs that are hard to find and fix. Here’s one example(린터를 억제하면 찾고 고치기 어려운 매우 직관적이지 않은 버그가 발생합니다. 다음은 그 예시 중 하나입니다):

```js
import { useState, useEffect } from "react";

export default function Timer() {
    const [count, setCount] = useState(0);
    const [increment, setIncrement] = useState(1);

    function onTick() {
        setCount(count + increment);
    }

    useEffect(() => {
        const id = setInterval(onTick, 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <h1>
                Counter: {count}
                <button onClick={() => setCount(0)}>Reset</button>
            </h1>
            <hr />
            <p>
                Every second, increment by:
                <button
                    disabled={increment === 0}
                    onClick={() => {
                        setIncrement((i) => i - 1);
                    }}
                >
                    –
                </button>
                <b>{increment}</b>
                <button
                    onClick={() => {
                        setIncrement((i) => i + 1);
                    }}
                >
                    +
                </button>
            </p>
        </>
    );
}
```

Let’s say that you wanted to run the Effect “only on mount”. You’ve read that empty (`[]`) dependencies do that, so you’ve decided to ignore the linter, and forcefully specified `[]` as the dependencies (의존성으로 []을 강제로 지정했습니다).

This counter was supposed to increment every second by the amount configurable with the two buttons (이 카운터는 두 버튼으로 설정할 수 있는 값만큼 매 초마다 증가하도록 되어 있었습니다). However, since you “lied” to React that this Effect doesn’t depend on anything, React forever keeps using the `onTick` function from the initial render(하지만 이 Effect가 아무것도 의존하지 않는다고 React에게 "거짓말"을 했기 때문에, React는 초기 렌더링에서 사용된 onTick 함수를 계속 사용합니다). During that render, count was `0` and increment was `1`. This is why `onTick` from that render always calls `setCount(0 + 1)` every second, and you always see `1`. Bugs like this are harder to fix when they’re spread across multiple components.

There’s always a better solution than ignoring the linter! To fix this code, you need to add `onTick` to the dependency list. (To ensure the interval is only setup once, make `onTick` an Effect Event.)

We recommend treating the dependency lint error as a compilation error. If you don’t suppress it, you will never see bugs like this. The rest of this page documents the alternatives for this and other cases(우리는 의존성 린트 오류를 컴파일 오류로 취급할 것을 권장합니다. 이를 억제하지 않으면 이러한 버그를 결코 발견하지 못할 것입니다. 이 페이지의 나머지 부분에서는 이러한 경우와 다른 경우에 대한 대안들을 문서화하고 있습니다).

---

<br/>
<br/>
<br/>

## Removing unnecessary dependencies

Every time you adjust the Effect’s dependencies to reflect the code, look at the dependency list. Does it make sense for the Effect to re-run when any of these dependencies change? Sometimes, the answer is “no” (이러한 의존성 중 하나가 변경될 때 Effect가 다시 실행되는 것이 합리적일까요? 가끔은 답이 “아니오”일 수 있습니다):

-   You might want to re-execute different parts of your Effect under different conditions (Effect의 서로 다른 부분을 다양한 조건에 따라 다시 실행하고 싶을 수 있습니다.).
-   You might want to only read the latest value of some dependency instead of “reacting” to its changes (특정 의존성의 변화를 "반응"하기보다는 최신 값을 읽기만 원할 수도 있습니다).
-   A dependency may change too often unintentionally because it’s an object or a function( 또한, 의존성이 객체나 함수인 경우 의도치 않게 너무 자주 변경될 수 있습니다).

To find the right solution, you’ll need to answer a few questions about your Effect. Let’s walk through them.

<br/>

### Should this code move to an event handler?

The first thing you should think about is whether this code should be an Effect at all.

Imagine a form. On submit, you set the submitted state variable to `true`. You need to send a POST request and show a notification. You’ve put this logic inside an Effect that “reacts” to `submitted` being `true` (이 논리를 submitted가 true일 때 "반응"하는 Effect 안에 넣었습니다):

```js
function Form() {
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (submitted) {
            // 🔴 Avoid: Event-specific logic inside an Effect
            post("/api/register");
            showNotification("Successfully registered!");
        }
    }, [submitted]);

    function handleSubmit() {
        setSubmitted(true);
    }

    // ...
}
```

Later, you want to style the notification message according to the current theme, so you read the current theme. Since `theme` is declared in the component body, it is a reactive value, so you add it as a dependency:

```js
function Form() {
    const [submitted, setSubmitted] = useState(false);
    const theme = useContext(ThemeContext);

    useEffect(() => {
        if (submitted) {
            // 🔴 Avoid: Event-specific logic inside an Effect
            post("/api/register");
            showNotification("Successfully registered!", theme);
        }
    }, [submitted, theme]); // ✅ All dependencies declared

    function handleSubmit() {
        setSubmitted(true);
    }

    // ...
}
```

By doing this, you’ve introduced a bug. Imagine you submit the form first and then switch between Dark and Light themes. The `theme` will change, the Effect will re-run, and so it will display the same notification again!

The problem here is that this shouldn’t be an Effect in the first place. You want to send this POST request and show the notification in response to submitting the form, which is a particular interaction. To run some code in response to particular interaction, put that logic directly into the corresponding event handler (여기서 문제는 이 코드가 처음부터 Effect가 되어서는 안 된다는 것입니다. 이 POST 요청을 보내고 폼 제출에 대한 응답으로 알림을 표시하고 싶으므로, 이는 특정 상호작용에 해당합니다. 특정 상호작용에 대한 응답으로 코드를 실행하려면 해당 로직을 해당 이벤트 핸들러에 직접 넣어야 합니다):

```js
function Form() {
    const theme = useContext(ThemeContext);

    function handleSubmit() {
        // ✅ Good: Event-specific logic is called from event handlers
        post("/api/register");
        showNotification("Successfully registered!", theme);
    }

    // ...
}
```

Now that the code is in an event handler, it’s not reactive—so it will only run when the user submits the form.

<br/>

### Is your Effect doing several unrelated things?

(당신의 Effect가 여러 관련 없는 작업을 수행하고 있습니까?)

The next question you should ask yourself is whether your Effect is doing several unrelated things.

Imagine you’re creating a shipping form where the user needs to choose their city and area. You fetch the list of cities from the server according to the selected country to show them in a dropdown (선택한 국가에 따라 서버에서 도시 목록을 가져와 드롭다운에 표시합니다):

```js
function ShippingForm({ country }) {
    const [cities, setCities] = useState(null);
    const [city, setCity] = useState(null);

    useEffect(() => {
        let ignore = false;
        fetch(`/api/cities?country=${country}`)
            .then((response) => response.json())
            .then((json) => {
                if (!ignore) {
                    setCities(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, [country]); // ✅ All dependencies declared

    // ...
}
```

This is a good example of fetching data in an Effect. You are synchronizing the `cities` state with the network according to the `country` prop. You can’t do this in an event handler because you need to fetch as soon as `ShippingForm` is displayed and whenever the `country` changes (no matter which interaction causes it) (이것은 Effect에서 데이터를 가져오는 좋은 예입니다. country prop에 따라 네트워크와 cities 상태를 동기화하고 있습니다. 이벤트 핸들러에서는 이를 수행할 수 없습니다. 왜냐하면 ShippingForm이 표시될 때와 country가 변경될 때마다(어떤 상호작용이 원인이든 관계없이) 즉시 데이터를 가져와야 하기 때문입니다).

Now let’s say you’re adding a second select box for city `areas`, which should fetch the `areas` for the currently selected city. You might start by adding a second fetch call for the list of `areas` inside the same Effect:

```js
function ShippingForm({ country }) {
    const [cities, setCities] = useState(null);
    const [city, setCity] = useState(null);
    const [areas, setAreas] = useState(null);

    useEffect(() => {
        let ignore = false;
        fetch(`/api/cities?country=${country}`)
            .then((response) => response.json())
            .then((json) => {
                if (!ignore) {
                    setCities(json);
                }
            });
        // 🔴 Avoid: A single Effect synchronizes two independent processes
        if (city) {
            fetch(`/api/areas?city=${city}`)
                .then((response) => response.json())
                .then((json) => {
                    if (!ignore) {
                        setAreas(json);
                    }
                });
        }
        return () => {
            ignore = true;
        };
    }, [country, city]); // ✅ All dependencies declared

    // ...
}
```

However, since the Effect now uses the `city` state variable, you’ve had to add `city` to the list of dependencies. That, in turn, introduced a problem: when the user selects a different city, the Effect will re-run and call `fetchCities(country)`. As a result, you will be unnecessarily refetching the list of cities many times (그러나 이제 Effect가 city 상태 변수를 사용하므로, city를 의존성 목록에 추가해야 했습니다. 그로 인해 문제가 발생했습니다. 사용자가 다른 도시를 선택하면 Effect가 다시 실행되고 fetchCities(country)를 호출하게 됩니다. 결과적으로 도시 목록을 불필요하게 여러 번 다시 가져오게 됩니다.).

The problem with this code is that you’re synchronizing two different unrelated things:

1. You want to synchronize the `cities` state to the network based on the `country` prop.
2. You want to synchronize the `areas` state to the network based on the `city` state.

Split the logic into two Effects, each of which reacts to the prop that it needs to synchronize with:

```js
function ShippingForm({ country }) {
    const [cities, setCities] = useState(null);
    useEffect(() => {
        let ignore = false;
        fetch(`/api/cities?country=${country}`)
            .then((response) => response.json())
            .then((json) => {
                if (!ignore) {
                    setCities(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, [country]); // ✅ All dependencies declared

    const [city, setCity] = useState(null);
    const [areas, setAreas] = useState(null);
    useEffect(() => {
        if (city) {
            let ignore = false;
            fetch(`/api/areas?city=${city}`)
                .then((response) => response.json())
                .then((json) => {
                    if (!ignore) {
                        setAreas(json);
                    }
                });
            return () => {
                ignore = true;
            };
        }
    }, [city]); // ✅ All dependencies declared
}
```

Now the first Effect only re-runs if the `country` changes, while the second Effect re-runs when the `city` changes. You’ve separated them by purpose: two different things are synchronized by two separate Effects(두 개의 서로 다른 작업이 두 개의 별도의 Effect에 의해 동기화됩니다). Two separate Effects have two separate dependency lists, so they won’t trigger each other unintentionally(두 개의 별도 Effect는 각각의 의존성 목록을 가지고 있으므로 서로 의도치 않게 트리거되지 않습니다).

The final code is longer than the original, but splitting these Effects is still correct(최종 코드는 원본보다 길어졌지만, 이러한 Effect를 분리하는 것은 여전히 올바른 방법입니다). Each Effect should represent an independent synchronization process(각 Effect는 독립적인 동기화 프로세스를 나타내야 합니다). In this example, deleting one Effect doesn’t break the other Effect’s logic. This means they synchronize different things, and it’s good to split them up. If you’re concerned about duplication, you can improve this code by extracting repetitive logic into a custom Hook (중복에 대한 우려가 있다면, 반복적인 로직을 사용자 정의 훅으로 추출하여 이 코드를 개선할 수 있습니다).

<br/>

### Are you reading some state to calculate the next state?

This Effect updates the `messages` state variable with a newly created array every time a new message arrives:

```js
function ChatRoom({ roomId }) {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const connection = createConnection();
        connection.connect();
        connection.on("message", (receivedMessage) => {
            setMessages([...messages, receivedMessage]);
        });
    });
}
// ...
```

It uses the `messages` variable to create a new array starting with all the existing messages and adds the new message at the end. However, since `messages` is a reactive value read by an Effect, it must be a dependency (이 코드는 messages 변수를 사용하여 기존의 모든 메시지를 포함한 새로운 배열을 생성하고 그 끝에 새로운 메시지를 추가합니다. 그러나 messages가 Effect에 의해 읽히는 반응적 값이므로, 이는 의존성이 되어야 합니다):

```js
function ChatRoom({ roomId }) {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const connection = createConnection();
        connection.connect();
        connection.on("message", (receivedMessage) => {
            setMessages([...messages, receivedMessage]);
        });
        return () => connection.disconnect();
    }, [roomId, messages]); // ✅ All dependencies declared
    // ...
}
```

And making `messages` a dependency introduces a problem.

Every time you receive a message, `setMessages()` causes the component to re-render with a new `messages` array that includes the received message. However, since this Effect now depends on` messages`, this will also re-synchronize the Effect. So every new message will make the chat re-connect. The user would not like that!

To fix the issue, don’t read `messages` inside the Effect. Instead, pass an updater function to `setMessages`:

```js
function ChatRoom({ roomId }) {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const connection = createConnection();
        connection.connect();
        connection.on("message", (receivedMessage) => {
            setMessages((msgs) => [...msgs, receivedMessage]);
        });
        return () => connection.disconnect();
    }, [roomId]); // ✅ All dependencies declared
}
// ...
```

Notice how your Effect does not read the `messages` variable at all now. You only need to pass an updater function like `msgs => [...msgs, receivedMessage]`. React puts your updater function in a queue and will provide the msgs argument to it during the next render. This is why the Effect itself doesn’t need to depend on messages anymore. As a result of this fix, receiving a chat message will no longer make the chat re-connect (이제 당신의 Effect가 messages 변수를 전혀 읽지 않는다는 점에 주목하세요. 이제는 msgs => [...msgs, receivedMessage]와 같은 업데이트 함수만 전달하면 됩니다. React는 이 업데이트 함수를 큐에 넣고 다음 렌더링 시 msgs 인수를 제공합니다. 이 때문에 Effect 자체는 더 이상 messages에 의존할 필요가 없습니다. 이러한 수정의 결과로, 채팅 메시지를 수신해도 채팅이 다시 연결되지 않게 됩니다).
