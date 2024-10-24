# Same-origin policy

The same-origin policy is a critical security mechanism that restricts how a document or script loaded by one origin can interact with a resource from another origin.

It helps isolate potentially malicious documents, reducing possible attack vectors. (이 정책은 잠재적으로 악의적인 문서를 격리하여 가능한 공격 경로를 줄이는 데 도움을 줍니다.)

예를 들어, 이 정책은 인터넷에 있는 악성 웹사이트가 브라우저에서 JavaScript를 실행하여 사용자가 로그인한 제3자 웹메일 서비스나 공격자가 직접 접근할 수 없는 회사 인트라넷의 데이터를 읽고, 그 데이터를 공격자에게 전달하는 것을 방지합니다.

<br/>
<br/>
<br/>
<br/>

## Definition of an origin

출처의 정의

Two URLs have the same origin if the protocol, port (if specified), and host are the same for both.

You may see this referenced as the "scheme/host/port tuple"

| URL                                             | Outcome     | Reason                                         |
| ----------------------------------------------- | ----------- | ---------------------------------------------- |
| http://store.company.com/dir2/other.html        | Same origin | Only the path differs                          |
| http://store.company.com/dir/inner/another.html | Same origin | Only the path differs                          |
| https://store.company.com/page.html             | Failure     | Different protocol                             |
| http://store.company.com:81/dir/page.html       | Failure     | Different port (http:// is port 80 by default) |
| http://news.company.com/dir/page.html           | Failure     | Different host                                 |
