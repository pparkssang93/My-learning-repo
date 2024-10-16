# Built-in React Hooks

`Hooks`는 **컴포넌트에서 다양한 `React` 기능을 사용**할 수 있다. 기본 제공되는 `Hooks`를 사용하거나, 이를 조합하여 자신만의 `Hooks`를 만들 수 있다.

<br/>
<br/>
<br/>
<br/>

## State Hooks

State lets a component “remember” information like user input. 예를 들어, For example, a form component can use state to store the input value, while an image gallery component can use state to store the selected image index.

To add state to a component, use one of these Hooks:

-   `useState`는 직접 업데이트할 수 있는 a state variable를 선언합니다.
-   `useReducer`는 업데이트 로직을 리듀서 함수 안에 포함하여 상태 변수를 선언합니다. (dispatch)

```js
function ImageGallery() {
    const [index, setIndex] = useState(0);
    // ...
}
```

<br/>
<br/>
<br/>
<br/>

## Context Hooks

`Context`는 정보를 받을 수 있게 해주며 (from distant parents without passing it as props). `props`로 전달할 필요가 없습니다. 예를 들어, 앱의 최상위 컴포넌트는 현재 UI 테마를 아래의 모든 컴포넌트에 전달할 수 있으며, 그 깊이에 상관없이 가능합니다.

-   `useContext` reads and subscribes to a context.

```js
function Button() {
    const theme = useContext(ThemeContext);
    // ...
}
```

---

**subscribe**

프로그래밍에서 특정 데이터나 이벤트를 "구독"한다는 것은 그 데이터나 이벤트의 변화를 계속해서 "지켜본다"는 뜻입니다.

---

<br/>
<br/>
<br/>
<br/>

## Ref Hooks

`Refs`는 컴포넌트가 **렌더링에 사용되지 않는 정보를 보유**할 수 있게 해줍니다. 예를 들어, DOM 노드나 타임아웃 ID와 같은 정보입니다. state와 달리, `ref`를 업데이트해도 **컴포넌트가 리렌더링되지 않습니다.** `Refs`는 React 패러다임에서 벗어날 수 있는 '탈출구' 역할을 합니다. 이는 `내장 브라우저 API`와 같은 non-React 시스템과 작업해야 할 때 유용합니다.

-   `useRef`는 `ref`를 선언합니다. 이 `ref`에는 어떤 값이든 저장할 수 있지만, most often DOM 노드를 저장하는 데 사용됩니다.
-   `useImperativeHandle` 은 컴포넌트에서 노출되는 `ref`를 lets you customize the ref. This is rarely used.

```js
function Form() {
    const inputRef = useRef(null);
    // ...
}
```

<br/>
<br/>
<br/>
<br/>

## Effect Hooks

`Effects`는 컴포넌트가 외부 시스템과 연결하고 동기화할 수 있게 해줍니다. 여기에는 네트워크 처리, 브라우저 DOM, 애니메이션, 다른 UI 라이브러리로 작성된 위젯, and other non-React code. 코드와의 상호작용이 포함됩니다.

-   `useEffect` connects a component to an external system.

```js
function ChatRoom({ roomId }) {
    useEffect(() => {
        const connection = createConnection(roomId);
        connection.connect();
        return () => connection.disconnect();
    }, [roomId]);
    // ...
}
```

`Effects`는 React 패러다임에서 벗어날 수 있는 '탈출구'입니다. 애플리케이션의 데이터 흐름을 조정하기 위해 `Effects`를 사용하지 마세요. 외부 시스템과 상호작용하지 않는 경우, `Effect`가 필요하지 않을 수 있습니다.

사용 빈도가 낮은 두 가지 변형의 `useEffect`가 있으며, 타이밍에서 차이가 있습니다.

-   `useLayoutEffect` fires before the browser repaints the screen. You can measure layout here.
-   `useInsertionEffect` fires before React makes changes to the DOM. Libraries can insert dynamic CSS here.

<br/>
<br/>
<br/>
<br/>

## Performance Hooks

리렌더링 성능을 최적화하는 일반적인 방법은 불필요한 작업을 건너뛰는 것입니다. 예를 들어, React에 캐시된 계산을 재사용하도록 하거나, 이전 렌더 이후 데이터가 변경되지 않았다면 리렌더링을 건너뛰도록 지시할 수 있습니다.

계산을 건너뛰고 불필요한 리렌더링을 피하기 위해 다음 `Hooks` 중 하나를 사용하세요.

-   `useMemo` lets you cache the result of an expensive calculation.
-   `useCallback` 최적화된 컴포넌트에 전달하기 전에 함수 정의를 캐시할 수 있게 해줍니다.

```js
function TodoList({ todos, tab, theme }) {
    const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
    // ...
}
```

Sometimes, you can’t skip re-rendering because the screen actually needs to update. In that case, you can improve performance by separating blocking updates that must be synchronous (like typing into an input) from non-blocking updates which don’t need to block the user interface (like updating a chart).

To prioritize rendering, use one of these Hooks:

-   `useTransition` lets you mark a state transition as non-blocking and allow other updates to interrupt it.
-   `useDeferredValue` lets you defer updating a non-critical part of the UI and let other parts update first.

<br/>
<br/>
<br/>
<br/>

## Other Hooks

이 `Hooks`는 주로 라이브러리 작성자에게 유용하며, 애플리케이션 코드에서는 일반적으로 사용되지 않습니다.

-   `useDebugValue` lets you customize the label React DevTools displays for your custom Hook.
-   `useId` lets a component associate a unique ID with itself. Typically used with accessibility APIs.
-   `useSyncExternalStore` lets a component subscribe to an external store.
-   `useActionState` allows you to manage state of actions.
