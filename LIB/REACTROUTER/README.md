# REACT ROUTER

<br/>
<br/>
<br/>
<br/>

# How to use

## Install

`npm install react-router-dom`

<br/>
<br/>
<br/>
<br/>

## Adding a Router

가장 먼저 할 일은 `Browser Router`를 생성하고 첫 번째 라우트를 설정하는 것입니다. 이렇게 하면 웹 애플리케이션에 클라이언트 사이드 라우팅이 활성화됩니다.

```js
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello world!</div>,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
```

<br/>
<br/>

## The Root Route

Let's add the global layout for this app.

### Create the root layout component

```js
export default function Root() {
    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <form id="search-form" role="search">
                        <input id="q" aria-label="Search contacts" placeholder="Search" type="search" name="q" />
                        <div id="search-spinner" aria-hidden hidden={true} />
                        <div className="sr-only" aria-live="polite"></div>
                    </form>
                    <form method="post">
                        <button type="submit">New</button>
                    </form>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href={`/contacts/1`}>Your Name</a>
                        </li>
                        <li>
                            <a href={`/contacts/2`}>Your Friend</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail"></div>
        </>
    );
}
```

### Set `<Root>` as the root route's element

```js
import Root from "./routes/root";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
```

<br/>
<br/>

## Create a new route

```js
/* existing imports */
import Contact from "./routes/contact";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
    },
    {
        path: "contacts/:contactId",
        element: <Contact />,
    },
]);
```

Now if we click one of the links or visit /contacts/1 we get our new component!

However, it's not inside of our root layout 😠

<br/>
<br/>
<br/>
<br/>

# Feature

## Client Side Routing

React Router는 "클라이언트 사이드 라우팅"을 가능하게 합니다.

전통적인 웹사이트에서는 브라우저가 웹 서버로부터 문서를 요청하고, CSS 및 JavaScript를 다운로드하고 평가한 후, 서버에서 보낸 HTML을 렌더링합니다. 사용자가 링크를 클릭하면 새로운 페이지를 위해 이 과정을 다시 시작합니다.

클라이언트 사이드 라우팅은 사용자가 링크를 클릭했을 때, 서버로부터 새로운 문서를 요청하지 않고도 URL을 업데이트할 수 있게 해줍니다. 대신, 애플리케이션은 즉시 새로운 UI를 렌더링하고, `fetch`를 사용하여 데이터 요청을 통해 페이지를 새로운 정보로 업데이트할 수 있습니다.

이 방식은 브라우저가 완전히 새로운 문서를 요청하거나 다음 페이지를 위해 CSS 및 JavaScript 자산을 다시 평가할 필요가 없기 때문에 사용자 경험을 더 빠르게 만듭니다. 또한 애니메이션과 같은 동적인 사용자 경험을 가능하게 합니다.

클라이언트 사이드 라우팅은 Router를 생성하고, `Link`및 `<Form>`을 사용하여 페이지로 연결하거나 제출함으로써 활성화됩니다.

```js
import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <div>
                <h1>Hello World</h1>
                <Link to="about">About Us</Link>
            </div>
        ),
    },
    {
        path: "about",
        element: <div>About</div>,
    },
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
```

<br/>
<br/>
<br/>
<br/>

## Nested Routes

우리는 Contact 컴포넌트가 `<Root>` 레이아웃 안에 다음과 같이 렌더링되기를 원합니다.

연락처 라우트를 루트 라우트의 자식으로 만들어서 이를 실현합니다.

<br/>
<br/>

### Move the `contacts` route to be a child of the root route

```js
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "contacts/:contactId",
                element: <Contact />,
            },
        ],
    },
]);
```

루트 레이아웃이 다시 보이지만 오른쪽에는 빈 페이지가 나타납니다. 우리는 루트 라우트가 자식 라우트를 어디에 렌더링할지 알려줘야 합니다. 이를 위해 `<Outlet>`을 사용합니다.

`<div id="detail"`>를 찾아서 그 안에 **`<Outlet>`**을 넣어주세요.

<br/>
<br/>

### Render an `<Outlet>`

```js
import { Outlet } from "react-router-dom";

export default function Root() {
    return (
        <>
            {/* all the other elements */}
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}
```

<br/>
<br/>
<br/>
<br/>
