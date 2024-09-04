# MDX

MDX는 마크다운 콘텐츠에서 JSX를 사용할 수 있다. 인터랙티브 차트나 알림과 같은 컴포넌트를 가져와서 콘텐츠 내에 삽입할 수 있습니다. 이를 통해 컴포넌트를 포함한 긴 형식의 콘텐츠를 작성하는 것이 매우 즐거워집니다.

보다 실용적으로 MDX는 마크다운과 JSX를 결합한 형식으로 설명할 수 있다.

사용하는 도구에 따라 JSX 작성 방식에 차이가 있다는 점을 주의해야 합니다.

또한 MDX에서는 JavaScript의 몇 가지 다른 기능도 지원됩니다: 중괄호`({1 + 1})` 안의 표현식과 `ESM`(가져오기 및 내보내기)이 그것입니다.

<br/>
<br/>
<br/>
<br/>

## MDX syntax

MDX 구문은 마크다운과 JSX를 결합합니다. 이는 문서화된 프로그래밍(literate programming)과 유사한 형태를 제공합니다. 또한 두 언어의 독특한 조합을 만들어냅니다: 마크다운은 공백에 민감하고 관대하여, 입력한 내용이 정확하지 않더라도 오류 없이 작동하지만, JavaScript는 공백에 민감하지 않고 관대하지 않아서 오타가 발생하면 오류가 발생합니다.

<br/>
<br/>

### Markdown

MDX는 기본적으로 표준 마크다운을 지원합니다.

Nonstandard markdown features (such as GFM, frontmatter, math, syntax highlighting) can be enabled with plugins.

MDX에서는 일부 마크다운 기능이 작동하지 않습니다:

-   들여쓰기된 코드는 MDX에서 작동하지 않습니다:

```
    console.log(1) // this is a paragraph in MDX!
```

그 이유는 컴포넌트를 깔끔하게 들여쓰기할 수 있도록 하기 위함입니다:

```
    <main>
        <article>
            # Hello!
        </article>
    </main>
```

-   MDX에서는 자동 링크가 작동하지 않습니다. 그 이유는 자동 링크가 JSX와 구별되지 않을 수 있기 때문입니다(예: svg:rect) 그래서 우리는 명시적으로 사용하는 것을 선호합니다. 링크를 원한다면 전체 링크를 사용하세요.

-   HTML 구문은 MDX에서 작동하지 않으며, JSX로 대체됩니다(`<img>`는 `<img />`로 변환됩니다). HTML 주석 대신 중괄호 안에 JavaScript 주석을 사용할 수 있습니다: `{/_ comment! _/}`.

-   이스케이프되지 않은 왼쪽 꺾쇠 괄호(`<`)와 왼쪽 중괄호(`{`)는 이스케이프해야 합니다: `<` 또는 `{` `(`또는 표현식을 사용할 수 있습니다: `{'<'}`, `{'{'})`

MDX가 마크다운과 어떻게 다른지에 대한 더 많은 정보는 여기에서 문서화되어 있습니다.

<br/>
<br/>
<br/>
<br/>

### JSX

JSX는 HTML처럼 보이지만 컴포넌트(재사용 가능한 요소)를 편리하게 사용할 수 있도록 해주는 JavaScript의 확장입니다. JSX는 일반적으로 React, Preact 또는 Vue와 같은 프론트엔드 프레임워크와 결합되어 사용됩니다. 이러한 프레임워크는 컴포넌트에 대한 지원을 추가하여 다음과 같은 반복되는 요소를 변경할 수 있게 해줍니다:

```HTML
<h2>Hello, Venus!</h2>
<h2>Hello, Mars!</h2>
```

…to JSX (or MDX) like this:

```jsx
<Welcome name="Venus" />
<Welcome name="Mars" />
```

JSX는 컴포넌트에 적합합니다. 반복되는 요소를 더 명확하게 만들고 관심사를 분리할 수 있게 해줍니다. MDX는 JSX 구문을 지원합니다. 다음은 HTML과 매우 유사하게 보입니다:

```MDX
<h1>Heading!</h1>

<abbr title="HyperText Markup Language">HTML</abbr> is a lovely language.

<section>
  And here is *markdown* in **JSX**!
</section>
```

하지만 앞서 언급했듯이 컴포넌트도 사용할 수 있습니다. 컴포넌트는 반드시 정의되어야 합니다. 컴포넌트를 가져오거나, 로컬에서 정의하거나, 나중에 전달할 수 있습니다.

```MDX
<MyComponent id="123" />

You can also use objects with components, such as the `thisOne` component on
the `myComponents` object: <myComponents.thisOne />

<Component
  open
  x={1}
  label={'this is a string, *not* markdown!'}
  icon={<Icon />}
/>
```

<br/>
<br/>
<br/>
<br/>

### Expressions

MDX는 중괄호 안에 JavaScript 표현식도 지원합니다:

```mdx
Two 🍰 is: {Math.PI \* 2}
```

표현식은 전체 JavaScript 프로그램을 포함할 수 있지만, 렌더링할 수 있는 결과로 평가되는 표현식으로 감싸져 있어야 합니다. 다음과 같이 즉시 실행 함수(IIFE)를 사용할 수 있습니다:

```MDX
{(function () {
  const guess = Math.random()

  if (guess > 0.66) {
    return <span style={{color: 'tomato'}}>Look at us.</span>
  }

  if (guess > 0.33) {
    return <span style={{color: 'violet'}}>Who would have guessed?!</span>
  }

  return <span style={{color: 'goldenrod'}}>Not me.</span>
})()}
```

표현식은 비어 있을 수도 있고, 단순히 주석만 포함할 수도 있습니다:

```MDX
{/* A comment! */}
```

<br/>
<br/>
<br/>
<br/>

### ESM

MDX는 JavaScript의 `import`와 `export` 문도 지원합니다. 이러한 ESM(ES Module) 기능은 MDX 내에서 요소를 정의하는 데 사용할 수 있습니다:

```mdx
import { External } from "./some/place.js";

export const Local = (properties) => <span style={{ color: "red" }} {...properties} />;

An <External>external</External> component and a <Local>local one</Local>.
```

ESM can also be used for non-components (data):

```mdx
import { Chart } from "./chart.js";
import population from "./population.js";
export const pi = 3.14;

<Chart data={population} label={"Something with " + pi} />
```

<br/>
<br/>
<br/>
<br/>

### Interleaving

상호 배치

텍스트와 태그가 같은 줄에 있을 경우, JSX 안에서 마크다운 "인라인"은 사용할 수 있지만 "블록"은 사용할 수 없습니다:

```mdx
<div># this is not a heading but *this* is emphasis</div>
```

텍스트와 태그가 한 줄에 있으면 블록을 생성하지 않으므로 `<p>` 태그도 생성되지 않습니다. 반면, 별도의 줄에 있으면 블록이 생성됩니다:

```mdx
<div>This is a `p`.</div>
```

우리는 이 규칙(같은 줄인지 여부)을 사용하여 구분합니다. HTML의 요소 의미에 따라 구분하지 않습니다. 따라서 올바르지 않은 HTML을 만들 수 있지만, 그렇게 해서는 안 됩니다:

```mdx
<h1 className="main">Don’t do this: it’s a `p` in an `h1`</h1>

<h1 className="main">Do this: an `h1` with `code`</h1>
```

텍스트와 태그가 같은 줄에 있으면 블록으로 감쌀 수 없고, 따라서 블록 요소가 생성되지 않습니다. 반면, 텍스트와 태그가 다른 줄에 있으면 블록으로 감쌀 수 있습니다.

```mdx
Welcome! <a href="about.html">

This is home of...

# The Falcons!</a>
```

마크다운을 파싱하기 위해 먼저 이를 "블록"으로 나누어야 합니다. 이 경우 두 개의 단락과 하나의 제목이 있습니다. 첫 번째 단락에 여는 태그가 있고 제목에 닫는 태그가 남아 있게 되면, 이는 잘못된 중첩으로 인해 오류가 발생합니다.

## Prerequisites

필수조건

MDX는 JSX에 의존하므로, 프로젝트에서 JSX를 지원해야 합니다. React, Preact, Vue 등 어떤 JSX 런타임도 사용할 수 있습니다. JSX는 JavaScript로 컴파일되므로, 별도로 설정할 필요는 없습니다.

모든 `@mdx-js/\*` 패키지는 최신 JavaScript로 작성되어 있습니다. 이들을 사용하려면 Node.js 버전 16.0 이상이 필요합니다. 또한, 패키지는 ESM(ES Module) 전용이므로, require가 아닌 **import를 사용**해야 합니다.

<br/>
<br/>
<br/>
<br/>

# Quick start

blog 프로젝트에서 vite 사용

<br/>
<br/>
<br/>
<br/>

## Bundler

MDX는 JavaScript로 컴파일되는 언어입니다. (우리는 일반 마크다운도 JavaScript로 컴파일합니다.) 시작하는 가장 쉬운 방법은 사용 중인 번들러에 대한 통합 도구를 사용하는 것입니다.

<br/>
<br/>
<br/>
<br/>

## Editor

MDX를 편집할 때의 경험을 향상시키기 위해 편집기에 MDX 지원을 추가할 수 있습니다:

if you use VS Code, try `mdx-js/mdx-analyzer`

## Types

우리 패키지는 TypeScript로 타입이 정의되어 있습니다. 타입이 제대로 작동하려면 JSX 네임스페이스도 타입이 정의되어 있어야 합니다. 이는 `@types/react`와 같은 프레임워크의 타입을 설치하고 사용하는 것으로 해결할 수 있습니다.

가져온 `.mdx`, `.md` 등의 파일에 대한 타입을 활성화하려면 `@types/mdx`를 설치하고 사용해야 합니다. 이 패키지는 컴포넌트 속성을 나타내는 `MDXComponents`와 같은 여러 유용한 타입도 내보냅니다. 이를 다음과 같이 가져올 수 있습니다:

### Install

`npm install @types/mdx`

TypeScript should automatically pick it up

```ts
import Post from "./post.mdx"; // `Post` is now typed.
```

<br/>
<br/>
<br/>
<br/>

# Integrations

MDX를 다양한 개발 환경이나 도구와 연결하여 사용할 수 있도록 지원하는 기능이나 패키지를 의미합니다. 예를 들어, 특정 번들러, 프레임워크, 또는 코드 편집기와의 통합을 통해 MDX 파일을 쉽게 처리하고 사용할 수 있도록 돕습니다. 이를 통해 개발자는 MDX를 보다 효율적으로 활용할 수 있습니다.

## Build systems

### Vite

#### Install

-   if you use Rollup (or Vite), install and configure `@mdx-js/rollup`

`npm install @mdx-js/rollup`

우리는 Vite를 지원합니다. Rollup 플러그인 `@mdx-js/rollup`을 설치하고 구성하세요. 사용하는 JSX 런타임(React, Preact, Vue 등)에 따라 설정을 조정해야 합니다.

사용자의 지원 범위보다 더 현대적인 JavaScript 기능을 사용하려면 Vite의 build.target을 구성하세요.

```js
// vite.config.js
import mdx from "@mdx-js/rollup";
import { defineConfig } from "vite";

const viteConfig = defineConfig({
    plugins: [mdx(/* jsxImportSource: …, otherOptions… */)],
});

export default viteConfig;
```

<br/>
<br/>

**CAUTION**

만약 `@vitejs/plugin-react`를 사용하고 있다면, @mdx-js/rollup이 그 이전의 pre 단계에서 실행되도록 강제해야 합니다:

```js
// vite.config.js
// …
const viteConfig = defineConfig({
    plugins: [
        {
            enforce: "pre",
            ...mdx({
                /* jsxImportSource: …, otherOptions… */
            }),
        },
        react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    ],
});
// …
```

> Vite로 초기 프로젝트를 생성했더니, @vitejs/plugin-react가 설치되어 있었다.

<br/>
<br/>
<br/>
<br/>

# Using MDX

<br/>
<br/>
<br/>
<br/>

## How MDX works

An integration compiles MDX syntax to JavaScript. Say we have an MDX document, `example.mdx`:

```mdx
export function Thing() {
    return <>World</>;
}

# Hello <Thing />
```

이는 대략 다음과 같은 JavaScript로 변환됩니다. 아래 내용은 개념을 형성하는 데 도움이 될 수 있습니다:

```js
export function Thing() {
    return <>World</>;
}

export default function MDXContent() {
    return (
        <h1>
            Hello <Thing />
        </h1>
    );
}
```

Some observations:

-   The output은 생성된 JavaScript 코드가 단순히 텍스트 형태로 존재하며, 실제로 실행되기 위해서는 추가적인 평가 과정이 필요하다는 것입니다. (The output is serialized JavaScript that still needs to be evaluated, eval??)
-   JSX가 처리되는 방식을 구성하기 위해 주석이 삽입됩니다.
-   It’s a complete file with import/exports
-   A component (MDXContent) is exported

The actual output is:

```js
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export function Thing() {
    return _jsx(_Fragment, { children: "World" });
}

function \_createMdxContent(props) {
const \_components = {h1: 'h1', ...props.components}
return \_jsxs(\_components.h1, {children: ['Hello ', _jsx(Thing, {})]})
}

export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || {}
  return MDXLayout
    ? _jsx(MDXLayout, {...props, children: _jsx(_createMdxContent, {...props})})
    : _createMdxContent(props)

}
```

Some more observations:

-   JSX는 함수 호출과 React의 import로 컴파일됩니다.
-   콘텐츠 컴포넌트에 `{components: {wrapper: MyLayout}}`를 제공하면 모든 콘텐츠를 감쌀 수 있습니다.
-   콘텐츠 컴포넌트에 `{components: {h1: MyComponent}}`를 제공하면 제목에 다른 컴포넌트를 사용할 수 있습니다.
-   MDX는 React에 결합되어 있지 않습니다. Preact, Vue, Emotion, Theme UI 등과 함께 사용할 수 있습니다. 클래식 및 자동 JSX 런타임 모두 지원됩니다."

<br/>
<br/>
<br/>
<br/>

## MDX content

우리는 MDX 파일이 컴포넌트로 컴파일된다는 것을 방금 보았습니다. 이러한 컴포넌트는 원하는 프레임워크에서 다른 컴포넌트처럼 사용할 수 있습니다. 이 파일을 보세요:

```mdx
# Hi!
```

It could be imported and used in a React app like so:

```jsx
import { createRoot } from "react-dom/client";
import Example from "./example.mdx"; // Assumes an integration is used to compile MDX -> JS.

const container = document.getElementById("root");
if (!container) throw new Error("Expected `root`");
const root = createRoot(container);
root.render(<Example />);
```

It could be imported in the following ways:

```js
// A namespace import to get everything:
import * as everything from "./example.mdx"; // Assumes an integration is used to compile MDX -> JS.
console.log(everything); // {Thing: [Function: Thing], default: [Function: MDXContent]}

// Default export shortcut and a named import specifier:
import Content, { Thing } from "./example.mdx";
console.log(Content); // [Function: MDXContent]
console.log(Thing); // [Function: Thing]

// Import specifier with another local name:
import { Thing as AnotherName } from "./example.mdx";
console.log(AnotherName); // [Function: Thing]
```

<br/>
<br/>
<br/>
<br/>

### props

In What is MDX, we showed that JavaScript expressions, inside curly braces, can be used in MDX:

```mdx
import { year } from "./data.js";
export const name = "world";

# Hello {name.toUpperCase()}

The current year is {year}
```

MDX 내에서 데이터를 가져오거나 정의하는 대신, 데이터를 MDXContent에 전달할 수도 있습니다.

```mdx
# Hello {props.name.toUpperCase()}

The current year is {props.year}
```

Instead of importing or defining data within MDX, data can also be passed to MDXContent. The passed data is called props. Take for example:

```mdx
# Hello {props.name.toUpperCase()}

The current year is {props.year}
```

This file could be used as:

```jsx
import React from "react";
import Example from "./example.mdx"; // Assumes an integration is used to compile MDX -> JS.

// Use a `createElement` call:
console.log(React.createElement(Example, { name: "Venus", year: 2021 }));

// Use JSX:
console.log(<Example name="Mars" year={2022} />);
```

<br/>
<br/>
<br/>
<br/>

### Components

There is one special prop: `components`. It takes an object mapping component names to components. Take this example:

```mdx
# Hello \*<Planet />\*
```

It can be imported from JavaScript and passed components like so:

```js
import Example from "./example.mdx"; // Assumes an integration is used to compile MDX -> JS.

console.log(
    <Example
        components={{
            Planet() {
                return <span style={{ color: "tomato" }}>Pluto</span>;
            },
        }}
    />
);
```

You don’t have to pass components. You can also define or import them within MDX:

```mdx
import { Box, Heading } from "rebass";

MDX using imported components!

<Box>
    <Heading>Here’s a heading</Heading>
</Box>
```

Because MDX files are components, they can also import each other:

```mdx
import License from "./license.md"; // Assumes an integration is used to compile markdown -> JS.
import Contributing from "./docs/contributing.mdx";

# Hello world

<License />

---

<Contributing />
```

Here are some other examples of passing components:

```js
console.log(
    <Example
        components={{
            // Map `h1` (`# heading`) to use `h2`s.
            h1: "h2",
            // Rewrite `em`s (`*like so*`) to `i` with a goldenrod foreground color.
            em(props) {
                return <i style={{ color: "goldenrod" }} {...props} />;
            },
            // Pass a layout (using the special `'wrapper'` key).
            wrapper({ components, ...rest }) {
                return <main {...rest} />;
            },
            // Pass a component.
            Planet() {
                return "Neptune";
            },
            // This nested component can be used as `<theme.text>hi</theme.text>`
            theme: {
                text(props) {
                    return <span style={{ color: "grey" }} {...props} />;
                },
            },
        }}
    />
);
```

The following keys can be passed in `components`:

-   HTML 대체물: Markdown으로 작성한 것의 HTML 동등물로, 예를 들어 # 헤딩은 h1로 변환됩니다 (예제는 § Table of components에서 확인할 수 있습니다).

-   wrapper: 레이아웃을 정의. (그러나 로컬 레이아웃이 우선적으로 적용됩니다.)

-   기타 JSX 식별자: JSX로 작성한 것에 해당하는 유효한 식별자 (예: foo, Quote, custom-element, \_, $x, a1)를 포함합니다. 이는 `<So />` 또는 `<like.so />`와 같은 컴포넌트를 의미하며, 로컬에서 정의된 컴포넌트가 우선적으로 적용됩니다.

이름이 JSX에서 리터럴 태그 이름인지 아닌지를 판단하는 규칙은 다음과 같습니다:

-   점(.)이 있는 경우: 이는 member expression로 간주됩니다 (`<a.b> → h(a.b)`), 즉 객체 `a`에서 키 `b`를 참조하는 것을 의미합니다.

-   유효한 JS 식별자가 아닌 경우: 이 경우 리터럴로 간주됩니다 (`<a-b> → h('a-b')`).

-   소문자로 시작하는 경우: 리터럴로 간주됩니다 (`<a> → h('a')`).

-   그 외의 경우: 참조로 간주됩니다 (`<A> → h(A)`).

These keys in `components` and the difference between literal tag names and references is illustrated as follows. With the following MDX:

컴포넌트에서 이러한 키와 리터럴 태그 이름과 참조 간의 차이는 다음과 같이 설명됩니다. 아래의 MDX를 사용하여 예시를 보여줍니다:

```mdx
-   [markdown syntax](#alpha)
-   <a href="#bravo">JSX with a lowercase name</a>
-   <Link to="#charlie">JSX with a capitalized name</Link>
```

…passed some components:

```js
import Example from "./example.mdx";

console.log(
    <Example
        components={{
            a(props) {
                return <a {...props} style={{ borderTop: "1px dotted", color: "violet" }} />;
            },
            Link(props) {
                return (
                    <a href={props.to} children={props.children} style={{ borderTop: "1px dashed", color: "tomato" }} />
                );
            },
        }}
    />
);
```

-   첫 번째 링크 (`#alpha`)는 점(.)이 있고 보라색입니다. 이는 a가 사용된 Markdown 구문에 대한 HTML 동등물이라는 의미입니다.
-   두 번째 링크 (`#bravo`)는 변경되지 않았습니다. 이는 JSX 구문에서 a가 리터럴 태그 이름으로 간주되기 때문입니다.
-   세 번째 링크 (`#charlie`)는 대시가 있고 토마토색입니다. 이는 JSX 구문에서 Link가 참조로 해석되기 때문입니다.

<br/>
<br/>
<br/>
<br/>

### Layout

There is one special component: the layout. If it is defined, it’s used to wrap all content. A layout can be defined from within MDX using a default export:

```mdx
export default function Layout({ children }) {
    return <main>{children}</main>;
}

All the things.
```

The layout can also be imported and then exported with an `export … from`:

```mdx
export { Layout as default } from "./components.js";

;
```

레이아웃은 `components.wrapper`로 전달될 수도 있습니다(하지만 로컬 레이아웃이 우선적으로 적용됩니다).

<br/>
<br/>
<br/>
<br/>

## MDX provider

You probably don’t need a provider. 컴포넌트를 전달하는 것으로 충분한 경우가 많습니다. Providers often only add extra weight.

```mdx
# Hello world
```

Used like so:

```js
import { createRoot } from "react-dom/client";
import { Heading, /* … */ Table } from "./components.js";
import Post from "./post.mdx"; // Assumes an integration is used to compile MDX -> JS.

const components = {
    h1: Heading.H1,
    // …
    table: Table,
};

const container = document.getElementById("root");
if (!container) throw new Error("Expected `root`");
const root = createRoot(container);
root.render(<Post components={components} />);
```

그렇게 하면 잘 작동하며, 해당 컴포넌트들이 사용됩니다.

하지만 MDX 파일을 중첩해서(importing) 사용할 때는 번거로울 수 있습니다. 예를 들어:

```mdx
import License from "./license.md"; // Assumes an integration is used to compile markdown -> JS.
import Contributing from "./docs/contributing.mdx";

# Hello world

<License components={props.components} />

---

<Contributing components={props.components} />
```

이를 해결하기 위해, React, Preact, 및 Vue에서 `컨텍스트`를 사용할 수 있습니다.

-   사용 중인 프레임워크에 따라 @mdx-js/react, @mdx-js/preact, 또는 @mdx-js/vue 중 하나를 설치합니다.

-   ProcessorOptions의 providerImportSource를 해당 패키지로 설정하여 MDX 통합을 구성합니다. 즉, '@mdx-js/react', '@mdx-js/preact', 또는 '@mdx-js/vue' 중 하나를 사용합니다.

-   해당 패키지에서 MDXProvider를 가져옵니다. 이를 사용하여 최상위 MDX 콘텐츠 컴포넌트를 감싸고, 컴포넌트를 전달합니다.

```diff
+import {MDXProvider} from '@mdx-js/react'
 import {createRoot} from 'react-dom/client'
 import {Heading, /* … */ Table} from './components/index.js'
 import Post from './post.mdx' // Assumes an integration is used to compile MDX -> JS.
@@ -13,4 +14,8 @@ const components = {

 const container = document.getElementById('root')
 if (!container) throw new Error('Expected `root`')
 const root = createRoot(container)
-root.render(<Post components={components} />)
+root.render(
+  <MDXProvider components={components}>
+    <Post />
+  </MDXProvider>
+)
```

이제 명시적이고 장황한 컴포넌트 전달을 제거할 수 있습니다.

```diff
 import License from './license.md' // Assumes an integration is used to compile markdown -> JS.
 import Contributing from './docs/contributing.mdx'

 # Hello world

-<License components={props.components} />
+<License />

 ---

-<Contributing components={props.components} />
+<Contributing />
```

MDXProvider가 중첩되면 그 컴포넌트들이 병합됩니다. 다음 예제를 보세요:

```js
<MDXProvider components={{ h1: Component1, h2: Component2 }}>
    <MDXProvider components={{ h2: Component3, h3: Component4 }}>
        <Content />
    </MDXProvider>
</MDXProvider>
```

이로 인해 `h1`은 `Component1`을 사용하고, `h2`는 `Component3`, `h3`는 `Component4`를 사용하게 됩니다.

다르게 병합하거나 전혀 병합하지 않으려면, components에 함수를 전달합니다. 이 함수는 현재 컨텍스트의 컴포넌트를 받으며, 반환된 값이 대신 사용됩니다. 이 예제에서는 현재 컨텍스트의 컴포넌트가 버려집니다.

이로 인해 `h2`는 `Component3`을 사용하고, `h3`는 `Component4`를 사용하게 됩니다. `h1`에는 어떤 컴포넌트도 사용되지 않습니다.

MDX 파일을 중첩하지 않거나 자주 중첩하지 않는 경우에는 프로바이더를 사용하지 말고 컴포넌트를 명시적으로 전달하세요.


