# Props

-   React 컴포넌트 데이터 통신 수단
-   부모 컴포넌트에서 자식 컴포넌트로 전달 할 수 있다.

## Using a props

-   커스텀 컴포넌트에는 원하는 props를 전달해 커스텀마이즈 할 수 있다.
-   HTML 태그에 전달할 수 있는 props는 정해져있다(ReactDOM은 HTML 표준을 따릅니다).

### 01. Pass props to the child component

```js
export default function Profile() {
    return <Avatar person={{ name: "Lin Lanying", imageId: "1bX5QH6" }} size={100} />;
}
```

### 02. Read props inside the child component

이 props는 자식 컴포넌트에서 중괄호({ }) 안에 이름을 나열함으로써 읽을 수 있습니다. 이렇게 하면 Avatar 코드 안에서 변수처럼 사용할 수 있습니다.

```js
function Avatar({ person, size }) {
    // person and size are available here
}
```

```js
function getImageUrl(person, size = "s") {
    return "https://i.imgur.com/" + person.imageId + size + ".jpg";
}

function Avatar({ person, size }) {
    return <img className="avatar" src={getImageUrl(person)} alt={person.name} width={size} height={size} />;
}

export default function Profile() {
    return (
        <div>
            <Avatar
                size={100}
                person={{
                    name: "Katsuko Saruhashi",
                    imageId: "YfeOqp2",
                }}
            />
            <Avatar
                size={80}
                person={{
                    name: "Aklilu Lemma",
                    imageId: "OKS67lh",
                }}
            />
            <Avatar
                size={50}
                person={{
                    name: "Lin Lanying",
                    imageId: "1bX5QH6",
                }}
            />
        </div>
    );
}
```

-   React component functions accept a single argument, a `props` object
-   props를 변경함으로써 컴포넌트의 렌더링 방식이나 기능을 쉽게 바꿀 수 있다

```js
function Avatar(props) {
    let person = props.person;
    let size = props.size;
    // ...
}
```

### 🔥

-   props를 선언할 때 `(` 와 `)` 사이에 있는 `{`와 `}` 쌍을 잊지 마세요

## Specifying a default value for a prop

값이 지정되지 않았을 때 사용할 기본 값을 prop에 제공하고 싶다면, 구조 분해 할당을 사용하여 매개변수 뒤에 `=`와 기본 값을 넣으면 됩니다

```js
function Avatar({ person, size = 100 }) {
    // ...
}
```

기본 값은 size prop이 없거나 size={undefined}로 전달될 때만 사용됩니다. 하지만 size={null}이나 size={0}을 전달하면 기본 값은 사용되지 않습니다

## Forwarding props with the JSX spread syntax

```js
function Profile({ person, size, isSepia, thickBorder }) {
    return (
        <div className="card">
            <Avatar person={person} size={size} isSepia={isSepia} thickBorder={thickBorder} />
        </div>
    );
}
```

props를 직접 사용하지 않기 때문에, **더 간결한spread syntax**를 사용하는 것이 합리적일 수 있다.

```js
function Profile(props) {
    return (
        <div className="card">
            <Avatar {...props} />
        </div>
    );
}
```

## Passing JSX as children

리액트 컴포넌트에 JSX 요소를 자식으로 전달하는 방법을 설명하는 내용.

```js
function getImageUrl(person, size = "s") {
    return "https://i.imgur.com/" + person.imageId + size + ".jpg";
}

function Avatar({ person, size }) {
    return <img className="avatar" src={getImageUrl(person)} alt={person.name} width={size} height={size} />;
}

function Card({ children }) {
    return <div className="card">{children}</div>;
}

export default function Profile() {
    return (
        <Card>
            <Avatar
                size={100}
                person={{
                    name: "Katsuko Saruhashi",
                    imageId: "YfeOqp2",
                }}
            />
        </Card>
    );
}
```

JSX 태그 안에 내용을 중첩하면, 부모 컴포넌트는 그 내용을 `children`이라는 prop으로 받게 된다.

## How props change over time

```js
function Clock({ color, time }) {
    return <h1 style={{ color: color }}>{time}</h1>;
}
```

위 예제는 컴포넌트가 시간에 따라 다른 props를 받을 수 있음을 보여준다. Props는 항상 정적이지 않다! 여기서 time prop은 매초 변하고, color prop은 다른 색상을 선택할 때 변합니다. Props는 시작 시뿐만 아니라 언제든지 **컴포넌트의 데이터를 반영**합니다.

하지만 **props는 불변**. ㅡ불변성은 '변경 불가능'이라는 컴퓨터 과학 용어입니다. 컴포넌트가 props를 변경해야 하는 경우(예: 사용자 상호작용이나 새로운 데이터에 반응할 때), 부모 컴포넌트에 다른 props, 즉 새로운 객체를 전달해 달라고 '요청'해야 합니다!ㅡ 이전의 props는 버려지고, 결국 자바스크립트 엔진이 그 메모리를 회수하게 됩니다.

**props는 불변이기 때문에 변경할 수 없고**, 필요한 경우 부모 컴포넌트에 요청하여 새로운 props를 받아야 한다
