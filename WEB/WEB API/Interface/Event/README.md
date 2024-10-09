# Event

Event 인터페이스는 DOM에서 발생하는 이벤트를 나타냅니다.

**이벤트는 마우스를 클릭하거나 키보드를 누르는 것과 같이 사용자의 액션에 의해 발생할 수도 있고, 비동기적 작업의 진행을 나타내기 위해서 API들이 생성할 수도 있습니다.** 요소의 `HTMLElement.click()` 메서드를 호출하거나, 이벤트를 정의한 후 대상의 `EventTarget.dispatchEvent()` 메서드를 사용해 발송하는 등 프로그래밍적으로도 만들어낼 수 있습니다.

이벤트에는 다양한 종류가 있으며 일부는 Event 인터페이스의 파생 인터페이스를 사용합니다. Event 자체는 모든 이벤트에 공통된 속성과 메서드를 가집니다.

많은 DOM 요소는 이벤트를 받고, 받은 이벤트를 "처리"할 수 있습니다. 이벤트 처리기는 주로 `EventTarget.addEventListener()`를 사용해 다양한 요소(`<button>, <div>, <span>`, 등등)에 연결("부착")됩니다. 올바르게 부착한 경우, `removeEventListener()`를 사용하면 반대로 제거할 수도 있습니다.

<br/>
<br/>

_note_

하나의 요소가 다수의 handlers를 가질 수 있습니다. 완전히 동일한 이벤트에 여러 handlers를 따로 등록할 수 있습니다. 특히, 서로 독립적인 코드 모듈이 각각의 독립적인 목적을 위해 핸들러를 연결할 경우 그렇습니다. (For example, a webpage with an advertising-module and statistics-module both monitoring video-watching.)

<br/>
<br/>

중첩된 많은 요소가 서로 자신만의 이벤트 handlers를 가지고 있으면 이벤트의 처리가 매우 복잡해질 수 있습니다. 특히 부모 요소와 자식 요소가 화면에서 차지하는 영역이 겹쳐서 (클릭 등의) 이벤트가 양쪽 모두에서 발생하는 경우, 이벤트 처리 순서는 각 handlers의 이벤트 버블링과 캡처 설정에 따라 달라집니다.
