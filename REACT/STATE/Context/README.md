# Context

보통 부모 컴포넌트에서 자식 컴포넌트로 정보를 전달할 때 props를 사용합니다. 하지만 여러 중간 컴포넌트를 통해 props를 전달해야 하거나, 앱의 여러 컴포넌트가 동일한 정보를 필요로 할 경우 props 전달이 장황하고 불편해질 수 있습니다. 이때 `Context`를 사용하면 부모 컴포넌트가 트리 아래의 모든 컴포넌트에 정보를 명시적으로 props로 전달하지 않고도 제공할 수 있게 됩니다—트리의 깊이에 상관없이 말입니다.

<br/>
<br/>
<br/>
<br/>

## The problem with passing props

props를 전달하는 것은 UI 트리에서 데이터를 명시적으로 연결하여 사용하는 컴포넌트로 전달하는 좋은 방법입니다.

하지만 props를 깊은 트리를 통해 전달해야 하거나, 여러 컴포넌트가 동일한 props를 필요로 할 경우, props 전달이 장황하고 불편해질 수 있습니다. 필요한 데이터를 요구하는 컴포넌트와 가장 가까운 공통 조상이 멀리 떨어져 있을 수 있으며, lifting state up는 **"prop drilling"**이라는 상황을 초래할 수 있습니다.

![이미지](/Img/React/State/context_01.png)

"props"를 전달하지 않고도 트리 내에서 필요한 컴포넌트로 데이터를 "텔레포트"할 수 있는 방법이 있다면 좋지 않을까요? React의 `Context` 기능이 바로 그런 방법을 제공합니다!

<br/>
<br/>
<br/>
<br/>

## Context: an alternative to passing props

`Context`는 부모 컴포넌트가 그 아래의 전체 트리에 데이터를 제공할 수 있게 해줍니다. `Context`의 사용 용도는 다양합니다. 다음은 그 예시입니다. 크기를 위한 레벨을 받아들이는 이 Heading 컴포넌트를 고려해 보세요:

```js
function Heading({ level, children }) {
    switch (level) {
        case 1:
            return <h1>{children}</h1>;
        case 2:
            return <h2>{children}</h2>;
        case 3:
            return <h3>{children}</h3>;
        case 4:
            return <h4>{children}</h4>;
        case 5:
            return <h5>{children}</h5>;
        case 6:
            return <h6>{children}</h6>;
        default:
            throw Error("Unknown level: " + level);
    }
}

function Section({ children }) {
    return <section className="section">{children}</section>;
}

export default function Page() {
    return (
        <Section>
            <Heading level={1}>Title</Heading>
            <Heading level={2}>Heading</Heading>
            <Heading level={3}>Sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={5}>Sub-sub-sub-heading</Heading>
            <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
        </Section>
    );
}
```

같은 `Section` 내에서 여러 개의 `Heading`이 항상 동일한 크기를 가지도록 하길 원한다고 가정해 보겠습니다.

```js
function Heading({ level, children }) {
    switch (level) {
        case 1:
            return <h1>{children}</h1>;
        case 2:
            return <h2>{children}</h2>;
        case 3:
            return <h3>{children}</h3>;
        case 4:
            return <h4>{children}</h4>;
        case 5:
            return <h5>{children}</h5>;
        case 6:
            return <h6>{children}</h6>;
        default:
            throw Error("Unknown level: " + level);
    }
}

function Section({ children }) {
    return <section className="section">{children}</section>;
}

export default function Page() {
    return (
        <Section>
            <Heading level={1}>Title</Heading>
            <Section>
                <Heading level={2}>Heading</Heading>
                <Heading level={2}>Heading</Heading>
                <Heading level={2}>Heading</Heading>
                <Section>
                    <Heading level={3}>Sub-heading</Heading>
                    <Heading level={3}>Sub-heading</Heading>
                    <Heading level={3}>Sub-heading</Heading>
                    <Section>
                        <Heading level={4}>Sub-sub-heading</Heading>
                        <Heading level={4}>Sub-sub-heading</Heading>
                        <Heading level={4}>Sub-sub-heading</Heading>
                    </Section>
                </Section>
            </Section>
        </Section>
    );
}
```

현재는 각 `<Heading>`에 레벨 prop을 개별적으로 전달하고 있습니다.

```js
<Section>
    <Heading level={3}>About</Heading>
    <Heading level={3}>Photos</Heading>
    <Heading level={3}>Videos</Heading>
</Section>
```

레벨 prop을 `<Heading>`에서 제거하고 대신 `<Section>` 컴포넌트에 전달할 수 있다면 좋을 것입니다. 이렇게 하면 같은 섹션 내의 모든 `Heading`이 동일한 크기를 갖도록 강제할 수 있습니다.

```js
<Section level={3}>
    <Heading>About</Heading>
    <Heading>Photos</Heading>
    <Heading>Videos</Heading>
</Section>
```

하지만 `<Heading>` 컴포넌트가 가장 가까운 `<Section>`의 레벨을 어떻게 알 수 있을까요? 이는 자식이 트리의 위쪽에 있는 데이터에 “요청”할 수 있는 방법이 필요합니다.

단순히 props로는 해결할 수 없습니다. 여기서 `context`가 등장합니다. 이 작업은 세 단계로 진행됩니다:

1. **Create** a context. (You can call it LevelContext, since it’s for the heading level.)
2. **Use** that context from the component that needs the data. (Heading will use LevelContext.)
3. **Provide** that context from the component that specifies the data. (Section will provide LevelContext.)

`Context`는 부모 컴포넌트—심지어 먼 부모 컴포넌트도!—가 그 안의 전체 트리에 데이터를 제공할 수 있게 해줍니다.

![이미지](/Img/React/State/context_02.png)

<br/>
<br/>
<br/>
<br/>

### Step 1: Create the context

First, you need to create the context. You’ll need to export it from a file so that your components can use it:

```js
import { createContext } from "react";

const LevelContext = createContext(1);

// Heading.js
function Heading({ level, children }) {
    switch (level) {
        case 1:
            return <h1>{children}</h1>;
        case 2:
            return <h2>{children}</h2>;
        case 3:
            return <h3>{children}</h3>;
        case 4:
            return <h4>{children}</h4>;
        case 5:
            return <h5>{children}</h5>;
        case 6:
            return <h6>{children}</h6>;
        default:
            throw Error("Unknown level: " + level);
    }
}

// Section.js
function Section({ children }) {
    return <section className="section">{children}</section>;
}

export default function Page() {
    return (
        <Section>
            <Heading level={1}>Title</Heading>
            <Section>
                <Heading level={2}>Heading</Heading>
                <Heading level={2}>Heading</Heading>
                <Heading level={2}>Heading</Heading>
                <Section>
                    <Heading level={3}>Sub-heading</Heading>
                    <Heading level={3}>Sub-heading</Heading>
                    <Heading level={3}>Sub-heading</Heading>
                    <Section>
                        <Heading level={4}>Sub-sub-heading</Heading>
                        <Heading level={4}>Sub-sub-heading</Heading>
                        <Heading level={4}>Sub-sub-heading</Heading>
                    </Section>
                </Section>
            </Section>
        </Section>
    );
}
```

The only argument to createContext is the default value. 여기서 1은 가장 큰 헤딩 레벨을 나타내지만, 어떤 종류의 값(심지어 객체)도 전달할 수 있습니다. 기본값의 중요성은 다음 단계에서 볼 수 있습니다.

<br/>
<br/>
<br/>
<br/>

### Step 2: Use the context

Import the `useContext` Hook from React and your context:

```js
import { useContext } from "react";
import { LevelContext } from "./LevelContext.js";
```

Currently, the Heading component reads `level` from props:

```js
export default function Heading({ level, children }) {
    // ...
}
```

Instead, remove the `level` prop and read the value from the context you just imported, LevelContext:

```js
export default function Heading({ children }) {
    const level = useContext(LevelContext);
    // ...
}
```

`useContext` is a Hook. `useState`와 `useReducer`처럼, React 컴포넌트 내부에서만 즉시 호출할 수 있으며(루프나 조건문 안에서는 호출할 수 없습니다), `useContext`는 `<Heading>` 컴포넌트가 `LevelContext`를 읽고 싶다는 것을 React에 알립니다.

이제 `<Heading>` 컴포넌트에 레벨 prop이 없으므로, 더 이상 JSX에서 이렇게 레벨 prop을 `<Heading>`에 전달할 필요가 없습니다:

```js
<Section>
    <Heading level={4}>Sub-sub-heading</Heading>
    <Heading level={4}>Sub-sub-heading</Heading>
    <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

Update the JSX so that it’s the `Section` that receives it instead:

```js
<Section level={4}>
    <Heading>Sub-sub-heading</Heading>
    <Heading>Sub-sub-heading</Heading>
    <Heading>Sub-sub-heading</Heading>
</Section>
```

참고로, 당신이 작동시키고자 했던 마크업은 다음과 같습니다:

```js
import { useContext } from 'react';
import { createContext } from 'react';

const LevelContext = createContext(1);

// Heading.js
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}


// Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}

export default function Page() {
    return (
        <Section level={1}>
            <Heading>Title</Heading>
            <Section level={2}>
                <Heading>Heading</Heading>
                <Heading>Heading</Heading>
                <Heading>Heading</Heading>
                <Section level={3}>
                    <Heading>Sub-heading</Heading>
                    <Heading>Sub-heading</Heading>
                    <Heading>Sub-heading</Heading>
                    <Section level={4}>
                        <Heading>Sub-sub-heading</Heading>
                        <Heading>Sub-sub-heading</Heading>
                        <Heading>Sub-sub-heading</Heading>
                    </Section>
                </Section>
            </Section>
        </Section>
    );
}
```

이 예제가 아직 완전히 동작하지 않는다. 모든 `헤딩`이 동일한 크기를 갖는 이유는 컨텍스트를 사용하고 있지만, 아직 제공하지 않았기 때문입니다. React는 어디서 가져와야 할지 모릅니다!

컨텍스트를 제공하지 않으면, React는 이전 단계에서 지정한 기본값을 사용합니다. 이 예제에서는 `createContext`에 1을 인자로 지정했기 때문에, `useContext`(LevelContext)는 `1`을 반환하여 모든 헤딩을 `<h1>`으로 설정합니다. 이 문제를 해결하기 위해 각 섹션이 자신의 컨텍스트를 제공하도록 하겠습니다.

<br/>
<br/>
<br/>
<br/>

### Step 3: Provide the context

The `Section` component currently renders its children:

```js
export default function Section({ children }) {
    return <section className="section">{children}</section>;
}
```

**Wrap them with a context provider** to provide the **LevelContext** to them:

```js
import { LevelContext } from "./LevelContext.js";

export default function Section({ level, children }) {
    return (
        <section className="section">
            <LevelContext.Provider value={level}>{children}</LevelContext.Provider>
        </section>
    );
}
```

<br/>
<br/>
<br/>
<br/>

React에게 "이 **`<Section>` 내부의 어떤 컴포넌트가 `LevelContext`를 요청하면, 이 레벨을 제공하라"고 말하는 것입니다.** 컴포넌트는 UI 트리 위쪽에 있는 가장 가까운 `<LevelContext.Provider>`의 값을 사용하게 됩니다.

```js
import { createContext } from 'react';
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export const LevelContext = createContext(1);

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}

import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}


export default function Page() {
    return (
        <Section level={1}>
            <Heading>Title</Heading>
            <Section level={2}>
                <Heading>Heading</Heading>
                <Heading>Heading</Heading>
                <Heading>Heading</Heading>
                <Section level={3}>
                    <Heading>Sub-heading</Heading>
                    <Heading>Sub-heading</Heading>
                    <Heading>Sub-heading</Heading>
                    <Section level={4}>
                        <Heading>Sub-sub-heading</Heading>
                        <Heading>Sub-sub-heading</Heading>
                        <Heading>Sub-sub-heading</Heading>
                    </Section>
                </Section>
            </Section>
        </Section>
    );
}
```

원래 코드와 같은 결과이지만, 각 `<Heading>` 컴포넌트에 레벨 prop을 전달할 필요가 없습니다! 대신, 가장 가까운 `<Section>`에 요청하여 헤딩 레벨을 "파악"합니다.

1. You pass a `level` prop to the `<Section>`.
2. `Section` wraps its children into `<LevelContext.Provider value={level}>`.
3. `Heading` asks the closest value of `LevelContext` above with `useContext(LevelContext)`.

<br/>
<br/>
<br/>
<br/>

## Using and providing context from the same component

현재 각 섹션의 `level`을 여전히 수동으로 지정해야 합니다.

```
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

컨텍스트를 사용하면 위쪽 컴포넌트에서 정보를 읽을 수 있으므로, 각 `<Section>`은 위의 `<Section>`에서 레벨을 읽고 자동으로 레벨 + 1을 아래로 전달할 수 있습니다. 다음은 이를 구현하는 방법입니다:

```js
import { useContext } from "react";
import { LevelContext } from "./LevelContext.js";

export default function Section({ children }) {
    const level = useContext(LevelContext);
    return (
        <section className="section">
            <LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider>
        </section>
    );
}
```

이 변경으로 인해 `<Section>`이나 `<Heading>`에 `level` prop을 전달할 필요도 없습니다.

```js
import { createContext } from "react";

export const LevelContext = createContext(0);

import { useContext } from "react";
import { LevelContext } from "./LevelContext.js";

export default function Heading({ children }) {
    const level = useContext(LevelContext);
    switch (level) {
        case 0:
            throw Error("Heading must be inside a Section!");
        case 1:
            return <h1>{children}</h1>;
        case 2:
            return <h2>{children}</h2>;
        case 3:
            return <h3>{children}</h3>;
        case 4:
            return <h4>{children}</h4>;
        case 5:
            return <h5>{children}</h5>;
        case 6:
            return <h6>{children}</h6>;
        default:
            throw Error("Unknown level: " + level);
    }
}

import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}

import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

`<Heading>`과 `<Section>` 모두 `LevelContext`를 읽어 자신이 얼마나 "깊이" 있는지를 파악합니다. 그리고 `<Section>`은 자신의 자식 컴포넌트를 `LevelContext`로 감싸서 그 안에 있는 모든 것이 "더 깊은" 레벨에 있음을 지정합니다.

<br/>
<br/>

**NOTE**

이 예제는 `헤딩 레벨`을 사용하여 중첩된 컴포넌트가 어떻게 컨텍스트를 오버라이드할 수 있는지를 시각적으로 보여줍니다. 하지만 컨텍스트는 많은 다른 용도에서도 유용합니다. 전체 서브트리에서 필요한 정보(현재 색상 테마, 현재 로그인한 사용자 등)를 전달할 수 있습니다.

<br/>
<br/>
<br/>
<br/>

## Context passes through intermediate components

컨텍스트를 제공하는 컴포넌트와 이를 사용하는 컴포넌트 사이에 원하는 만큼 많은 컴포넌트를 삽입할 수 있습니다. 여기에는 `<div>`와 같은 내장 컴포넌트와 사용자가 직접 만든 컴포넌트도 포함됩니다.

이 예제에서는 같은 `<Post>` 컴포넌트(점선 테두리가 있는)가 두 개의 다른 중첩 레벨에서 렌더링됩니다. 그 안에 있는 `<Heading>`은 가장 가까운 `<Section>`에서 자동으로 레벨을 가져오는 것을 주목하세요.

```js
import { createContext } from "react";

export const LevelContext = createContext(0);

import { useContext } from "react";
import { LevelContext } from "./LevelContext.js";

export default function Heading({ children }) {
    const level = useContext(LevelContext);
    switch (level) {
        case 0:
            throw Error("Heading must be inside a Section!");
        case 1:
            return <h1>{children}</h1>;
        case 2:
            return <h2>{children}</h2>;
        case 3:
            return <h3>{children}</h3>;
        case 4:
            return <h4>{children}</h4>;
        case 5:
            return <h5>{children}</h5>;
        case 6:
            return <h6>{children}</h6>;
        default:
            throw Error("Unknown level: " + level);
    }
}

import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}

import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

이를 작동시키기 위해 특별한 작업을 할 필요는 없습니다. `<Section>`은 그 안의 트리를 위한 컨텍스트를 지정하므로, `<Heading>`을 어디에든 삽입할 수 있으며, 올바른 크기를 가집니다.

컨텍스트는 컴포넌트가 "주변에 적응"하고, 렌더링되는 위치(즉, 어떤 컨텍스트에서) 에 따라 다르게 표시되도록 작성할 수 있게 해줍니다.

컨텍스트의 작동 방식은 CSS 속성 상속을 떠올리게 할 수 있습니다. CSS에서는 `<div>`에 `color: blue`를 지정하면, 그 안에 있는 모든 DOM 노드가 얼마나 깊이 있든지 상관없이 그 색상을 상속받습니다. 중간에 있는 다른 DOM 노드가 `color: green`으로 오버라이드하지 않는 한 말이죠. 마찬가지로, React에서 위쪽에서 오는 컨텍스트를 오버라이드하는 유일한 방법은 자식을 다른 값의 컨텍스트 프로바이더로 감싸는 것입니다.

CSS에서는 색상과 배경색과 같은 서로 다른 속성이 서로를 오버라이드하지 않습니다. 모든 `<div>`의 색상을 빨간색으로 설정해도 배경색에는 영향을 주지 않습니다. 마찬가지로, 서로 다른 React 컨텍스트는 서로를 오버라이드하지 않습니다. `createContext()`로 만든 각 컨텍스트는 다른 컨텍스트와 완전히 독립적이며, 해당 특정 컨텍스트를 사용하는 컴포넌트들을 연결합니다. 한 컴포넌트는 여러 다른 컨텍스트를 문제없이 사용하거나 제공할 수 있습니다.

<br/>
<br/>
<br/>
<br/>

## Before you use context

컨텍스트는 사용하기 매우 매력적입니다! 하지만 이는 과도하게 사용할 위험도 있습니다. 몇 개의 props를 여러 레벨 깊이로 전달해야 한다고 해서 그 정보를 컨텍스트에 넣어야 한다는 의미는 아닙니다.

컨텍스트를 사용하기 전에 고려해야 할 몇 가지 대안은 다음과 같습니다:

1. **Start by passing props.** 컴포넌트가 간단하지 않다면, 열 개의 컴포넌트를 통해 열 개의 props를 전달하는 것은 드문 일이 아닙니다. 번거롭게 느껴질 수 있지만, 어떤 컴포넌트가 어떤 데이터를 사용하는지 매우 명확하게 해줍니다! 코드를 유지보수하는 사람은 props를 통해 데이터 흐름을 명시적으로 만든 것에 감사할 것입니다.

2. **Extract components and pass JSX as children to them.** 데이터가 없는 중간 컴포넌트를 통해 여러 레이어로 전달하는 경우, 이는 종종 일부 컴포넌트를 추출하는 것을 잊었음을 의미합니다. 예를 들어, 데이터 props인 `posts`를 직접 사용하지 않는 시각적 컴포넌트에 전달하는 경우가 있습니다. 대신, `Layout` 컴포넌트가 자식을 prop으로 받아서 `<Layout><Posts posts={posts} /></Layout>`와 같이 렌더링하도록 만드세요. 이렇게 하면 데이터를 지정하는 컴포넌트와 그것이 필요한 컴포넌트 간의 레이어 수가 줄어듭니다.

이 두 가지 방법이 잘 작동하지 않는다면, 컨텍스트를 고려하세요.

<br/>
<br/>
<br/>
<br/>

## Use cases for context

-   **Theming**: If your app lets the user change its appearance (e.g. dark mode), you can put a context provider at the top of your app, and use that context in components that need to adjust their visual look.
-   **Current account**: 많은 컴포넌트가 현재 로그인한 사용자에 대한 정보를 알아야 할 수 있습니다. 이를 컨텍스트에 저장하면 트리의 어디에서나 읽기 편리합니다. 일부 앱은 여러 계정을 동시에 사용할 수 있게 하기도 합니다(예: 다른 사용자로 댓글을 남기기). 이런 경우에는 UI의 일부를 다른 현재 계정 값을 가진 중첩 프로바이더로 감싸는 것이 유용할 수 있습니다.
-   **Routing**: 대부분의 라우팅 솔루션은 현재 경로를 저장하기 위해 내부적으로 컨텍스트를 사용합니다. 이 방식 덕분에 모든 링크가 "활성"인지 아닌지를 알 수 있습니다. 자체 라우터를 구축할 경우, 이와 같은 방식으로 구현할 수 있습니다.
-   **Managing state**: 앱이 성장함에 따라, 앱의 상단에 많은 state가 몰릴 수 있습니다. 그 아래의 먼 컴포넌트들이 이를 변경하고 싶어할 수 있습니다. 복잡한 state를 관리하고 이를 먼 컴포넌트에 전달하기 위해 **컨텍스트와 함께 리듀서를 사용**하는 것이 일반적입니다.

컨텍스트는 정적 값에만 국한되지 않습니다. **다음 렌더링에서 다른 값을 전달하면, React는 그 아래에서 읽고 있는 모든 컴포넌트를 업데이트합니다!** 이 때문에 컨텍스트는 종종 state와 함께 사용됩니다.

일반적으로, 트리의 서로 다른 부분에 있는 먼 컴포넌트가 어떤 정보를 필요로 한다면, 이는 컨텍스트가 도움이 될 것이라는 좋은 지표입니다.

# Scaling Up with Reducer and Context

Reducers let you consolidate a component’s state update logic.

Context lets you pass information deep down to other components.

You can combine reducers and context together to manage state of a complex screen.

## Combining a reducer with context

In this example from the introduction to reducers, the state is managed by a reducer. The reducer function contains all of the state update logic and is declared at the bottom of this file:

```js
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}



import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}

import { useReducer } from "react";
import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";

export default function TaskApp() {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

    function handleAddTask(text) {
        dispatch({
            type: "added",
            id: nextId++,
            text: text,
        });
    }

    function handleChangeTask(task) {
        dispatch({
            type: "changed",
            task: task,
        });
    }

    function handleDeleteTask(taskId) {
        dispatch({
            type: "deleted",
            id: taskId,
        });
    }

    return (
        <>
            <h1>Day off in Kyoto</h1>
            <AddTask onAddTask={handleAddTask} />
            <TaskList tasks={tasks} onChangeTask={handleChangeTask} onDeleteTask={handleDeleteTask} />
        </>
    );
}

function tasksReducer(tasks, action) {
    switch (action.type) {
        case "added": {
            return [
                ...tasks,
                {
                    id: action.id,
                    text: action.text,
                    done: false,
                },
            ];
        }
        case "changed": {
            return tasks.map((t) => {
                if (t.id === action.task.id) {
                    return action.task;
                } else {
                    return t;
                }
            });
        }
        case "deleted": {
            return tasks.filter((t) => t.id !== action.id);
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}

let nextId = 3;
const initialTasks = [
    { id: 0, text: "Philosopher’s Path", done: true },
    { id: 1, text: "Visit the temple", done: false },
    { id: 2, text: "Drink matcha", done: false },
];
```

리듀서는 이벤트 핸들러를 짧고 간결하게 유지하는 데 도움을 줍니다. 그러나 앱이 성장함에 따라 또 다른 어려움에 부딪힐 수 있습니다. 현재 `tasks` state와 `dispatch` 함수는 최상위 `TaskApp` 컴포넌트에서만 사용할 수 있습니다. 다른 컴포넌트가 작업 목록을 읽거나 변경할 수 있도록 하려면, 현재 state와 이를 변경하는 이벤트 핸들러를 props로 명시적으로 전달해야 합니다.

예를 들어, `TaskApp`은 작업 목록과 이벤트 핸들러를 `TaskList`에 전달합니다.

```js
<TaskList tasks={tasks} onChangeTask={handleChangeTask} onDeleteTask={handleDeleteTask} />
```

And `TaskList` passes the event handlers to `Task`:

```js
<Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
```

In a small example like this, this works well, but 중간에 수십 개 또는 수백 개의 컴포넌트가 있을 경우, 모든 상태와 함수를 전달하는 것은 꽤 번거로울 수 있습니다!

그래서 props를 통해 전달하는 대신, `tasks` state와 `dispatch` 함수를 컨텍스트에 넣는 것을 고려할 수 있습니다. 이렇게 하면 `TaskApp` 아래의 모든 컴포넌트가 반복적인 "prop drilling" 없이도 `tasks`를 읽고 액션을 dispatch할 수 있습니다.

Here is how you can combine a reducer with context:

### Step 1: Create the context

The `useReducer` Hook returns the current `tasks` and the dispatch function that lets you update them:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

트리 아래로 전달하기 위해, 두 개의 별도의 컨텍스트를 생성합니다:

-   `TasksContext`: 현재 작업 목록을 제공합니다.
-   `TasksDispatchContext`: 컴포넌트가 액션을 dispatch할 수 있게 해주는 함수를 제공합니다.

```js
import { createContext } from "react";

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

여기에서는 두 컨텍스트 모두에 기본값으로 `null`을 전달하고 있습니다. 실제 값은 `TaskApp` 컴포넌트에서 제공될 것입니다.

<br/>
<br/>
<br/>
<br/>

### Step 2: Put state and dispatch into context

이제 `TaskApp` 컴포넌트에서 두 컨텍스트를 가져올 수 있습니다. `useReducer()`에서 반환된 `tasks`와 `dispatch`를 사용하여 아래의 전체 트리에 제공하면 됩니다.

```js
import { TasksContext, TasksDispatchContext } from "./TasksContext.js";

export default function TaskApp() {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
    // ...
    return (
        <TasksContext.Provider value={tasks}>
            <TasksDispatchContext.Provider value={dispatch}>...</TasksDispatchContext.Provider>
        </TasksContext.Provider>
    );
}
```

현재는 state를 props와 컨텍스트를 통해 모두 전달하고 있습니다.

```js
import { useReducer } from "react";
import { useState } from 'react';
import { createContext } from "react";

import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}



export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}


export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export default function TaskApp() {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

    function handleAddTask(text) {
        dispatch({
            type: "added",
            id: nextId++,
            text: text,
        });
    }

    function handleChangeTask(task) {
        dispatch({
            type: "changed",
            task: task,
        });
    }

    function handleDeleteTask(taskId) {
        dispatch({
            type: "deleted",
            id: taskId,
        });
    }

    return (
        <TasksContext.Provider value={tasks}>
            <TasksDispatchContext.Provider value={dispatch}>
                <h1>Day off in Kyoto</h1>
                <AddTask onAddTask={handleAddTask} />
                <TaskList tasks={tasks} onChangeTask={handleChangeTask} onDeleteTask={handleDeleteTask} />
            </TasksDispatchContext.Provider>
        </TasksContext.Provider>
    );
}

function tasksReducer(tasks, action) {
    switch (action.type) {
        case "added": {
            return [
                ...tasks,
                {
                    id: action.id,
                    text: action.text,
                    done: false,
                },
            ];
        }
        case "changed": {
            return tasks.map((t) => {
                if (t.id === action.task.id) {
                    return action.task;
                } else {
                    return t;
                }
            });
        }
        case "deleted": {
            return tasks.filter((t) => t.id !== action.id);
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}

let nextId = 3;
const initialTasks = [
    { id: 0, text: "Philosopher’s Path", done: true },
    { id: 1, text: "Visit the temple", done: false },
    { id: 2, text: "Drink matcha", done: false },
];
```

<br/>
<br/>
<br/>
<br/>

### Step 3: Use context anywhere in the tree

이제 작업 목록이나 이벤트 핸들러를 트리 아래로 전달할 필요가 없습니다.

```js
<TasksContext.Provider value={tasks}>
    <TasksDispatchContext.Provider value={dispatch}>
        <h1>Day off in Kyoto</h1>
        <AddTask />
        <TaskList />
    </TasksDispatchContext.Provider>
</TasksContext.Provider>
```

대신, 작업 목록이 필요한 모든 컴포넌트는 `TaskContext`에서 이를 읽을 수 있습니다.

```js
export default function TaskList() {
    const tasks = useContext(TasksContext);
    // ...
}
```

To update the task list, any component can read the `dispatch` function from context and call it:

```js
export default function AddTask() {
    const [text, setText] = useState("");
    const dispatch = useContext(TasksDispatchContext);
    // ...
    return (
        // ...
        <button
            onClick={() => {
                setText("");
                dispatch({
                    type: "added",
                    id: nextId++,
                    text: text,
                });
            }}
        >
            Add
        </button>
        // ...
    );
}
```

`TaskApp `컴포넌트는 어떤 이벤트 핸들러도 아래로 전달하지 않고, `TaskList`도 `Task` 컴포넌트에 이벤트 핸들러를 전달하지 않습니다. 각 컴포넌트는 필요한 컨텍스트를 읽습니다.

state는 여전히 최상위 `TaskApp` 컴포넌트에 "존재"하며, `useReducer`를 통해 관리됩니다. 그러나 이제 `tasks`와 `dispatch`는 이 컨텍스트를 가져오고 사용함으로써 트리 아래의 모든 컴포넌트에서 접근할 수 있습니다.

<br/>
<br/>
<br/>
<br/>

## Moving all wiring into a single file

모든 설정을 하나의 파일로 이동하기

이 작업은 필수는 아니지만, reducer와 context를 하나의 파일로 이동함으로써 컴포넌트를 더 깔끔하게 만들 수 있습니다. 현재 `TasksContext.js`에는 두 개의 컨텍스트 선언만 포함되어 있습니다.

```js
import { createContext } from "react";

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

This file is about to get crowded! reducer를 같은 파일로 이동시키고, 새로 `TasksProvider` 컴포넌트를 선언할 것입니다. 이 컴포넌트는 모든 요소를 연결합니다:

-   reducer로 상태를 관리합니다.
-   두 개의 컨텍스트를 아래의 컴포넌트에 제공합니다.
-   `children`을 props로 받아 JSX를 전달할 수 있게 합니다.

```js
export function TasksProvider({ children }) {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

    return (
        <TasksContext.Provider value={tasks}>
            <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
        </TasksContext.Provider>
    );
}
```

This removes all the complexity and wiring from your `TaskApp` component:

```js
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}

import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;


import { createContext, useReducer } from "react";

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

    return (
        <TasksContext.Provider value={tasks}>
            <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
        </TasksContext.Provider>
    );
}

function tasksReducer(tasks, action) {
    switch (action.type) {
        case "added": {
            return [
                ...tasks,
                {
                    id: action.id,
                    text: action.text,
                    done: false,
                },
            ];
        }
        case "changed": {
            return tasks.map((t) => {
                if (t.id === action.task.id) {
                    return action.task;
                } else {
                    return t;
                }
            });
        }
        case "deleted": {
            return tasks.filter((t) => t.id !== action.id);
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}

const initialTasks = [
    { id: 0, text: "Philosopher’s Path", done: true },
    { id: 1, text: "Visit the temple", done: false },
    { id: 2, text: "Drink matcha", done: false },
];

import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";
import { TasksProvider } from "./TasksContext.js";

export default function TaskApp() {
    return (
        <TasksProvider>
            <h1>Day off in Kyoto</h1>
            <AddTask />
            <TaskList />
        </TasksProvider>
    );
}
```

You can also export functions that use the context from `TasksContext.js`:

```js
export function useTasks() {
    return useContext(TasksContext);
}

export function useTasksDispatch() {
    return useContext(TasksDispatchContext);
}
```

When a component needs to read context, it can do it through these functions:

```js
const tasks = useTasks();
const dispatch = useTasksDispatch();
```

이렇게 해도 동작에는 아무런 변화가 없지만, 나중에 이러한 컨텍스트를 더 분리하거나 함수에 일부 논리를 추가할 수 있게 해줍니다. 이제 모든 컨텍스트와 reducer 설정이 `TasksContext.js`에 있으므로, 컴포넌트는 깔끔하고 정돈된 상태를 유지하며, 데이터를 어디서 가져오는지보다 무엇을 표시하는지에 집중할 수 있습니다.

```js
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}


import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;


import { createContext, useContext, useReducer } from "react";

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

    return (
        <TasksContext.Provider value={tasks}>
            <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
        </TasksContext.Provider>
    );
}

export function useTasks() {
    return useContext(TasksContext);
}

export function useTasksDispatch() {
    return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
    switch (action.type) {
        case "added": {
            return [
                ...tasks,
                {
                    id: action.id,
                    text: action.text,
                    done: false,
                },
            ];
        }
        case "changed": {
            return tasks.map((t) => {
                if (t.id === action.task.id) {
                    return action.task;
                } else {
                    return t;
                }
            });
        }
        case "deleted": {
            return tasks.filter((t) => t.id !== action.id);
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}

const initialTasks = [
    { id: 0, text: "Philosopher’s Path", done: true },
    { id: 1, text: "Visit the temple", done: false },
    { id: 2, text: "Drink matcha", done: false },
];

import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";
import { TasksProvider } from "./TasksContext.js";

export default function TaskApp() {
    return (
        <TasksProvider>
            <h1>Day off in Kyoto</h1>
            <AddTask />
            <TaskList />
        </TasksProvider>
    );
}
```

You can think of `TasksProvider` as a part of the screen that knows how to deal with tasks, `useTasks` as a way to read them, `useTasksDispatch`는 트리 아래의 모든 컴포넌트에서 작업을 업데이트하는 방법입니다.

<br/>
<br/>

**NOTE**

Functions like `useTasks` and `useTasksDispatch` are **called Custom Hooks.** Your function is considered a custom Hook if its name starts with `use`. This lets you use other Hooks, like useContext, inside it.

As your app grows, you may have many context-reducer pairs like this. This is a powerful way to scale your app and lift state up without too much work whenever you want to access the data deep in the tree.

<br/>
<br/>
<br/>
<br/>
