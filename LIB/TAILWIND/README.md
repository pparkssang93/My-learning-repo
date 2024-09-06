# TAILWIND CSS

Tailwind CSS는 모든 HTML 파일, JavaScript 컴포넌트 및 기타 템플릿에서 클래스 이름을 스캔하여 해당 스타일을 생성한 후, 이를 정적 CSS 파일에 작성하는 방식으로 작동합니다.

이는 빠르고 유연하며 신뢰할 수 있으며, 런타임이 필요 없습니다.

<br/>
<br/>
<br/>
<br/>

## Installation

<br/>
<br/>

### Install Tailwind CSS with Vite

**Step01. Install Tailwind CSS**

Install tailwindcss and its peer dependencies, then generate your `tailwind.config.js` and `postcss.config.js` files.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

> postcss?
> CSS를 변환하고 처리하기 위한 도구입니다. JavaScript로 작성된 플러그인을 사용하여 CSS 파일을 변환할 수 있으며, 다양한 작업을 수행할 수 있습니다.

> autoprefixer
> CSS 코드에서 필요한 브라우저 접두사를 자동으로 추가해주는 PostCSS 플러그인입니다. 이를 통해 개발자는 다양한 브라우저의 호환성을 고려할 필요 없이 최신 CSS 기능을 사용할 수 있습니다.

<br/>
<br/>

**Step02. Configure your template paths**

Add the paths to all of your template files in your `tailwind.config.js` file.

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

<br/>
<br/>

**Step03. Add the Tailwind directives to your CSS**

Add the `@tailwind` directives for each of Tailwind’s layers to your `./src/index.css` file.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

<br/>
<br/>

**Step04. Start your build process**

```bash
npm run dev
```

<br/>
<br/>

**Step05. Start your build process**

Start using Tailwind in your project

<br/>
<br/>
<br/>
<br/>

# Customization

<br/>
<br/>

## Configuration

<br/>
<br/>

### Option

<br/>
<br/>

#### Content

The content section 모든 HTML 템플릿, JS 컴포넌트 및 Tailwind 클래스 이름이 포함된 기타 파일의 경로를 구성하는 곳입니다.

Tailwind CSS는 모든 HTML, JavaScript 컴포넌트 및 기타 템플릿 파일에서 클래스 이름을 스캔한 다음, 해당 스타일에 대한 모든 CSS를 생성하는 방식으로 작동합니다.

Tailwind가 필요한 모든 CSS를 생성하기 위해서는 프로젝트 내의 Tailwind 클래스 이름이 포함된 모든 파일을 알아야 합니다.

따라서, 설정 파일의 Content 섹션에서 모든 콘텐츠 파일의 경로를 구성해야 합니다.

Paths는 **glob 패턴**으로 구성되어 있어, 많은 설정 없이도 프로젝트의 모든 콘텐츠 파일을 쉽게 매칭할 수 있습니다:

`\*`를 사용하여 슬래시와 숨겨진 파일을 제외한 모든 것을 매칭합니다.
`\*\*`를 사용하여 0개 이상의 디렉토리를 매칭합니다.
`{}` 안에 쉼표로 구분된 값을 사용하여 옵션 목록에 대해 매칭합니다.
Tailwind는 내부적으로 `fast-glob` 라이브러리를 사용하므로, 지원되는 다른 패턴 기능에 대한 자세한 내용은 해당 문서를 확인하세요.

경로는 `tailwind.config.js` 파일이 아닌 프로젝트 루트를 기준으로 하므로, `tailwind.config.js` 파일이 사용자 정의 위치에 있는 경우에도 여전히 **프로젝트 루트를 기준**으로 경로를 작성해야 합니다.

<br/>
<br/>
<br/>
<br/>

<br/>
<br/>
<br/>
<br/>

#### Theme

`tailwind.config.js` 파일의 theme section은 프로젝트의 색상 팔레트, 타이프 스케일, 폰트, 브레이크포인트, 테두리 반경 값 등을 정의하는 곳입니다.

##### fontfamily

Tailwind 설정 파일의 `theme.fontFamily` 섹션을 수정하면 됩니다.

폰트 패밀리는 배열 형태 또는 간단한 쉼표로 구분된 문자열로 지정할 수 있습니다.

```js
// tailwind.config.js

module.exports = {
  theme: {
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui', ...],
      'serif': ['ui-serif', 'Georgia', ...],
      'mono': ['ui-monospace', 'SFMono-Regular', ...],
      'display': ['Oswald', ...],
      'body': ['"Open Sans"', ...],
    }
  }
}
```

<br/>
<br/>
<br/>
<br/>

### Typescript

우리는 `tailwind.config.js` 파일에 대한 TypeScript 타입을 제공하여 유용한 IDE 지원을 제공합니다. 이를 통해 구성 변경을 할 때 문서를 자주 참조하지 않고도 쉽게 수정할 수 있습니다.

Tailwind CLI로 생성된 구성 파일은 기본적으로 필요한 타입 주석을 포함하지만, TypeScript 타입을 수동으로 구성하려면 구성 객체 위에 타입 주석을 추가하면 됩니다.
