# Separating Events from Effects

Event handlers only re-run when you perform the same interaction again.
이벤트 핸들러와 달리, Effects는 읽는 값(예: prop이나 state 변수)이 마지막 렌더링 때와 다를 경우 다시 동기화됩니다. 때로는 두 가지 동작을 혼합하여, 특정 값에 반응해 다시 실행되지만 다른 값에 대해서는 그렇지 않은 Effect가 필요할 수 있습니다.

<br/>
<br/>
<br/>

## Choosing between event handlers and Effects

First, let’s recap the difference between event handlers and Effects.

Imagine you’re implementing a chat room component. Your requirements look like this:

1. Your component should automatically connect to the selected chat room.
2. When you click the “Send” button, it should send a message to the chat.

Let’s say you’ve already implemented the code for them, but you’re not sure where to put it. Should you use event handlers or Effects? Every time you need to answer this question, consider why the code needs to run.

<br/>
<br/>
<br/>

### Event handlers run in response to specific interactions

From the user’s perspective, sending a message should happen because the particular “Send” button was clicked. The user will get rather upset if you send their message at any other time or for any other reason (사용자는 메시지가 다른 시간이나 다른 이유로 전송되면 꽤 불쾌해할 것입니다.). This is why sending a message should be an event handler. Event handlers let you handle specific interactions:

```js
function ChatRoom({ roomId }) {
    const [message, setMessage] = useState("");
    // ...
    function handleSendClick() {
        sendMessage(message);
    }
    // ...
    return (
        <>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSendClick}>Send</button>
        </>
    );
}
```

With an event handler, you can be sure that sendMessage(message) will only run if the user presses the button.

<br/>

### Effects run whenever synchronization is needed

Recall that you also need to keep the component connected to the chat room. Where does that code go? (채팅방에 컴포넌트를 계속 연결해 두어야 한다는 점도 기억하세요. 그 코드는 어디에 들어가야 할까요?)

The reason to run this code is not some particular interaction. It doesn’t matter why or how the user navigated to the chat room screen. Now that they’re looking at it and could interact with it, the component needs to stay connected to the selected chat server. Even if the chat room component was the initial screen of your app, and the user has not performed any interactions at all, you would still need to connect. This is why it’s an Effect (사용자가 아무 상호작용도 하지 않았더라도, 여전히 연결을 유지해야 합니다. 그래서
이것은 Effect여야 합니다.) :

```js
function ChatRoom({ roomId }) {
    // ...
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

With this code, you can be sure that there is always an active connection to the currently selected chat server, regardless of the specific interactions performed by the user (사용자가 수행한 특정 상호작용과 상관없이). Whether the user has only opened your app, selected a different room, or navigated to another screen and back, your Effect ensures that the component will remain synchronized with the currently selected room, and will re-connect whenever it’s necessary.

```js
import { useState, useEffect } from "react";

export function sendMessage(message) {
    console.log("🔵 You sent: " + message);
}

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
    const [message, setMessage] = useState("");

    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
    }, [roomId]);

    function handleSendClick() {
        sendMessage(message);
    }

    return (
        <>
            <h1>Welcome to the {roomId} room!</h1>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSendClick}>Send</button>
        </>
    );
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

<br/>
<br/>
<br/>

## Reactive values and reactive logic

Intuitively (직감적으로), you could say that **event handlers** are always triggered “manually”, for example by clicking a button.

**Effects**, on the other hand, are “automatic”: they run and re-run as often as it’s needed to stay synchronized.

There is a more precise (정확한) way to think about this.

Props, state, and variables declared inside your component’s body are called reactive values. In this example, `serverUrl` is not a reactive value, but `roomId` and `message` are. They participate(참가하다) in the rendering data flow:

```js
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
    const [message, setMessage] = useState("");

    // ...
}
```

Reactive values like these can change due to a re-render. For example, the user may edit the message or choose a different `roomId` in a dropdown. Event handlers and Effects respond to changes differently:

-   **Logic inside event handlers is not reactive.** It will not run again unless the user performs the same interaction (e.g. a click) again (동일한 상호작용(예: 클릭)을 사용자가 다시 수행하지 않는 한, 다시 실행되지 않을 것입니다). Event handlers can read reactive values without “reacting” to their changes (이벤트 핸들러는 반응적 값의 변화를 "반응"하지 않고도 읽을 수 있습니다).

-   **Logic inside Effects is reactive.** If your Effect reads a reactive value, you have to specify it as a dependency. Then, if a re-render causes that value to change, React will re-run your Effect’s logic with the new value.

Let’s revisit the previous example to illustrate(설명하다) this difference.

<br/>

### Logic inside event handlers is not reactive

Take a look at this line of code. Should this logic be reactive or not?

```js
// ...
sendMessage(message);
// ...
```

From the user’s perspective, a change to the message does not mean that they want to send a message. It only means that the user is typing. In other words(다시 말해), the logic that sends a message should not be reactive. It should not run again only because the reactive value has changed(반응적 값이 변경되었다고 해서 다시 실행되어서는 안 됩니다). That’s why it belongs in the event handler:

```js
function handleSendClick() {
    sendMessage(message);
}
```

Event handlers aren’t reactive, so `sendMessage(message)` will only run when the user clicks the Send button.

<br/>

### Logic inside Effects is reactive

Now let’s return to these lines:

```js
// ...
const connection = createConnection(serverUrl, roomId);
connection.connect();
// ...
```

From the user’s perspective, a change to the `roomId` does mean that they want to connect to a different room. In other words, the logic for connecting to the room should be reactive. You want these lines of code to “keep up” with the reactive value (이 코드 들이 반응적 값에 "따라가기를" 원합니다), and to run again if that value is different. That’s why it belongs in an Effect:

```js
useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
        connection.disconnect();
    };
}, [roomId]);
```

Effects are reactive, so `createConnection(serverUrl, roomId)` and `connection.connect()` will run for every distinct value of `roomId`. Your Effect keeps the chat connection synchronized to the currently selected room (Effect는 현재 선택된 방과 채팅 연결을 동기화합니다).

<br/>
<br/>
<br/>

## Extracting non-reactive logic out of Effects

(Effects에서 비반응적 논리를 추출하기)

Things get more tricky when you want to mix reactive logic with non-reactive logic (반응적 논리와 비반응적 논리를 혼합하고 싶을 때 상황이 더 복잡해집니다).

For example, imagine that you want to show a notification when the user connects to the chat. You read the current theme (dark or light) from the props so that you can show the notification in the correct color(현재 테마(어두운 모드 또는 밝은 모드)를 props에서 읽어 올바른 색상으로 알림을 표시할 수 있습니다):

```js
function ChatRoom({ roomId, theme }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.on("connected", () => {
            showNotification("Connected!", theme);
        });
        connection.connect();
        // ...
    });
}
```

However, theme is a reactive value (it can change as a result of re-rendering), and every reactive value read by an Effect must be declared as its dependency. Now you have to specify theme as a dependency of your Effect:

```js
unction ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
}
```

```js
import { useState, useEffect } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function showNotification(message, theme) {
    Toastify({
        text: message,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
            background: theme === "dark" ? "black" : "white",
            color: theme === "dark" ? "white" : "black",
        },
    }).showToast();
}

export function createConnection(serverUrl, roomId) {
    // A real implementation would actually connect to the server
    let connectedCallback;
    let timeout;
    return {
        connect() {
            timeout = setTimeout(() => {
                if (connectedCallback) {
                    connectedCallback();
                }
            }, 100);
        },
        on(event, callback) {
            if (connectedCallback) {
                throw Error("Cannot add the handler twice.");
            }
            if (event !== "connected") {
                throw Error('Only "connected" event is supported.');
            }
            connectedCallback = callback;
        },
        disconnect() {
            clearTimeout(timeout);
        },
    };
}

const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId, theme }) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.on("connected", () => {
            showNotification("Connected!", theme);
        });
        connection.connect();
        return () => connection.disconnect();
    }, [roomId, theme]);

    return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
    const [roomId, setRoomId] = useState("general");
    const [isDark, setIsDark] = useState(false);
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
            <label>
                <input type="checkbox" checked={isDark} onChange={(e) => setIsDark(e.target.checked)} />
                Use dark theme
            </label>
            <hr />
            <ChatRoom roomId={roomId} theme={isDark ? "dark" : "light"} />
        </>
    );
}
```

When the `roomId` changes, the `chat` re-connects as you would expect. But since theme is also a dependency(하지만 테마도 의존성이기 때문에), the `chat` also re-connects every time you switch between the dark and the light theme. That’s not great!

In other words, you don’t want this line to be reactive, even though it is inside an Effect (which is reactive) (다시 말해, 이 코드 줄이 Effect 안에 있지만 반응적이지 않기를 원합니다):

```js
// ...
showNotification("Connected!", theme);
// ...
```

You need a way to separate this non-reactive logic from the reactive Effect around it.

<br/>

### Declaring an Effect Event

This section describes an experimental API that has not yet been released in a stable version of React.

-   Effect Event라는게 있다.

<br/>
<br/>

> 이벤트 핸들러가 반응적 값의 변화를 반응 하지 않고도 읽을 수 있는건, 이벤트 핸들러는 특정 값의 변화를 추적하는 것이 아니라, 사용자의 명시적인 동작에 반응하여 실행되기 때문에 "반응적" 값의 변화를 따르지 않아도 됩니다. - Reactive values and reactive logic

> "reactive"라는 의미는 특정 상태나 값이 변경될 때 자동으로 반응하여 다시 실행되거나 업데이트되는 것을 말합니다. 즉, 반응적이라는 것은 데이터의 변화를 감지하고 그에 따라 어떤 작업이나 로직이 자동으로 수행되는 것을 의미합니다.
