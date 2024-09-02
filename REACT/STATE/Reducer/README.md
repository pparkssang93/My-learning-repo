# Extracting State Logic into a Reducer

state logic을 리듀서로 추출하기

많은 이벤트 핸들러에서 여러 state 업데이트가 발생하는 컴포넌트는 복잡해질 수 있습니다. 이런 경우, state 업데이트 logic을 컴포넌트 외부의 단일 함수인 리듀서로 통합할 수 있습니다.

<br/>
<br/>
<br/>
<br/>

## Consolidate state logic with a reducer

리듀서로 state 로직 통합하기

컴포넌트의 복잡성이 증가함에 따라, 컴포넌트의 state가 업데이트되는 다양한 방법을 한눈에 파악하기 어려워질 수 있습니다. 예를 들어, 아래의 `TaskApp` 컴포넌트는 state에 작업 배열을 보유하고 있으며, 작업을 추가, 제거 및 수정하기 위해 세 가지 다른 이벤트 핸들러를 사용합니다.

```js
import { useState } from "react";
import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";

let nextId = 3;
const initialTasks = [
    { id: 0, text: "Visit Kafka Museum", done: true },
    { id: 1, text: "Watch a puppet show", done: false },
    { id: 2, text: "Lennon Wall pic", done: false },
];

export default function TaskApp() {
    const [tasks, setTasks] = useState(initialTasks);

    function handleAddTask(text) {
        setTasks([
            ...tasks,
            {
                id: nextId++,
                text: text,
                done: false,
            },
        ]);
    }

    function handleChangeTask(task) {
        setTasks(
            tasks.map((t) => {
                if (t.id === task.id) {
                    return task;
                } else {
                    return t;
                }
            })
        );
    }

    function handleDeleteTask(taskId) {
        setTasks(tasks.filter((t) => t.id !== taskId));
    }

    return (
        <>
            <h1>Prague itinerary</h1>
            <AddTask onAddTask={handleAddTask} />
            <TaskList tasks={tasks} onChangeTask={handleChangeTask} onDeleteTask={handleDeleteTask} />
        </>
    );
}
```

각 이벤트 핸들러는 state를 업데이트하기 위해 `setTasks`를 호출합니다. 이 컴포넌트가 커짐에 따라 state 로직이 여기저기 분산되는 양도 증가합니다. 이러한 복잡성을 줄이고 모든 로직을 하나의 접근하기 쉬운 장소에 유지하기 위해, 그 state 로직을 컴포넌트 외부의 단일 함수인 "reducer"로 이동할 수 있습니다.

리듀서는 state를 처리하는 다른 방법입니다. `useState`에서 `useReducer`로 마이그레이션하는 것은 세 가지 단계로 진행할 수 있습니다.

1. **Move** from setting state to dispatching actions.
2. **Write** a reducer function.
3. **Use** the reducer from your component.

<br/>
<br/>
<br/>
<br/>

### Step 1: Move from setting state to dispatching actions

현재 이벤트 핸들러는 state를 설정하여 수행할 작업을 지정합니다.

```js
function handleAddTask(text) {
    setTasks([
        ...tasks,
        {
            id: nextId++,
            text: text,
            done: false,
        },
    ]);
}

function handleChangeTask(task) {
    setTasks(
        tasks.map((t) => {
            if (t.id === task.id) {
                return task;
            } else {
                return t;
            }
        })
    );
}

function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Remove all the state setting logic. What you are left with are three event handlers:

-   `handleAddTask(text)` is called when the user presses “Add”.
-   `handleChangeTask(task)` is called when the user toggles a task or presses “Save”.
-   `handleDeleteTask(taskId)` is called when the user presses “Delete”.

리듀서를 사용한 state 관리는 state를 직접 설정하는 것과 약간 다릅니다. React에 "무엇을 할 것인지" state를 설정하는 대신, 이벤트 핸들러에서 "사용자가 방금 무엇을 했는지"를 나타내는 "액션"을 dispatch합니다. (state 업데이트 로직은 다른 곳에 존재하게 됩니다!) 따라서 이벤트 핸들러를 통해 "작업을 설정하는" 대신, "작업을 추가/변경/삭제했다"는 액션을 dispatch하는 방식입니다. 이는 사용자의 의도를 더 잘 설명합니다.

```js
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
```

The object you pass to dispatch is called an “action”:

```js
function handleDeleteTask(taskId) {
    dispatch(
        // "action" object:
        {
            type: "deleted",
            id: taskId,
        }
    );
}
```

It is a regular JavaScript object. You decide what to put in it, 일반적으로 발생한 일에 대한 최소한의 정보를 포함해야 합니다.

<br/>
<br/>

**NOTE**

An action object can have any shape.

By convention, 발생한 일을 설명하는 문자열 타입을 주고, 추가 정보를 다른 필드에 전달하는 것이 일반적입니다. 타입은 특정 컴포넌트에 맞추어져야 하므로, 이 예제에서는 `'added'`나 `'added_task'`와 같은 이름이 적합합니다. 발생한 일을 잘 설명하는 이름을 선택하세요!

```js
dispatch({
    // specific to component
    type: "what_happened",
    // other fields go here
});
```

<br/>
<br/>
<br/>
<br/>

### Step 2: Write a reducer function

A reducer function is where you will put your state logic. It **takes two arguments**, the current state and the action object, and it returns the next state:

```js
function yourReducer(state, action) {
    // return next state for React to set
}
```

React는 리듀서에서 반환하는 값으로 state를 설정합니다.

이 예제에서 이벤트 핸들러에서 state setting logic을 리듀서 함수로 이동하려면 다음과 같은 단계를 수행해야 합니다:

1. 현재 state인 tasks를 첫 번째 인수로 선언합니다.
2. 액션 객체를 두 번째 인수로 선언합니다.
3. 리듀서에서 다음 state를 반환합니다. (이 값으로 React가 state를 설정합니다.)

Here is all the state setting logic migrated to a reducer function:

```js
function tasksReducer(tasks, action) {
    if (action.type === "added") {
        return [
            ...tasks,
            {
                id: action.id,
                text: action.text,
                done: false,
            },
        ];
    } else if (action.type === "changed") {
        return tasks.map((t) => {
            if (t.id === action.task.id) {
                return action.task;
            } else {
                return t;
            }
        });
    } else if (action.type === "deleted") {
        return tasks.filter((t) => t.id !== action.id);
    } else {
        throw Error("Unknown action: " + action.type);
    }
}
```

리듀서 함수가 state를 인수로 받기 때문에, 이를 컴포넌트 외부에 선언할 수 있습니다. 이렇게 하면 들여쓰기 수준이 줄어들고 코드를 더 읽기 쉽게 만들 수 있습니다.

<br/>
<br/>

**NOTE**

위의 코드는 `if/else` 문을 사용하고 있지만, 리듀서 내부에서는 `switch` 문을 사용하는 것이 일반적입니다. 결과는 동일하지만, `switch` 문이 한눈에 더 읽기 쉬울 수 있습니다.

```js
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
```

각 `case` 블록을 `{`와 `}` 중괄호로 감싸는 것을 권장합니다. 이렇게 하면 서로 다른 `case`에서 선언된 변수들이 충돌하지 않게 됩니다. 또한, 각 `case`는 보통 `return`으로 끝나는 것이 좋습니다. `return`을 잊으면 코드가 다음 `case`로 "흘러넘쳐" 잘못된 결과를 초래할 수 있습니다!

<br/>
<br/>

**DEEP DIVE**

**Why are reducers called this way?**

리듀서는 컴포넌트 내부의 코드 양을 "줄일" 수 있지만, 실제로는 배열에서 수행할 수 있는 `reduce()` 연산에서 이름이 유래되었습니다.

`reduce()` 연산은 배열을 사용하여 여러 값 중에서 "누적"하여 단일 값을 생성할 수 있게 해줍니다.

```js
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((result, number) => result + number); // 1 + 2 + 3 + 4 + 5
```

reduce에 전달하는 함수는 "reducer"라고 알려져 있습니다. 이 함수는 지금까지의 결과와 현재 항목을 받아서 다음 결과를 반환합니다. React 리듀서도 같은 개념의 예로, 현재 state와 액션을 받아서 다음 state를 반환합니다. 이렇게 하여 시간이 지남에 따라 액션을 state로 누적합니다.

초기 state와 액션 배열을 사용하여 최종 state를 계산할 때 `reduce()` 메서드를 사용할 수도 있습니다. 이 경우 리듀서 함수를 전달하면 됩니다.

```js
export default function tasksReducer(tasks, action) {
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
```

```js
import tasksReducer from "./tasksReducer.js";

let initialState = [];
let actions = [
    { type: "added", id: 1, text: "Visit Kafka Museum" },
    { type: "added", id: 2, text: "Watch a puppet show" },
    { type: "deleted", id: 1 },
    { type: "added", id: 3, text: "Lennon Wall pic" },
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById("output");
output.textContent = JSON.stringify(finalState, null, 2);
```

이 작업을 직접 할 필요는 없겠지만, 이는 React가 수행하는 방식과 유사합니다!

<br/>
<br/>
<br/>
<br/>

### Step 3: Use the reducer from your component

마지막으로, `tasksReducer`를 컴포넌트에 연결해야 합니다. React에서 useReducer 훅을 임포트하세요.

```js
import { useReducer } from "react";
```

Then you can replace useState:

```js
const [tasks, setTasks] = useState(initialTasks);
```

with useReducer like so:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` hook은 `useState`와 유사합니다. 초기 state를 전달해야 하며, state 값을 반환하고 state를 설정하는 방법(이 경우, dispatch 함수)을 제공합니다. 하지만 약간의 차이가 있습니다.

`useReducer` 훅은 두 개의 인수를 받습니다:

-   A reducer function
-   An initial state

And it returns:

-   A stateful value
-   A dispatch function (to “dispatch” user actions to the reducer)

```js
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
            <h1>Prague itinerary</h1>
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
    { id: 0, text: "Visit Kafka Museum", done: true },
    { id: 1, text: "Watch a puppet show", done: false },
    { id: 2, text: "Lennon Wall pic", done: false },
];
```

If you want, you can even move the reducer to a different file:

```js
export default function tasksReducer(tasks, action) {
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
```

관심사를 분리하면 Component logic이 더 읽기 쉬워질 수 있습니다. 이제 이벤트 핸들러는 액션을 디스패치하여 어떤 일이 발생했는지만 명시하고, 리듀서 함수는 그에 따라 state가 어떻게 업데이트되는지를 결정합니다.

<br/>
<br/>
<br/>
<br/>

## Comparing `useState` and `useReducer`

Reducers are not without downsides!

-   **Code size**:`useState`를 사용할 때는 초기 코드 작성이 적습니다. 반면 `useReducer`를 사용할 경우 리듀서 함수와 액션을 디스패치하는 코드를 모두 작성해야 합니다. 그러나 `useReducer`는 여러 이벤트 핸들러가 유사한 방식으로 state를 수정할 때 코드 양을 줄이는 데 도움이 될 수 있습니다.
-   **Readability**:state 업데이트가 간단할 때는 `useState`가 매우 읽기 쉽습니다. 하지만 업데이트가 복잡해지면 컴포넌트 코드가 부풀어져서 스캔하기 어려워질 수 있습니다. 이 경우 `useReducer`를 사용하면 업데이트 로직의 방식과 이벤트 핸들러에서 발생한 일(what happened)을 깔끔하게 분리할 수 있습니다.
-   **Debugging**: `useState`에서 버그가 발생했을 때, state가 잘못 설정된 위치와 이유를 파악하기 어려울 수 있습니다. `useReducer`를 사용하면 리듀서에 콘솔 로그를 추가하여 모든 state 업데이트와 그 이유(어떤 액션 때문인지)를 확인할 수 있습니다. 각 액션이 올바르면, 문제는 리듀서 로직 자체에 있다는 것을 알 수 있습니다. 하지만 `useState`보다 더 많은 코드를 검토해야 합니다.
-   **Testing**: 리듀서는 컴포넌트에 의존하지 않는 순수 함수입니다. 이는 리듀서를 별도로 내보내고 격리된 상태에서 테스트할 수 있음을 의미합니다. 일반적으로는 더 현실적인 환경에서 컴포넌트를 테스트하는 것이 좋지만, 복잡한 state 업데이트 로직의 경우 특정 초기 state와 액션에 대해 리듀서가 특정 상태를 반환하는지 확인하는 것이 유용할 수 있습니다.
-   **Personal preference**: 개인적인 취향

특정 컴포넌트에서 잘못된 state 업데이트로 인해 자주 버그가 발생하고 코드에 더 많은 구조를 도입하고 싶다면 리듀서를 사용하는 것을 권장합니다. 모든 경우에 리듀서를 사용할 필요는 없습니다: 자유롭게 혼합하여 사용할 수 있습니다! 같은 컴포넌트 내에서도 `useState`와 `useReducer`를 함께 사용할 수 있습니다.

<br/>
<br/>
<br/>
<br/>

## Writing reducers well

Two tips when writing reducers:

-   **Reducers must be pure.** Similar to state updater functions, 리듀서는 렌더링 중에 실행됩니다! (액션은 다음 렌더링까지 대기됩니다.) 이는 리듀서가 순수해야 함을 의미합니다. 동일한 입력은 항상 동일한 출력을 생성해야 합니다. **리듀서는 요청을 보내거나, 타임아웃을 예약하거나, 컴포넌트 외부에 영향을 미치는 부작용을 수행해서는 안 됩니다.** 객체와 배열은 변형 없이 업데이트해야 합니다.
-   **Each action describes a single user interaction, even if that leads to multiple changes in the data.** 예를 들어, 사용자가 리듀서로 관리되는 다섯 개의 필드가 있는 폼에서 "Reset"을 누르면, 다섯 개의 개별 set_field 액션 대신 하나의 reset_form 액션을 디스패치하는 것이 더 합리적입니다. 리듀서에서 모든 액션을 로그로 남기면, 그 로그는 어떤 상호작용이나 응답이 어떤 순서로 발생했는지를 재구성할 수 있을 만큼 명확해야 합니다. 이는 디버깅에 도움이 됩니다!

<br/>
<br/>
<br/>
<br/>

## Writing concise reducers with Immer

<br/>
<br/>
<br/>
<br/>
