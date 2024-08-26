# 컴포넌트 Component

-   one of the core concepts of React.
-   UI를 구축하는 기초.
-   reusable UI

## Defining a component

-   리액트 컴포넌트는 **마크업**을 추가할 수 있는 자바스크립트 함수

```js
export default function Profile() {
    return <img src="https://i.imgur.com/MK3eW3Am.jpg" alt="Katherine Johnson" />;
}
```

-   return 키워드와 같은 줄에 있지 않다면, 반드시 괄호로 감싸야 합니다.

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

```js
return (
    <div>
        <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
    </div>
);
```

## Using a component

-   다른 컴포넌트 안에서 중첩해서 사용할 수 있다.

```js
function Profile() {
    return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
}

export default function Gallery() {
    return (
        <section>
            <h1>Amazing scientists</h1>
            <Profile />
            <Profile />
            <Profile />
        </section>
    );
}
```

🔴 Never define a component inside another component!

```js
export default function Gallery() {
    function Profile() {
        // ...
    }
    // ...
}
```

✅ Declare components at the top level

```js
export default function Gallery() {
    // ...
}

function Profile() {
    // ...
}
```

## the browser sees

대소문자에 따라 브라우저가 인식하는게 다르다.

-   `<section>` is lowercase, so React knows we refer to an **HTML tag**.
-   `<Profile />` starts with a capital `P`, so React knows that we want to use our **component** called `Profile`.

```js
<section>
    <h1>Amazing scientists</h1>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

## Exporting and importing a component 

1.  **Make** a new JS file to put the components in.
2.  **Export** your function component from that file (using either default or named  exports).
3.  **Import** it in the file where you’ll use the component (using the corresponding technique for importing default or named exports).

<br/>

> #### Default & Named export

##### Default

-   하나의 파일에 export가 하나만 존재할 수 있다.
-   `import Banana from './Button.js'`라고 작성해도 동일한 defalut export를 제공받습니다.

##### Named

-   원하는 만큼 export 할 수 있다
-   named export는 양쪽의 이름이 일치해야 한다.

| Syntax  | Export statement                      | Import statement                        |
| ------- | ------------------------------------- | --------------------------------------- |
| Default | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named   | `export function Button() {}`         | `import { Button } from './Button.js';` |
