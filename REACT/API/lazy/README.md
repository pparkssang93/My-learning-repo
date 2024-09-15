# Lazy

`lazy`는 컴포넌트의 코드를 처음 렌더링될 때까지 로드를 지연시킬 수 있게 해줍니다.

<br/>
<br/>
<br/>
<br/>

## Reference

Call `lazy` outside your components to declare a lazy-loaded React component:

`lazy(load)`

```js
import { lazy } from "react";

const MarkdownPreview = lazy(() => import("./MarkdownPreview.js"));
```

<br/>
<br/>

### parameter

-   **`load function`**: `Promise` 또는 thenable(then 메서드를 가진 Promise와 유사한 객체)을 반환하는 함수입니다. React는 반환된 컴포넌트를 처음 렌더링하려고 시도할 때까지 `load`를 호출하지 않습니다. React가 처음 `load`를 호출한 후, 해당 함수가 해결될 때까지 기다리고, 해결된 값의 `.default`를 React 컴포넌트로 렌더링합니다. 반환된 Promise와 Promise의 해결된 값은 캐시되므로 React는 `load`를 한 번만 호출합니다. 만약 `Promise`가 거부되면, React will `throw` the rejection reason for the nearest Error Boundary to handle.

<br/>
<br/>

### return

`lazy` returns a React component you can render in your tree. lazy 컴포넌트의 코드가 아직 로딩 중일 때 이를 렌더링하려고 하면 중단됩니다. 로딩 중일 때 로딩 인디케이터를 표시하려면 `<Suspense>`를 사용해야 합니다.

<br/>
<br/>

### load function

#### parameters

`load` receives no parameters.

<br/>
<br/>

#### return

`Promise` 또는 다른 thenable(then 메서드를 가진 Promise와 유사한 객체)을 반환해야 합니다. 이 `Promise`는 결국 `.default` 속성이 유효한 React 컴포넌트 타입(예: 함수형 컴포넌트, memo, 또는 forwardRef 컴포넌트)인 객체로 해결되어야 합니다.

<br/>
<br/>

## Usage

### Lazy-loading components with Suspense

<br/>
<br/>

###

#### MEMO 🤔

-   promise 또는 promise 비슷한 객체를 반환하니까 정확한 렌더링을 위해 Suspense 컴포넌트를 같이 사용하는건가??
