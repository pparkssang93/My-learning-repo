# JSX

-   JavaScript 파일 내에서 HTML과 유사한 마크업을 작성할 수 있다.
-   React 컴포넌트는 React가 브라우저에 렌더링하는 마크업을 포함할 수 있는 JavaScript 함수에서 마크업 언어를 사용할 수 있는 문법 확장이 JSX
-   문법 확장
-   react와는 별개 개념.

## The Rules of JSX

### 01. Return a single root element

-   컴포넌트에서 여러 요소를 반환하려면, 그것들을 하나의 부모 태그로 감싸야 합니다.

```js
<div>
	<h1>
		Hedy Lamarr's Todos
	</h1>
	<img
		src="https://i.imgur.com/yXOvdOSs.jpg"
		alt="Hedy Lamarr"
		class="photo"
  .   >

	<ul>
		...
	</ul>
</div>
```

#### Fragment

If you don’t want to add an extra `<div>` to your markup.

```js
<>
	<h1>Hedy Lamarr's Todos</h1>
	<img
		src="https://i.imgur.com/yXOvdOSs.jpg"
		alt="Hedy Lamarr"
		class="photo"
 .  >

	<ul>
		...
	</ul>
</>
```

### 02. Close all the tags

```js
<>
    <img src="https://i.imgur.com/yXOvdOSs.jpg" alt="Hedy Lamarr" class="photo" />

    <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
    </ul>
</>
```

### 03. camelCase all most of the things!

-   JSX는 JavaScript로 변환되며, JSX에 작성된 속성은 JavaScript 객체의 키가 된다.
-   자신의 컴포넌트에서 이러한 속성을 변수로 읽어오고 싶을 때가 많다. 하지만 JavaScript는 변수 이름에 대한 제한이 있습니다. 예를 들어, 변수 이름에는 대시가 포함될 수 없고, class와 같은 예약어도 사용할 수 없습니다.
-   이런 이유로 React에서는 많은 HTML 및 SVG 속성이 **camelCase**로 작성됩니다. 예를 들어, stroke-width 대신 strokeWidth를 사용합니다. class가 예약어이기 때문에, React에서는 해당 DOM 속성에 이름을 따서 className으로 작성합니다.

```js
<img src="https://i.imgur.com/yXOvdOSs.jpg" alt="Hedy Lamarr" className="photo" />
```

## Passing Strings with Quotes

문자열 속성 전달

```js
export default function Avatar() {
    return <img className="avatar" src="https://i.imgur.com/7vQD0fPs.jpg" alt="Gregorio Y. Zara" />;
}
```

### dynamically specify strings

`"` 및 `"`를 `{` 및 `}`로 대체하여 JavaScript의 값을 사용할 수 있다.

```js
export default function Avatar() {
    const avatar = "https://i.imgur.com/7vQD0fPs.jpg";
    const description = "Gregorio Y. Zara";
    return <img className="avatar" src={avatar} alt={description} />;
}
```

## Using curly braces { }

-   JSX는 자바스크립트 함수니까 JSX 내부에서 `{}` 사용해 자바스크립트 문법을 그대로 사용할 수 있다.

```js
export default function TodoList() {
    const name = "Gregorio Y. Zara";
    return <h1>{name}'s To Do List</h1>;
}
```

```js
const today = new Date();

function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}

export default function TodoList() {
    return <h1>To Do List for {formatDate(today)}</h1>;
}
```

### Where to use curly braces 

1. **As text** directly inside a JSX tag
2. **As attributes** immediately following the `=` sign

## Using “double curlies” {{  }}

-   문자열, 숫자 및 기타 JavaScript 표현식 외에도 **JSX에서 객체를 전달.** `person={{ name: "Hedy Lamarr", inventions: 5 }}`
-   JSX에서 인라인 CSS 스타일. **React는 인라인 스타일을 사용할 것을 요구하지 않는다.**

#### MEMO 🤔

-   JSX는 자바스크립트 파일에서 마크업 언어를 포함시킬 수 있는 특수한 문법 확장.
-   JSX는 자바스크립트 함수.
-   리액트 공식 홈페이지에서는 이중중괄호를 `{{ }}` JSX에서 객체를 전달하거나 인라인 스타일 적용할 때 사용한다고 하는데 -> 객체는 prop을 사용하면 되는데 이중중괄호를 사용할 필요가 있을까??
