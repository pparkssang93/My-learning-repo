# Suspense

`<Suspense>`는 자식 컴포넌트가 로딩을 완료할 때까지 대체 콘텐츠(폴백)를 표시할 수 있게 해주는 컴포넌트입니다.

```js
<Suspense fallback={<Loading />}>
    <SomeComponent />
</Suspense>
```

<br/>
<br/>
<br/>
<br/>

## props

-   **`children`**: 렌더링하려는 실제 UI를 의미합니다. 만약 이 자식 컴포넌트가 렌더링 중에 로딩 상태가 되면, `the Suspense boundary` 폴백(fallback)으로 전환됩니다.

-   **`fallback`**: 실제 UI가 로딩되지 않은 경우 대신 렌더링할 대체 UI를 의미합니다. 유효한 React 노드라면 어떤 것이든 사용할 수 있지만, 일반적으로 폴백은 로딩 스피너나 스켈레톤과 같은 가벼운 플레이스홀더 뷰입니다. `<Suspense>`는 자식 컴포넌트가 로딩 상태가 되면 자동으로 폴백으로 전환하고, 데이터가 준비되면 다시 자식 컴포넌트로 돌아갑니다. 만약 폴백이 렌더링 중에도 로딩 상태가 되면, 가장 가까운 부모 `<Suspense>` boundary.

<br/>
<br/>

## caution

-   React는 처음으로 마운트되기 전에 중단된 렌더에 대한 상태를 보존하지 않습니다. 컴포넌트가 로드되면, React는 중단된 트리를 처음부터 다시 렌더링합니다.

-   만약 `Suspense`가 트리에 대해 콘텐츠를 표시하고 있다가 다시 중단되면, 폴백이 다시 표시됩니다. 단, 이 중단이 `startTransition` 또는 `useDeferredValue`에 의해 발생한 경우는 제외됩니다.

-   React가 이미 보이는 콘텐츠를 숨겨야 하는 경우(다시 중단되었을 때), 콘텐츠 트리의 레이아웃 효과(layout Effects)를 정리합니다. 콘텐츠가 다시 표시될 준비가 되면, React will fire the layout Effects again. 이는 DOM 레이아웃을 측정하는 효과가 콘텐츠가 숨겨져 있을 때 실행되지 않도록 보장합니다.

-   React는 Streaming Server Rendering과 Selective Hydration과 같은 내부 최적화를 포함하고 있으며, 이러한 최적화는 Suspense와 통합되어 있습니다.

<br/>
<br/>
<br/>
<br/>

## usage

### Displaying a fallback while content is loading

<br/>
<br/>

### Revealing content together at once

<br/>
<br/>

### Revealing nested content as it loads

컴포넌트가 중단되면 가장 가까운 상위 `Suspense` 컴포넌트가 폴백을 표시합니다. 이를 통해 여러 `Suspense` 컴포넌트를 중첩하여 로딩 순서를 만들 수 있습니다. 각 `Suspense` 경계의 폴백은 다음 단계의 콘텐츠가 사용 가능해짐에 따라 채워집니다. 예를 들어, 앨범 목록에 고유한 폴백을 제공할 수 있습니다.

<br/>
<br/>

## Showing stale content while fresh content is loading

이 예제에서, `SearchResults` 컴포넌트는 검색 결과를 가져오는 동안 중단됩니다. `"a"`를 입력하고 결과를 기다린 후, 이를 `"ab"`로 수정하면 `"a"`에 대한 결과가 로딩 폴백으로 대체됩니다.

```js
import { Suspense, useState } from "react";
import SearchResults from "./SearchResults.js";

export default function App() {
    const [query, setQuery] = useState("");
    return (
        <>
            <label>
                Search albums:
                <input value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <Suspense fallback={<h2>Loading...</h2>}>
                <SearchResults query={query} />
            </Suspense>
        </>
    );
}
```

<br/>
<br/>

### Preventing already revealed content from hiding

<br/>
<br/>

### Indicating that a Transition is happening

a Transition 진행 중임을 나타내기

### Resetting Suspense boundaries on navigation

<br/>
<br/>

### Providing a fallback for server errors and client-only content
