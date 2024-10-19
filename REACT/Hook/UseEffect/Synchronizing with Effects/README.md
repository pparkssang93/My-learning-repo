# Synchronizing with Effects

Some components need to synchronize with external systems. For example, you might want to control a non-React component based on the React state, set up a server connection, or send an analytics log when a component appears on the screen. `Effects` let you run some code **after rendering** so that you can synchronize your component with some system outside of React.

<br/>
<br/>
<br/>

## What are Effects and how are they different from events?

Before getting to `Effects`, you need to be familiar with two types of logic inside React components:

-   **Rendering code** (introduced in Describing the UI)는 컴포넌트의 최상위에 위치합니다. 여기에서 `props`와 `state`를 가져와 변환한 후, 화면에 표시할 `JSX`를 반환합니다. Rendering code must be pure. Like a math formula, it should only calculate the result, but not do anything else.

-   **Event handlers** (introduced in Adding Interactivity) are nested functions inside your components that do things rather than just calculate them. 이벤트 핸들러는 update an input field, submit an HTTP POST request to buy a product, or navigate the user to another screen. 이벤트 핸들러는 특정 사용자 행동(예: 버튼 클릭이나 입력)에 의해 발생하는 프로그램의 state를 변경하는 '부수 효과(side effects)'를 포함합니다.

Sometimes this isn’t enough. 예를 들어, 화면에 보일 때마다 채팅 서버에 연결해야 하는 `ChatRoom` 컴포넌트를 생각해 보세요. Connecting to a server is not a pure calculation (it’s a side effect) so it can’t happen during rendering. 하지만 `ChatRoom` 컴포넌트가 표시되는 특정 이벤트(예: 클릭)는 없습니다.

`Effects`는 특정 이벤트가 아닌 렌더링 자체로 인해 발생하는 side effects를 지정할 수 있게 해줍니다. 채팅에서 메시지를 보내는 것은 사용자가 특정 버튼을 클릭한 것에 의해 직접적으로 발생하는 이벤트입니다. 그러나 서버 연결을 설정하는 것은 컴포넌트가 나타나는 원인에 관계없이 발생해야 하므로 `Effect`로 간주됩니다. `Effects` run at the end of a commit after the screen updates. 이는 리액트 컴포넌트를 외부 시스템(네트워크나 서드파티 라이브러리 등)과 동기화하기에 좋은 시점입니다.

---

Here and later in this text, 대문자로 표기된 'Effect'는 위에서 설명한 리액트 특정 정의, 즉 렌더링에 의해 발생하는 부수 효과를 의미합니다. 더 넓은 프로그래밍 개념을 언급할 때는 '부수 효과(side effect)'라고 표현할 것입니다.

---

<br/>
<br/>
<br/>

## How to write an Effect

To write an Effect, follow these three steps:

1. **Declare an Effect**. By default, your Effect will run after every commit.

2.**Specify the Effect dependencies**. 대부분의 `Effect`는 매 렌더링 후가 아니라 필요할 때만 다시 실행되어야 합니다. 예를 들어, 페이드 인 애니메이션은 컴포넌트가 나타날 때만 트리거되어야 합니다. A chat room에 연결하고 연결을 끊는 작업은 컴포넌트가 나타나고 사라질 때, 또는 A chat room이 변경될 때만 발생해야 합니다.

3. **Add cleanup if needed**. 일부 `Effects`는 그들이 수행하던 작업을 중지하거나 되돌리거나 정리하는 방법을 지정할 필요가 있습니다. 예를 들어, 'connect'에는 'disconnect'가 필요하고, 'subscribe'에는 'unsubscribe'가 필요하며, 'fetch'에는 'cancel'이나 'ignore'가 필요합니다.

Let’s look at each of these steps in detail.

<br/>

### Step 1: Declare an Effect

To declare an `Effect` in your component, import the `useEffect` Hook from React:

```js
import { useEffect } from "react";
```

Then, call it at the top level of your component and put some code inside your Effect:

```js
function MyComponent() {
    useEffect(() => {
        // Code here will run after *every* render
    });
    return <div />;
}
```

Every time your component renders, React will update the screen and then run the code inside `useEffect`. 다시 말해, `useEffect`는 특정 코드의 실행을 화면에 렌더링이 반영될 때까지 “delays” 시킵니다. 이제 외부 시스템과 동기화하기 위해 `Effect`를 사용하는 방법을 살펴보겠습니다. `<VideoPlayer>` 리액트 컴포넌트를 고려해 보세요. `isPlaying prop`을 전달하여 재생 중인지 일시 정지 중인지 제어할 수 있으면 좋습니다.

```js
<VideoPlayer isPlaying={isPlaying} />
```

Your custom `VideoPlayer` component renders the built-in browser `<video>` tag:

```js
function VideoPlayer({ src, isPlaying }) {
    // TODO: do something with isPlaying
    return <video src={src} />;
}
```

However, the browser `<video>` tag does not have an `isPlaying` prop. The only way to control it is to manually call the `play()` and `pause()` methods on the DOM element. You need to synchronize the value of `isPlaying` prop, which tells whether the video should currently be playing, with calls like `play()` and `pause()`.

We’ll need to first get a `ref` to the `<video>` DOM node.

렌더링 중에 `play()` 또는 `pause()`를 호출하고 싶은 유혹이 있을 수 있지만, 이는 옳지 않습니다.

```js
import { useState, useRef, useEffect } from "react";

function VideoPlayer({ src, isPlaying }) {
    const ref = useRef(null);

    if (isPlaying) {
        ref.current.play(); // Calling these while rendering isn't allowed.
    } else {
        ref.current.pause(); // Also, this crashes.
    }

    return <video ref={ref} src={src} loop playsInline />;
}

❌ Runtime Error
export default function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <>
            <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "Pause" : "Play"}</button>
            <VideoPlayer
                isPlaying={isPlaying}
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            />
        </>
    );
}
```

The reason this code isn’t correct is that it tries to do something with the DOM node during rendering. 리액트에서 렌더링은 `JSX`의 순수한 계산이어야 하며, `DOM`을 수정하는 등의 side effects를 포함해서는 안 됩니다.

게다가 `VideoPlayer`가 처음 호출될 때, 그 `DOM`은 아직 존재하지 않습니다! `play()`나 `pause()`를 호출할 `DOM` 노드가 없는데, 이는 리액트가 `JSX`를 반환하기 전까지 어떤 `DOM`을 생성할지 모르기 때문입니다.

The solution here is to wrap the side effect with `useEffect` to move it out of the rendering calculation:

```js
import { useEffect, useRef } from "react";

function VideoPlayer({ src, isPlaying }) {
    const ref = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            ref.current.play();
        } else {
            ref.current.pause();
        }
    });

    return <video ref={ref} src={src} loop playsInline />;
}
```

`DOM` 업데이트를 `Effect`로 감싸면, 리액트가 먼저 화면을 업데이트하도록 할 수 있습니다. 그 다음에 당신의 `Effect`가 실행됩니다.

When your `VideoPlayer` component renders (either the first time or if it re-renders), **a few things will happen**.

First, React will update the screen, ensuring the `<video>` tag is in the DOM with the right props. Then React will run your `Effect`. Finally, your `Effect` will call `play()` or `pause()` depending on the value of `isPlaying`.

```js
import { useState, useRef, useEffect } from "react";

function VideoPlayer({ src, isPlaying }) {
    const ref = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            ref.current.play();
        } else {
            ref.current.pause();
        }
    });

    return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <>
            <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "Pause" : "Play"}</button>
            <VideoPlayer
                isPlaying={isPlaying}
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            />
        </>
    );
}
```

In this example, the “external system” you synchronized to React state was the browser media API. You can use a similar approach to wrap legacy non-React code (like jQuery plugins) into declarative React components.

---

### 💥 Pitfall

By default, Effects run after every render. 아래 코드가 무한 루프를 발생시키는 이유입니다:

```js
const [count, setCount] = useState(0);
useEffect(() => {
    setCount(count + 1);
});
```

`Effects` run as a result of rendering. Setting state triggers rendering. Setting state immediately in an Effect is like plugging a power outlet into itself. The Effect runs, it sets the state, which causes a re-render, which causes the Effect to run, it sets the state again, this causes another re-render, and so on.

`Effects` should usually synchronize your components with an external system. If there’s no external system and you only want to adjust some state based on other state, you might not need an Effect.

---

<br/>

### Step 2: Specify the Effect dependencies

By default, Effects run after every render. Often, this is not what you want:

-   Sometimes, it’s slow. Synchronizing with an external system is not always instant, so you might want to skip doing it unless it’s necessary. For example, you don’t want to reconnect to the chat server on every keystroke.

-   Sometimes, it’s wrong. For example, you don’t want to trigger a component fade-in animation on every keystroke. The animation should only play once when the component appears for the first time.

문제를 설명하기 위해, 여기에 몇 가지 `console.log` 호출과 부모 컴포넌트의 상태를 업데이트하는 텍스트 입력이 포함된 예제가 있습니다.

리액트에 불필요한 `Effect`의 re-render를 건너뛰도록 하려면 `useEffect` 호출의 두 번째 인자로 의존성 배열을 지정하면 됩니다.

```js
useEffect(() => {
    // ...
}, []);
```

You should see an error saying React Hook useEffect has a missing dependency: `isPlaying`:

```js
import { useState, useRef, useEffect } from "react";

function VideoPlayer({ src, isPlaying }) {
    const ref = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            console.log("Calling video.play()");
            ref.current.play();
        } else {
            console.log("Calling video.pause()");
            ref.current.pause();
        }
    }, []); // This causes an error

    return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [text, setText] = useState("");
    return (
        <>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "Pause" : "Play"}</button>
            <VideoPlayer
                isPlaying={isPlaying}
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            />
        </>
    );
}
```

문제는 `Effect` 내부의 코드가 `isPlaying prop`에 따라 수행할 작업을 결정하는데, 이 의존성이 명시적으로 선언되지 않았다는 것입니다. 이 문제를 해결하려면 `isPlaying`을 의존성 배열에 추가하세요.

```js
useEffect(() => {
    if (isPlaying) {
        // It's used here...
        // ...
    } else {
        // ...
    }
}, [isPlaying]); // ...so it must be declared here!
```

Now all dependencies are declared, so there is no error. `[isPlaying]`을 의존성 배열로 지정하면 리액트에 이전 렌더링 시의 `isPlaying`과 동일할 경우 `Effect`의 재실행을 건너뛰어야 한다고 알리는 것입니다. With this change, typing into the input doesn’t cause the `Effect` to re-run, but pressing `Play/Pause` does:

The dependency array can contain multiple dependencies. 리액트는 지정한 모든 의존성이 이전 렌더링 시와 정확히 동일한 값을 가질 경우에만 Effect의 재실행을 건너뜁니다. React compares the dependency values using the `Object.is` comparison.

**Notice that you can’t “choose” your dependencies**. 지정한 dependencies이 `Effect` 내부의 코드에 따라 리액트가 기대하는 것과 일치하지 않으면 lint 오류가 발생합니다. 이는 코드 내의 많은 버그를 잡는 데 도움이 됩니다. 특정 코드가 재실행되지 않도록 하려면, 그 의존성이 필요하지 않도록 Effect 코드를 수정해야 합니다.

---

### 💥 Pitfall

의존성 배열이 없는 경우와 빈 `[]` 의존성 배열을 사용하는 경우의 동작은 다릅니다.

```js
useEffect(() => {
    // This runs after every render
});

useEffect(() => {
    // This runs only on mount (when the component appears)
}, []);

useEffect(() => {
    // This runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);
```

We’ll take a close look at what “mount” means in the next step.

---

<br/>

---

### Deep dive

**Why was the ref omitted from the dependency array?**

This Effect uses both ref and isPlaying, but only isPlaying is declared as a dependency:

```js
function VideoPlayer({ src, isPlaying }) {
    const ref = useRef(null);
    useEffect(() => {
        if (isPlaying) {
            ref.current.play();
        } else {
            ref.current.pause();
        }
    }, [isPlaying]);
}
```

This is because the `ref` object has a stable identity: 리액트는 매 렌더링마다 같은 `useRef` 호출로부터 항상 동일한 객체를 반환한다고 보장합니다.
`ref`는 결코 변경되지 않으므로, 그것만으로는 `Effect`가 재실행되는 원인이 되지 않습니다. 따라서 포함하든 포함하지 않든 상관없습니다.

```js
function VideoPlayer({ src, isPlaying }) {
    const ref = useRef(null);
    useEffect(() => {
        if (isPlaying) {
            ref.current.play();
        } else {
            ref.current.pause();
        }
    }, [isPlaying, ref]);
}
```

The `set functions` returned by `useState` also have stable identity,
so you will often see them omitted from the dependencies too. If the linter lets you omit a dependency without errors, it is safe to do.

Omitting always-stable dependencies only works when the linter can “see” that the object is stable. 예를 들어, `ref`가 부모 컴포넌트에서 전달되었다면, 의존성 배열에 이를 명시해야 합니다. 이는 부모 컴포넌트가 항상 같은 `ref`를 전달하는지, 아니면 여러 `ref` 중 하나를 조건적으로 전달하는지를 알 수 없기 때문입니다. 따라서 `Effect`는 어떤 `ref`가 전달되는지에 따라 달라지게 됩니다.

---

<br/>

### Step 3: Add cleanup if needed

Consider a different example. You’re writing a `ChatRoom` component that needs to connect to the chat server when it appears. You are given a `createConnection() API` that returns an object with `connect()` and `disconnect()` methods. How do you keep the component connected while it is displayed to the user?

```js
useEffect(() => {
    const connection = createConnection();
    connection.connect();
});
```

It would be slow to connect to the chat after every re-render, so you add the dependency array:

```js
useEffect(() => {
    const connection = createConnection();
    connection.connect();
}, []);
```

The code inside the Effect does not use any `props` or `state`, so your dependency array is `[]` (empty). This tells React to only run this code when the component “mounts”, i.e. appears on the screen for the first time.

```js
import { useEffect } from "react";

export function createConnection() {
    // A real implementation would actually connect to the server
    return {
        connect() {
            console.log("✅ Connecting...");
        },
        disconnect() {
            console.log("❌ Disconnected.");
        },
    };
}

export default function ChatRoom() {
    useEffect(() => {
        const connection = createConnection();
        connection.connect();
    }, []);
    return <h1>Welcome to the chat!</h1>;
}
```

이 `Effect`는 마운트 시에만 실행되므로, 콘솔에 `'✅ Connecting...'`이 한 번만 출력될 것으로 예상할 수 있습니다. 그러나 콘솔을 확인하면 `'✅ Connecting...'`이 두 번 출력됩니다. Why does it happen?

Imagine the `ChatRoom` component is a part of a larger app with many different screens. The user starts their journey on the `ChatRoom page`. 컴포넌트가 마운트되고 `connection.connect()`를 호출합니다. 그런 다음 사용자가 다른 화면 — 예를 들어 `Settings` 페이지로—이동합니다. ChatRoom 컴포넌트는 언마운트됩니다. 마지막으로 사용자가 `Back` 버튼을 클릭하면 `ChatRoom`이 다시 마운트됩니다. 이로 인해 두 번째 연결이 설정되지만, but the first connection was never destroyed! 사용자가 앱을 탐색하는 동안 연결이 계속 쌓이게 됩니다."

Bugs like this are easy to miss without extensive manual testing. 이를 빠르게 발견할 수 있도록, 개발 중에는 리액트가 initial mount 후 각 컴포넌트를 한 번 더 remounts합니다.

`'✅ Connecting...'` 로그가 두 번 출력되는 것을 보면 실제 문제를 인식할 수 있습니다: 컴포넌트가 언마운트될 때 연결을 닫지 않는 코드입니다.

이 문제를 해결하려면, `Effect`에서 `cleanup` 함수를 반환하세요.

```js
useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
        connection.disconnect();
    };
}, []);
```

리액트는 `Effect`가 다시 실행되기 전에 매번 `cleanup` 함수를 호출하고, 컴포넌트가 언마운트될 때(제거될 때) 마지막으로 한 번 더 호출합니다. `cleanup` 함수가 구현되었을 때 어떤 일이 발생하는지 살펴봅시다.

```js
import { useState, useEffect } from "react";

export function createConnection() {
    // A real implementation would actually connect to the server
    return {
        connect() {
            console.log("✅ Connecting...");
        },
        disconnect() {
            console.log("❌ Disconnected.");
        },
    };
}

export default function ChatRoom() {
    useEffect(() => {
        const connection = createConnection();
        connection.connect();
        return () => connection.disconnect();
    }, []);
    return <h1>Welcome to the chat!</h1>;
}
```

Now you get three console logs in development:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**This is the correct behavior in development.** By remounting your component, 다른 화면으로 이동한 후 다시 돌아오는 것이 코드에 문제를 일으키지 않는지 검증합니다. 연결을 끊고 다시 연결하는 것은 정확히 발생해야 하는 일입니다!
`cleanup`를 잘 구현하면, `Effect`를 한 번 실행하는 것과, 정리한 후 다시 실행하는 것 사이에는 사용자에게 보이는 차이가 없어야 합니다. 리액트가 개발 중에 코드의 버그를 탐지하기 위해 추가적인 connect/disconnect call pair이 발생하는 것은 정상입니다—이것을 없애려고 하지 마세요!

**In production, you would only see `"✅ Connecting..."` printed once.** 컴포넌트의 리마운트는 개발 중에만 발생하여 `cleanup` 필요한 `Effect`를 찾는 데 도움을 줍니다. 개발 모드의 동작을 피하려면 `Strict Mode`를 끌 수 있지만, 계속 켜두는 것을 권장합니다. 이렇게 하면 위와 같은 많은 버그를 발견할 수 있습니다.

<br/>
<br/>
<br/>

## How to handle the Effect firing twice in development?

리액트는 의도적으로 개발 환경에서 컴포넌트를 리마운트하여 지난 예제와 같은 버그를 찾습니다. 올바른 질문은 'Effect를 한 번만 실행하는 방법'이 아니라 '리마운트 후에도 작동하도록 `Effect`를 어떻게 수정할 것인가'입니다.

보통의 경우, `cleanup` 함수를 구현하는 것이 답입니다. `cleanup` 함수는 `Effect`가 수행하던 작업을 중지하거나 취소해야 합니다. 일반적인 규칙은 사용자가 운영 환경에서 `Effect`가 한 번 실행되는 것과 개발 환경에서 `setup` → `cleanup` → `setup` 시퀀스 사이를 구별할 수 없어야 한다는 것입니다.

당신이 작성할 대부분의 `Effect`는 아래의 일반적인 패턴 중 하나에 해당할 것입니다.

---

### 💥 Pitfall

**Don’t use refs to prevent Effects from firing**

Effects의 두 번 실행을 방지하기 위해 `refs`를 사용하지 마세요.

개발 중 `Effect`가 두 번 실행되는 것을 방지하기 위한 일반적인 함정 중 하나는 `Effect`가 한 번 이상 실행되지 않도록 `refs`를 사용하는 것입니다. 예를 들어, 위의 버그를 `useRef`로 '수정'할 수 있습니다.

```js
const connectionRef = useRef(null);
useEffect(() => {
    // 🚩 This wont fix the bug!!!
    if (!connectionRef.current) {
        connectionRef.current = createConnection();
        connectionRef.current.connect();
    }
}, []);
```

이렇게 하면 개발 중에 `'✅ Connecting...'`이 한 번만 출력되지만, 버그는 해결되지 않습니다.

사용자가 다른 화면으로 이동할 때 연결이 여전히 닫히지 않고, 다시 돌아올 때 새로운 연결이 생성됩니다. 사용자가 앱을 탐색하는 동안 연결이 계속 쌓이게 되며, “fix” 이전과 동일한 문제가 발생합니다.

버그를 해결하기 위해서는 `Effect`가 한 번만 실행되도록 하는 것만으로는 충분하지 않습니다. `Effect`는 리마운트 후에도 작동해야 하며, 이는 위의 해결책처럼 연결을 정리해야 함을 의미합니다.

아래의 예제를 통해 일반적인 패턴을 처리하는 방법을 살펴보세요.

---

<br/>

### Controlling non-React widgets

때때로 리액트로 작성되지 않은 UI 위젯을 추가해야 할 필요가 있습니다. 예를 들어, 페이지에 a `map component`를 추가한다고 가정해 보겠습니다. 이 컴포넌트에는 `setZoomLevel()` 메서드가 있으며, 리액트 코드의 `zoomLevel` 상태 변수와 줌 레벨을 동기화하고 싶습니다. `Effect`는 다음과 비슷하게 보일 것입니다.

```js
useEffect(() => {
    const map = mapRef.current;
    map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Note that there is no `cleanup` needed in this case. 개발 중에 리액트는 Effect를 두 번 호출하지만, 이는 문제가 되지 않습니다. 같은 값으로 `setZoomLevel`을 두 번 호출해도 아무런 효과가 없기 때문입니다. 약간 느릴 수는 있지만, 운영 환경에서는 불필요하게 리마운트되지 않기 때문에 이는 중요하지 않습니다.

Some APIs may not allow you to call them twice in a row. 예를 들어, 내장 `<dialog>` 요소의 `showModal` 메서드는 두 번 호출하면 오류를 발생시킵니다. Implement the `cleanup` function and make it close the dialog.

```js
useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
}, []);
```

개발 중에는 `Effect`가 `showModal()`을 호출한 다음 즉시 `close()`를 호출하고, 다시 `showModal()`을 호출합니다. 이는 운영 환경에서 `showModal()`을 한 번 호출하는 것과 동일한 사용자 가시적 동작을 나타냅니다.

<br/>

### Subscribing to events

If your `Effect` subscribes to something, the `cleanup` function should unsubscribe:

```js
useEffect(() => {
    function handleScroll(e) {
        console.log(window.scrollX, window.scrollY);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

In development, your Effect will call `addEventListener()`, then immediately `removeEventListener()`, and then `addEventListener()` again with the same handler. So there would be only one active subscription at a time. 운영 환경에서 `addEventListener()`를 한 번 호출하는 것과 동일한 사용자 가시적 동작을 나타냅니다.

<br/>

### Triggering animations

If your Effect animates something in, the `cleanup` function should reset the animation to the initial values:

```js
useEffect(() => {
    const node = ref.current;
    node.style.opacity = 1; // Trigger the animation
    return () => {
        node.style.opacity = 0; // Reset to the initial value
    };
}, []);
```

In development, opacity will be set to `1`, then to `0`, and then to `1` again. 이것은 운영 환경에서 직접 `1`로 설정하는 것과 동일한 사용자 가시적 동작을 가져야 합니다. 트윈 애니메이션을 지원하는 a third-party animation library를 사용하는 경우, `cleanup` 함수는 타임라인을 initial state로 재설정해야 합니다.

<br/>

### Subscribing to events

If your `Effect` fetches something, the `cleanup` function should either abort the fetch or ignore its result:

```js
useEffect(() => {
    let ignore = false;

    async function startFetching() {
        const json = await fetchTodos(userId);
        if (!ignore) {
            setTodos(json);
        }
    }

    startFetching();

    return () => {
        ignore = true;
    };
}, [userId]);
```

You can’t “undo” a network request that already happened, `cleanup` 함수는 더 이상 관련 없는 `fetch`가 애플리케이션에 영향을 주지 않도록 해야 합니다. 예를 들어, `userId`가 `'Alice'`에서 `'Bob'`으로 변경될 때, `cleanup` 함수는 `'Bob'` 요청이 도착한 후에도 `'Alice'` 응답이 무시되도록 보장합니다.

**In development, you will see two fetches in the Network tab.** There is nothing wrong with that. 위의 접근 방식을 사용하면 첫 번째 `Effect`가 즉시 정리되어 `ignore` 변수의 복사본이 `true`로 설정됩니다. 따라서 추가 요청이 있더라도 `if (!ignore)` 검사를 통해 상태에 영향을 주지 않게 됩니다.

**In production, there will only be one request.** If the second request in development is bothering you, 최선의 접근 방식은 요청을 중복 제거하고 컴포넌트 간에 응답을 캐시하는 솔루션을 사용하는 것입니다.

```js
function TodoList() {
    const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
    // ...
}
```

이것은 개발 경험을 개선할 뿐만 아니라, 애플리케이션이 더 빠르게 느껴지도록 만듭니다. 예를 들어, 사용자가 뒤로 가기 버튼을 눌렀을 때, 데이터가 다시 로드되는 것을 기다릴 필요가 없게 됩니다. 왜냐하면 데이터가 캐시되어 있기 때문입니다. 이러한 캐시를 직접 구축할 수도 있고, `Effect`에서 수동으로 데이터를 가져오는 것의 여러 대안 중 하나를 사용할 수도 있습니다.

---

### Deep dive

**What are good alternatives to data fetching in Effects?**

Effect에서 데이터 가져오기에 대한 좋은 대안은 무엇인가요?

`Effect` 내에서 `fetch` 호출을 작성하는 것은 특히 완전 클라이언트 사이드 애플리케이션에서 데이터를 가져오는 인기 있는 방법입니다. 그러나 이것은 매우 수동적인 접근 방식이며, 몇 가지 중요한 단점이 있습니다:

-   **`Effects`don’t run on the server.** 이는 초기 서버 렌더링된 `HTML`이 데이터 없이 로딩 상태만 포함된다는 것을 의미합니다. 클라이언트 컴퓨터는 모든 `JavaScript`를 다운로드하고 애플리케이션을 렌더링한 후 이제 데이터를 로드해야 한다는 것을 알게 됩니다. 이는 매우 비효율적입니다.

-   **Fetching directly in Effects makes it easy to create “network waterfalls”.** You render the parent component, it fetches some data, renders the child components, and then they start fetching their data If the network is not very fast, 이는 모든 데이터를 병렬로 가져오는 것보다 상당히 느립니다.

-   **Fetching directly in Effects usually means you don’t preload or cache data.** 예를 들어, 컴포넌트가 언마운트된 후 다시 마운트되면, 데이터를 다시 가져와야 합니다.

-   **It’s not very ergonomic.** 이것은 그리 편리하지 않습니다. race conditions과 같은 버그에 시달리지 않도록 `fetch` 호출을 작성할 때 상당히 많은 보일러플레이트 코드가 필요합니다.

(race conditions Promise README.md 참고)

This list of downsides is not specific to React. 어떤 라이브러리에서든 마운트 시 데이터를 가져오는 데 적용됩니다. 라우팅과 마찬가지로 데이터 가져오는 작업은 잘 수행하기가 간단하지 않으므로, 다음과 같은 접근 방식을 추천합니다.

-   **If you use a framework, use its built-in data fetching mechanism.** 현대의 React 프레임워크는 효율적이며 위에서 언급한 단점들에 시달리지 않는 데이터 가져오기 메커니즘을 통합하고 있습니다.

-   **Otherwise, consider using or building a client-side cache.** 인기 있는 오픈 소스 솔루션으로는 `React Query`, `useSWR`, 그리고 `React Router 6.4+`가 있습니다. 자신만의 솔루션을 구축할 수도 있으며, 이 경우 내부적으로 `Effects`를 사용하되, 요청 중복 제거, 응답 캐싱, network waterfalls를 피하기 위한 logic(by preloading data or hoisting data requirements to routes).를 추가해야 합니다.

이 두 가지 방법이 당신에게 맞지 않는다면, `Effects`에서 직접 데이터를 계속 가져올 수 있습니다.

---
