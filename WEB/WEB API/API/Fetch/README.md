# Fetch

Fetch API는 HTTP 요청을 생성하고 응답을 처리하기 위한 자바스크립트 인터페이스를 제공합니다.

`Fetch`는 `XMLHttpRequest`의 현대적인 대체 수단입니다. `XMLHttpRequest`는 콜백을 사용하는 반면, `Fetch`는 **프로미스 기반**이며 서비스 워커 및 CORS와 같은 현대 웹 기능과 통합되어 있습니다.

`Fetch API`를 사용하여 요청을 만들려면 `fetch()` 함수를 호출하면 됩니다. 이 함수는 전역 함수로, `window`와 worker 컨텍스트 모두에서 사용할 수 있습니다. 요청을 구성하기 위한 선택적 인자와 함께 `Request` 객체나 가져올 URL이 포함된 문자열을 전달합니다.

The `fetch()` function returns a Promise which is fulfilled with **a Response object** representing the server's response. 이후 요청 상태를 확인하고 응답 본문을 텍스트나 JSON 등의 다양한 형식으로 추출할 수 있는 적절한 메서드를 호출할 수 있습니다.

다음은 서버에서 `JSON` 데이터를 가져오기 위해 `fetch()`를 사용하는 최소한의 함수 예시입니다:

```js
async function getData() {
    const url = "https://example.org/products.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}
```

URL이 포함된 문자열을 선언한 후, 추가 옵션 없이 URL을 전달하며 `fetch()`를 호출합니다.

`fetch()` 함수는 일부 오류가 발생할 경우 프로미스를 거부하지만, 서버가 404와 같은 오류 상태로 응답할 경우에는 거부하지 않습니다. 따라서 응답 상태를 확인하고, 상태가 OK가 아닐 경우에는 오류를 발생시킵니다.

그렇지 않은 경우, 우리는 `Response`의 `json()` 메서드를 호출하여 응답 본문 내용을 `JSON` 형식으로 가져오고, 그 값 중 하나를 로그에 기록합니다. `fetch()`와 마찬가지로 `json()`도 비동기적이며, 응답 본문 내용을 접근하는 다른 모든 메서드도 비동기적입니다.

<br/>
<br/>
<br/>
<br/>

## Making a request

To make a request, call `fetch()`, passing in:

1. a definition of the resource to fetch. This can be any one of:

-   URL이 포함된 문자열
-   문자열로 변환할 수 있는 문자열 변환기(stringifier)를 가진 URL 인스턴스와 같은 객체
-   Request 인스턴스

2. optionally, an object containing options to configure the request.

<br/>
<br/>
<br/>
<br/>

### Setting the method

By default, `fetch()` makes a GET request, but you can use the method option to use a different request method:

```js
const response = await fetch("https://example.org/post", {
    method: "POST",
    // ...
});
```

If the `mode` option is set to `no-cors`, then method must be one of `GET`, `POST` or `HEAD`.

<br/>
<br/>

### Setting a body

The request body is the payload of the request: 클라이언트가 서버에 전송하는 내용입니다. GET 요청에는 본문을 포함할 수 없지만, 서버에 내용을 전송하는 요청, 즉 `POST`나 `PUT` 요청에서는 유용합니다. 예를 들어, 서버에 파일을 업로드하려면 `POST` 요청을 만들고 파일을 요청 본문으로 포함할 수 있습니다.

요청 본문을 설정하려면, `body` 옵션으로 전달하면 됩니다.

```js
const response = await fetch("https://example.org/post", {
    body: JSON.stringify({ username: "example" }),
    // ...
});
```

<br/>

---

#### Payload

네트워크 요청이나 데이터 전송에서 실제로 전송되는 데이터의 내용을 말합니다. 즉, 클라이언트가 서버에 보내는 정보나 데이터를 의미합니다.

---

<br/>

You can supply the body as an instance of any of the following types:

-   문자열 (string)
-   ArrayBuffer
-   TypedArray
-   DataView
-   Blob
-   File
-   URLSearchParams
-   FormData
-   ReadableStream

응답 본문과 마찬가지로 요청 본문도 스트림이며, 요청을 만들면 이 스트림이 읽혀집니다. 따라서 요청에 본문이 포함된 경우, 같은 요청을 두 번 만들 수 없습니다.

<br/>

---

#### Stream

스트림(stream)은 데이터를 연속적으로 전송하거나 처리하는 방식입니다. 이는 데이터를 한 번에 전체가 아닌, 작은 조각으로 나누어 순차적으로 읽거나 쓸 수 있게 해줍니다. 스트림은 메모리 사용을 효율적으로 하고, 대용량 데이터를 처리할 때 유용합니다.

스트리밍 서비스

---

<br/>

```js
// ❌ Don't use

const request = new Request("https://example.org/post", {
    method: "POST",
    body: JSON.stringify({ username: "example" }),
});

const response1 = await fetch(request);
console.log(response1.status);

// Will throw: "Body has already been consumed."
const response2 = await fetch(request);
console.log(response2.status);
```

Instead, you would need to create a clone of the request before sending it:

```js
const request1 = new Request("https://example.org/post", {
    method: "POST",
    body: JSON.stringify({ username: "example" }),
});

const request2 = request1.clone();

const response1 = await fetch(request1);
console.log(response1.status);

const response2 = await fetch(request2);
console.log(response2.status);
```

<br/>
<br/>

### Setting headers

Request headers give the server information about the request:

예를 들어, `Content-Type` 헤더는 요청 본문의 형식을 서버에 알려줍니다. 많은 헤더는 브라우저에 의해 자동으로 설정되며, 스크립트에서 설정할 수 없는 경우도 있습니다. 이러한 헤더는 Forbidden header names이라고 불립니다.

요청 헤더를 설정하려면, 이를 `headers` 옵션에 할당하면 됩니다.

header-name: header-value properties:을 포함하는 객체 리터럴을 전달할 수 있습니다.

```js
const response = await fetch("https://example.org/post", {
    headers: {
        "Content-Type": "application/json",
    },
    // ...
});
```

또는 `Headers` 객체를 생성하고, `Headers.append()`를 사용하여 해당 객체에 헤더를 추가한 다음, `headers` 옵션에 `Headers` 객체를 할당할 수 있습니다.

```js
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const response = await fetch("https://example.org/post", {
    headers: myHeaders,
    // ...
});
```

If the `mode` option is set to no-cors, you can only set `CORS-safelisted request headers`.

<br/>
<br/>

### Making POST requests

We can combine the `method`, `body`, and `headers` options to make a `POST` request:

```js
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const response = await fetch("https://example.org/post", {
    method: "POST",
    body: JSON.stringify({ username: "example" }),
    headers: myHeaders,
});
```

<br/>
<br/>

### Making cross-origin requests

a request이 크로스 오리진인지 여부는 `mode` 옵션의 값에 따라 결정됩니다. 이 값은 세 가지 중 하나를 가질 수 있습니다: cors, no-cors, 또는 same-origin.

-   기본적으로 `mode`는 `cors`로 설정되어 있으며, 이는 요청이 크로스 오리진인 경우 Cross-Origin Resource Sharing 메커니즘을 사용함을 의미합니다. 구체적으로는 다음과 같습니다:

    -   if the request is a simple request, 요청은 항상 전송되지만, 서버는 올바른 `Access-Control-Allow-Origin` 헤더로 응답해야 합니다. 그렇지 않으면 브라우저는 응답을 호출자와 공유하지 않습니다.
    -   if the request is not a simple request, 브라우저는 서버가 CORS를 이해하고 요청을 허용하는지 확인하기 위해 사전 요청(preflighted request)을 보냅니다. 서버가 적절한 CORS 헤더로 사전 요청에 응답하지 않으면 실제 요청은 전송되지 않습니다.

-   Setting mode to same-origin: 크로스 오리진 요청(CORS)을 완전히 금지합니다.
-   Setting mode to no-cors: 요청은 단순 요청이어야 하며, 설정할 수 있는 헤더가 제한되고, 메서드는 GET, HEAD, POST로 제한됩니다.

<br/>
<br/>

### Including credentials

자격 증명(credentials)은 쿠키, TLS 클라이언트 인증서, 또는 사용자 이름과 비밀번호가 포함된 인증 헤더를 의미합니다.

브라우저가 credentials을 전송할지 여부와 브라우저가 Set-Cookie 응답 헤더를 존중할지 여부를 제어하기 위해 credentials 옵션을 설정할 수 있습니다. 이 옵션은 다음 세 가지 값 중 하나를 가질 수 있습니다:

-   `omit`: never send credentials in the request or include credentials in the response.
-   `same-origin` (the default): only send and include credentials for same-origin requests.
-   `include`: always include credentials, even cross-origin.

<br/>

---

쿠키의 SameSite 속성이 Strict 또는 Lax로 설정된 경우, credentials이 include로 설정되어 있더라도 쿠키는 크로스 사이트에서 전송되지 않습니다.

---

<br/>

크로스 오리진 요청에 credentials을 포함하는 것은 사이트를 `CSRF` 공격에 취약하게 만들 수 있으므로, credentials이 `include`로 설정된 경우에도 서버는 응답에 `Access-Control-Allow-Credentials` 헤더를 포함하여 자격 증명의 포함에 동의해야 합니다. 또한 이 경우 서버는 `Access-Control-Allow-Origin` 응답 헤더에서 클라이언트의 출처를 명시적으로 지정해야 하며, 즉 `*`는 허용되지 않습니다.

따라서, 자격 증명이 `include`로 설정되고 요청이 크로스 오리진인 경우, 다음과 같은 조건이 적용됩니다:

-   If the request is a simple request, credentials을 포함하여 요청이 전송되지만, 서버는 `Access-Control-Allow-Credentials`와 `Access-Control-Allow-Origin` 응답 헤더를 설정해야 합니다. 그렇지 않으면 브라우저는 호출자에게 네트워크 오류를 반환합니다. 서버가 올바른 헤더를 설정하면, credentials을 포함한 응답이 호출자에게 전달됩니다.
-   If the request is not a simple request, 브라우저는 credentials을 포함하지 않고 사전 요청(preflighted request)을 전송합니다. 이때도 서버는 `Access-Control-Allow-Credentials`와 `Access-Control-Allow-Origin` 응답 헤더를 설정해야 하며, 그렇지 않으면 브라우저는 호출자에게 네트워크 오류를 반환합니다. 서버가 올바른 헤더를 설정하면, 브라우저는 credentials을 포함한 실제 요청을 후속으로 전송하고, credentials을 포함한 실제 응답을 호출자에게 전달합니다.

<br/>

---

#### Simple request

1. HTTP 메서드: GET, HEAD, POST 중 하나여야 합니다.
2. 헤더: 다음과 같은 특정 헤더만 허용됩니다:
    - Accept
    - Accept-Language
    - Content-Language
    - Content-Type (단, 값은 application/x-www-form-urlencoded, multipart/form-data, text/plain 중 하나여야 합니다)

#### Not simple request

비단순 요청은 단순 요청의 조건을 충족하지 않는 모든 요청을 의미합니다. 즉, 다음과 같은 경우에 해당합니다:

1. HTTP 메서드: PUT, DELETE, PATCH 등 단순 요청에 포함되지 않는 메서드일 경우.
2. 헤더: 사용자 정의 헤더를 포함하거나, `Content-Type`이 단순 요청에서 허용되지 않는 값일 경우.

---

<br/>
<br/>

### Creating a Request object

`Request()` 생성자는 `fetch()`와 동일한 인수를 받습니다. 즉, `fetch()`에 옵션을 전달하는 대신, 동일한 옵션을 `Request()` 생성자에 전달하고, 그 객체를 `fetch()`에 넘길 수 있습니다.

예를 들어, 다음과 같은 코드를 사용하여 `fetch()`에 옵션을 전달함으로써 `POST` 요청을 만들 수 있습니다:

```js
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const response = await fetch("https://example.org/post", {
    method: "POST",
    body: JSON.stringify({ username: "example" }),
    headers: myHeaders,
});
```

However, we could rewrite this to pass the same arguments to the `Request()` constructor:

```js
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const myRequest = new Request("https://example.org/post", {
    method: "POST",
    body: JSON.stringify({ username: "example" }),
    headers: myHeaders,
});

const response = await fetch(myRequest);
```

This also means that you can **create a request from another request**, while changing some of its properties using the second argument:

```js
async function post(request) {
    try {
        const response = await fetch(request);
        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

const request1 = new Request("https://example.org/post", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: "example1" }),
});

const request2 = new Request(request1, {
    body: JSON.stringify({ username: "example2" }),
});

post(request1);
post(request2);
```

<br/>
<br/>
<br/>
<br/>

## Canceling a request

To make a request cancelable, `AbortController`를 생성하고, 그 `AbortSignal`을 요청의 `signal` 속성에 할당해야 합니다.
To cancel the request, 컨트롤러의 `abort()` 메서드를 호출하면 됩니다. 그러면 `fetch()` 호출은 `AbortError` 예외로 프로미스를 거부하게 됩니다.

```js
const controller = new AbortController();

const fetchButton = document.querySelector("#fetch");
fetchButton.addEventListener("click", async () => {
    try {
        console.log("Starting fetch");
        const response = await fetch("https://example.org/get", {
            signal: controller.signal,
        });
        console.log(`Response: ${response.status}`);
    } catch (e) {
        console.error(`Error: ${e}`);
    }
});

const cancelButton = document.querySelector("#cancel");
cancelButton.addEventListener("click", () => {
    controller.abort();
    console.log("Canceled fetch");
});
```

```js
async function get() {
    const controller = new AbortController();
    const request = new Request("https://example.org/get", {
        signal: controller.signal,
    });

    const response = await fetch(request);
    controller.abort();
    // The next line will throw `AbortError`
    const text = await response.text();
    console.log(text);
}
```

<br/>
<br/>
<br/>
<br/>

## Handling the response

As soon as the browser has received the response status and headers from the server (응답 본문이 수신되기 전에), `fetch()`가 반환하는 프로미스는 Response 객체로 이행됩니다.

<br/>
<br/>

### Checking response status

`fetch()`가 반환하는 프로미스는 네트워크 오류나 잘못된 scheme과 같은 일부 오류가 발생하면 rejected됩니다. 그러나 서버가 404와 같은 오류로 응답할 경우, `fetch()`는 Response로 이행되므로 응답 본문을 읽기 전에 상태를 확인해야 합니다.

`Response.status` 속성은 숫자 상태 코드를 알려주고, `Response.ok` 속성은 상태가 200 범위에 있을 경우 true를 반환합니다.

일반적인 패턴은 `ok`의 값을 확인하고, `false`일 경우 예외를 던지는 것입니다.

```js
async function getData() {
    const url = "https://example.org/products.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        // ...
    } catch (error) {
        console.error(error.message);
    }
}
```

<br/>
<br/>

### Checking the response type

Responses have a type property that can be one of the following:

-   basic: the request was a same-origin request.
-   cors: the request was a cross-origin CORS request.
-   opaque: the request was a cross-origin simple request made with the no-cors mode.
-   opaqueredirect: 요청이 리다이렉트 옵션을 수동으로 설정했으며, 서버가 리다이렉트 상태로 응답했습니다.

type은 응답의 가능한 내용을 결정합니다:

-   Basic 응답은 금지된 응답 헤더 이름 목록에서 응답 헤더를 제외합니다.
-   CORS 응답은 CORS 안전 목록에 있는 응답 헤더만 포함합니다.
-   Opaque 응답 및 opaque redirect 응답은 상태가 0이고, 헤더 목록이 비어 있으며, 본문이 null입니다.

<br/>
<br/>

### Checking headers

Just like the request, the response has a headers property which is a Headers object, 이 객체는 응답 유형에 따라 스크립트에 노출되는 응답 헤더를 포함합니다.

일반적인 용도는 본문을 읽기 전에 콘텐츠 유형을 확인하는 것입니다.

```js
async function fetchJSON(request) {
    try {
        const response = await fetch(request);
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }
        // Otherwise, we can read the body as JSON
    } catch (error) {
        console.error("Error:", error);
    }
}
```

<br/>
<br/>

### Reading the response body

Response 인터페이스는 다양한 형식으로 전체 본문 내용을 가져오는 여러 메서드를 제공합니다:

-   Response.arrayBuffer(): 응답 본문을 ArrayBuffer 형식으로 반환합니다.
-   Response.blob(): 응답 본문을 Blob 형식으로 반환합니다.
-   Response.formData(): 응답 본문을 FormData 형식으로 반환합니다.
-   Response.json(): 응답 본문을 JSON 형식으로 파싱하여 반환합니다.
-   Response.text(): 응답 본문을 텍스트 형식으로 반환합니다.

이들은 모두 비동기 메서드로, 본문 내용을 포함하는 프로미스를 반환합니다.

이 예제에서는 이미지를 가져와 `Blob` 형식으로 읽고, 이를 사용하여 객체 URL을 생성할 수 있습니다.

```js
const image = document.querySelector("img");

const url = "flowers.jpg";

async function setImage() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        image.src = objectURL;
    } catch (e) {
        console.error(e);
    }
}
```

응답 본문이 적절한 형식이 아닐 경우, 메서드는 예외를 던집니다. 예를 들어, JSON으로 파싱할 수 없는 응답에 `json()`을 호출하면 예외가 발생합니다.

<br/>
<br/>

### Streaming the response body

Request and response bodies는 실제로 `ReadableStream` 객체이며, 이를 읽을 때마다 콘텐츠를 스트리밍하는 것입니다. 이는 메모리 효율성에 좋습니다. 왜냐하면 브라우저가 전체 응답을 메모리에 버퍼링한 후에야 호출자가 `json()`과 같은 메서드를 사용하여 이를 가져올 필요가 없기 때문입니다.

이는 또한 호출자가 콘텐츠를 수신하는 대로 점진적으로 처리할 수 있음을 의미합니다.

예를 들어, 큰 텍스트 파일을 가져와서 어떤 방식으로 처리하거나 사용자에게 표시하는 GET 요청을 고려해볼 수 있습니다.

```js
const url = "https://www.example.org/a-large-file.txt";

async function fetchText(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const text = await response.text();
        console.log(text);
    } catch (e) {
        console.error(e);
    }
}
```

위에서 언급한 것처럼 `Response.text()`를 사용하면 전체 파일이 수신될 때까지 기다려야 그 내용을 처리할 수 있습니다.

반면에 응답을 스트리밍하면 네트워크에서 수신되는 본문의 청크를 처리할 수 있습니다.

```js
const url = "https://www.example.org/a-large-file.txt";

async function fetchTextAsStream(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const stream = response.body.pipeThrough(new TextDecoderStream());
        for await (const value of stream) {
            console.log(value);
        }
    } catch (e) {
        console.error(e);
    }
}
```

In this example, 스트림을 비동기적으로 반복하면서 도착하는 각 청크를 처리합니다.

이렇게 본문에 직접 접근하면 응답의 원시 바이트를 얻으며, 이를 직접 변환해야 한다는 점에 유의해야 합니다. 이 경우 `ReadableStream.pipeThrough()`를 호출하여 응답을 `TextDecoderStream`을 통해 파이프 처리하며, 이는 `UTF-8` 인코딩된 본문 데이터를 텍스트로 디코딩합니다.

<br/>
<br/>

### Processing a text file line by line

아래 예제에서는 텍스트 리소스를 가져와 정규 표현식을 사용하여 줄 단위로 처리합니다. 간단함을 위해 텍스트가 `UTF-8`이라고 **가정**하고, `fetch` 오류는 처리하지 않습니다.

```js
async function* makeTextFileLineIterator(fileURL) {
    const response = await fetch(fileURL);
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    let { value: chunk, done: readerDone } = await reader.read();
    chunk = chunk || "";

    const newline = /\r?\n/gm;
    let startIndex = 0;
    let result;

    while (true) {
        const result = newline.exec(chunk);
        if (!result) {
            if (readerDone) break;
            const remainder = chunk.substr(startIndex);
            ({ value: chunk, done: readerDone } = await reader.read());
            chunk = remainder + (chunk || "");
            startIndex = newline.lastIndex = 0;
            continue;
        }
        yield chunk.substring(startIndex, result.index);
        startIndex = newline.lastIndex;
    }

    if (startIndex < chunk.length) {
        // Last line didn't end in a newline char
        yield chunk.substring(startIndex);
    }
}

async function run(urlOfFile) {
    for await (const line of makeTextFileLineIterator(urlOfFile)) {
        processLine(line);
    }
}

function processLine(line) {
    console.log(line);
}

run("https://www.example.org/a-large-file.txt");
```

<br/>
<br/>

### Locked and disturbed streams

The consequences of request and response bodies being streams are that:

-   `ReadableStream.getReader()`를 사용하여 스트림에 리더가 연결되면 스트림이 잠기게 되어 다른 어떤 것도 그 스트림을 읽을 수 없습니다.
-   스트림에서 어떤 콘텐츠가 읽히면 스트림이 손상되어 다른 어떤 것도 그 스트림을 읽을 수 없습니다.

즉, 동일한 응답(또는 요청) 본문을 여러 번 읽는 것은 불가능합니다.

```js
// ❌ Don't use
async function getData() {
    const url = "https://example.org/products.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json1 = await response.json();
        const json2 = await response.json(); // will throw
    } catch (error) {
        console.error(error.message);
    }
}
```

If you do need to read the body more than once, you must call `Response.clone()` before reading the body:

```js
async function getData() {
    const url = "https://example.org/products.json";
    try {
        const response1 = await fetch(url);
        if (!response1.ok) {
            throw new Error(`Response status: ${response1.status}`);
        }

        const response2 = response1.clone();

        const json1 = await response1.json();
        const json2 = await response2.json();
    } catch (error) {
        console.error(error.message);
    }
}
```

이것은 서비스 워커를 사용하여 오프라인 캐시를 구현할 때 일반적인 패턴입니다. 서비스 워커는 응답을 앱에 반환하고 동시에 응답을 캐시하고자 합니다. 그래서 원본 응답을 반환하고, 그 응답을 복제하여 캐시합니다.

```js
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open("MyCache_1");
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return Response.error();
    }
}

self.addEventListener("fetch", (event) => {
    if (precachedResources.includes(url.pathname)) {
        event.respondWith(cacheFirst(event.request));
    }
});
```

<br/>
<br/>
