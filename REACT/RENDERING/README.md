## Conditional Rendering

React에서는 `if 문`, `&&`, `? : `연산자와 같은 자바스크립트 구문을 사용하여 JSX를 조건부로 렌더링할 수 있다.

### Conditionally returning JSX

```js
function Item({ name, isPacked }) {
    if (isPacked) {
        return <li className="item">{name} ✅</li>;
    }
    return <li className="item">{name}</li>;

    return <li className="item">{name}</li>;
}

export default function PackingList() {
    return (
        <section>
            <h1>Sally Ride's Packing List</h1>
            <ul>
                <Item isPacked={true} name="Space suit" />
                <Item isPacked={true} name="Helmet with a golden leaf" />
                <Item isPacked={false} name="Photo of Tam" />
            </ul>
        </section>
    );
}
```

-   isPacked={true}일 경우 포장된 아이템에 체크마크(✅)를 추가
-   이 코드는 **다른 JSX 트리를 반환**
-   자바스크립트의 if 및 return 문을 사용하여 분기 로직을 생성

> ### 분기 로직

특정 조건에 따라 다른 코드 경로로 진행하는 것

### Conditionally returning nothing with null

일부 상황에서는 아예 아무 것도 렌더링하고 싶지 않을 수 있습니다. 예를 들어, 포장된 아이템을 전혀 보여주고 싶지 않을 때입니다. **컴포넌트는 반드시 무언가를 반환해야 한다.** 이 경우, **null을 반환**할 수 있습니다."

```js
function Item({ name, isPacked }) {
    if (isPacked) {
        return null;
    }
    return <li className="item">{name}</li>;
}

export default function PackingList() {
    return (
        <section>
            <h1>Sally Ride's Packing List</h1>
            <ul>
                <Item isPacked={true} name="Space suit" />
                <Item isPacked={true} name="Helmet with a golden leaf" />
                <Item isPacked={false} name="Photo of Tam" />
            </ul>
        </section>
    );
}
```

실제로, 컴포넌트에서 null을 반환하는 것은 일반적이지 않습니다. 부모 컴포넌트의 JSX에서 컴포넌트를 조건부로 포함하거나 제외하는 방식으로 처리합니다.

### Conditional (ternary) operator (`? :`)

삼항 연산자

```js
if (isPacked) {
    return <li className="item">{name} ✅</li>;
}

return <li className="item">{name}</li>;

return <li className="item">{isPacked ? name + " ✅" : name}</li>;
```

-   JSX 요소는 인스턴스가 아니며, 위 두 예제는 동일하다

```js
function Item({ name, isPacked }) {
    return <li className="item">{isPacked ? <del>{name + " ✅"}</del> : name}</li>;
}

export default function PackingList() {
    return (
        <section>
            <h1>Sally Ride's Packing List</h1>
            <ul>
                <Item isPacked={true} name="Space suit" />
                <Item isPacked={true} name="Helmet with a golden leaf" />
                <Item isPacked={false} name="Photo of Tam" />
            </ul>
        </section>
    );
}
```

이 스타일은 간단한 조건에는 잘 작동하지만, 적당히 사용해야 합니다. 만약 컴포넌트가 너무 많은 중첩된 조건부 마크업으로 복잡해진다면, 자식 컴포넌트를 분리하여 정리하는 것을 고려하세요. React에서는 마크업이 코드의 일부이므로, 변수와 함수와 같은 도구를 사용하여 복잡한 표현식을 정리할 수 있습니다.

### Logical AND operator (`&&`) 

논리연산자

React 컴포넌트 내에서 조건이 true일 때 JSX를 렌더링하고, 그렇지 않으면 아무 것도 렌더링하지 않을 때 자주 사용됩니다. &&를 사용하면, 'isPacked'가 true일 때만 체크마크를 조건부로 렌더링할 수 있습니다.

```js
function Item({ name, isPacked }) {
    return (
        <li className="item">
            {name} {isPacked && "✅"}
        </li>
    );
}

export default function PackingList() {
    return (
        <section>
            <h1>Sally Ride's Packing List</h1>
            <ul>
                <Item isPacked={true} name="Space suit" />
                <Item isPacked={true} name="Helmet with a golden leaf" />
                <Item isPacked={false} name="Photo of Tam" />
            </ul>
        </section>
    );
}
```

-   자바스크립트 && 표현식은 왼쪽(조건)이 true일 경우 오른쪽(이 경우 체크마크)의 값을 반환합니다. 하지만 조건이 false일 경우 전체 표현식은 false가 됩니다.
-   React는 false를 JSX 트리에서 '빈 공간'으로 간주하여, null이나 undefined와 마찬가지로 그 자리에 아무 것도 렌더링하지 않습니다.

### 🔥

&&의 왼쪽에 숫자를 두지 마세요.

조건을 테스트하기 위해 자바스크립트는 왼쪽을 자동으로 불리언으로 변환합니다. 그러나 왼쪽이 0인 경우, 전체 표현식은 그 값(0)을 가지게 되고, React는 아무 것도 아닌 것 대신 0을 렌더링합니다.

예를 들어, 흔히 저지르는 실수는 `messageCount && <p>New messages</p>`와 같은 코드를 작성하는 것입니다. messageCount가 0일 때 아무 것도 렌더링하지 않는다고 쉽게 가정할 수 있지만, **실제로는 0 자체가 렌더링됩니다!**

이를 수정하려면 왼쪽을 불리언으로 만들어야 합니다: `messageCount > 0 && <p>New messages</p>`.

### Conditionally assigning JSX to a variable

-   코드가 복잡해질 경우 단축키 대신 if 문과 변수를 사용하여 더 명확하게 작성할 수 있다.

```js
function Item({ name, isPacked }) {
    let itemContent = name;
    if (isPacked) {
        itemContent = name + " ✅";
    }
    return <li className="item">{itemContent}</li>;
}

export default function PackingList() {
    return (
        <section>
            <h1>Sally Ride's Packing List</h1>
            <ul>
                <Item isPacked={true} name="Space suit" />
                <Item isPacked={true} name="Helmet with a golden leaf" />
                <Item isPacked={false} name="Photo of Tam" />
            </ul>
        </section>
    );
}
```

## Rendering Lists

유사한 컴포넌트를 생성하기 위해 **배열 메서드를 활용**할 수 있다

### Rendering data from arrays

```js
<ul>
    <li>Creola Katherine Johnson: mathematician</li>
    <li>Mario José Molina-Pasquel Henríquez: chemist</li>
    <li>Mohammad Abdus Salam: physicist</li>
    <li>Percy Lavon Julian: chemist</li>
    <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

리스트 항목들 사이의 유일한 차이는 그들의 내용, 즉 데이터입니다. 인터페이스를 구축할 때 서로 다른 데이터를 사용하여 같은 컴포넌트의 여러 인스턴스를 표시해야 할 경우가 많습니다. 예를 들어, 댓글 목록이나 프로필 이미지 갤러리 등이 있습니다. 이러한 상황에서는 데이터를 자바스크립트 객체와 배열에 저장하고, map() 및 filter()와 같은 메서드를 사용하여 이들로부터 컴포넌트 목록을 렌더링할 수 있습니다.

1.  **Move** the data into an array

```js
const people = [
    "Creola Katherine Johnson: mathematician",
    "Mario José Molina-Pasquel Henríquez: chemist",
    "Mohammad Abdus Salam: physicist",
    "Percy Lavon Julian: chemist",
    "Subrahmanyan Chandrasekhar: astrophysicist",
];
```

2.  **Map** the `people` members into a new array of JSX nodes, `listItems`

```js
const listItems = people.map((person) => <li>{person}</li>);
```

3.  **Return** `listItems` from your component wrapped in a `<ul>`

```js
return <ul>{listItems}</ul>;
```

### Filtering arrays of items

특정 조건에 맞는 데이터만 필터링

```js
const people = [
    {
        id: 0,
        name: "Creola Katherine Johnson",
        profession: "mathematician",
    },
    {
        id: 1,
        name: "Mario José Molina-Pasquel Henríquez",
        profession: "chemist",
    },
    {
        id: 2,
        name: "Mohammad Abdus Salam",
        profession: "physicist",
    },
    {
        id: 3,
        name: "Percy Lavon Julian",
        profession: "chemist",
    },
    {
        id: 4,
        name: "Subrahmanyan Chandrasekhar",
        profession: "astrophysicist",
    },
];
```

1.  **Create** a new array of just “chemist” people, `chemists`, by calling `filter()` on the `people` filtering by `person.profession === 'chemist'`

```js
const chemists = people.filter((person) => person.profession === "chemist");
```

2.  Now **map** over `chemists`:

```js
const listItems = chemists.map((person) => (
    <li>
        <img src={getImageUrl(person)} alt={person.name} />
        <p>
            <b>{person.name}:</b>
            {" " + person.profession + " "}
            known for {person.accomplishment}
        </p>
    </li>
));
```

3.  Lastly, **return** the `listItems` from your component:

```
	<ul>{listItems}</ul>
```

### 🔥

Arrow functions implicitly return the expression right after `=>`, so you didn’t need a `return` statement

```js
const listItems = chemists.map(
    (person) => <li>...</li> // Implicit return!
);
```

However, **you must write `return` explicitly if your `=>` is followed by a `{` curly brace!**

```js
const listItems = chemists.map((person) => {
    // Curly brace
    return <li>...</li>;
});
```

=> {를 포함하는 화살표 함수는 '블록 본체'를 가진다고 합니다. 이 경우 여러 줄의 코드를 작성할 수 있지만, 반환값을 명시적으로 작성해야 합니다. 만약 반환문을 잊어버리면, 아무것도 반환되지 않습니다!

### Keeping list items in order with `key`

각 **배열 항목에 `key`를 부여**해야 합니다. `key`는 배열의 다른 항목들 사이에서 고유하게 식별할 수 있는 문자열 또는 숫자입니다.

`key`는 React에게 각 컴포넌트가 어떤 배열 항목에 해당하는지를 알려주어, 나중에 이를 맞추는 데 도움을 줍니다. 배열 항목이 이동하거나(예: 정렬으로 인해), 삽입되거나 삭제될 수 있는 경우, 이는 중요해집니다. 잘 선택된 키는 React가 정확히 어떤 일이 발생했는지를 추론하고, DOM 트리에 올바른 업데이트를 수행하는 데 도움을 줍니다.

키를 즉석에서 생성하기보다는, **데이터를 작성할 때 키를 포함**해야 합니다

```js
function getImageUrl(person) {
    return "https://i.imgur.com/" + person.imageId + "s.jpg";
}

const people = [
    {
        id: 0, // Used in JSX as a key
        name: "Creola Katherine Johnson",
        profession: "mathematician",
        accomplishment: "spaceflight calculations",
        imageId: "MK3eW3A",
    },
    {
        id: 1, // Used in JSX as a key
        name: "Mario José Molina-Pasquel Henríquez",
        profession: "chemist",
        accomplishment: "discovery of Arctic ozone hole",
        imageId: "mynHUSa",
    },
    {
        id: 2, // Used in JSX as a key
        name: "Mohammad Abdus Salam",
        profession: "physicist",
        accomplishment: "electromagnetism theory",
        imageId: "bE7W1ji",
    },
    {
        id: 3, // Used in JSX as a key
        name: "Percy Lavon Julian",
        profession: "chemist",
        accomplishment: "pioneering cortisone drugs, steroids and birth control pills",
        imageId: "IOjWm71",
    },
    {
        id: 4, // Used in JSX as a key
        name: "Subrahmanyan Chandrasekhar",
        profession: "astrophysicist",
        accomplishment: "white dwarf star mass calculations",
        imageId: "lrWQx8l",
    },
];

function List() {
    const listItems = people.map((person) => (
        <li key={person.id}>
            <img src={getImageUrl(person)} alt={person.name} />
            <p>
                <b>{person.name}</b>
                {" " + person.profession + " "}
                known for {person.accomplishment}
            </p>
        </li>
    ));
    return <ul>{listItems}</ul>;
}
```

### 🔥

각 항목이 하나가 아닌 여러 개의 DOM 노드를 렌더링해야 할 때는 어떻게 해야 할까요?

짧은 `<>...</>` 프래그먼트 문법은 키를 전달할 수 없으므로, 항목들을 단일 `<div>`로 그룹화하거나, 약간 더 길고 명시적인 `<Fragment>` 문법을 사용해야 합니다.

```js
import { Fragment } from "react";

// ...

const listItems = people.map((person) => (
    <Fragment key={person.id}>
        <h1>{person.name}</h1>
        <p>{person.bio}</p>
    </Fragment>
));
```

프래그먼트를 사용하면 DOM 구조에서 프래그먼트 자체는 나타나지 않고, 단순히 자식 요소들만 나열된다.

#### Where to get your key

-   **Data from a database**:  If your data is coming from a database, you can use the database keys/IDs, which are unique by nature.
-   **Locally generated data**: If your data is generated and persisted locally (e.g. notes in a note-taking app), use an incrementing counter, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) or a package like [`uuid`](https://www.npmjs.com/package/uuid) when creating items.

#### Rules of keys

-   **Keys must be unique among siblings.** 그러나 서로 다른 배열의 JSX 노드에 대해서는 같은 키를 사용하는 것이 괜찮습니다.
-   **Keys must not change**, 그렇지 않으면 그 목적이 무의미해집니다! 렌더링할 때 키를 생성하지 마세요.

#### Why does React need keys? 

`key`는 형제 항목 간에 고유하게 항목을 식별할 수 있게 해줍니다. 잘 선택된 키는 배열 내의 위치보다 더 많은 정보를 제공합니다. 순서가 바뀌더라도, 키를 통해 React는 해당 항목을 전체 생애 동안 식별할 수 있습니다

## React rendering

UI를 요청하고 제공하는 이 과정은 세 가지 단계로 나뉩니다.

### Step 1: Trigger a render 

There are two reasons for a component to render:

1. 초기 렌더링.
2. The component’s (or one of its ancestors’) **state has been updated.**

<span style="font-weight:bold; color:#AFBF75">NOTE</span>

**Trigger?** 특정 조건이 충족되었을 때 어떤 행동이나 기능이 실행되도록 하는 것

#### Initial render

앱이 시작될 때, 초기 렌더링을 트리거해야 합니다. 프레임워크와 샌드박스에서는 이 코드를 숨기는 경우가 있지만, 이는 target DOM 노드와 함께 **createRoot를 호출**하고, 그 다음에 당신의 컴포넌트를 사용하여 render 메서드를 호출함으로써 이루어집니."

```js
import { createRoot } from "react-dom/client";

function Image() {
    return (
        <img
            src="https://i.imgur.com/ZF6s192.jpg"
            alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
        />
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<Image />);
```

#### Re-renders when state updates 

컴포넌트가 처음 렌더링된 후에는, state를 set 함수로 업데이트함으로써 추가 렌더링을 트리거할 수 있습니다. 컴포넌트의 상태를 업데이트하면 자동으로 렌더링이 대기열에 추가됩니다. (이것을 레스토랑 손님이 처음 주문한 후 갈증이나 배고픔에 따라 차, 디저트 및 다양한 것을 주문하는 것으로 상상할 수 있습니다.)

### Step 2: React renders your components

"렌더링을 트리거한 후, React는 어떤 내용을 화면에 표시할지 결정하기 위해 컴포넌트를 호출합니다. **'렌더링'은 React가 여러분의 컴포넌트를 호출하는 것을 의미합니다.**

초기 렌더링에서는 React가 루트 컴포넌트를 호출합니다. 이후 렌더링에서는 상태 업데이트로 렌더링을 트리거한 함수 컴포넌트를 호출합니다. 이 과정은 재귀적입니다. 업데이트된 컴포넌트가 다른 컴포넌트를 반환하면, React는 다음에 그 컴포넌트를 렌더링하고, 만약 그 컴포넌트도 또 다른 것을 반환하면 계속해서 렌더링을 진행합니다. 이 과정은 더 이상 중첩된 컴포넌트가 없을 때까지 계속되며, React는 화면에 무엇을 표시해야 하는지 정확히 알게 됩니다.

```js
import { createRoot } from "react-dom/client";

function Image() {
    return (
        <img
            src="https://i.imgur.com/ZF6s192.jpg"
            alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
        />
    );
}

function Gallery() {
    return (
        <section>
            <h1>Inspiring Sculptures</h1>
            <Image />
            <Image />
            <Image />
        </section>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<Gallery />);
```

-   **During the initial render,** React는 `<section>`, `<h1>`, 그리고 세 개의 `<img>` 태그에 대한 DOM 노드를 생성합니다.
-   **During a re-render,** React는 이전 렌더링 이후에 어떤 속성이 변경되었는지를 계산합니다. 그러나 그 정보로는 아무런 작업도 하지 않고, 다음 단계인 커밋 단계까지 기다립니다."

<span style="color:#F29544">**CAUTIONS**</span>

**Rendering must always be a pure calculation:**

-   **Same inputs, same output.** Given the same inputs, a component should always return the same JSX. (When someone orders a salad with tomatoes, they should not receive a salad with onions!)
-   **It minds its own business.** It should not change any objects or variables that existed before rendering. (One order should not change anyone else’s order.) **독립성**

<span style="font-weight:bold; color:rgb(70, 142, 242)">DEEP DIVE</span>

**Optimizing performance**

업데이트된 컴포넌트 내에 중첩된 모든 컴포넌트를 렌더링하는 기본 동작은, 업데이트된 컴포넌트가 트리에서 매우 높은 위치에 있을 경우 성능에 최적이 아닙니다. 성능 문제가 발생하면, 성능 섹션에서 설명된 여러 선택적 방법으로 해결할 수 있습니다. **너무 일찍 최적화하지 마세요!**

### Step 3: React commits changes to the DOM

React는 DOM에 변경 사항을 적용한다.

초기 렌더링에서는 React가 appendChild() DOM API를 사용하여 생성한 모든 DOM 노드를 화면에 추가합니다. re-render에서는 React가 렌더링 중에 계산된 최소한의 필요한 작업을 적용하여 DOM이 최신 렌더링 결과와 일치하도록 만듭니다. React는 render 간에 차이가 있을 때만 DOM 노드를 변경합니다.

예를 들어, 여기 부모로부터 매초 다른 props를 받아 re-renders되는 컴포넌트가 있습니다. `<input>`에 텍스트를 입력하여 값을 업데이트할 수 있지만, 컴포넌트가 재렌더링될 때 텍스트가 사라지지 않는다는 점에 주목하세요."

```js
export default function Clock({ time }) {
    return (
        <>
            <h1>{time}</h1>
            <input />
        </>
    );
}
```

This works because during this last step, React only updates the content of `<h1>` with the new time.

React는 `<input>`이 지난번과 같은 위치에 JSX에 나타나는 것을 확인하므로, so React doesn’t touch the `<input>`—or its value!

After rendering is done and React updated the DOM, the browser will repaint the screen. Although this process is known as “browser rendering”.

#### MEMO 🤔

-   state로 rerendering이 이뤄지면, 업데이트된 컴포넌트가 다른 컴포넌트를 반환하고 있는 상황이면 중첩된 컴포넌트가 없을 때까지 하위 컴포넌트를 계속 렌더링 시킨다.
-   React는 Trigger a render로 target DOM 노드 렌더링하고 -> 컴포넌트들 렌더링 -> 변경 사항이 있으면 DOM에 적용한다.
