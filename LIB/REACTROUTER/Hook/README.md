# React router Hook

<br/>
<br/>

## useLocation

이 훅은 현재 위치 객체를 반환합니다. 이는 현재 위치가 변경될 때마다 어떤 side effect를 수행하고 싶을 때 유용할 수 있습니다.

```js
import * as React from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  let location = useLocation();

  React.useEffect(() => {
    // Google Analytics
    ga('send', 'pageview');
  }, [location]);

  return (
    // ...
  );
}
```

### Return Obj

1. **location.hash**

    현재 URL의 해시 부분을 나타냅니다. 만약 URL이 `https://example.com/page#section1`이라면, `location.hash`는 `#section1`이 됩니다.

2. **location.key**

    현재 위치의 고유 키입니다. 이 키는 `React Router`가 위치를 추적하는 데 사용되며, 특정 위치에 대해 고유한 식별자를 제공합니다.

3. **location.pathname**

    현재 URL의 경로를 나타냅니다. URL이 `https://example.com/page`라면, `location.pathname`은 `/page`가 됩니다.

4. **locaion.search**

    현재 URL의 **쿼리 문자열**을 포함합니다. `URL`이 `https://example.com/page?name=John&age=30`이라면, `location.search`는 `?name=John&age=30`이 됩니다.

5. **location.state**

    `<Link>` 컴포넌트나 `navigate` 함수에서 생성된 상태 값을 포함합니다. 이 상태 값은 이전 위치에서 전달된 데이터로, 특정 컴포넌트에서 상태를 관리하는 데 유용합니다.

<br/>
<br/>
<br/>
<br/>

## useParams

useParams 훅은 현재 URL에서 `<Route path>`에 의해 매칭된 동적 파라미터의 키(동적 라우팅에 설정한 파라미터)/값(동적 라우팅 주소) 쌍을 포함하는 객체를 반환합니다. 자식 라우트는 부모 라우트의 모든 파라미터를 상속받습니다.

```js
import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

function ProfilePage() {
  // Get the userId param from the URL.
  let { userId } = useParams();
  // ...
}

function App() {
  return (
    <Routes>
      <Route path="users">
        <Route path=":userId" element={<ProfilePage />} />
        <Route path="me" element={...} />
      </Route>
    </Routes>
  );
}
```
