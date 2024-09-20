# Promise

Promise 객체는 비동기 작업의 완료 또는 실패와 그 결과 값을 나타냅니다.

기본적으로 promise는 함수에 콜백을 전달하는 대신에, 콜백을 첨부하는 방식의 객체입니다.

비동기로 음성 파일을 생성해주는 `createAudioFileAsync()`라는 함수가 있었다고 생각해보세요. 해당 함수는 음성 설정에 대한 정보를 받고, 두 가지 콜백 함수를 받습니다. 하나는 음성 파일이 성공적으로 생성되었을때 실행되는 콜백, 그리고 다른 하나는 에러가 발생했을때 실행되는 콜백입니다.

````js
function successCallback(result) {
  console.log("Audio file ready at URL: " + result);
}

function failureCallback(error) {
  console.log("Error generating audio file: " + error);
}

createAudioFileAsync(audioSettings, successCallback, failureCallback);```
````

`createAudioFileAsync()`가 Promise를 반환하도록 다시 작성된다면, 그에 따라 콜백을 붙일 수 있습니다

```js
createAudioFileAsync(audioSettings).then(successCallback, failureCallback);
```

This convention has **several advantages**. We will explore each one.

## Chaining

A common need is 두 개 이상의 비동기 작업을 순차적으로 실행하는 것. 각 후속 작업은 이전 작업이 성공할 때 시작되며, 이전 단계의 결과를 사용합니다. 예전에는 여러 비동기 작업을 연속으로 수행하면 고전적인 콜백 지옥으로 이어졌습니다.

```js
doSomething(function (result) {
    doSomethingElse(
        result,
        function (newResult) {
            doThirdThing(
                newResult,
                function (finalResult) {
                    console.log(`Got the final result: ${finalResult}`);
                },
                failureCallback
            );
        },
        failureCallback
    );
}, failureCallback);
```
