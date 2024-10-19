# You Might Not Need an Effect

Effects are an escape hatch from the React paradigm. They let you “step outside” of React and synchronize your components with some external system like a non-React widget, network, or the browser DOM.

<br/>
<br/>
<br/>

## How to remove unnecessary Effects

There are two common cases in which you don’t need Effects:

-   **You don’t need Effects to transform data for rendering.** 예를 들어, 리스트를 표시하기 전에 필터링하고 싶다고 가정해 보겠습니다. 리스트가 변경될 때 `state` 변수를 업데이트하는 `Effect`를 작성하고 싶을 수 있지만, 이는 비효율적입니다. `state`를 업데이트하면 React는 먼저 컴포넌트 함수를 호출하여 화면에 무엇을 표시해야 할지를 계산합니다. 그런 다음 React는 이러한 변경 사항을 DOM에 'commit'하여 화면을 업데이트합니다. 그 후에 React는 `Effects`를 실행합니다. 만약 당신의 `Effect`가 즉시 state를 업데이트한다면, 이 과정이 처음부터 다시 시작됩니다! 불필요한 렌더링을 피하기 위해, 모든 데이터를 컴포넌트의 최상위에서 변환하십시오. 그렇게 하면 `props`나 `state`가 변경될 때마다 그 코드가 자동으로 다시 실행됩니다.

-   **You don’t need Effects to handle user events.** 예를 들어, 사용자가 제품을 구매할 때 `/api/buy` `POST` 요청을 보내고 알림을 표시하고 싶다고 가정해 보겠습니다. 구매 버튼 클릭 이벤트 핸들러에서는 어떤 일이 발생했는지 정확히 알고 있습니다. `Effect`가 실행될 때쯤에는 사용자가 무엇을 했는지(예: 어떤 버튼을 클릭했는지) 알 수 없습니다. 그래서 일반적으로 사용자 이벤트는 해당 이벤트 핸들러에서 처리하는 것이 좋습니다.

몇 가지 구체적인 예를 살펴보겠습니다!

<br/>

### Updating state based on props or state

만약 `firstName`과 `lastName`이라는 두 개의 상태 변수를 가진 컴포넌트가 있다고 가정해 보겠습니다. 이 두 변수를 연결하여 `fullName`을 계산하고 싶습니다. 또한, `firstName`이나 `lastName`이 변경될 때마다 `fullName`이 업데이트되기를 원합니다. 당신의 첫 번째 instinct은 `fullName` 상태 변수를 추가하고 `Effect`에서 이를 업데이트하는 것일 수 있습니다.

```js
function Form() {
    const [firstName, setFirstName] = useState("Taylor");
    const [lastName, setLastName] = useState("Swift");

    // 🔴 Avoid: redundant state and unnecessary Effect
    const [fullName, setFullName] = useState("");
    useEffect(() => {
        setFullName(firstName + " " + lastName);
    }, [firstName, lastName]);
    // ...
}
```

This is more complicated than necessary. 또한 비효율적입니다: `fullName`에 대해 오래된 값을 가지고 전체 렌더링을 수행한 다음, 즉시 업데이트된 값으로 다시 렌더링합니다. `stsate` 변수와 `Effect`를 제거하세요.

```js
function Form() {
    const [firstName, setFirstName] = useState("Taylor");
    const [lastName, setLastName] = useState("Swift");
    // ✅ Good: calculated during rendering
    const fullName = firstName + " " + lastName;
    // ...
}
```

기존의 `props`나 `state`로부터 계산할 수 있는 것이 있다면, 이를 state에 넣지 마세요. 대신, 렌더링 중에 계산하세요. 이렇게 하면 코드가 더 빨라지고(추가적인 '연쇄' 업데이트를 피할 수 있습니다), 더 간단해지며(코드가 줄어듭니다), 오류 발생 가능성이 줄어듭니다(서로 다른 상태 변수가 동기화되지 않아 발생하는 버그를 피할 수 있습니다).

<br/>

### Caching expensive calculations

이 컴포넌트는 `props`로 받은 `todos`를 사용하여 `filter prop`에 따라 필터링하여 `visibleTodos`를 계산합니다. 결과를 `state`에 저장하고 `Effect`에서 업데이트하고 싶을 수 있습니다.

```js
function TodoList({ todos, filter }) {
    const [newTodo, setNewTodo] = useState("");

    // 🔴 Avoid: redundant state and unnecessary Effect
    const [visibleTodos, setVisibleTodos] = useState([]);
    useEffect(() => {
        setVisibleTodos(getFilteredTodos(todos, filter));
    }, [todos, filter]);

    // ...
}
```

앞선 예와 마찬가지로, 이것은 불필요하고 비효율적입니다. 먼저 state와 `Effect`를 제거하세요.

```js
function TodoList({ todos, filter }) {
    const [newTodo, setNewTodo] = useState("");
    // ✅ This is fine if getFilteredTodos() is not slow.
    const visibleTodos = getFilteredTodos(todos, filter);
    // ...
}
```

보통 이 코드는 괜찮습니다! 하지만 `getFilteredTodos()`가 느리거나 `todos`가 많을 경우, `newTodo`와 같은 관련 없는 state 변수가 변경되었을 때 `getFilteredTodos()`를 다시 계산하고 싶지 않을 수 있습니다.

비싼 계산을 캐시(또는 '메모이제이션')하려면, 이를 `useMemo Hook`으로 감싸면 됩니다.

```js
import { useMemo, useState } from "react";

function TodoList({ todos, filter }) {
    const [newTodo, setNewTodo] = useState("");
    const visibleTodos = useMemo(() => {
        // ✅ Does not re-run unless todos or filter change
        return getFilteredTodos(todos, filter);
    }, [todos, filter]);
    // ...
}
```

Or, written as a single line:

```js
import { useMemo, useState } from "react";

function TodoList({ todos, filter }) {
    const [newTodo, setNewTodo] = useState("");
    // ✅ Does not re-run getFilteredTodos() unless todos or filter change
    const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
    // ...
}
```

**This tells React that you don’t want the inner function to re-run unless either todos or filter have changed.**

React는 초기 렌더링 동안 `getFilteredTodos()`의 반환 값을 기억합니다. 다음 렌더링에서는 `todos`나 `filter`가 다른지 확인합니다. 이전과 같으면, `useMemo`는 저장된 마지막 결과를 반환합니다. 하지만 다르면, React는 내부 함수를 다시 호출하고 그 결과를 저장합니다.

`useMemo`로 감싼 함수는 렌더링 중에 실행되므로, 이는 순수 계산에만 적합합니다.

---

### Deep dive

**How to tell if a calculation is expensive?**

In general, 수천 개의 객체를 생성하거나 반복하지 않는 한, it’s probably not expensive. If you want to get more confidence, 코드의 실행 시간을 측정하기 위해 콘솔 로그를 추가할 수 있습니다.

```js
console.time("filter array");
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd("filter array");
```

측정하고 있는 상호작용을 수행하세요(예: 입력란에 타이핑하기). 그러면 콘솔에서 `'filter array: 0.15ms'`와 같은 로그를 볼 수 있습니다. 전체 로그된 시간이 상당한 양`(예: 1ms 이상)`으로 합산된다면, 해당 계산을 메모이제이션하는 것이 의미 있을 수 있습니다. 실험으로, 그 계산을 `useMemo`로 감싸서 해당 상호작용에 대한 총 로그 시간이 줄어들었는지 확인할 수 있습니다.

```js
console.time("filter array");
const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd("filter array");
```

`useMemo`는 첫 번째 렌더링을 더 빠르게 만들지 않습니다. 업데이트 시 불필요한 작업을 건너뛰는 데만 도움이 됩니다. 당신의 기계가 아마도 사용자보다 더 빠를 것이므로, 인위적인 늦춤을 통해 성능을 테스트하는 것이 좋습니다. 예를 들어, Chrome에서는 CPU 스로틀링 옵션을 제공합니다.

또한, 개발 환경에서 성능을 측정하는 것은 가장 정확한 결과를 제공하지 않을 것입니다. (예를 들어, Strict Mode가 활성화되면 각 컴포넌트가 한 번이 아니라 두 번 렌더링되는 것을 볼 수 있습니다.) 가장 정확한 타이밍을 얻으려면, 앱을 프로덕션 빌드로 만들어서 사용자와 유사한 기기에서 테스트해야 합니다.

---

<br/>

### Resetting all state when a prop changes

This `ProfilePage` component receives a `userId prop`. The page contains a comment `input`, and you use a `comment state` variable to hold its value. One day, you notice a problem: 한 프로필에서 다른 프로필로 이동할 때 댓글 상태가 초기화되지 않습니다. 그 결과, 잘못된 사용자의 프로필에 댓글을 실수로 게시하기 쉽습니다. 이 문제를 해결하기 위해, `userId`가 변경될 때마다 `comment state` variable 초기화하고 싶습니다.

```js
export default function ProfilePage({ userId }) {
    const [comment, setComment] = useState("");

    // 🔴 Avoid: Resetting state on prop change in an Effect
    useEffect(() => {
        setComment("");
    }, [userId]);
    // ...
}
```

이것은 비효율적입니다. 왜냐하면 `ProfilePage`와 그 자식 컴포넌트가 먼저 오래된 값으로 렌더링되고, 그 후에 다시 렌더링되기 때문입니다. 또한, `ProfilePage` 내부에 `state`를 가진 모든 컴포넌트에서 이를 처리해야 하므로 복잡합니다. 예를 들어, 댓글 UI가 중첩되어 있다면 중첩된 댓글 상태도 초기화해야 할 것입니다.

대신, 각 사용자의 프로필이 개념적으로 다른 프로필임을 React에 알려주기 위해 명시적인 키를 부여할 수 있습니다. 컴포넌트를 두 개로 나누고, 외부 컴포넌트에서 내부 컴포넌트로 키 속성을 전달하세요.

```js
export default function ProfilePage({ userId }) {
    return <Profile userId={userId} key={userId} />;
}

function Profile({ userId }) {
    // ✅ This and any other state below will reset on key change automatically
    const [comment, setComment] = useState("");
    // ...
}
```

보통 React는 동일한 컴포넌트가 동일한 위치에서 렌더링될 때 state를 유지합니다. `userId`를 `Profile` 컴포넌트의 키로 전달함으로써, 서로 다른 `userId`를 가진 두 개의 `Profile` 컴포넌트를 서로 다른 컴포넌트로 취급하여 state를 공유하지 않도록 React에 요청하는 것입니다. `key`(즉, `userId`)가 변경될 때마다 React는 DOM을 다시 생성하고 `Profile` 컴포넌트 및 모든 자식의 state를 초기화합니다. 이제 프로필 간에 이동할 때 댓글 필드가 자동으로 지워집니다.

이 예제에서는 외부 `ProfilePage` 컴포넌트만이 내보내지고 프로젝트의 다른 파일에서 볼 수 있습니다. `ProfilePage`를 렌더링하는 컴포넌트는 이를 위해 키를 전달할 필요 없이 `userId`를 일반 `prop`으로 전달합니다. `ProfilePage`가 내부 `Profile` 컴포넌트에 키로 전달하는 것은 구현 세부사항입니다.

<br/>

### Adjusting some state when a prop changes

`prop`이 변경될 때 `state`의 일부를 초기화하거나 조정하고 싶지만, 모든 `state`를 초기화하고 싶지는 않을 수 있습니다.

```js
function List({ items }) {
    const [isReverse, setIsReverse] = useState(false);
    const [selection, setSelection] = useState(null);

    // 🔴 Avoid: Adjusting state on prop change in an Effect
    useEffect(() => {
        setSelection(null);
    }, [items]);
    // ...
}
```

이 또한 이상적이지 않습니다. `items`가 변경될 때마다 `List`와 그 자식 컴포넌트는 will render with a stale selection value at first. 그 후 React는 DOM을 업데이트하고 `Effects`를 실행합니다. 마지막으로 `setSelection(null)` 호출로 인해 `List`와 그 자식 컴포넌트가 다시 렌더링되며, 이 전체 과정이 다시 시작됩니다.

```js
function List({ items }) {
    const [isReverse, setIsReverse] = useState(false);
    const [selection, setSelection] = useState(null);

    // Better: Adjust the state while rendering
    const [prevItems, setPrevItems] = useState(items);
    if (items !== prevItems) {
        setPrevItems(items);
        setSelection(null);
    }
    // ...
}
```

이렇게 이전 렌더의 정보를 저장하는 것은 이해하기 어려울 수 있지만, 같은 `state`를 `Effect`에서 업데이트하는 것보다는 낫습니다. 위의 예에서 `setSelection`은 렌더 중에 직접 호출됩니다. React는 `return` 문을 지나고 나서 바로 `List`를 다시 렌더링합니다. 이때 React는 아직 `List`의 자식 컴포넌트를 렌더링하지 않았고 DOM도 업데이트하지 않았으므로, 이를 통해 `List`의 자식 컴포넌트가 오래된 선택 값을 렌더링하는 것을 건너뛸 수 있습니다.

렌더링 중에 컴포넌트를 업데이트하면, React는 반환된 JSX를 버리고 즉시 다시 렌더링을 시도합니다. To avoid very slow cascading retries, React는 렌더 중에 같은 컴포넌트의 state만 업데이트할 수 있도록 제한합니다. 다른 컴포넌트의 state를 렌더 중에 업데이트하면 오류가 발생합니다. `items !== prevItems`와 같은 조건이 필요하여 loops를 피할 수 있습니다. 이렇게 state를 조정할 수는 있지만, DOM을 변경하거나 타임아웃을 설정하는 등의 side effects은 이벤트 핸들러나 `Effect` 안에 있어야 컴포넌트를 순수하게 유지할 수 있습니다.

이 패턴은 `Effect`보다 더 효율적이지만, 대부분의 컴포넌트에서는 이 패턴이 필요하지 않습니다. 어떻게 하든지 간에, `props`나 다른 state에 기반하여 state를 조정하는 것은 데이터 흐름을 이해하고 디버깅하기 어렵게 만듭니다. 항상 모든 state를 키를 사용하여 리셋할 수 있는지 또는 렌더링 중에 모든 것을 계산할 수 있는지 확인하세요. 예를 들어, 선택된 항목을 저장하고 리셋하는 대신, 선택된 항목의 `ID`만 저장할 수 있습니다.

```js
function List({ items }) {
    const [isReverse, setIsReverse] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // ✅ Best: Calculate everything during rendering
    const selection = items.find((item) => item.id === selectedId) ?? null;
    // ...
}
```

Now there is no need to “adjust” the state at all. If the item with the selected ID is in the list, it remains selected. 만약 리스트에 없으면, 렌더링 중에 계산된 the selection은 일치하는 항목이 없기 때문에 `null`이 됩니다. 이 동작 방식은 다르지만, 대부분의 항목 변경 시 선택 상태를 유지하기 때문에 오히려 더 나은 방식이라고 할 수 있습니다.

<br/>

### Sharing logic between event handlers

제품 페이지에 두 개의 버튼(Buy and Checkout)이 있다고 가정해 보겠습니다. 이 버튼들은 모두 사용자가 제품을 장바구니에 추가할 수 있게 해줍니다. 사용자가 제품을 장바구니에 추가할 때마다 알림을 표시하고 싶습니다. 두 버튼의 클릭 핸들러에서 `showNotification()`을 호출하는 것은 반복적으로 느껴질 수 있으므로, 이 로직을 `Effect`에 두고 싶을 수도 있습니다.

```js
unction ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

This Effect is unnecessary. It will also most likely cause bugs. 예를 들어, 앱이 페이지를 새로 고침해도 장바구니를 '기억'한다고 가정해 보겠습니다. 제품을 한 번 장바구니에 추가하고 페이지를 새로 고침하면, 알림이 다시 나타납니다. 이 제품 페이지를 새로 고침할 때마다 알림이 계속 표시될 것입니다. 이는 `product.isInCart`가 페이지 로드 시 이미 `true`이기 때문에, 위의 `Effect`가 `showNotification()`을 호출하게 되기 때문입니다.

어떤 코드가 `Effect`에 있어야 하는지 아니면 이벤트 핸들러에 있어야 하는지 확신이 서지 않을 때, 그 코드가 왜 실행되어야 하는지 스스로에게 물어보세요. `Effect`는 컴포넌트가 사용자에게 표시되었기 때문에 실행되어야 하는 코드에만 사용하세요. 이 예제에서 알림은 사용자가 버튼을 눌렀기 때문에 나타나야지, 페이지가 표시되었기 때문에 나타나서는 안 됩니다! `Effect`를 삭제하고 두 이벤트 핸들러에서 호출할 수 있는 함수로 the shared logic을 넣으세요

```js
function ProductPage({ product, addToCart }) {
    // ✅ Good: Event-specific logic is called from event handlers
    function buyProduct() {
        addToCart(product);
        showNotification(`Added ${product.name} to the shopping cart!`);
    }

    function handleBuyClick() {
        buyProduct();
    }

    function handleCheckoutClick() {
        buyProduct();
        navigateTo("/checkout");
    }
    // ...
}
```

<br/>

### Sending a POST request

This `Form` component sends two kinds of POST requests. 컴포넌트가 마운트될 때 an analytics event를 전송합니다. 양식을 작성하고 제출 버튼을 클릭하면, `/api/register` 엔드포인트에 POST 요청을 전송합니다.

```js
function Form() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // ✅ Good: This logic should run because the component was displayed
    useEffect(() => {
        post("/analytics/event", { eventName: "visit_form" });
    }, []);

    // 🔴 Avoid: Event-specific logic inside an Effect
    const [jsonToSubmit, setJsonToSubmit] = useState(null);
    useEffect(() => {
        if (jsonToSubmit !== null) {
            post("/api/register", jsonToSubmit);
        }
    }, [jsonToSubmit]);

    function handleSubmit(e) {
        e.preventDefault();
        setJsonToSubmit({ firstName, lastName });
    }
    // ...
}
```

The analytics POST 요청은 `Effect` 안에 남아야 합니다. This is because the reason to send the the analytics event is that the form was displayed.

하지만 `/api/register` POST 요청은 is not caused by the form being displayed. 이 요청은 특정 순간에만 전송되길 원하며, 사용자가 버튼을 눌렀을 때만 발생해야 합니다. 이 상호작용에서만 발생해야 합니다. Delete the second Effect and move that POST request into the event handler:

```js
function Form() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // ✅ Good: This logic runs because the component was displayed
    useEffect(() => {
        post("/analytics/event", { eventName: "visit_form" });
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        // ✅ Good: Event-specific logic is in the event handler
        post("/api/register", { firstName, lastName });
    }
    // ...
}
```

When you choose whether to put some logic into an event handler or an `Effect`, the main question you need to answer is what kind of logic it is from the user’s perspective. If this logic is caused by a particular interaction, keep it in the event handler. If it’s caused by the user seeing the component on the screen, keep it in the `Effect`.

<br/>

### Chains of computations

다른 state에 따라 각각의 state를 조정하는 `Effect`를 연결하고 싶을 때가 있을 수도 있다.

```js
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

There are two problems with this code. The first problem is that it is very inefficient: 컴포넌트(및 그 자식 컴포넌트)는 체인 내 각 `set` 호출 사이에서 다시 렌더링해야 합니다. 위의 예에서 최악의 경우(예: setCard → render → setGoldCardCount → render → setRound → render → setIsGameOver → render)에는 아래 트리에서 세 번의 불필요한 재렌더링이 발생합니다.

The second problem is that even if it weren’t slow, as your code evolves, you will run into cases where the “chain” you wrote doesn’t fit the new requirements. 게임의 이동 기록을 단계별로 확인할 수 있는 방법을 추가한다고 가정해 보세요. 이 경우, 각 state 변수를 과거의 값으로 업데이트해야 합니다. 그러나 `card state`를 과거의 값으로 설정하면 `Effect` 체인이 다시 트리거되어 보여주고 있는 데이터가 변경됩니다. Such code is often rigid and fragile.

In this case, it’s better to calculate what you can during rendering, and adjust the state in the event handler:

```js
function Game() {
    const [card, setCard] = useState(null);
    const [goldCardCount, setGoldCardCount] = useState(0);
    const [round, setRound] = useState(1);

    // ✅ Calculate what you can during rendering
    const isGameOver = round > 5;

    function handlePlaceCard(nextCard) {
        if (isGameOver) {
            throw Error("Game already ended.");
        }

        // ✅ Calculate all the next state in the event handler
        setCard(nextCard);
        if (nextCard.gold) {
            if (goldCardCount <= 3) {
                setGoldCardCount(goldCardCount + 1);
            } else {
                setGoldCardCount(0);
                setRound(round + 1);
                if (round === 5) {
                    alert("Good game!");
                }
            }
        }
    }

    // ...
}
```

이것은 훨씬 더 효율적입니다. 또한, 게임 기록을 볼 수 있는 방법을 구현하면 이제 과거의 이동으로 각 state 변수를 설정할 수 있으며, 다른 모든 값을 조정하는 `Effect` 체인을 트리거하지 않습니다.

Remember that inside event handlers, state behaves like a snapshot. 예를 들어, `setRound(round + 1)`을 호출한 후에도 `round` 변수는 사용자가 버튼을 클릭했을 때의 값을 반영합니다. 계산을 위해 다음 값을 사용해야 하는 경우, `const nextRound = round + 1`과 같이 수동으로 정의해야 합니다.

In some cases, you can’t calculate the next state directly in the event handler. 예를 들어, 여러 개의 드롭다운이 있는 a from을 상상해 보세요. 이 경우, 다음 드롭다운의 옵션은 이전 드롭다운에서 선택한 값에 따라 달라집니다. 이런 경우에는 네트워크와 동기화하고 있으므로 `Effect`의 연쇄가 적합합니다.

<br/>

### Initializing the application

일부 로직은 앱이 로드될 때 한 번만 실행되어야 합니다.

이를 최상위 컴포넌트의 `Effect`에 두고 싶을 수 있습니다.

```js
function App() {
    // 🔴 Avoid: Effects with logic that should only ever run once
    useEffect(() => {
        loadDataFromLocalStorage();
        checkAuthToken();
    }, []);
    // ...
}
```

하지만 개발 환경에서는 이 로직이 두 번 실행된다. 이로 인해 문제가 발생할 수 있습니다. 예를 들어, 함수가 두 번 호출되도록 설계되지 않았기 때문에 인증 토큰이 무효화될 수 있습니다. 일반적으로, 컴포넌트는 다시 마운트되는 상황에 잘 견딜 수 있어야 합니다. 이는 최상위 `App` 컴포넌트에도 해당됩니다.

비록 실제 운영 환경에서는 다시 마운트되지 않을 수도 있지만, 모든 컴포넌트에서 동일한 제약 조건을 따르는 것이 코드 이동 및 재사용을 용이하게 만듭니다. 만약 어떤 로직이 각 컴포넌트가 마운트될 때가 아니라 앱이 로드될 때 한 번만 실행되어야 한다면, 이미 실행되었는지를 추적할 최상위 변수를 추가하세요.

```js
let didInit = false;

function App() {
    useEffect(() => {
        if (!didInit) {
            didInit = true;
            // ✅ Only runs once per app load
            loadDataFromLocalStorage();
            checkAuthToken();
        }
    }, []);
    // ...
}
```

You can also run it during module initialization and before the app renders

```js
if (typeof window !== "undefined") {
    // Check if we're running in the browser.
    // ✅ Only runs once per app load
    checkAuthToken();
    loadDataFromLocalStorage();
}

function App() {
    // ...
}
```

최상위에서의 코드는 컴포넌트가 임포트될 때 한 번 실행됩니다. 렌더링되지 않더라도 마찬가지입니다. 임의의 컴포넌트를 임포트할 때 성능 저하나 예상치 못한 동작을 피하기 위해 이 패턴을 과도하게 사용하지 마세요. 애플리케이션 전역 초기화 로직은 `App.js`와 같은 루트 컴포넌트 모듈이나 애플리케이션의 진입점에 두는 것이 좋습니다.

<br/>

### Notifying parent components about state changes

예를 들어, 내부의 `isOn` state가 `true` 또는 `false`가 될 수 있는 `Toggle` 컴포넌트를 작성하고 있다고 가정해 보겠습니다. 클릭이나 드래그와 같은 여러 가지 방법으로 상태를 전환할 수 있습니다. `Toggle`의 내부 state가 변경될 때마다 부모 컴포넌트에 알리기를 원하므로, `onChange` 이벤트를 노출하고 `Effect`에서 이를 호출합니다.

```js
function Toggle({ onChange }) {
    const [isOn, setIsOn] = useState(false);

    // 🔴 Avoid: The onChange handler runs too late
    useEffect(() => {
        onChange(isOn);
    }, [isOn, onChange]);

    function handleClick() {
        setIsOn(!isOn);
    }

    function handleDragEnd(e) {
        if (isCloserToRightEdge(e)) {
            setIsOn(true);
        } else {
            setIsOn(false);
        }
    }

    // ...
}
```

앞서 마찬가지로, 이것은 이상적이지 않습니다. `Toggle`은 먼저 자신의 `state`를 업데이트하고, 그 다음 React가 화면을 업데이트합니다. 이후 React는 `Effect`를 실행하고, 부모 컴포넌트에서 전달된 `onChange` 함수를 호출합니다. 이제 부모 컴포넌트는 자신의 `state`를 업데이트하고, 또 다른 렌더링이 시작됩니다. It would be better to do everything in a single pass.

따라서 `Effect`를 삭제하고 대신 같은 이벤트 핸들러 내에서 두 컴포넌트의 `state`를 업데이트하세요.

```js
function Toggle({ onChange }) {
    const [isOn, setIsOn] = useState(false);

    function updateToggle(nextIsOn) {
        // ✅ Good: Perform all updates during the event that caused them
        setIsOn(nextIsOn);
        onChange(nextIsOn);
    }

    function handleClick() {
        updateToggle(!isOn);
    }

    function handleDragEnd(e) {
        if (isCloserToRightEdge(e)) {
            updateToggle(true);
        } else {
            updateToggle(false);
        }
    }

    // ...
}
```

이 접근 방식으로 `Toggle` 컴포넌트와 부모 컴포넌트가 이벤트 중에 state를 업데이트합니다. `React`는 서로 다른 컴포넌트의 업데이트를 배치 처리하므로, 렌더링은 한 번만 발생합니다.

또한, `state`를 아예 제거하고 부모 컴포넌트에서 `isOn`을 받아오는 방식으로 변경할 수도 있습니다.

```js
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
    function handleClick() {
        onChange(!isOn);
    }

    function handleDragEnd(e) {
        if (isCloserToRightEdge(e)) {
            onChange(true);
        } else {
            onChange(false);
        }
    }

    // ...
}
```

"Lifting state up" 부모 컴포넌트가 자신의 state를 전환하여 `Toggle`을 완전히 제어할 수 있게 합니다. 이는 부모 컴포넌트가 더 많은 로직을 포함해야 한다는 것을 의미하지만, 전체적으로 관리해야 할 `state`는 줄어듭니다.

<br/>

### Passing data to the parent

`Child` 컴포넌트는 데이터를 가져온 다음, `Effect`를 통해 이를 `Parent` 컴포넌트에 전달합니다.

```js
function Parent() {
    const [data, setData] = useState(null);
    // ...
    return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
    const data = useSomeAPI();
    // 🔴 Avoid: Passing data to the parent in an Effect
    useEffect(() => {
        if (data) {
            onFetched(data);
        }
    }, [onFetched, data]);
    // ...
}
```

In React, data flows from the parent components to their children. 화면에서 문제가 발생했을 때, 잘못된 `prop`을 전달하거나 잘못된 `state`를 가진 컴포넌트를 찾기 위해 컴포넌트 체인을 거슬러 올라가며 정보를 추적할 수 있습니다. 자식 컴포넌트가 `Effect`에서 부모 컴포넌트의 state를 업데이트할 때, 데이터 흐름을 추적하기가 매우 어려워집니다. 자식과 부모가 동일한 데이터를 필요로 할 경우, 부모 컴포넌트가 그 데이터를 가져오고 자식에게 전달하도록 하세요.

```js
function Parent() {
    const data = useSomeAPI();
    // ...
    // ✅ Good: Passing data down to the child
    return <Child data={data} />;
}

function Child({ data }) {
    // ...
}
```

이 방식은 더 간단하고 데이터 흐름을 예측 가능하게 유지합니다: 데이터가 부모에서 자식으로 흐릅니다.

<br/>

### Subscribing to an external store

Sometimes, your components may need to subscribe to some data outside of the React state. 이 데이터는 서드파티 라이브러리나 내장된 브라우저 API에서 올 수 있습니다. 이 데이터는 React의 인식 없이 변경될 수 있기 때문에, 컴포넌트를 수동으로 구독해야 합니다. 이는 종종 `Effect`를 사용하여 수행됩니다. 예를 들어:

```js
function useOnlineStatus() {
    // Not ideal: Manual store subscription in an Effect
    const [isOnline, setIsOnline] = useState(true);
    useEffect(() => {
        function updateState() {
            setIsOnline(navigator.onLine);
        }

        updateState();

        window.addEventListener("online", updateState);
        window.addEventListener("offline", updateState);
        return () => {
            window.removeEventListener("online", updateState);
            window.removeEventListener("offline", updateState);
        };
    }, []);
    return isOnline;
}

function ChatIndicator() {
    const isOnline = useOnlineStatus();
    // ...
}
```

여기서 컴포넌트는 외부 데이터 저장소(이 경우 브라우저의 `navigator.onLine API`)에 구독합니다. 이 API는 서버에 존재하지 않기 때문에(초기 HTML에 사용할 수 없음), 처음에는 상태가 `true`로 설정됩니다. 브라우저에서 해당 데이터 저장소의 값이 변경될 때마다, 컴포넌트는 자신의 state를 업데이트합니다.

Although it’s common to use `Effects` for this, React에는 외부 저장소에 구독하기 위해 특별히 설계된 Hook이 있습니다. 따라서 `Effect`를 삭제하고 `useSyncExternalStore` 호출로 대체하는 것이 좋습니다."

```js
function subscribe(callback) {
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);
    return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
    };
}

function useOnlineStatus() {
    // ✅ Good: Subscribing to an external store with a built-in Hook
    return useSyncExternalStore(
        subscribe, // React won't resubscribe for as long as you pass the same function
        () => navigator.onLine, // How to get the value on the client
        () => true // How to get the value on the server
    );
}

function ChatIndicator() {
    const isOnline = useOnlineStatus();
    // ...
}
```

이 접근 방식은 `Effect`를 사용하여 가변 데이터를 React state와 수동으로 동기화하는 것보다 오류가 발생할 가능성이 적습니다. 일반적으로는 위의 `useOnlineStatus()`와 같은 사용자 정의 Hook을 작성하여, 개별 컴포넌트에서 이 코드를 반복할 필요가 없도록 합니다.

<br/>

### Fetching data

많은 앱이 데이터 가져오기를 시작하기 위해 `Effects`를 사용합니다. 다음과 같은 데이터 가져오기 `Effect`를 작성하는 것은 매우 일반적입니다:

```js
function SearchResults({ query }) {
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        // 🔴 Avoid: Fetching without cleanup logic
        fetchResults(query, page).then((json) => {
            setResults(json);
        });
    }, [query, page]);

    function handleNextPageClick() {
        setPage(page + 1);
    }
    // ...
}
```

You don’t need to move this fetch to an event handler.

This might seem like a contradiction with the earlier examples where you needed to put the logic into the event handlers! 그러나 데이터 가져오는 주된 이유는 the typing event가 아니라는 점을 고려해야 합니다. Search inputs are often prepopulated from the URL, and the user might navigate Back and Forward without touching the input.

It doesn’t matter where page and query come from. While this component is visible, you want to keep results synchronized with data from the network for the current page and query. This is why it’s an `Effect`.

하지만 위의 코드에는 버그가 있습니다. `'hello'`를 빠르게 입력한다고 가정해 보세요. 그러면 쿼리는 '`h', 'he', 'hel', 'hell', 'hello'`로 변경됩니다. 이로 인해 별도의 `fetch`가 발생하지만, 응답이 도착하는 순서에 대한 보장이 없습니다. 예를 들어, `'hell'` 응답이 `'hello'` 응답보다 늦게 도착할 수 있습니다. 마지막으로 `setResults()`를 호출하게 되므로 잘못된 검색 결과를 표시하게 됩니다. 이를 race condition이라고 합니다: 두 개의 다른 요청이 서로 '경쟁'을 하여 예상과 다른 순서로 도착한 경우입니다.

To fix the race condition, you need to add a `cleanup` function to ignore stale responses:

```js
function SearchResults({ query }) {
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        let ignore = false;
        fetchResults(query, page).then((json) => {
            if (!ignore) {
                setResults(json);
            }
        });
        return () => {
            ignore = true;
        };
    }, [query, page]);

    function handleNextPageClick() {
        setPage(page + 1);
    }
    // ...
}
```

이것은 `Effect`가 데이터를 가져올 때, 마지막으로 요청한 응답을 제외한 모든 응답이 무시되도록 보장합니다.

Handling race conditions is not the only difficulty with implementing data fetching. 응답을 캐싱하는 방법(사용자가 '뒤로'를 클릭했을 때 이전 화면을 즉시 볼 수 있도록), 서버에서 데이터를 가져오는 방법(초기 서버 렌더링 HTML에 로딩 스피너 대신 가져온 내용을 포함하도록), 그리고 network waterfalls를 피하는 방법(자식이 모든 부모의 데이터가 준비될 때까지 기다리지 않고 데이터를 가져올 수 있도록)도 고려해야 할 사항입니다.

이 문제들은 React뿐만 아니라 모든 UI 라이브러리에 적용됩니다. 이를 해결하는 것은 간단하지 않기 때문에, 현대의 프레임워크는 `Effects`에서 데이터를 가져오는 것보다 더 효율적인 built-in data fetching mechanisms than fetching data in `Effects`.

프레임워크를 사용하지 않거나 직접 만들고 싶지 않지만, `Effects`에서 데이터 가져오기를 더 편리하게 하고 싶다면, 다음 예제와 같이 가져오기 로직을 사용자 정의 `Hook`으로 추출하는 것을 고려해보세요.

```js
function SearchResults({ query }) {
    const [page, setPage] = useState(1);
    const params = new URLSearchParams({ query, page });
    const results = useData(`/api/search?${params}`);

    function handleNextPageClick() {
        setPage(page + 1);
    }
    // ...
}

function useData(url) {
    const [data, setData] = useState(null);
    useEffect(() => {
        let ignore = false;
        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                if (!ignore) {
                    setData(json);
                }
            });
        return () => {
            ignore = true;
        };
    }, [url]);
    return data;
}
```

오류 처리와 콘텐츠 로딩 상태를 추적하는 로직도 추가하고 싶을 것입니다. 이러한 Hook을 직접 만들거나 React 생태계에 이미 존재하는 여러 솔루션 중 하나를 사용할 수 있습니다. 비록 이것만으로는 프레임워크의 내장 데이터 가져오기 메커니즘만큼 효율적이지 않겠지만, 데이터 가져오기 로직을 사용자 정의 Hook으로 이동시키면 나중에 효율적인 데이터 가져오기 전략을 채택하는 데 더 쉬워질 것입니다.

일반적으로 `Effects`를 작성해야 할 때마다, 기능의 일부를 `useData`와 같은 더 선언적이고 목적에 맞는 API를 가진 사용자 정의 `Hook`으로 추출할 수 있는지를 주의 깊게 살펴보세요. **컴포넌트에 원시 `useEffect` 호출이 적을수록 애플리케이션 유지 관리가 더 쉬워질 것입니다.**

<br/>
<br/>

> 🤔 effect에서는 set update function을 사용하면 무한 렌더링이 발생한다.

> 🤔 key를 통해 state 공유를 막을 수 있다.

> When you choose whether to put some logic into an event handler or an `Effect`, the main question you need to answer is what kind of logic it is from the user’s perspective. - Sending a POST request

> prepopulated 이미 있는 데이터에 새로운 사항을 추가하는 것

> race condition - fetching data
