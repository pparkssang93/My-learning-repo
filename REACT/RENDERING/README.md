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
