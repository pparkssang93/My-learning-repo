# Sharing State Between Components

때때로 두 컴포넌트의 state가 **항상 함께 변경되기를 원할 때**가 있습니다. 이를 위해 두 컴포넌트에서 상태를 제거하고, 가장 가까운 공통 부모로 이동시킨 다음, props를 통해 상태를 전달합니다. 이를 "lifting state up"라고 하며, React 코드를 작성할 때 가장 흔히 하는 작업 중 하나입니다.

<br/>
<br/>
<br/>
<br/>

## Lifting state up by example

In this example, a parent Accordion component renders two separate Panels:

```js
<Accordion>
    <Panels />
    <Panels />
</Accordion>
```

각 `Panel` 컴포넌트는 내용이 표시되는지 여부를 결정하는 boolean 형태의 `isActive` state를 가집니다.

두 패널 모두에 대해 `Show` 버튼을 누르세요:

```js
import { useState } from "react";

function Panel({ title, children }) {
    const [isActive, setIsActive] = useState(false);
    return (
        <section className="panel">
            <h3>{title}</h3>
            {isActive ? <p>{children}</p> : <button onClick={() => setIsActive(true)}>Show</button>}
        </section>
    );
}

export default function Accordion() {
    return (
        <>
            <h2>Almaty, Kazakhstan</h2>
            <Panel title="About">
                With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its
                capital city.
            </Panel>
            <Panel title="Etymology">
                The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated
                as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the
                apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor
                of the modern domestic apple.
            </Panel>
        </>
    );
}
```

한 패널의 버튼을 누르는 것이 다른 패널에 영향을 주지 않는다는 점에 주목하세요. 이들은 독립적입니다.

![이미지](/IMG/REACT/STATE/sharing-state_01.png)

하지만 이제 한 번에 하나의 패널만 확장되도록 변경하고 싶다고 가정해 보겠습니다. 그런 디자인에서는 두 번째 패널을 확장하면 첫 번째 패널이 접혀야 합니다. 이를 어떻게 할 수 있을까요?

이 두 패널을 조정하기 위해서는 다음 세 가지 단계로 state를 부모 컴포넌트로 "끌어올려야" 합니다:

<br/>
<br/>
<br/>
<br/>

### Step 1: Remove state from the child components

패널의 `isActive` state를 부모 컴포넌트에서 제어하도록 할 것입니다. 이는 부모 컴포넌트가 `isActive`를 패널에 prop으로 전달하게 된다는 의미입니다. 먼저, 패널 컴포넌트에서 이 줄을 제거하세요:

```js
const [isActive, setIsActive] = useState(false);
```

And instead, add `isActive` to the Panel’s list of props:

```js
function Panel({ title, children, isActive })
```

이제 패널의 부모 컴포넌트가 `isActive`를 prop으로 전달한다. 반대로, 패널 컴포넌트는 `isActive`의 값을 제어할 수 없으며, 이제는 부모 컴포넌트에 의존하게 됩니다!

<br/>
<br/>
<br/>
<br/>

### Step 2: Pass hardcoded data from the common parent

state를 끌어올리기 위해서는 조정하려는 두 자식 컴포넌트의 가장 가까운 공통 부모 컴포넌트를 찾아야 합니다:

```js
//closest common parent
<Accordion>
    <Panels />
    <Panels />
</Accordion>
```

이 컴포넌트는 두 패널 위에 위치하고, 그들의 props를 제어할 수 있으므로 현재 활성화된 패널에 대한 "source of truth"이 됩니다. Accordion 컴포넌트가 두 패널에 하드코딩된 `isActive` 값을 (예: true) 전달하도록 만드세요:

```js
import { useState } from "react";

export default function Accordion() {
    return (
        <>
            <h2>Almaty, Kazakhstan</h2>
            <Panel title="About" isActive={true}>
                With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its
                capital city.
            </Panel>
            <Panel title="Etymology" isActive={true}>
                The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated
                as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the
                apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor
                of the modern domestic apple.
            </Panel>
        </>
    );
}

function Panel({ title, children, isActive }) {
    return (
        <section className="panel">
            <h3>{title}</h3>
            {isActive ? <p>{children}</p> : <button onClick={() => setIsActive(true)}>Show</button>}
        </section>
    );
}
```

Accordion 컴포넌트에서 하드코딩된 `isActive` 값을 수정해 보고, 화면에서 결과를 확인해 보세요.

<br/>
<br/>
<br/>
<br/>

### Step 3: Add state to the common parent

state를 끌어올리면 저장하는 state의 성격이 자주 변경됩니다.

이 경우에는 한 번에 하나의 패널만 활성화되어야 합니다. 따라서 Accordion 공통 부모 컴포넌트는 어떤 패널이 활성화되어 있는지를 추적해야 합니다. `boolean` 값 대신, 활성 패널의 인덱스를 상태 변수로 사용하는 숫자를 사용할 수 있습니다:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

When the activeIndex is 0, the first panel is active, and when it’s 1, it’s the second one.
각 패널에서 "Show" 버튼을 클릭하면 Accordion의 activeIndex를 변경해야 합니다. 패널은 activeIndex state를 직접 설정할 수 없으며, 이는 Accordion 내부에서 정의되기 때문입니다. Accordion 컴포넌트는 패널 컴포넌트가 자신의 state를 변경할 수 있도록 이벤트 핸들러를 prop으로 전달해야 합니다:

```js
<>
    <Panel isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
        ...
    </Panel>
    <Panel isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
        ...
    </Panel>
</>
```

패널 내부의 `<button>`은 이제 클릭 이벤트 핸들러로 `onShow` prop을 사용할 것입니다:

```js
import { useState } from "react";

function Accordion() {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <>
            <h2>Almaty, Kazakhstan</h2>
            <Panel title="About" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
                With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its
                capital city.
            </Panel>
            <Panel title="Etymology" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
                The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated
                as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the
                apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor
                of the modern domestic apple.
            </Panel>
        </>
    );
}

function Panel({ title, children, isActive, onShow }) {
    return (
        <section className="panel">
            <h3>{title}</h3>
            {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
        </section>
    );
}
```

이로써 상태를 끌어올리는 작업이 완료되었습니다! 공통 부모 컴포넌트로 상태를 이동함으로써 두 패널을 조정할 수 있게 되었습니다. 두 개의 "is shown" 플래그 대신 activeIndex를 사용함으로써 한 번에 하나의 패널만 활성화되도록 보장했습니다. 또한, **이벤트 핸들러를 자식에게 전달함으로써 자식이 부모의 상태를 변경할 수 있게 되었습니다.**

![이미지](/IMG/REACT/STATE/sharing-state_02.png)

<br/>
<br/>

**DEEP DIVE**

**Controlled and uncontrolled components**

local state가 있는 컴포넌트를 "uncontrolled" 컴포넌트라고 부른다. 예를 들어, `isActive` 상태 변수가 있는 원래의 패널 컴포넌트는 부모가 패널의 활성화 여부에 영향을 줄 수 없기 때문에 uncontrolled component입니다. (어떤 컴포넌트 기준으로??)

반면, 중요한 정보가 로컬 상태가 아닌 props에 의해 결정될 때, 그 컴포넌트를 "controlled" 컴포넌트라고 할 수 있습니다. 이는 부모 컴포넌트가 컴포넌트의 동작을 완전히 지정할 수 있게 해줍니다. `isActive` prop을 가진 패널 컴포넌트는 Accordion 컴포넌트에 의해 제어됩니다.

비제어 컴포넌트는 부모 내에서 사용하기가 더 쉬우며, 설정이 덜 필요합니다. 하지만 함께 조정하려고 할 때는 유연성이 떨어집니다. 제어 컴포넌트는 최대한 유연하지만, 부모 컴포넌트가 props로 완전히 설정해야 합니다.

실제로 "제어"와 "비제어"는 엄격한 기술 용어가 아니며, 각 컴포넌트는 일반적으로 로컬 상태와 props의 혼합을 가지고 있습니다. 그러나 이는 **컴포넌트가 어떻게 설계되었고 어떤 기능을 제공하는지에 대해 이야기할 때 유용한 방법**입니다.

컴포넌트를 작성할 때, 어떤 정보가 props를 통해 제어되어야 하고, 어떤 정보가 상태를 통해 비제어되어야 하는지 고려하세요. 하지만 나중에 마음을 바꾸고 리팩토링할 수도 있습니다.

<br/>
<br/>
<br/>
<br/>

## A single source of truth for each state

In a React application, many components will have their own state. 일부 state는 입력과 같은 리프 컴포넌트(트리의 가장 아래쪽에 있는 컴포넌트) 가까이에 "live"할 수 있습니다. 다른 state는 앱의 상단에 더 가까이 "live"할 수 있습니다. 예를 들어, 클라이언트 측 라우팅 라이브러리조차도 현재 경로를 React 상태에 저장하고 이를 props로 전달하여 구현되는 경우가 많습니다!

For each unique piece of state, you will choose the component that “owns” it. 이 원칙은 "single source of truth"이라고도 알려져 있습니다. 이는 모든 state가 한 곳에 존재한다는 의미가 아니라, 각 each piece of state에 대해 그 **정보를 보유하는 특정 컴포넌트가 존재**한다는 뜻입니다. 컴포넌트 간에 공유 상태를 중복하는 대신, 이를 공통의 상위 컴포넌트로 끌어올리고 필요한 자식에게 전달하세요.

앱은 작업하면서 변화할 것입니다. 각 상태 조각이 어디에 "존재"하는지를 파악하는 동안 상태를 위아래로 이동시키는 것이 일반적입니다. 이는 모두 과정의 일부입니다!
