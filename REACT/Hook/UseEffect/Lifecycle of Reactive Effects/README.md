# Lifecycle of Reactive Effects

Effects have a different lifecycle from components. 컴포넌트는 마운트, 업데이트 또는 언마운트될 수 있지만, `Effect`는 두 가지 작업만 수행할 수 있습니다: 뭔가의 동기화를 시작하고, 나중에 그 동기화를 중지하는 것입니다. 이 주기는 `Effect`가 시간이 지남에 따라 변경되는 `props`와 `state`에 의존할 경우 여러 번 발생할 수 있습니다. React는 `Effect`의 dependencies을 올바르게 지정했는지 확인하기 위한 린터 규칙을 제공합니다. 이는 당신의 `Effect`가 최신 `props`와 state에 동기화되도록 유지합니다.

<br/>
<br/>
<br/>

## The lifecycle of an Effect

Every React component goes through the same lifecycle:

-   A component mounts when it’s added to the screen.
-   A component updates when it receives new props or state, usually in response to an interaction.
-   A component unmounts when it’s removed from the screen.

**It’s a good way to think about components, but not about Effects.**
대신, 각 `Effect`를 컴포넌트의 The lifecycle와 독립적으로 생각해 보세요. **`Effect`는 현재의 `props`와 `state`에 외부 시스템을 어떻게 동기화할지를 설명합니다.** 코드가 변경됨에 따라 동기화는 더 자주 또는 덜 자주 발생해야 할 필요가 있습니다.

To illustrate this point, consider this `Effect` connecting your component to a chat server:

```js
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [roomId]);
    // ...
}
```

Your Effect’s body specifies how to start synchronizing:

```js
const connection = createConnection(serverUrl, roomId);
connection.connect();
```

The `cleanup` function returned by your Effect specifies how to stop synchronizing:

```js
return () => {
    connection.disconnect();
};
```

직관적으로, React는 컴포넌트가 마운트될 때 동기화를 시작하고 언마운트될 때 동기화를 중지할 것이라고 생각할 수 있습니다. 그러나 때때로, 컴포넌트가 마운트된 상태에서 여러 번 동기화를 시작하고 중지하는 것이 필요할 수 있습니다.

왜 이것이 필요한지, 언제 발생하는지, 그리고 이 동작을 어떻게 제어할 수 있는지 살펴보겠습니다

<br/>

---

일부 `Effects`는 전혀 `cleanup` 함수를 반환하지 않습니다. 더 자주, `cleanup` 함수를 반환하고 싶겠지만, 만약 반환하지 않으면 React는 마치 빈 `cleanup` 함수를 반환한 것처럼 동작합니다.

---

<br/>

### Why synchronization may need to happen more than once

Imagine this `ChatRoom` component receives a `roomId` prop that the user picks in a dropdown. Let’s say that initially the user picks the `"general"` room as the `roomId`. Your app displays the `"general"` chat room:

```js
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId /* "general" */ }) {
    // ...
    return <h1>Welcome to the {roomId} room!</h1>;
}
```

After the UI is displayed, React will run your `Effect` to start synchronizing. It connects to the `"general"` room:

```js
function ChatRoom({ roomId /* "general" */ }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
        connection.connect();
        return () => {
            connection.disconnect(); // Disconnects from the "general" room
        };
    }, [roomId]);
    // ...
}
```

Later, the user picks a different room in the dropdown (for example, `"travel"`). First, React will update the UI:

```js
function ChatRoom({ roomId /* "travel" */ }) {
    // ...
    return <h1>Welcome to the {roomId} room!</h1>;
}
```

Think about what should happen next. The user sees that `"travel"` is is the selected chat room in the UI. However, the `Effect` that ran the last time is still connected to the `"general"` room. The `roomId` prop has changed, so what your `Effect` did back then (connecting to the "general" room) no longer matches the UI.

At this point, you want React to do two things:

1. Stop synchronizing with the old `roomId` (disconnect from the "general" room)
2. Start synchronizing with the new `roomId` (connect to the "travel" room)

Luckily, you’ve already taught React how to do both of these things! Your `Effect’s` body specifies how to start synchronizing, and your `cleanup` function specifies how to stop synchronizing.

<br/>

### How React re-synchronizes your Effect

Recall that your `ChatRoom` component has received a new value for its `roomId` prop. It used to be `"general"`, and now it is `"travel"`. React needs to re-synchronize your `Effect` to re-connect you to a different room.

To **stop synchronizing**, React will call the `cleanup` function that your `Effect` returned after connecting to the `"general"` room. Since `roomId` was `"general"`, the `cleanup` function disconnects from the `"general"` room:

```js
function ChatRoom({ roomId /* "general" */ }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
        connection.connect();
        return () => {
            connection.disconnect(); // Disconnects from the "general" room
        };
        // ...
    });
}
```

Then React will run the `Effect` that you’ve provided during this render. This time, `roomId` is `"travel"` so it will start synchronizing to the `"travel" chat room` (until its `cleanup` function is eventually called too):

```js
function ChatRoom({ roomId /* "travel" */ }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId); // Connects to the "travel" room
        connection.connect();
        // ...
    });
}
```

you’re now connected to the same `room` that the user chose in the UI.

Every time after your component re-renders with a different `roomId`, your `Effect` will re-synchronize. For example, let’s say the user changes `roomId` from `"travel"` to `"music"`. React will again stop synchronizing your `Effect` by calling its `cleanup` function (disconnecting you from the `"travel"` room). Then it will start synchronizing again by running its body with the new `roomId` prop (connecting you to the `"music"` room).

Finally, when the user goes to a different screen, `ChatRoom` unmounts. Now there is no need to stay connected at all. React는 마지막으로 당신의 Effect의 동기화를 중지하고 `'music'` 채팅 방에서 연결을 끊을 것입니다.

<br/>

### Thinking from the Effect’s perspective

Let’s recap everything that’s happened from the `ChatRoom` component’s perspective:

1. `ChatRoom` mounted with `roomId` set to "general"
2. `ChatRoom` updated with `roomId` set to "travel"
3. `ChatRoom` updated with `roomId` set to "music"
4. `ChatRoom` unmounted

During each of these points in the component’s lifecycle, your Effect did different things:

1. Your Effect connected to the `"general"` room
2. Your Effect disconnected from the `"general"` room and connected to the `"travel"` room
3. Your Effect disconnected from the `"travel"` room and connected to the `"music"` room
4. Your Effect disconnected from the `"music"` room

Now let’s think about what happened from the perspective of the Effect itself:

```js
useEffect(() => {
    // Your Effect connected to the room specified with roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
        // ...until it disconnected
        connection.disconnect();
    };
}, [roomId]);
```

This code’s structure might inspire you to see what happened as a sequence of non-overlapping time periods:

1. Your Effect connected to the `"general"` room (until it disconnected)
2. Your Effect connected to the `"travel"` room (until it disconnected)
3. Your Effect connected to the `"music"` room (until it disconnected)

Previously, you were thinking from the component’s perspective. 컴포넌트의 관점에서 볼 때, `Effects`는 렌더 후나 언마운트 전 특정한 시간에 실행되는 콜백 또는 라이프사이클 이벤트라고 생각하기 쉽다.

Instead, always focus on a single start/stop cycle at a time. It shouldn’t matter whether a component is mounting, updating, or unmounting. All you need to do is to describe how to start synchronization and how to stop it. If you do it well, Effect는 필요할 때마다 시작되고 중지되는 것에 대해 강인할 것입니다.

This might remind you how you don’t think whether a component is mounting or updating when you write the rendering logic that creates JSX. You describe what should be on the screen, React는 나머지를 처리합니다.

<br/>

### How React verifies that your Effect can re-synchronize

Here is a live example that you can play with.

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
    const [show, setShow] = useState(false);
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
            <button onClick={() => setShow(!show)}>{show ? "Close chat" : "Open chat"}</button>
            {show && <hr />}
            {show && <ChatRoom roomId={roomId} />}
        </>
    );
}
```

Notice that when the component mounts for the first time, you see three logs:

1. ✅ Connecting to "general" room at https://localhost:1234... (development-only)
2. ❌ Disconnected from "general" room at https://localhost:1234. (development-only)
3. ✅ Connecting to "general" room at https://localhost:1234...

The first two logs are development-only. In development, React always remounts each component once.

개발 중에는 `Effect`가 올바르게 작동하는지 검증하기 위해 React가 이를 강제로 다시 실행한다.
이것은 마치 문이 잠겼는지 확인하기 위해 문을 한 번 더 열고 닫는 것을 떠올리게 할 수 있습니다. React는 개발 환경에서 `Effect`를 한 번 더 시작하고 중지하여 당신이 `cleanup` 함수를 잘 구현했는지 확인합니다.

실제로 `Effect`가 다시 동기화되는 주요 이유는 사용하는 데이터 중 일부가 변경되었을 때입니다. 위의 샌드박스에서 선택한 채팅방을 변경해 보세요. `roomId`가 변경되면, `Effect`가 다시 동기화되는 것을 확인할 수 있을 것입니다.

하지만 다시 동기화가 필요한 더 특이한 경우들도 있습니다. 예를 들어, 채팅이 열려 있는 상태에서 위 샌드박스에서 `serverUrl`을 수정해 보세요. 코드를 수정하면 `Effect`가 다시 동기화되는 것을 확인할 수 있습니다. 앞으로 `React`는 다시 동기화에 의존하는 기능을 더 추가할 수도 있습니다.

<br/>

### How React knows that it needs to re-synchronize the Effect

You might be wondering how React knew that your `Effect` needed to re-synchronize after `roomId` changes. It’s because you told React that its code depends on `roomId` by including it in the list of dependencies:

```js
function ChatRoom({ roomId }) { // The roomId prop may change over time
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads roomId
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // So you tell React that this Effect "depends on" roomId
  // ...
```

Here’s how this works:

1. You knew `roomId` is a prop, which means it can change over time.
2. You knew that your `Effect` reads `roomId` (so its logic depends on a value that may change later).
3. This is why you specified it as your Effect’s dependency (so that it re-synchronizes when `roomId` changes).

Every time after your component re-renders, React will look at the array of dependencies that you have passed. 배열에 있는 값 중 하나라도 이전 렌더링 때 전달했던 at the same spot의 값과 다르면, React will re-synchronize your Effect.

For example, if you passed `["general"]` during the initial render, and later you passed `["travel"]` during the next render, React will compare `"general"` and `"travel"`. These are different values (compared with `Object.is`), so React will re-synchronize your Effect. On the other hand, if your component re-renders but `roomId` has not changed, your Effect will remain connected to the same room.

<br/>

### Each Effect represents a separate synchronization process

이미 작성한 Effect와 동시에 실행해야 한다는 이유만으로 관련 없는 로직을 Effect에 추가하는 것은 피하세요. For example, let’s say you want to send an analytics event when the user visits the room. You already have an Effect that depends on `roomId`, so you might feel tempted to add the analytics call there:

```js
function ChatRoom({ roomId }) {
    useEffect(() => {
        logVisit(roomId);
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [roomId]);
    // ...
}
```

하지만 나중에 이 `Effect`에 연결을 다시 설정해야 하는 다른 의존성을 추가한다고 가정해 보세요. If this `Effect` re-synchronizes, it will also call `logVisit(roomId)` for the same room, which you did not intend. 방문 기록은 연결과는 별개의 과정입니다. Write them as two separate Effects:

```js
function ChatRoom({ roomId }) {
    useEffect(() => {
        logVisit(roomId);
    }, [roomId]);

    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        // ...
    }, [roomId]);
    // ...
}
```

Each Effect in your code should represent a separate and independent synchronization process.

In the above example, deleting one Effect wouldn’t break the other Effect’s logic. 이는 두 `Effect`가 서로 다른 작업을 동기화하고 있다는 좋은 신호이며, 따라서 이를 나누는 것이 합리적입니다. 반면에, 하나의 통합된 로직을 별개의 Effect로 분리하면 코드가 "더 깔끔해" 보일 수 있지만, 유지보수가 더 어려워질 수 있습니다. 그래서 코드를 깔끔하게 보이게 할지 여부보다는, 과정이 동일한지 아니면 별개의 작업인지 고민해야 합니다.

<br/>

### Effects “react” to reactive values

Your `Effect` reads two variables (`serverUrl` and `roomId`), but you only specified `roomId` as a dependency:

```js
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [roomId]);
    // ...
}
```

Why doesn’t serverUrl need to be a dependency?

This is because the `serverUrl` never changes due to a re-render. It’s always the same no matter how many times the component re-renders and why. Since `serverUrl` never changes, 그것을 dependencies로 지정하는 것은 합리적이지 않을 것입니다. 결국, dependencies은 시간이 지나면서 변경될 때만 작동하니까요!

On the other hand, `roomId` may be different on a re-render. Props, state, and other values declared inside the component are reactive because they’re calculated during rendering and participate in the React data flow.

If `serverUrl` was a state variable, it would be reactive. Reactive values must be included in dependencies:

```js
function ChatRoom({ roomId }) {
    // Props change over time
    const [serverUrl, setServerUrl] = useState("https://localhost:1234"); // State may change over time

    useEffect(() => {
        const connection = createConnection(serverUrl, roomId); // Your Effect reads props and state
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [roomId, serverUrl]); // So you tell React that this Effect "depends on" on props and state
    // ...
}
```

By including `serverUrl` as a dependency, you ensure that the Effect re-synchronizes after it changes.

Try changing the selected chat room or edit the server URL:

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

function ChatRoom({ roomId }) {
    const [serverUrl, setServerUrl] = useState("https://localhost:1234");

    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
    }, [roomId, serverUrl]);

    return (
        <>
            <label>
                Server URL: <input value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
            </label>
            <h1>Welcome to the {roomId} room!</h1>
        </>
    );
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

Whenever you change a reactive value like `roomId` or `serverUrl`, the Effect re-connects to the chat server.

<br/>

### What an Effect with empty dependencies means

What happens if you move both `serverUrl` and `roomId` outside the component?

```js
const serverUrl = "https://localhost:1234";
const roomId = "general";

function ChatRoom() {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, []); // ✅ All dependencies declared
    // ...
}
```

Now your Effect’s code does not use any reactive values, so its dependencies can be empty (`[]`).

Thinking from the component’s perspective, the empty `[]` dependency array means this `Effect` connects to the chat room only when the component mounts, and disconnects only when the component unmounts. (실제로 dependency 변경되지 않더라도 개발 모드에서는 React가 추가로 `Effect`를 실행해 올바르게 동작하는지 확인하는 과정을 거친다)

However, if you think from the Effect’s perspective, you don’t need to think about mounting and unmounting at all. 중요한 것은 당신이 `Effect`가 시작하고 중지될 때 무엇을 수행하는지 명시했다는 것입니다. 현재, it has no reactive dependencies. But if you ever want the user to change `roomId` or `serverUrl` over time (and they would become reactive), your Effect’s code won’t change. You will only need to add them to the dependencies.

<br/>

### All variables declared in the component body are reactive

Props and state aren’t the only reactive values. If the props or state change, your component will re-render, and the values calculated from them will also change. 그렇기 때문에 `Effect`에서 사용하는 컴포넌트 body의 모든 변수는 `Effect` dependency list에 포함되어야 합니다.

Let’s say that the user can pick a chat server in the dropdown, but they can also configure a default server in settings. Suppose you’ve already put the settings state in a context so you read the settings from that context. Now you calculate the `serverUrl` based on the selected server from props and the default server:

```js
function ChatRoom({ roomId, selectedServerUrl }) {
    // roomId is reactive
    const settings = useContext(SettingsContext); // settings is reactive
    const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl is reactive
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId); // Your Effect reads roomId and serverUrl
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [roomId, serverUrl]); // So it needs to re-synchronize when either of them changes!
    // ...
}
```

In this example, `serverUrl` is not a prop or a state variable. It’s a regular variable that you calculate during rendering. But it’s calculated during rendering, so it can change due to a re-render. This is why it’s reactive.

All values inside the component (including props, state, and variables in your component’s body) are reactive. Any reactive value can change on a re-render, so you need to include reactive values as Effect’s dependencies.

다시 말해, Effects는 컴포넌트 본체의 모든 값에 "반응"합니다.

---

### Deep dive

**Can global or mutable values be dependencies?**

Mutable values (including global variables) aren’t reactive.

**A mutable value like `location.pathname` can’t be a dependency.** 이것은 변경 가능(mutable)하기 때문에 React 렌더링 데이터 흐름과 완전히 독립적으로 언제든지 변경될 수 있습니다. Changing it wouldn’t trigger a re-render of your component. Therefore, even if you specified it in the dependencies, React wouldn’t know to re-synchronize the Effect when it changes. This also breaks the rules of React, 렌더링 중에 변경 가능한 데이터를 읽는 것은(의존성을 계산하는 시점) 렌더링의 순수성을 깨뜨립니다. Instead, you should read and subscribe to an external mutable value with `useSyncExternalStore`.

**A mutable value like `ref.current` or things you read from it also can’t be a dependency.** The `ref` object returned by `useRef` itself can be a dependency, 하지만 current 속성은 의도적으로 변경 가능(mutable)합니다. 이를 통해 재렌더링을 발생시키지 않고도 어떤 것을 추적할 수 있습니다. 그러나 이를 변경해도 재렌더링이 발생하지 않기 때문에, 이는 반응적 값이 아니며, React는 변경될 때 Effect를 다시 실행해야 한다는 것을 알지 못합니다.

이 페이지 아래에서 배우게 되겠지만, linter는 이러한 문제들을 자동으로 검사할 것입니다.

---

<br/>

### React verifies that you specified every reactive value as a dependency

If your linter is configured for React,
linter는 Effect의 코드에서 사용되는 모든 반응적 값이 의존성으로 선언되었는지 확인할 것입니다. For example, this is a lint error because both `roomId` and `serverUrl` are reactive:

❌ Lint Error

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

function ChatRoom({ roomId }) {
    // roomId is reactive
    const [serverUrl, setServerUrl] = useState("https://localhost:1234"); // serverUrl is reactive

    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
    }, []); // <-- Something's wrong here!

    return (
        <>
            <label>
                Server URL: <input value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
            </label>
            <h1>Welcome to the {roomId} room!</h1>
        </>
    );
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

이것은 React 오류처럼 보일 수 있지만, 실제로는 React가 코드의 버그를 지적하고 있는 것입니다. `roomId`와 `serverUrl`은 시간이 지나면서 변경될 수 있지만, 이들이 변경될 때 `Effect`를 다시 동기화하는 것을 잊고 있습니다. 사용자가 UI에서 다른 값을 선택하더라도 초기 `roomId`와 `serverUrl`에 연결된 상태로 남아 있게 됩니다.

To fix the bug, follow the linter’s suggestion to specify `roomId` and `serverUrl` as dependencies of your Effect:

```js
function ChatRoom({ roomId }) {
    // roomId is reactive
    const [serverUrl, setServerUrl] = useState("https://localhost:1234"); // serverUrl is reactive
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [serverUrl, roomId]); // ✅ All dependencies declared
    // ...
}
```

Try this fix in the sandbox above. Verify that the linter error is gone, and the chat re-connects when needed.

---

In some cases, React knows that a value never changes even though it’s declared inside the component. 예를 들어, `useState`에서 반환된 `set` 함수와 `useRef`에서 반환된 `ref` 객체는 안정적이며, 재렌더링 시 변경되지 않도록 보장됩니다. 안정적인 값은 반응적이지 않으므로, 의존성 목록에서 생략할 수 있습니다. 포함하는 것은 허용되지만, 변경되지 않기 때문에 상관이 없습니다.

---

<br/>

### What to do when you don’t want to re-synchronize

In the previous example, you’ve fixed the lint error by listing `roomId` and `serverUrl` as dependencies.

하지만 대신, 린터에게 이러한 값들이 반응적이지 않다는 것을 "입증"할 수 있습니다. 즉, 이 값들이 재렌더링의 결과로 변경될 수 없다는 것을 보여줄 수 있습니다. 예를 들어, `serverUrl`과 `roomId`가 렌더링에 의존하지 않고 항상 동일한 값을 가진다면, 이를 컴포넌트 외부로 이동할 수 있습니다. 이제 이 값들은 의존성이 필요하지 않습니다.

```js
const serverUrl = "https://localhost:1234"; // serverUrl is not reactive
const roomId = "general"; // roomId is not reactive

function ChatRoom() {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, []); // ✅ All dependencies declared
    // ...
}
```

You can also move them inside the Effect. They aren’t calculated during rendering, so they’re not reactive:

```js
function ChatRoom() {
    useEffect(() => {
        const serverUrl = "https://localhost:1234"; // serverUrl is not reactive
        const roomId = "general"; // roomId is not reactive
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, []); // ✅ All dependencies declared
    // ...
}
```

**Effects are reactive blocks of code.** 그들은 내부에서 읽는 값이 변경될 때 다시 동기화됩니다. 이벤트 핸들러와 달리, 이벤트 핸들러는 상호작용당 한 번만 실행되지만, `Effect`는 동기화가 필요할 때마다 실행됩니다.

**You can’t “choose” your dependencies.** Your dependencies must include every reactive value you read in the `Effect`. The linter enforces this (린터는 이를 강제합니다). Sometimes this may lead to problems like infinite loops and to your Effect re-synchronizing too often. Don’t fix these problems by suppressing the linter! (이러한 문제를 린터를 억제하여 해결하지 마세요!) Here’s what to try instead:

-   **Check that your Effect represents an independent synchronization process.** If your Effect doesn’t synchronize anything, it might be unnecessary. If it synchronizes several independent things, split it up.

-   **만약 props나 state의 최신 값을 읽고 싶지만, 그 값에 "반응"하여 Effect를 다시 동기화하고 싶지 않다면,** Effect를 반응적인 부분과 비반응적인 부분으로 나눌 수 있습니다. 반응적인 부분은 `Effect` 안에 유지하고, 비반응적인 부분은 "Effect Event"라고 불리는 것으로 분리할 수 있습니다. Events와 Effects를 분리하는 것에 대해 읽어보세요.

-   **Avoid relying on objects and functions as dependencies.** 렌더링 중에 객체와 함수를 생성한 다음, 이를 Effect에서 읽으면 매 렌더링마다 이 객체와 함수는 다르게 됩니다. 이로 인해 Effect가 매번 다시 동기화될 것입니다. Effects에서 불필요한 의존성을 제거하는 방법에 대해 더 알아보세요.

<br/>

---

### 💥 Pitfall

The linter is your friend, but its powers are limited. The linter only knows when the dependencies are wrong.
각 경우를 해결하는 최선의 방법을 린터가 알지 못합니다. 만약 린터가 의존성을 제안하지만, 이를 추가하면 루프가 발생한다면, 린터를 무시해야 한다는 의미는 아닙니다. 그 값을 반응적이지 않게 만들고 의존성이 필요하지 않도록 `Effect` 내부(또는 외부)의 코드를 변경해야 합니다.

```js
useEffect(() => {
    // ...
    // 🔴 Avoid suppressing the linter like this:
    // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

---

<br/>
<br/>

> dependency 기준 ?? 1. You knew `roomId` is a prop, which means it can change over time. 2. You knew that your `Effect` reads `roomId` (so its logic depends on a value that may change later). 3. This is why you specified it as your Effect’s dependency (so that it re-synchronizes when `roomId` changes). - How React knows that it needs to re-synchronize the Effect

> dependency 기준 - Effects “react” to reactive values

> 🤔 dependency는 정적인 값은 dependency에 추가하지 않는다.

> 정적인 값을 가진다면 컴포넌트 외부에 값을 작성해도 된다.

> effect는 렌더링 중에 실행되지 않는다.

> dependency에 설정한 값으로 effect가 다시 실행되는 것을 synchronize 표현하는 걸까? state나 props와 잘 일치하도록 유지

> Effect는 컴포넌트의 상태가 변경될 때마다 그에 맞춰 특정 작업을 수행하거나, 필요한 값을 업데이트하는 역할을 합니다.
