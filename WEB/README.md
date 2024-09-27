# Web

<br/>
<br/>
<br/>
<br/>

## URI

URI는 "Uniform Resource Identifier"의 약자로, 인터넷에서 자원을 식별하는 데 사용되는 **문자열**. URI는 두 가지 유형으로 나눌 수 있어: URL과 URN.

<br/>
<br/>
<br/>
<br/>

## URL

인터넷에서 특정 자원의 **위치**를 지정하는 주소. 브라우저에서 URL을 입력하면 해당 자원의 위치로 이동할 수 있다.

### 구성요소

`https://www.example.com:8080/path/to/resource?key1=value1&key2=value2#section`

<br/>

`<프로토콜>://<도메인>:<포트>/<패스>?<쿼리 스트링>#<해쉬>`

-   프로토콜: `https://` 부분으로, 자원에 접근하는 방법 정의. 일반적으로 HTTP나 HTTPS가 사용된다.
-   도메인(호스트): `www.example.com` 부분으로, 웹사이트의 고유 이름. 서버의 주소를 나타낸다.
-   포트: `3000` 부분으로, 포트는 서버에서 실행 중인 다양한 서비스나 애플리케이션을 구별하는 데 사용. 프로토콜에 따라 기본 포트번호가 있다.
-   패스: `path/to/resource` 부분으로, path는 특정 자원의 위치를 나타낸다. 검색 엔진 최적화(SEO)에서 중요한 역할을 한다. 잘 구조화된 path는 검색 엔진에서 더 잘 인식될 수 있다.
-   쿼리스트링: `?key1=value1&key2=value2` 부분으로, 웹 서버에 추가적인 정보를 전달하는 데 사용되는 파라미터를 포함하고 있다. 쿼리 스트링은 URL의 path 뒤에 ? 기호로 시작하며, 여러 개의 파라미터는 & 기호로 구분돼요.
-   해쉬: `#section` 부분으로, 페이지의 특정 부분으로 이동하기 위한 식별자. # 기호로 시작하며, 주로 클라이언트 측에서 사용된다.

<br/>
<br/>

### 쿼리스트링

1. 데이터 전송: 클라이언트가 서버에 특정 데이터를 전송할 때 사용된다. 예를 들어, 검색어를 전달하는 경우 `http://www.example.com/search?query=apple`처럼 사용한다.

2. 필터링 및 정렬: 웹 애플리케이션에서 데이터를 필터링하거나 정렬할 때 쿼리 스트링을 활용할 수 있다. 예를 들어, 제품 목록에서 가격 범위를 지정하는 경우 `http://www.example.com/products?min_price=100&max_price=500`처럼 쓸 수 있다.

3. 세션 관리: 사용자 세션 정보를 포함할 때도 쿼리 스트링을 사용할 수 있다. 예를 들어, 로그인 후 사용자 ID를 전달하는 경우 `http://www.example.com/dashboard?user_id=123`와 같이 쓸 수 있다.

<br/>
<br/>

### URL 역할

1. 자원의 위치 지정: URL은 서버 내에서 자원이 어디에 위치하는지를 명확하게 지정. 예를 들어, 웹 페이지, 이미지 파일, 비디오 등 다양한 자원에 대한 주소를 포함하고 있다.

2. 서버에 요청 전송: URL을 통해 클라이언트(사용자의 브라우저 등)는 해당 자원을 저장하고 있는 서버에 요청을 보낼 수 있다. 이 요청은 HTTP(또는 HTTPS) 프로토콜을 사용하여 이루어진다.

<br/>
<br/>
<br/>
<br/>