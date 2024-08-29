# 이벤트 핸들러 Event handler

React lets you add _event handlers_ to your JSX.

## Adding event handlers 

add event handler 3 steps:

1. Declare a function
2. 1번에서 생성한 함수에서 로직 구현.
3. Add `onClick={handleClick}` to the `<button>` JSX.

```js
export default function Button() {
    function handleClick() {
        alert("You clicked me!");
    }

    return <button onClick={handleClick}>Click me</button>;
}
```

### 이벤트 핸들러 함수 특징

-   defined *inside* your components.
-   Have names that start with `handle`, followed by the name of the event.

JSX 내에서 인라인으로 정의할 수도 있다.

```js
<button onClick={function handleClick() {
	alert('You clicked me!');
}}>

<button onClick={() => {
	alert('You clicked me!');
}}>
```

<br/>
<br/>

<span style="color:#F29544">**CAUTIONS**</span>
Functions passed to event handlers **must be passed, not called.**

| passing a function (correct)     | calling a function (incorrect)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

첫 번째 예에서는 `handleClick` 함수가 `onClick` 이벤트 핸들러로 전달됩니다. 이는 React에게 사용자가 버튼을 클릭할 때만 해당 함수를 호출하도록 기억하라고 지시합니다.

두 번째 예에서는 `handleClick()` 뒤의 괄호가 함수가 즉시 렌더링 중에 실행되도록 합니다. 클릭 없이도 함수가 실행되는 것입니다.

코드를 인라인으로 작성할 때:

| passing a function (correct)            | calling a function (incorrect)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

이렇게 인라인 코드를 전달하면 클릭 시 실행되지 않고, 컴포넌트가 렌더링될 때마다 실행됩니다:

```js
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

If you want to define your event handler inline, wrap it in an **anonymous function** like so:

```js
<button onClick={() => alert('You clicked me!')}>
```

### Reading props in event handlers

이벤트 핸들러는 컴포넌트 내부에서 선언되기 때문에, 컴포넌트의 props에 접근할 수 있다.

```js
function AlertButton({ message, children }) {
    return <button onClick={() => alert(message)}>{children}</button>;
}

export default function Toolbar() {
    return (
        <div>
            <AlertButton message="Playing!">Play Movie</AlertButton>
            <AlertButton message="Uploading!">Upload Image</AlertButton>
        </div>
    );
}
```

<br/>

### Passing event handlers as props

Often you’ll want the parent component to specify a child’s event handler.

```js
function Button({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>;
}

function PlayButton({ movieName }) {
    function handlePlayClick() {
        alert(`Playing ${movieName}!`);
    }

    return <Button onClick={handlePlayClick}>Play "{movieName}"</Button>;
}

function UploadButton() {
    return <Button onClick={() => alert("Uploading!")}>Upload Image</Button>;
}

export default function Toolbar() {
    return (
        <div>
            <PlayButton movieName="Kiki's Delivery Service" />
            <UploadButton />
        </div>
    );
}
```

### Naming event handler props

관례상, 이벤트 핸들러 props는 `on`으로 시작하고, 그 뒤에 대문자가 오는 것이 좋습니다.

```js
function Button({ onSmash, children }) {
    return <button onClick={onSmash}>{children}</button>;
}

export default function App() {
    return (
        <div>
            <Button onSmash={() => alert("Playing!")}>Play Movie</Button>
            <Button onSmash={() => alert("Uploading!")}>Upload Image</Button>
        </div>
    );
}
```

When your component supports multiple interactions, you might name event handler props for app-specific concepts.

```js
export default function App() {
    return <Toolbar onPlayMovie={() => alert("Playing!")} onUploadImage={() => alert("Uploading!")} />;
}

function Toolbar({ onPlayMovie, onUploadImage }) {
    return (
        <div>
            <Button onClick={onPlayMovie}>Play Movie</Button>
            <Button onClick={onUploadImage}>Upload Image</Button>
        </div>
    );
}

function Button({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>;
}
```

## Event propagation

이벤트 핸들러는 컴포넌트의 자식 요소에서 발생하는 이벤트도 잡습니다. **“bubbles” or “propagates”**

```js
export default function Toolbar() {
    return (
        <div
            className="Toolbar"
            onClick={() => {
                alert("You clicked on the toolbar!");
            }}
        >
            <button onClick={() => alert("Playing!")}>Play Movie</button>
            <button onClick={() => alert("Uploading!")}>Upload Image</button>
        </div>
    );
}
```

버튼 중 하나를 클릭하면 해당 버튼의 `onClick` 핸들러가 먼저 실행되고, 그 다음에 부모 `<div>`의 `onClick` 핸들러가 실행됩니다. 따라서 두 개의 메시지가 나타납니다. 만약 툴바 자체를 클릭하면 부모 `<div>`의 `onClick` 핸들러만 실행됩니다.

<br/>
<br/>

<span style="color:#F29544">**CAUTIONS**</span>

React에서는 모든 이벤트가 전파되지만, `onScroll` 이벤트는 해당 이벤트가 부착된 JSX 태그에서만 작동합니다.

### Stopping propagation

이벤트 핸들러는 이벤트 객체를 유일한 인자로 받습니다. 관례상 이 객체는 보통 `e`라고 불리며, 이는 "event"를 의미합니다. 이 객체를 사용하여 이벤트에 대한 정보를 읽을 수 있습니다.

이 이벤트 객체는 전파를 중단하는 것도 가능하게 합니다. 만약 이벤트가 부모 컴포넌트에 도달하는 것을 방지하고 싶다면, `e.stopPropagation()`을 호출해야 합니다. 이는 `Button` 컴포넌트에서처럼 사용할 수 있습니다.

```js
function Button({ onClick, children }) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {children}
        </button>
    );
}

export default function Toolbar() {
    return (
        <div
            className="Toolbar"
            onClick={() => {
                alert("You clicked on the toolbar!");
            }}
        >
            <Button onClick={() => alert("Playing!")}>Play Movie</Button>
            <Button onClick={() => alert("Uploading!")}>Upload Image</Button>
        </div>
    );
}
```

When you click on a button:

1. React는 `<button>`에 전달된 `onClick` 핸들러를 호출합니다.
2. 이 핸들러는 `Button`에서 정의되어 있으며, 다음 작업을 수행합니다:
    - `e.stopPropagation()`을 호출하여 **이벤트의 버블링을 방지**합니다.
    - `Toolbar` 컴포넌트에서 전달된 `onClick` 함수를 호출합니다.
3. 이 함수는 `Toolbar` 컴포넌트에서 정의되어 있으며, 버튼의 경고 메시지를 표시합니다.
4. 전파가 중단되었기 때문에 부모 `<div>`의 `onClick` 핸들러는 실행되지 않습니다.

결과적으로 `e.stopPropagation()` 덕분에 버튼을 클릭할 때는 이제 버튼에서 발생한 경고 메시지만 표시되고, 부모 툴바 `<div>`에서 발생하는 메시지는 표시되지 않습니다. 버튼 클릭과 주변 툴바 클릭은 서로 다른 행동이므로, 전파를 중단하는 것이 이 UI에서는 타당합니다.

<br/>
<br/>

<span style="font-weight:bold; color:rgb(70, 142, 242)">DEEP DIVE</span>

**Capture phase events**

capture evnets?
이벤트가 최상위 요소에서 시작하여 자식 요소로 내려갑니다.

```js
<div
    onClickCapture={() => {
        /* this runs first */
    }}
>
    <button onClick={(e) => e.stopPropagation()} />
    <button onClick={(e) => e.stopPropagation()} />
</div>
```

각 이벤트는 세 가지 단계로 전파됩니다:

1. 이벤트가 아래로 내려가면서 모든 `onClickCapture` 핸들러를 호출합니다.
2. 클릭된 요소의 `onClick` 핸들러가 실행됩니다.
3. 이벤트가 위로 올라가면서 모든 `onClick` 핸들러를 호출합니다.

캡처 이벤트는 라우터나 분석 코드와 같은 용도로 유용하지만, 일반적인 앱 코드에서는 잘 사용하지 않을 것입니다.

### Passing handlers as alternative to propagation 

전파 대신 핸들러 전달하기

```js
function Button({ onClick, children }) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {children}
        </button>
    );
}
```

### Preventing default behavior

기본 동작 방지

일부 브라우저 이벤트는 기본 동작이 연결되어 있습니다. 예를 들어, `<form>`의 제출 이벤트는 그 안의 버튼이 클릭될 때 발생하며, 기본적으로 전체 페이지를 새로 고칩니다.
\
You can call `e.preventDefault()` on the event object to stop this from happening:

```js
export default function Signup() {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                alert("Submitting!");
            }}
        >
            <input />
            <button>Send</button>
        </form>
    );
}
```

Don’t confuse `e.stopPropagation()` and `e.preventDefault()`.

-   `e.stopPropagation()`: 상위 태그에 연결된 이벤트 핸들러가 실행되는 것을 막습니다.
-   `e.preventDefault()`: 기본 브라우저 동작이 있는 몇 가지 이벤트에 대해 기본 동작을 방지합니다.

## Can event handlers have side effects?

Event handlers are the best place for side effects.
