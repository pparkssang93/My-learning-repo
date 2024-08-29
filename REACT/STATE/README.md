# 스테이트 STATE

컴포넌트는 종종 상호작용의 결과로 화면에 표시되는 내용을 변경해야 합니다. 예를 들어, 폼에 입력하면 입력 필드가 업데이트되고, 이미지 캐러셀에서 "다음"을 클릭하면 표시되는 이미지가 바뀌며, "구매"를 클릭하면 제품이 쇼핑 카트에 담깁니다. 컴포넌트는 현재 입력값, 현재 이미지, 쇼핑 카트와 같은 정보를 **"기억"**할 필요가 있습니다. React에서는 이러한 **컴포넌트 전용 메모리를 상태(state)**라고 부릅니다.

## When a regular variable isn’t enough

```js
const sculptureList = [
    {
        name: "Homenaje a la Neurocirugía",
        artist: "Marta Colvin Andrade",
        description:
            "Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.",
        url: "https://i.imgur.com/Mx7dA2Y.jpg",
        alt: "A bronze statue of two crossed hands delicately holding a human brain in their fingertips.",
    },
    {
        name: "Floralis Genérica",
        artist: "Eduardo Catalano",
        description:
            "This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.",
        url: "https://i.imgur.com/ZF6s192m.jpg",
        alt: "A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.",
    },
    {
        name: "Eternal Presence",
        artist: "John Woodrow Wilson",
        description:
            'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
        url: "https://i.imgur.com/aTtVpES.jpg",
        alt: "The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.",
    },
    {
        name: "Moai",
        artist: "Unknown Artist",
        description:
            "Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.",
        url: "https://i.imgur.com/RCwLEoQm.jpg",
        alt: "Three monumental stone busts with the heads that are disproportionately large with somber faces.",
    },
    {
        name: "Blue Nana",
        artist: "Niki de Saint Phalle",
        description:
            "The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.",
        url: "https://i.imgur.com/Sd1AgUOm.jpg",
        alt: "A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.",
    },
    {
        name: "Ultimate Form",
        artist: "Barbara Hepworth",
        description:
            "This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.",
        url: "https://i.imgur.com/2heNQDcm.jpg",
        alt: "A tall sculpture made of three elements stacked on each other reminding of a human figure.",
    },
    {
        name: "Cavaliere",
        artist: "Lamidi Olonade Fakeye",
        description:
            "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
        url: "https://i.imgur.com/wIdGuZwm.png",
        alt: "An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.",
    },
    {
        name: "Big Bellies",
        artist: "Alina Szapocznikow",
        description:
            "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
        url: "https://i.imgur.com/AlHTAdDm.jpg",
        alt: "The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.",
    },
    {
        name: "Terracotta Army",
        artist: "Unknown Artist",
        description:
            "The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.",
        url: "https://i.imgur.com/HMFmH6m.jpg",
        alt: "12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.",
    },
    {
        name: "Lunar Landscape",
        artist: "Louise Nevelson",
        description:
            "Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.",
        url: "https://i.imgur.com/rN7hY6om.jpg",
        alt: "A black matte sculpture where the individual elements are initially indistinguishable.",
    },
    {
        name: "Aureole",
        artist: "Ranjani Shettar",
        description:
            'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
        url: "https://i.imgur.com/okTpbHhm.jpg",
        alt: "A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.",
    },
    {
        name: "Hippos",
        artist: "Taipei Zoo",
        description: "The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.",
        url: "https://i.imgur.com/6o5Vuyu.jpg",
        alt: "A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.",
    },
];

export default function Gallery() {
    let index = 0;

    function handleClick() {
        index = index + 1;
    }

    let sculpture = sculptureList[index];
    return (
        <>
            <button onClick={handleClick}>Next</button>
            <h2>
                <i>{sculpture.name} </i>
                by {sculpture.artist}
            </h2>
            <h3>
                ({index + 1} of {sculptureList.length})
            </h3>
            <img src={sculpture.url} alt={sculpture.alt} />
            <p>{sculpture.description}</p>
        </>
    );
}
```

`handleClick` 이벤트 핸들러는 로컬 변수인 `index`를 업데이트하고 있습니다. 하지만 두 가지 이유로 그 변화가 보이지 않게 됩니다:

1. 로컬 변수는 렌더링 사이에 지속되지 않습니다. React가 이 컴포넌트를 두 번째로 렌더링할 때, 처음부터 다시 렌더링하며 로컬 변수의 변경 사항을 고려하지 않습니다.
2. 로컬 변수의 변경은 렌더링을 트리거하지 않습니다. React는 새로운 데이터로 컴포넌트를 다시 렌더링해야 한다는 것을 인식하지 못합니다.

컴포넌트를 새로운 데이터로 업데이트하려면 두 가지가 필요합니다:

1. 렌더링 사이에 데이터를 유지해야 합니다.
2. React가 새로운 데이터로 컴포넌트를 다시 렌더링하도록 트리거해야 합니다.

`useState` 훅은 다음 두 가지를 제공합니다:

1. 렌더링 사이에 데이터를 유지할 수 있는 상태 변수를 제공합니다.
2. 변수를 업데이트하고 React가 컴포넌트를 다시 렌더링하도록 트리거하는 상태 설정 함수(state setter function)를 제공합니다.

## Adding a state variable

To add a state variable, import `useState` from React at the top of the file:

```js
import { useState } from "react";
```

Then, replace this line:

```js
let index = 0;

const [index, setIndex] = useState(0);
```

`index` is **a state variable** and `setIndex` is **the setter function.**

The `[` and `]` syntax here is called **array destructuring** and it lets you read values from an array. **The array returned by `useState` always has exactly two items.**

### first Hook

React에서 `useState`와 "use"로 시작하는 다른 모든 함수는 **훅(Hook)**이라고 불립니다.
훅은 React가 렌더링하는 동안에만 사용할 수 있는 특별한 함수입니다

<br/>

<span style="color:#F29544">**CAUTIONS**</span>

훅(Hooks)—"use"로 시작하는 함수—은 컴포넌트의 최상위나 자신만의 훅에서만 호출할 수 있습니다. 조건문, 루프, 또는 다른 중첩 함수 안에서는 훅을 호출할 수 없습니다. 훅은 함수이지만, 컴포넌트의 필요에 대한 무조건적인 선언으로 생각하는 것이 유용합니다. 컴포넌트의 상단에서 React 기능을 "사용"하는 것은 파일의 상단에서 모듈을 "임포트"하는 것과 유사합니다.

<span style="font-weight:bold; color:#AFBF75">NOTE</span>

**The convention is to name this pair** like `const [something, setSomething]`. You could name it anything you like, but conventions make things easier to understand across projects.

The only argument to useState is the initial value of your state variable.

<br/>
<br/>
<br/>

컴포넌트가 렌더링될 때마다, `useState`는 두 가지 값을 포함하는 배열을 제공한다.

1. 저장한 값이 있는 상태 변수(`index`).
2. 상태 변수를 업데이트하고 React가 컴포넌트를 다시 렌더링하도록 트리거할 수 있는 상태 설정 함수(`setIndex`).

```js
const [index, setIndex] = useState(0);
```

1. 당신의 컴포넌트가 처음 렌더링됩니다. `useState`에 0을 초기 값으로 전달했기 때문에, `[0, setIndex]`를 반환하고 React는 0이 최신 상태 값임을 기억합니다.
2. 상태를 업데이트합니다. 사용자가 버튼을 클릭하면 `setIndex(index + 1)`이 호출됩니다. `index`는 0이므로 `setIndex(1)`이 됩니다. 이는 React에게 `index`가 이제 1임을 기억하라고 하고, 또 다른 렌더링을 트리거합니다.
3. 컴포넌트의 두 번째 렌더링입니다. React는 여전히 `useState(0)`을 보지만, React는 `index`를 1로 설정했음을 기억하기 때문에 `[1, setIndex]`를 대신 반환합니다.
4. And so on!

## Giving a component multiple state variables

You can have as many state variables of as many types as you like in one component.

```js
import { useState } from "react";
const sculptureList = [
    {
        name: "Homenaje a la Neurocirugía",
        artist: "Marta Colvin Andrade",
        description:
            "Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.",
        url: "https://i.imgur.com/Mx7dA2Y.jpg",
        alt: "A bronze statue of two crossed hands delicately holding a human brain in their fingertips.",
    },
    {
        name: "Floralis Genérica",
        artist: "Eduardo Catalano",
        description:
            "This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.",
        url: "https://i.imgur.com/ZF6s192m.jpg",
        alt: "A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.",
    },
    {
        name: "Eternal Presence",
        artist: "John Woodrow Wilson",
        description:
            'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
        url: "https://i.imgur.com/aTtVpES.jpg",
        alt: "The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.",
    },
    {
        name: "Moai",
        artist: "Unknown Artist",
        description:
            "Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.",
        url: "https://i.imgur.com/RCwLEoQm.jpg",
        alt: "Three monumental stone busts with the heads that are disproportionately large with somber faces.",
    },
];

export default function Gallery() {
    const [index, setIndex] = useState(0);
    const [showMore, setShowMore] = useState(false);

    function handleNextClick() {
        setIndex(index + 1);
    }

    function handleMoreClick() {
        setShowMore(!showMore);
    }

    let sculpture = sculptureList[index];
    return (
        <>
            <button onClick={handleNextClick}>Next</button>
            <h2>
                <i>{sculpture.name} </i>
                by {sculpture.artist}
            </h2>
            <h3>
                ({index + 1} of {sculptureList.length})
            </h3>
            <button onClick={handleMoreClick}>{showMore ? "Hide" : "Show"} details</button>
            {showMore && <p>{sculpture.description}</p>}
            <img src={sculpture.url} alt={sculpture.alt} />
        </>
    );
}
```

상태가 서로 관련이 없는 경우, 예를 들어 이 예시의 `index`와 `showMore`처럼 여러 개의 상태 변수를 가지는 것이 좋습니다. 그러나 두 개의 상태 변수를 자주 함께 변경해야 한다면, 하나로 결합하는 것이 더 쉬울 수 있습니다. 예를 들어, 여러 필드가 있는 폼이 있다면, 각 필드마다 상태 변수를 두는 것보다 객체를 담고 있는 단일 상태 변수를 사용하는 것이 더 편리합니다.

<br/>
<br/>
<br/>

<span style="font-weight:bold; color:rgb(70, 142, 242)">DEEP DIVE</span>

**How does React know which state to return?**

`useState` 호출이 어떤 상태 변수를 참조하는지에 대한 정보가 전달되지 않는다. `useState`에 "식별자"가 없기 때문에, 어떻게 어떤 상태 변수를 반환하는지 알 수 있을까요?

간결한 문법을 가능하게 하기 위해 훅은 동일한 컴포넌트의 모든 렌더링에서 **안정적인 호출 순서에 의존**합니다. 위의 규칙("훅은 최상위에서만 호출해야 한다")을 따르면, 훅은 항상 같은 순서로 호출됩니다. 또한, 린터 플러그인이 대부분의 실수를 잡아냅니다.

내부적으로 React는 **각 컴포넌트에 대한 상태 쌍의 배열을 유지**합니다. 또한 현재 쌍 인덱스를 유지하며, 렌더링 전에 0으로 설정됩니다. `useState`를 호출할 때마다 React는 다음 상태 쌍을 제공하고 인덱스를 증가시킵니다.

```js
let componentHooks = [];
let currentHookIndex = 0;

// How useState works inside React (simplified).
function useState(initialState) {
    let pair = componentHooks[currentHookIndex];
    if (pair) {
        // This is not the first render,
        // so the state pair already exists.
        // Return it and prepare for next Hook call.
        currentHookIndex++;
        return pair;
    }

    // This is the first time we're rendering,
    // so create a state pair and store it.
    pair = [initialState, setState];

    function setState(nextState) {
        // When the user requests a state change,
        // put the new value into the pair.
        pair[0] = nextState;
        updateDOM();
    }

    // Store the pair for future renders
    // and prepare for the next Hook call.
    componentHooks[currentHookIndex] = pair;
    currentHookIndex++;
    return pair;
}

function Gallery() {
    // Each useState() call will get the next pair.
    const [index, setIndex] = useState(0);
    const [showMore, setShowMore] = useState(false);

    function handleNextClick() {
        setIndex(index + 1);
    }

    function handleMoreClick() {
        setShowMore(!showMore);
    }

    let sculpture = sculptureList[index];
    // This example doesn't use React, so
    // return an output object instead of JSX.
    return {
        onNextClick: handleNextClick,
        onMoreClick: handleMoreClick,
        header: `${sculpture.name} by ${sculpture.artist}`,
        counter: `${index + 1} of ${sculptureList.length}`,
        more: `${showMore ? "Hide" : "Show"} details`,
        description: showMore ? sculpture.description : null,
        imageSrc: sculpture.url,
        imageAlt: sculpture.alt,
    };
}

function updateDOM() {
    // Reset the current Hook index
    // before rendering the component.
    currentHookIndex = 0;
    let output = Gallery();

    // Update the DOM to match the output.
    // This is the part React does for you.
    nextButton.onclick = output.onNextClick;
    header.textContent = output.header;
    moreButton.onclick = output.onMoreClick;
    moreButton.textContent = output.more;
    image.src = output.imageSrc;
    image.alt = output.imageAlt;
    if (output.description !== null) {
        description.textContent = output.description;
        description.style.display = "";
    } else {
        description.style.display = "none";
    }
}

let nextButton = document.getElementById("nextButton");
let header = document.getElementById("header");
let moreButton = document.getElementById("moreButton");
let description = document.getElementById("description");
let image = document.getElementById("image");
let sculptureList = [
    {
        name: "Homenaje a la Neurocirugía",
        artist: "Marta Colvin Andrade",
        description:
            "Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.",
        url: "https://i.imgur.com/Mx7dA2Y.jpg",
        alt: "A bronze statue of two crossed hands delicately holding a human brain in their fingertips.",
    },
    {
        name: "Floralis Genérica",
        artist: "Eduardo Catalano",
        description:
            "This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.",
        url: "https://i.imgur.com/ZF6s192m.jpg",
        alt: "A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.",
    },
    {
        name: "Eternal Presence",
        artist: "John Woodrow Wilson",
        description:
            'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
        url: "https://i.imgur.com/aTtVpES.jpg",
        alt: "The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.",
    },
    {
        name: "Moai",
        artist: "Unknown Artist",
        description:
            "Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.",
        url: "https://i.imgur.com/RCwLEoQm.jpg",
        alt: "Three monumental stone busts with the heads that are disproportionately large with somber faces.",
    },
    {
        name: "Blue Nana",
        artist: "Niki de Saint Phalle",
        description:
            "The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.",
        url: "https://i.imgur.com/Sd1AgUOm.jpg",
        alt: "A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.",
    },
    {
        name: "Ultimate Form",
        artist: "Barbara Hepworth",
        description:
            "This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.",
        url: "https://i.imgur.com/2heNQDcm.jpg",
        alt: "A tall sculpture made of three elements stacked on each other reminding of a human figure.",
    },
    {
        name: "Cavaliere",
        artist: "Lamidi Olonade Fakeye",
        description:
            "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
        url: "https://i.imgur.com/wIdGuZwm.png",
        alt: "An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.",
    },
    {
        name: "Big Bellies",
        artist: "Alina Szapocznikow",
        description:
            "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
        url: "https://i.imgur.com/AlHTAdDm.jpg",
        alt: "The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.",
    },
    {
        name: "Terracotta Army",
        artist: "Unknown Artist",
        description:
            "The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.",
        url: "https://i.imgur.com/HMFmH6m.jpg",
        alt: "12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.",
    },
    {
        name: "Lunar Landscape",
        artist: "Louise Nevelson",
        description:
            "Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.",
        url: "https://i.imgur.com/rN7hY6om.jpg",
        alt: "A black matte sculpture where the individual elements are initially indistinguishable.",
    },
    {
        name: "Aureole",
        artist: "Ranjani Shettar",
        description:
            'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
        url: "https://i.imgur.com/okTpbHhm.jpg",
        alt: "A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.",
    },
    {
        name: "Hippos",
        artist: "Taipei Zoo",
        description: "The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.",
        url: "https://i.imgur.com/6o5Vuyu.jpg",
        alt: "A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.",
    },
];

// Make UI match the initial state.
updateDOM();
```

## State is isolated and private

동일한 컴포넌트를 여러 번 렌더링할 경우 각 인스턴스가 독립적인 상태를 가진다

```js
import { useState } from "react";
import { sculptureList } from "./data.js";

function Gallery() {
    const [index, setIndex] = useState(0);
    const [showMore, setShowMore] = useState(false);

    function handleNextClick() {
        setIndex(index + 1);
    }

    function handleMoreClick() {
        setShowMore(!showMore);
    }

    let sculpture = sculptureList[index];
    return (
        <section>
            <button onClick={handleNextClick}>Next</button>
            <h2>
                <i>{sculpture.name} </i>
                by {sculpture.artist}
            </h2>
            <h3>
                ({index + 1} of {sculptureList.length})
            </h3>
            <button onClick={handleMoreClick}>{showMore ? "Hide" : "Show"} details</button>
            {showMore && <p>{sculpture.description}</p>}
            <img src={sculpture.url} alt={sculpture.alt} />
        </section>
    );
}

function Page() {
    return (
        <div className="Page">
            <Gallery />
            <Gallery />
        </div>
    );
}
```

두 개의 `<Gallery />` 컴포넌트를 렌더링했으므로, 각 갤러리의 상태가 별도로 저장됩니다.

또한, `Page` 컴포넌트는 `Gallery`의 상태나 그것이 존재하는지조차 '모른다'. state는 이를 선언한 컴포넌트에 완전히 개인적입니다. **부모 컴포넌트는 상태를 변경할 수 없습니다.** 이는 상태를 어떤 컴포넌트에 추가하거나 제거해도 나머지 컴포넌트에 영향을 주지 않도록 해줍니다.

만약 두 갤러리가 상태를 동기화해야 한다면, React에서 올바른 방법은 자식 컴포넌트에서 상태를 제거하고 가장 가까운 공유 부모 컴포넌트에 추가하는 것입니다.

## Setting state triggers renders

사용자 인터페이스가 클릭과 같은 사용자 이벤트에 직접 반응하여 변한다고 생각할 수 있다. 그러나 React에서는 조금 다르게 작동합니다. 이전 페이지(render and commit chapter)에서 state를 설정하는 것이 React에 re-renders를 요청한다는 것을 보았습니다. UI가 이벤트에 반응하려면 상태를 업데이트해야 합니다.

```js
import { useState } from "react";

export default function Form() {
    const [isSent, setIsSent] = useState(false);
    const [message, setMessage] = useState("Hi!");
    if (isSent) {
        return <h1>Your message is on its way!</h1>;
    }
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                setIsSent(true);
                sendMessage(message);
            }}
        >
            <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button type="submit">Send</button>
        </form>
    );
}

function sendMessage(message) {
    // ...
}
```

버튼을 클릭하면 다음과 같은 일이 발생합니다:

1. onSubmit 이벤트 핸들러가 실행됩니다.
2. `setIsSent(true)`가 `isSent`를 `true`로 설정하고 새로운 렌더를 대기합니다.
3. React는 새로운 `isSent` 값에 따라 컴포넌트를 재렌더링합니다.

## Rendering takes a snapshot in time 

“Rendering” means that React is calling your component, which is a function. 이 함수에서 반환하는 JSX는 시간의 한 시점에 UI 스냅샷과 같습니다. 이때의 props, 이벤트 핸들러, 로컬 변수는 모두 해당 렌더링 시점의 상태를 사용하여 계산됩니다.

**When React re-renders a component:**

1. React calls your function again.
2. Your function returns a new JSX snapshot.
3. React then updates the screen to match the snapshot your function returned.

As a component’s memory, state is not like a regular variable that disappears after your function returns. (state는 함수가 리턴된 후 사라지지 않는다.) 함수 외부에 존재합니다.

React가 컴포넌트를 호출할 때, 특정 렌더에 대한 상태의 스냅샷을 제공합니다. 당신의 컴포넌트는 그 렌더에서의 상태 값을 사용하여 계산된 새로운 props와 이벤트 핸들러 세트를 포함한 UI의 스냅샷을 JSX로 반환합니다!

아래 예제에서는 ‘+3’ 버튼을 클릭하면 `setNumber(number + 1)`가 세 번 호출되기 때문에 카운터가 세 번 증가할 것이라고 예상할 수 있습니다.

See what happens when you click the “+3” button:
상태를 설정하는 것은 다음 렌더에만 변경 사항을 적용합니다. 첫 번째 렌더링에서 `number`는 0이었습니다. 그래서 그 렌더의 `onClick` 핸들러에서 `setNumber(number + 1)`가 호출되었음에도 불구하고 `number`의 값은 여전히 0인 것입니다.

```js
import { useState } from "react";

export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
        <>
            <h1>{number}</h1>
            <button
                onClick={() => {
                    setNumber(number + 1);
                    setNumber(number + 1);
                    setNumber(number + 1);
                }}
            >
                +3
            </button>
        </>
    );
}
```

상태를 설정하는 것은 다음 렌더에만 변경 사항을 적용합니다. 첫 번째 렌더링(init render??)에서 `number`는 0이었습니다. 그래서 그 렌더의 `onClick` 핸들러에서 `setNumber(number + 1)`가 호출되었음에도 불구하고 `number`의 값은 여전히 0인 것입니다.

이 버튼의 클릭 핸들러가 React에 지시하는 내용은 다음과 같습니다:

1. `setNumber(number + 1)`: `number`는 0이므로 `setNumber(0 + 1)`이 호출됩니다.  
   React는 다음 렌더에서 `number`를 1로 변경할 준비를 합니다.
2. `setNumber(number + 1)`: `number`는 여전히 0이므로 다시 `setNumber(0 + 1)`이 호출됩니다.  
   React는 다음 렌더에서 `number`를 1로 변경할 준비를 합니다.
3. `setNumber(number + 1)`: `number`는 여전히 0이므로 다시 `setNumber(0 + 1)`이 호출됩니다.  
   React는 다음 렌더에서 `number`를 1로 변경할 준비를 합니다.

비록 `setNumber(number + 1)`을 세 번 호출했지만, 이 렌더의 이벤트 핸들러에서 `number`는 항상 0이므로 상태를 1로 세 번 설정한 것입니다. 그래서 이벤트 핸들러가 끝난 후, React는 `number`가 1인 상태로 컴포넌트를 재렌더링하는 것입니다.

## State over time

Well, that was fun. Try to guess what clicking this button will alert:

```js
import { useState } from "react";

export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
        <>
            <h1>{number}</h1>
            <button
                onClick={() => {
                    setNumber(number + 5);
                    alert(number);
                }}
            >
                +5
            </button>
        </>
    );
}
```

0이 출력된다.

But what if you put a timer on the alert, so it only fires after the component re-rendered? Would it say “0” or “5”? Have a guess!

```js
export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
        <>
            <h1>{number}</h1>
            <button
                onClick={() => {
                    setNumber(number + 5);
                    setTimeout(() => {
                        alert(number);
                    }, 3000);
                }}
            >
                +5
            </button>
        </>
    );
}
```

Surprised? If you use the substitution method, you can see the “snapshot” of the state passed to the alert.

렌더링 중에는 **state 변수의 값이 변경되지 않으며**, **이벤트 핸들러의 코드가 비동기적일지라도 마찬가지입니다.** 해당 render's `onClick` 안에서 `setNumber(number + 5)`가 호출되었어도 `number`의 값은 계속 0입니다. **React가 UI의 스냅샷을 ‘찍었을’ 때 값이 고정된 것입니다.** (핵심 내용)

## React batches state updates 

```js
import { useState } from "react";

export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
        <>
            <h1>{number}</h1>
            <button
                onClick={() => {
                    setNumber(number + 1);
                    setNumber(number + 1);
                    setNumber(number + 1);
                }}
            >
                +3
            </button>
        </>
    );
}
```

하지만 이전 섹션에서 언급했듯이, 각 렌더의 상태 값은 고정되어 있기 때문에 첫 번째 렌더의 이벤트 핸들러 안에 있는 `number`의 값은 `setNumber(1)`을 몇 번 호출하더라도 항상 0입니다.

하지만 여기에는 또 다른 요소가 작용합니다. React는 **이벤트 핸들러의 모든 코드가 실행된 후에 상태 업데이트를 처리합니다. 그래서 모든 `setNumber()` 호출이 끝난 후에만 재렌더링이 발생**하는 것입니다.

이는 마치 식당에서 웨이터가 주문을 받는 것과 비슷합니다. 웨이터는 첫 번째 요리를 언급했다고 해서 주방으로 달려가지 않습니다! 대신, 주문을 마칠 때까지 기다리고, 변경 사항을 반영하며, 테이블의 다른 사람들로부터도 주문을 받습니다.

이렇게 하면 여러 상태 변수를 업데이트할 수 있으며, 여러 컴포넌트에서 업데이트하더라도 너무 많은 재렌더링을 유발하지 않습니다. 하지만 이는 **UI가 이벤트 핸들러와 그 안의 모든 코드가 완료될 때까지 업데이트되지 않음을 의미**합니다. 이러한 동작은 **배칭(batching)**이라고도 하며, React 앱의 성능을 크게 향상시킵니다. 또한 일부 변수만 업데이트된 상태의 혼란스러운 '반쯤 완료된' 렌더링을 피할 수 있습니다.

React는 클릭과 같은 여러 의도적 이벤트 간에는 배칭을 하지 않으며, 각 클릭은 별도로 처리됩니다. React는 일반적으로 안전할 때만 배칭을 수행하므로, 예를 들어 첫 번째 버튼 클릭이 폼을 비활성화하면 두 번째 클릭이 다시 제출되지 않도록 보장합니다.

## Updating the same state multiple times before the next render 

React에게 '상태 값을 가지고 뭔가를 하라'고 지시하는 방법. 이전 state를 기반으로 다음 state를 계산하는 함수를 전달할 수 있습니다.

```js
import { useState } from "react";

export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
        <>
            <h1>{number}</h1>
            <button
                onClick={() => {
                    setNumber((n) => n + 1);
                    setNumber((n) => n + 1);
                    setNumber((n) => n + 1);
                }}
            >
                +3
            </button>
        </>
    );
}
```

여기서 `n => n + 1`은 **업데이트 함수(updater function)**라고 합니다. When you pass it to a state setter:

1. React queues this function to be processed after all the other code in the event handler has run.
2. 다음 렌더링 동안, React는 큐를 순회하며 최종 업데이트된 상태를 제공합니다.

다음은 이벤트 핸들러를 실행하면서 React가 이 코드 줄들을 처리하는 방식입니다:

1. `setNumber(n => n + 1)`: `n => n + 1`은 함수입니다. React는 이를 큐에 추가합니다.
2. `setNumber(n => n + 1)`: `n => n + 1`은 함수입니다. React는 이를 큐에 추가합니다.
3. `setNumber(n => n + 1)`: `n => n + 1`은 함수입니다. React는 이를 큐에 추가합니다.

다음 렌더링에서 `useState`를 호출하면 **React는 큐를 순회**합니다. 이전 `number` 상태는 0이므로, React는 이를 첫 번째 업데이트 함수의 `n` 인수로 전달합니다. 그런 다음 React는 이전 업데이트 함수의 반환 값을 가져와서 다음 업데이트 함수에 `n`으로 전달하고, 이 과정을 계속 진행합니다.

### What happens if you update state after replacing it

state를 교체한 후에 state를 업데이트하면 어떻게 될까요?

What about this event handler? What do you think `number` will be in the next render?

```js
import { useState } from "react";

export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
        <>
            <h1>{number}</h1>
            <button
                onClick={() => {
                    setNumber(number + 5);
                    setNumber((n) => n + 1);
                }}
            >
                Increase the number
            </button>
        </>
    );
}
```

이 이벤트 핸들러는 React에게 다음과 같이 지시합니다:

1. `setNumber(number + 5)`: `number`는 0이므로 `setNumber(0 + 5)`가 됩니다. React는 '5로 교체'라는 작업을 큐에 추가합니다.
2. `setNumber(n => n + 1)`: `n => n + 1`은 업데이트 함수입니다. React는 이 함수를 큐에 추가합니다.

React stores `6` as the final result and returns it from `useState`.

### What happens if you replace state after updating it 

state를 업데이트한 후에 교체하면 어떻게 될까요?

```js
import { useState } from "react";

export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
        <>
            <h1>{number}</h1>
            <button
                onClick={() => {
                    setNumber(number + 5);
                    setNumber((n) => n + 1);
                    setNumber(42);
                }}
            >
                Increase the number
            </button>
        </>
    );
}
```

이 이벤트 핸들러를 실행하면서 React가 이 코드를 처리하는 방식은 다음과 같습니다:

1. `setNumber(number + 5)`: `number`는 0이므로 `setNumber(0 + 5)`가 됩니다. React는 '5로 교체'라는 작업을 큐에 추가합니다.
2. `setNumber(n => n + 1)`: `n => n + 1`은 업데이트 함수입니다. React는 이 함수를 큐에 추가합니다.
3. `setNumber(42)`: React는 '42로 교체'라는 작업을 큐에 추가합니다.

To summarize, here’s how you can think of what you’re passing to the `setNumber` state setter:

1. 업데이트 함수(예: `n => n + 1`)는 큐에 추가됩니다.
2. **Any other value** (e.g. number `5`) adds “replace with `5`” to the queue, ignoring what’s already queued.

이벤트 핸들러가 완료된 후, React는 리렌더링을 트리거합니다. 리렌더링 동안 React는 큐를 처리합니다. 업데이트 함수는 렌더링 중에 실행되므로, 업데이트 함수는 순수해야 하며 오직 결과만 반환해야 합니다. 그 안에서 state를 설정하거나 다른 side effects을 실행하지 마세요.

### Updater function naming conventions 

It’s common to name the updater function argument by the first letters of the corresponding state variable:

```js
setEnabled((e) => !e);
setLastName((ln) => ln.reverse());
setFriendCount((fc) => fc * 2);
```

예를 들어 `setEnabled(enabled => !enabled)`와 같이 하거나, 접두사를 사용하여 `setEnabled(prevEnabled => !prevEnabled)`와 같이 사용할 수 있습니다."

# Updating Objects in State

state는 객체를 포함한 모든 종류의 JavaScript 값을 저장할 수 있습니다. 하지만 React state에 있는 객체를 직접 변경해서는 안 됩니다. 대신, 객체를 업데이트하려면 새로운 객체를 생성하거나 기존 객체의 복사본을 만들어야 하며, 그 다음에 상태를 해당 복사본으로 설정해야 합니다.

## What’s a mutation?

You can store any kind of JavaScript value in state.

```js
const [x, setX] = useState(0);
```

지금까지 숫자, 문자열, 불리언을 다루어왔습니다. 이러한 종류의 JavaScript 값은 '불변(immutable)'으로, 즉 변경할 수 없거나 '읽기 전용'입니다. 값을 교체하기 위해 리렌더링을 트리거할 수 있습니다:

```js
setX(5);
```

x 상태는 0에서 5로 변경되었지만, 숫자 0 자체는 변하지 않았습니다. JavaScript에서 숫자, 문자열, 불리언과 같은 내장 원시 값은 변경할 수 없습니다.

Now consider an object in state:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

기술적으로 객체 자체의 내용을 변경하는 것은 가능합니다. 이를 **변경(mutation)**이라고 합니다:

```js
position.x = 5;
```

하지만 React state의 객체는 기술적으로 변경 가능하더라도, 숫자, 불리언, 문자열처럼 불변으로 취급해야 합니다. 객체를 변경하는 대신 항상 교체해야 합니다.

## Treat state as read-only

state를 읽기 전용으로 취급하세요

state에 넣은 모든 JavaScript 객체를 읽기 전용으로 취급해야 합니다.

이 예제에서는 현재 포인터 위치를 나타내기 위해 상태에 객체를 보유하고 있습니다. 빨간 점은 미리보기 영역을 터치하거나 커서를 이동할 때 움직여야 하지만, 점은 초기 위치에 머물러 있습니다:

```js
import { useState } from "react";
export default function MovingDot() {
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });
    return (
        <div
            onPointerMove={(e) => {
                position.x = e.clientX;
                position.y = e.clientY;
            }}
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    left: -10,
                    top: -10,
                    width: 20,
                    height: 20,
                }}
            />
        </div>
    );
}
```

The problem is with this bit of code.

```js
onPointerMove={e => {
	position.x = e.clientX;
	position.y = e.clientY;
}}
```

이 코드는 이전 렌더링에서 position에 할당된 객체를 수정합니다. 그러나 **the state setting function를 사용하지 않으면 React는 해당 객체가 변경되었는지 알 수 없습니다.** 따라서 React는 아무런 반응을 하지 않습니다. 이는 식사를 이미 마신 후에 주문을 변경하려고 하는 것과 같습니다. state를 변경하는 것이 경우에 따라 작동할 수 있지만, 우리는 이를 권장하지 않습니다. 렌더링에서 접근할 수 있는 state 값을 read-only 취급해야 합니다.

실제로 이 경우 리렌더링을 트리거하려면 새로운 객체를 생성하고 상태 설정 함수에 전달해야 합니다:

```js
onPointerMove={e => {
	setPosition({
		x: e.clientX,
		y: e.clientY
	});
}}
```

setPosition을 사용하여 React에 다음과 같이 지시하는 것입니다:

1. position을 이 새로운 객체로 교체하세요.
2. 이 컴포넌트를 다시 렌더링하세요.

```js
import { useState } from "react";
export default function MovingDot() {
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });
    return (
        <div
            onPointerMove={(e) => {
                setPosition({
                    x: e.clientX,
                    y: e.clientY,
                });
            }}
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    left: -10,
                    top: -10,
                    width: 20,
                    height: 20,
                }}
            />
        </div>
    );
}
```

<span style="font-weight:bold; color:rgb(70, 142, 242)">DEEP DIVE</span>

**Local mutation is fine**

이와 같은 코드는 state에 있는 기존 객체를 수정하기 때문에 문제입니다:

```js
position.x = e.clientX;
position.y = e.clientY;
```

하지만 이와 같은 코드는 방금 생성한 새로운 객체를 변경하기 때문에 전혀 문제가 없습니다:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

In fact, it is completely equivalent to writing this:

```js
setPosition({
    x: e.clientX,
    y: e.clientY,
});
```

변경(mutation)은 이미 state에 있는 기존 객체를 변경할 때만 문제가 됩니다. 방금 생성한 객체를 변경하는 것은 괜찮습니다. 왜냐하면 다른 코드가 아직 그 객체를 참조하지 않기 때문입니다. 이를 **'로컬 변경(local mutation)'**이라고 합니다. 렌더링 중에도 로컬 변경을 할 수 있습니다. 매우 편리하고 전혀 문제되지 않습니다!

## Copying objects with the spread syntax

종 새로운 객체를 만들 때 기존 데이터를 포함하고 싶을 것입니다. 예를 들어, 폼에서 하나의 필드만 업데이트하고 다른 모든 필드의 이전 값을 유지하고 싶을 수 있습니다.

이러한 입력 필드는 onChange 핸들러가 state를 변경하기 때문에 작동하지 않습니다:

```js
import { useState } from "react";

export default function Form() {
    const [person, setPerson] = useState({
        firstName: "Barbara",
        lastName: "Hepworth",
        email: "bhepworth@sculpture.com",
    });

    function handleFirstNameChange(e) {
        person.firstName = e.target.value;
    }

    function handleLastNameChange(e) {
        person.lastName = e.target.value;
    }

    function handleEmailChange(e) {
        person.email = e.target.value;
    }

    return (
        <>
            <label>
                First name:
                <input value={person.firstName} onChange={handleFirstNameChange} />
            </label>
            <label>
                Last name:
                <input value={person.lastName} onChange={handleLastNameChange} />
            </label>
            <label>
                Email:
                <input value={person.email} onChange={handleEmailChange} />
            </label>
            <p>
                {person.firstName} {person.lastName} ({person.email})
            </p>
        </>
    );
}
```

이 줄은 이전 렌더링에서 상태를 변경합니다:

```js
person.firstName = e.target.value;
```

원하는 동작을 얻는 신뢰할 수 있는 방법은 새로운 객체를 생성하고 이를 setPerson에 전달하는 것입니다. 하지만 여기서는 기존 데이터를 복사해야 합니다. 왜냐하면 오직 하나의 필드만 변경되었기 때문입니다:

```js
setPerson({
    firstName: e.target.value, // New first name from the input
    lastName: person.lastName,
    email: person.email,
});
```

You can use the `...` object spreadsyntax so that you don’t need to copy every property separately.

```js
setPerson({
    ...person, // Copy the old fields
    firstName: e.target.value, // But override this one
});
```

이제 폼이 작동합니다!

각 입력 필드에 대해 별도의 state 변수를 선언하지 않았다는 점에 주목하세요. 큰 폼의 경우, 모든 데이터를 객체로 그룹화하여 유지하는 것이 매우 편리합니다—단, 올바르게 업데이트하는 것이 중요합니다!

```js
import { useState } from "react";

export default function Form() {
    const [person, setPerson] = useState({
        firstName: "Barbara",
        lastName: "Hepworth",
        email: "bhepworth@sculpture.com",
    });

    function handleFirstNameChange(e) {
        setPerson({
            ...person,
            firstName: e.target.value,
        });
    }

    function handleLastNameChange(e) {
        setPerson({
            ...person,
            lastName: e.target.value,
        });
    }

    function handleEmailChange(e) {
        setPerson({
            ...person,
            email: e.target.value,
        });
    }

    return (
        <>
            <label>
                First name:
                <input value={person.firstName} onChange={handleFirstNameChange} />
            </label>
            <label>
                Last name:
                <input value={person.lastName} onChange={handleLastNameChange} />
            </label>
            <label>
                Email:
                <input value={person.email} onChange={handleEmailChange} />
            </label>
            <p>
                {person.firstName} {person.lastName} ({person.email})
            </p>
        </>
    );
}
```

주의할 점은 `...` 전개 구문이 '**얕은(shallow)' 복사**라는 것입니다. 이는 한 단계 깊이의 것만 복사합니다. 이로 인해 빠르지만, 중첩된 속성을 업데이트하려면 여러 번 사용해야 한다는 의미이기도 합니다.

<span style="font-weight:bold; color:rgb(70, 142, 242)">DEEP DIVE</span>

**Using a single event handler for multiple fields**

You can also use the [ ] braces inside your object definition to specify a property with dynamic name.

```js
import { useState } from "react";

export default function Form() {
    const [person, setPerson] = useState({
        firstName: "Barbara",
        lastName: "Hepworth",
        email: "bhepworth@sculpture.com",
    });

    function handleChange(e) {
        setPerson({
            ...person,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <>
            <label>
                First name:
                <input name="firstName" value={person.firstName} onChange={handleChange} />
            </label>
            <label>
                Last name:
                <input name="lastName" value={person.lastName} onChange={handleChange} />
            </label>
            <label>
                Email:
                <input name="email" value={person.email} onChange={handleChange} />
            </label>
            <p>
                {person.firstName} {person.lastName} ({person.email})
            </p>
        </>
    );
}
```

여기서 `e.target.name`은 `<input>` DOM 요소에 부여된 name 속성을 참조합니다.

## Updating a nested object

```js
const [person, setPerson] = useState({
    name: "Niki de Saint Phalle",
    artwork: {
        title: "Blue Nana",
        city: "Hamburg",
        image: "https://i.imgur.com/Sd1AgUOm.jpg",
    },
});
```

If you wanted to update person.artwork.city

```js
person.artwork.city = "New Delhi";
```

But in React, you treat state as immutable!

도시(city)를 변경하려면, 먼저 이전 데이터로 미리 채워진 새로운 artwork 객체를 생성한 후, 새로운 artwork을 가리키는 새로운 person 객체를 생성해야 합니다:

```js
const nextArtwork = { ...person.artwork, city: "New Delhi" };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);

// OR

setPerson({
    ...person, // Copy other fields
    artwork: {
        // but replace the artwork
        ...person.artwork, // with the same one
        city: "New Delhi", // but in New Delhi!
    },
});
```

<br/>
<br/>

<span style="font-weight:bold; color:rgb(70, 142, 242)">DEEP DIVE</span>

**Objects are not really nested**

An object like this appears “nested” in code:

```js
let obj = {
    name: "Niki de Saint Phalle",
    artwork: {
        title: "Blue Nana",
        city: "Hamburg",
        image: "https://i.imgur.com/Sd1AgUOm.jpg",
    },
};
```

However, 코드가 실행될 때 '중첩된' 객체라는 것은 존재하지 않습니다. 실제로는 두 개의 서로 다른 객체를 보고 있는 것입니다:

```js
let obj1 = {
    title: "Blue Nana",
    city: "Hamburg",
    image: "https://i.imgur.com/Sd1AgUOm.jpg",
};

let obj2 = {
    name: "Niki de Saint Phalle",
    artwork: obj1,
};
```

obj1 객체는 obj2 안에 '들어가' 있지 않습니다. 예를 들어, obj3도 obj1을 '가리킬' 수 있습니다:

```js
let obj1 = {
    title: "Blue Nana",
    city: "Hamburg",
    image: "https://i.imgur.com/Sd1AgUOm.jpg",
};

let obj2 = {
    name: "Niki de Saint Phalle",
    artwork: obj1,
};

let obj3 = {
    name: "Copycat",
    artwork: obj1,
};
```

만약 `obj3.artwork.city`를 변경하면, `obj2.artwork.city`와 `obj1.city`에도 영향을 미칩니다. 이는 `obj3.artwork`, `obj2.artwork`, 그리고 `obj1`이 동일한 객체이기 때문입니다. 객체를 '중첩'으로 생각할 때는 이를 보기 어렵지만, 실제로는 서로의 속성을 가리키는 별개의 객체입니다.

<br/>
<br/>

<span style="font-weight:bold; color:rgb(70, 142, 242)">DEEP DIVE</span>

**Why is mutating state not recommended in React?**

There are a few reasons:

1. **디버깅**: `console.log`를 사용하고 상태를 변경하지 않으면, 이전 로그가 최근 상태 변화로 인해 덮어쓰이지 않습니다. 따라서 렌더링 사이에 상태가 어떻게 변경되었는지 명확하게 볼 수 있습니다.
2. **최적화**: 일반적인 React 최적화 전략은 이전 props나 상태가 다음 것과 동일할 경우 작업을 건너뛰는 데 의존합니다. 상태를 절대 변경하지 않으면 변경 사항이 있었는지 확인하는 것이 매우 빠릅니다. `prevObj === obj`이면 내부에서 아무것도 변경되지 않았음을 확신할 수 있습니다.
3. **새로운 기능**: 우리가 구축하고 있는 새로운 React 기능은 상태가 스냅샷처럼 취급되는 것에 의존합니다. 이전 state 버전을 변경하면 새로운 기능을 사용하는 데 방해가 될 수 있습니다.
4. **요구 사항 변경**: Undo/Redo 기능 구현, 변경 이력 표시, 사용자가 양식을 이전 값으로 재설정하는 등의 애플리케이션 기능은 변경이 없을 때 더 쉽게 구현할 수 있습니다. 이는 이전 상태 복사본을 메모리에 유지하고 적절할 때 재사용할 수 있기 때문입니다. 변형 접근 방식으로 시작하면 이러한 기능을 나중에 추가하기 어려울 수 있습니다.
5. **간단한 구현**: React는 mutation에 의존하지 않기 때문에 객체에 대해 특별한 작업을 수행할 필요가 없습니다. 객체의 속성을 가로채거나 항상 Proxy로 감싸거나, 많은 '반응형' 솔루션들이 하는 초기화 작업을 할 필요가 없습니다. 이것이 React가 어떤 크기의 객체든 상태에 넣을 수 있도록 허용하는 이유이기도 하며, 추가적인 성능이나 정확성 문제 없이 가능합니다.

실제로 React에서 state를 변경해도 '문제없이' 사용할 수 있지만, 새로운 React 기능을 사용할 수 있도록 그렇게 하지 않기를 강력히 권장합니다.

# Updating Arrays in State

JavaScript에서 배열은 변경 가능하지만, 상태에 저장할 때는 불변(immutable)으로 취급해야 합니다. 객체와 마찬가지로 상태에 저장된 배열을 업데이트하려면, 새로운 배열을 생성하거나 기존 배열의 복사본을 만든 후, 상태를 새 배열로 설정해야 합니다.

## Updating arrays without mutation

JavaScript에서 배열은 또 다른 종류의 객체입니다. 객체와 마찬가지로 React state의 배열은 read-only으로 취급해야 합니다. 즉, `arr[0] = 'bird'`와 같이 배열의 항목을 재할당해서는 안 되며, `push()`나 `pop()`과 같이 배열을 변경하는 메서드도 사용해서는 안 됩니다.

대신, 배열을 업데이트할 때마다 state setting function에 새 배열을 전달해야 합니다. 이를 위해 state에 있는 원본 배열에서 `filter()`나 `map()`과 같은 변경하지 않는(non-mutating) 메서드를 호출하여 새로운 배열을 만들 수 있습니다. 그런 다음, 결과로 나온 새 배열로 상태를 설정할 수 있습니다.

다음은 일반 배열 작업에 대한 참고 표입니다. React state 내에서 배열을 다룰 때는 왼쪽 열의 메서드를 피하고, 오른쪽 열의 메서드를 사용하는 것이 좋습니다.

|           | avoid (mutates the array)           | prefer (returns a new array)       |
| --------- | ----------------------------------- | ---------------------------------- |
| adding    | `push`, `unshift`                   | `concat`, `[...arr]` spread syntax |
| removing  | `pop`, `shift`, `splice`            | `filter`, `slice`                  |
| replacing | `splice`, `arr[i] = ...` assignment | `map`                              |
| sorting   | `reverse`, `sort`                   | copy the array first               |

<br/>
<br/>

<span style="color:#F29544">**CAUTIONS**</span>

Unfortunately, `slice` and `splice` are named similarly but are very different:

-   `slice`는 배열 전체 또는 그 일부를 복사할 수 있게 해줍니다.
-   `splice`는 배열을 변경(mutate)하여 항목을 삽입하거나 삭제합니다.

### Adding to an array

`push()` will mutate an array.

```js
import { useState } from "react";

let nextId = 0;

export default function List() {
    const [name, setName] = useState("");
    const [artists, setArtists] = useState([]);

    return (
        <>
            <h1>Inspiring sculptors:</h1>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <button
                onClick={() => {
                    artists.push({
                        id: nextId++,
                        name: name,
                    });
                }}
            >
                Add
            </button>
            <ul>
                {artists.map((artist) => (
                    <li key={artist.id}>{artist.name}</li>
                ))}
            </ul>
        </>
    );
}
```

대신, 기존 항목과 새 항목을 끝에 포함하는 새로운 배열을 생성하세요. 이를 수행하는 방법은 여러 가지가 있지만, 가장 쉬운 방법은 `...` 배열 전개 구문(spread syntax)을 사용하는 것입니다.

```js
setArtists(
    // Replace the state
    [
        // with a new array
        ...artists, // that contains all the old items
        { id: nextId++, name: name }, // and one new item at the end
    ]
);
```

### Removing from an array

배열에서 항목을 제거하는 가장 쉬운 방법은 해당 항목을 필터링하는 것입니다. 즉, 그 항목이 포함되지 않은 새로운 배열을 생성하는 것입니다. 이를 위해 `filter` 메서드를 사용합니다.

```js
import { useState } from "react";

let initialArtists = [
    { id: 0, name: "Marta Colvin Andrade" },
    { id: 1, name: "Lamidi Olonade Fakeye" },
    { id: 2, name: "Louise Nevelson" },
];

export default function List() {
    const [artists, setArtists] = useState(initialArtists);

    return (
        <>
            <h1>Inspiring sculptors:</h1>
            <ul>
                {artists.map((artist) => (
                    <li key={artist.id}>
                        {artist.name}{" "}
                        <button
                            onClick={() => {
                                setArtists(artists.filter((a) => a.id !== artist.id));
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}
```

여기서 `artists.filter(a => a.id !== artist.id)`는 `artist.id`와 다른 `ID`를 가진 아티스트들로 구성된 배열을 생성하라'는 의미입니다. 즉, 각 아티스트의 '삭제' 버튼은 해당 아티스트를 배열에서 필터링하고, 결과 배열로 다시 렌더링을 요청합니다. `filter`는 원본 배열을 수정하지 않는다는 점에 유의하세요.

### Transforming an array

배열의 일부 또는 모든 항목을 변경하고 싶다면, `map()`을 사용하여 새로운 배열을 생성할 수 있습니다. `map`에 전달할 함수는 각 항목의 데이터나 인덱스(또는 둘 다)에 따라 무엇을 할지 결정할 수 있습니다.

이 예제에서는 배열이 두 개의 원과 하나의 사각형의 좌표를 보유하고 있습니다. 버튼을 누르면 원만 50픽셀 아래로 이동합니다. 이는 `map()`을 사용하여 데이터의 새로운 배열을 생성함으로써 이루어집니다.

```js
import { useState } from "react";

let initialShapes = [
    { id: 0, type: "circle", x: 50, y: 100 },
    { id: 1, type: "square", x: 150, y: 100 },
    { id: 2, type: "circle", x: 250, y: 100 },
];

export default function ShapeEditor() {
    const [shapes, setShapes] = useState(initialShapes);

    function handleClick() {
        const nextShapes = shapes.map((shape) => {
            if (shape.type === "square") {
                // No change
                return shape;
            } else {
                // Return a new circle 50px below
                return {
                    ...shape,
                    y: shape.y + 50,
                };
            }
        });
        // Re-render with the new array
        setShapes(nextShapes);
    }

    return (
        <>
            <button onClick={handleClick}>Move circles down!</button>
            {shapes.map((shape) => (
                <div
                    key={shape.id}
                    style={{
                        background: "purple",
                        position: "absolute",
                        left: shape.x,
                        top: shape.y,
                        borderRadius: shape.type === "circle" ? "50%" : "",
                        width: 20,
                        height: 20,
                    }}
                />
            ))}
        </>
    );
}
```

### Replacing items in an array

배열에서 하나 이상의 항목을 교체하고 싶어하는 경우가 특히 흔합니다. `arr[0] = 'bird'`와 같은 할당은 원본 배열을 변경하므로, 대신 `map`을 사용해야 합니다.

항목을 교체하려면 `map`을 사용하여 새로운 배열을 생성하세요. `map` 호출 내에서는 두 번째 인수로 항목의 인덱스를 받을 수 있습니다. 이를 사용하여 원본 항목(첫 번째 인수)을 반환할지 아니면 다른 것을 반환할지를 결정할 수 있습니다.

```js
import { useState } from "react";

let initialCounters = [0, 0, 0];

export default function CounterList() {
    const [counters, setCounters] = useState(initialCounters);

    function handleIncrementClick(index) {
        const nextCounters = counters.map((c, i) => {
            if (i === index) {
                // Increment the clicked counter
                return c + 1;
            } else {
                // The rest haven't changed
                return c;
            }
        });
        setCounters(nextCounters);
    }

    return (
        <ul>
            {counters.map((counter, i) => (
                <li key={i}>
                    {counter}
                    <button
                        onClick={() => {
                            handleIncrementClick(i);
                        }}
                    >
                        +1
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

### Inserting into an array

가끔은 항목을 시작이나 끝이 아닌 특정 위치에 삽입하고 싶을 수 있습니다. 이를 위해 `...` 배열 전개 구문(spread syntax)과 `slice()` 메서드를 함께 사용할 수 있습니다. `slice()` 메서드는 배열의 '조각'을 잘라낼 수 있게 해줍니다. 항목을 삽입하려면, 삽입 지점 이전의 슬라이스를 펼치고, 그 다음에 새 항목을 추가한 후, 원본 배열의 나머지를 포함하는 배열을 생성합니다.

이 예제에서는 '삽입' 버튼이 항상 인덱스 1에 항목을 삽입합니다.

```js
import { useState } from "react";

let nextId = 3;
const initialArtists = [
    { id: 0, name: "Marta Colvin Andrade" },
    { id: 1, name: "Lamidi Olonade Fakeye" },
    { id: 2, name: "Louise Nevelson" },
];

export default function List() {
    const [name, setName] = useState("");
    const [artists, setArtists] = useState(initialArtists);

    function handleClick() {
        const insertAt = 1; // Could be any index
        const nextArtists = [
            // Items before the insertion point:
            ...artists.slice(0, insertAt),
            // New item:
            { id: nextId++, name: name },
            // Items after the insertion point:
            ...artists.slice(insertAt),
        ];
        setArtists(nextArtists);
        setName("");
    }

    return (
        <>
            <h1>Inspiring sculptors:</h1>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={handleClick}>Insert</button>
            <ul>
                {artists.map((artist) => (
                    <li key={artist.id}>{artist.name}</li>
                ))}
            </ul>
        </>
    );
}
```

### Making other changes to an array

전개 구문(spread syntax)과 `map()`, `filter()`와 같은 변경하지 않는(non-mutating) 메서드만으로는 할 수 없는 작업들이 있습니다. 예를 들어, 배열을 뒤집거나 정렬하고 싶을 수 있습니다. JavaScript의 `reverse()`와 `sort()` 메서드는 원본 배열을 변경하므로 직접 사용할 수 없습니다.

하지만, 먼저 배열을 복사한 다음 그 배열에 변경을 가할 수 있습니다.

```js
import { useState } from "react";

const initialList = [
    { id: 0, title: "Big Bellies" },
    { id: 1, title: "Lunar Landscape" },
    { id: 2, title: "Terracotta Army" },
];

export default function List() {
    const [list, setList] = useState(initialList);

    function handleClick() {
        const nextList = [...list];
        nextList.reverse();
        setList(nextList);
    }

    return (
        <>
            <button onClick={handleClick}>Reverse</button>
            <ul>
                {list.map((artwork) => (
                    <li key={artwork.id}>{artwork.title}</li>
                ))}
            </ul>
        </>
    );
}
```

여기서 `[...list]` 전개 구문을 사용하여 원본 배열의 복사본을 먼저 생성합니다. 이제 복사본이 있으므로, `nextList.reverse()`나 `nextList.sort()`와 같은 변경하는(mutating) 메서드 또는 `nextList[0] = "something"`과 같이 개별 항목을 할당할 수 있습니다.

하지만 배열을 복사하더라도, 그 안에 있는 기존 항목을 직접 변경할 수는 없습니다. 이는 복사가 얕기 때문에(new array가 원본 배열과 같은 항목을 포함하게 되므로) 발생합니다. 따라서 복사된 배열 안의 객체를 수정하면 기존 상태를 변경하게 됩니다. 예를 들어, 아래와 같은 코드는 문제가 됩니다.

```js
const nextList = [...list];
nextList[0].seen = true; // Problem: mutates list[0]
setList(nextList);
```

비록 `nextList`와 `list`는 두 개의 서로 다른 배열이지만, `nextList[0]`와 `list[0]`는 같은 객체를 가리킵니다. 따라서 `nextList[0].seen`을 변경하면 `list[0].seen`도 변경되는 것입니다. 이는 상태 변화를 일으키는 것으로, 피해야 합니다! 이 문제를 해결하는 방법은 중첩된 JavaScript 객체를 업데이트하는 것과 비슷합니다. 즉, 변경하려는 개별 항목을 복사하여 변경하는 것입니다. 방법은 다음과 같습니다.

(얕은 복사 - 깊은 복사)

## Updating objects inside arrays 

객체는 실제로 배열 '안에' 위치해 있는 것이 아닙니다. 코드에서는 '안에' 있는 것처럼 보일 수 있지만, 배열의 각 객체는 배열이 '가리키는' 별개의 값입니다. 이 때문에 `list[0]`와 같은 중첩 필드를 변경할 때 주의해야 합니다. 다른 사람의 작품 목록이 배열의 같은 요소를 가리킬 수 있기 때문입니다!

**When updating nested state,** 업데이트하고자 하는 지점부터 최상위까지 복사본을 생성해야 합니다. 이게 어떻게 작동하는지 살펴봅시다.

이 예제에서는 두 개의 별개의 작품 목록이 같은 초기 상태를 가지고 있습니다. 이들은 분리되어 있어야 하지만, 변형으로 인해 상태가 우연히 공유되어, 한 목록에서 체크박스를 선택하면 다른 목록에도 영향을 미칩니다.

```js
import { useState } from "react";

let nextId = 3;
const initialList = [
    { id: 0, title: "Big Bellies", seen: false },
    { id: 1, title: "Lunar Landscape", seen: false },
    { id: 2, title: "Terracotta Army", seen: true },
];

export default function BucketList() {
    const [myList, setMyList] = useState(initialList);
    const [yourList, setYourList] = useState(initialList);

    function handleToggleMyList(artworkId, nextSeen) {
        const myNextList = [...myList];
        const artwork = myNextList.find((a) => a.id === artworkId);
        artwork.seen = nextSeen;
        setMyList(myNextList);
    }

    function handleToggleYourList(artworkId, nextSeen) {
        const yourNextList = [...yourList];
        const artwork = yourNextList.find((a) => a.id === artworkId);
        artwork.seen = nextSeen;
        setYourList(yourNextList);
    }

    return (
        <>
            <h1>Art Bucket List</h1>
            <h2>My list of art to see:</h2>
            <ItemList artworks={myList} onToggle={handleToggleMyList} />
            <h2>Your list of art to see:</h2>
            <ItemList artworks={yourList} onToggle={handleToggleYourList} />
        </>
    );
}

function ItemList({ artworks, onToggle }) {
    return (
        <ul>
            {artworks.map((artwork) => (
                <li key={artwork.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={artwork.seen}
                            onChange={(e) => {
                                onToggle(artwork.id, e.target.checked);
                            }}
                        />
                        {artwork.title}
                    </label>
                </li>
            ))}
        </ul>
    );
}
```

The problem is in code like this:

```js
const myNextList = [...myList];
const artwork = myNextList.find((a) => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```

비록 `myNextList` 배열 자체는 새로 생성되었지만, 그 안의 항목들은 원본 `myList` 배열과 동일합니다. 따라서 `artwork.seen`을 변경하면 원본 작품 항목도 변경됩니다. 그 작품 항목은 `yourList`에도 있기 때문에 버그가 발생합니다. 이런 버그는 생각하기 어려울 수 있지만, 다행히도 상태를 변경하지 않으면 사라집니다.

`map`을 사용하여 이전 항목을 업데이트된 버전으로 대체할 수 있으며, 이때 상태 변형이 발생하지 않습니다.

```js
import { useState } from "react";

let nextId = 3;
const initialList = [
    { id: 0, title: "Big Bellies", seen: false },
    { id: 1, title: "Lunar Landscape", seen: false },
    { id: 2, title: "Terracotta Army", seen: true },
];

export default function BucketList() {
    const [myList, setMyList] = useState(initialList);
    const [yourList, setYourList] = useState(initialList);

    function handleToggleMyList(artworkId, nextSeen) {
        setMyList(
            myList.map((artwork) => {
                if (artwork.id === artworkId) {
                    // Create a *new* object with changes
                    return { ...artwork, seen: nextSeen };
                } else {
                    // No changes
                    return artwork;
                }
            })
        );
    }

    function handleToggleYourList(artworkId, nextSeen) {
        setYourList(
            yourList.map((artwork) => {
                if (artwork.id === artworkId) {
                    // Create a *new* object with changes
                    return { ...artwork, seen: nextSeen };
                } else {
                    // No changes
                    return artwork;
                }
            })
        );
    }

    return (
        <>
            <h1>Art Bucket List</h1>
            <h2>My list of art to see:</h2>
            <ItemList artworks={myList} onToggle={handleToggleMyList} />
            <h2>Your list of art to see:</h2>
            <ItemList artworks={yourList} onToggle={handleToggleYourList} />
        </>
    );
}

function ItemList({ artworks, onToggle }) {
    return (
        <ul>
            {artworks.map((artwork) => (
                <li key={artwork.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={artwork.seen}
                            onChange={(e) => {
                                onToggle(artwork.id, e.target.checked);
                            }}
                        />
                        {artwork.title}
                    </label>
                </li>
            ))}
        </ul>
    );
}
```

<br/>
<br/>
<br/>

#### MEMO 🤔

-   When a regular variable isn’t enough 파트는 React 컴포넌트는 지역변수를 메모리에 할당하지 않으니까 state를 이용해라?? 이런 의미지 않을까??
-   deep dive How does React know which state to return? 내용 중 호출 순서에 의존한다는 내용은 호출 순서의 안정성을 지키기 위해 최상위에서 import하고, 안정성을 지키는 이유는 순수한 컴포넌트를 유지하기 위해서 그러는건가?
-   컴포넌트는 스냅샷 역할을 합니다. 컴포넌트를 호출하는 과정이 **렌더링**이며, 이때 사용하는 값은 컴포넌트가 모든 JSX를 반환할 때까지 동일하게 유지됩니다. 즉, 컴포넌트는 하나의 함수로서, 함수 내에서 동일한 값을 참조하여 스냅샷을 표현하는 것입니다.
-   리액트는 렌더링 과정 중에서 큐를 순회하는데, 이게 렌더링 과정 중 하나 인 것 같다. 그래서 업데이터 함수가 전 state를 참고할 수 있는 거 아닐까?
-   set state function을 통해 객체 데이터를 변형하는게 mutation??
-   React에서 state에 넣은 값은 모두 불변 immutable 취급해야한다.
