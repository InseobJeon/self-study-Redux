# 08/25, redux(2)

# Learning `Redux` from scratch

공식 문서를 보고 튜토리얼에 맞추어 리덕스를 사용해보는 과정들을 적은 문서입니다. 

# 설치

`npm install redux —save` 를 통해서 설치하였다.

`create-react-app` 으로 React App 보일러플레이팅을 할 때, `npx create-react-app app-dir --template redux` 와 같은 식으로 해도 괜찮다. 다음부터 React 앱을 빌드하는데 Redux 를 사용해야겠다! 할 때는 저 명령어로 보일러플레이팅을 할 때 redux 를 깔아버리자

# Introduction

> The whole state of your app is stored in an object tree inside a single store. The only way to change the state tree is to emit an action, an object describing what happened. To specify how the actions transform the state tree, you write pure reducers. That's it!

[Getting Started with Redux | Redux](https://redux.js.org/introduction/getting-started#basic-example)

내 앱의 모든 상태가 Single Store 안에 있는 Object Tree 안에 저장된다고 한다. 이 state tree 를 바꾸기 위해선 어떤 일이 일어났는지를 기술해주는 객체인 action 을 emit 해야 한다. 그리고 이 action 을 통해 state tree 를 사용하기 위해서는 "순수 함수" 인 reducer 를 사용해야 한다. 

그래... 그것이 전부라고 한다. 

예제 코드 

```jsx
import { createStore } from 'redux'

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter)

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

store.subscribe(() => console.log(store.getState()))

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

`reducer` 함수 `counter` 를 구현한 예시이다.  주석을 차근차근 읽어보았다. 

(state, action) 을 인자로 받아 state 를 return 하는 순수한 함수(pure function)이고, 어떻게 `action` 이 `state` 를 다음 `state` 로 바꾸는지를 보여주는 과정을 묘사하는 함수라고 한다. 

`state storage` 는 어떤 자료형이든 상관없다고 한다. 그러나 단 한가지는 지키라고 한다. `state storage` 를 오염시키지 말라고(don mutate it). 그저 변화가 적용된 새로운 state object 를 return 하라고. 

밑의 코드 실행 예시들은 아직도 이해가 잘 가지 않는다. introduction 단계의 코드라 대략 이런 식으로 돌아간다고 감만 잡고, 튜토리얼을 마저 읽어보려고 한다. 

Tutorial 은 Redux Essential 과 Basic-Advanced 로 나뉘어져 있는데 전자는 top-down, 후자는 bottom-up 방식이다. 아무래도 후자가 나을 거 같다는 생각에 후자의 basic 단계부터 읽어보고, essential 이나 advanced 를 나중에 읽어보기로 했다. 

추가로, Basic-Advanced  문서는 이전 개념들이 있을 수 있어서 Essential 문서를 권장한다고 하지만 일단은 한 번 만들어보는게 가장 좋은 것이라고 생각하기에 먼저 읽어보려고 한다.

# Basic Tutorial

간단한 To do App 을 만들면서 redux 의 주요 개념을 익혀보자! 

## Actions

### Actions

> `Actions` are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using `store.dispatch().`

action 이란, 내가 만든 앱에서 내가 만든 store 로 전송되는 일련의 데이터들을 의미한다. 이는 store 의 정보의 유일한 원천(의역하자면, store 의 정보를 업데이트하는 유일한 방법)이며, `store.dispatch()` 라는 메서드를 통해 `action` 들을 보낼 수 있다고 한다. 

```jsx
const ADD_TODO = "ADD_TODO"

{ 
    type: ADD_TODO,
    text: "Build my first Redux app"
}
```

새로운 to do item 을 만드는 action(`ADD_TODO`) 을 만들어보았다. 이처럼 action 은 순수한 JS 객체(`plain JavaScript Obejct`) 이며, 반드시 `type` 이라는 `property` 를 가져야 한다. 이는 구동되는 action 의 `type` 을 정의한다. 

```jsx
//Actions.js 
export const ADD_TODO = "ADD_TODO"

{ 
    type: ADD_TODO,
    text: "Build my first Redux app"
}

/* ------------------------------ */

//App.js
import { ADD_TODO } from './Actions.js';

//blah blah...

```

물론 이렇게 `export`, `import` 도 가능하다.

이렇게 아얘 다른 파일로 분기를 하는 것도 좋지만, 만약 작은 프로젝트라면 그냥 하나의 파일에서 관리하는 것이 공수가 조금 덜 갈수도 있다고 한다. 물론, 이렇게 파일을 나누어 놓는 것이 깔끔한 코드를 작성하는 데 더 도움이 되기 떄문에 분명히 이점은 존재한다고 이야기하고 있기도 하며, 더 자세한 내용을 보고 싶으면 해당 링크로 가라고 한다.

[Reducing Boilerplate | Redux](https://redux.js.org/recipes/reducing-boilerplate)

이제 유저가 to do 항목을 눌렀을 때 check-off 가 되는 `TOGGLE_TODO` action 을 만들어보자. 

```jsx
{
  type: TOGGLE_TODO,
  index: 5
}
```

우리는 배열에 저장을 할 것이기 때문에 `index` 라는 property 를 사용하지만, 실제 앱에서는 새로운 무언가가 생길 때마다 새롭고, 그리고 겹치지 않는(unique) ID 를 통해 만들어 주는 것이 좋다고 한다. 

> We'll add one more action type to describe a user ticking off a todo as completed. We refer to a particular todo by index because we store them in an array. In a real app, it is wiser to generate a unique ID every time something new is created.

매 action 마다 넘기는 데이터의 크기는 적으면 적을수록 좋다. 그래서 우리는 모든 to-do project 의 데이터를 넘기는 게 아니라, `index` 를 넘겨줄 것이다.

```jsx
{
  type: SET_VISIBILITY_FILTER,
  filter: SHOW_COMPLETED
}
```

이제 마지막으로 지금 화면에 나오는 to-do 목록들을 변경해주는 action 을 만들고 action 을 마무리해보자 

### Action Creator

말 그대로 action 을 만드는 creator 를 말한다. 방금 배우고 만든 action 이라는 개념과 헷갈릴 수 있으니 명확히 인지하고 개념을 정립하도록 하자.

```jsx
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```

Redux 의 간단한 action creator 코드이다. 간단하다!

```jsx
function addTodoWithDispatch(text) {
  const action = {
    type: ADD_TODO,
    text
  }
  dispatch(action) // like this!
}
```

`Flux` 에서는 action creator 가 호출될 때 종종 `dispatch` 메서드를 를 호출했다.

**Redux 는 이렇지 않다(In Redux, this is not the case).** 대신, `dispatch()` 라는 메서드에 우리가 만든 `action creator` 의 결과물을 날려보낸다.

```jsx
dispatch(addTodo(text))
dispatch(completeTodo(index))
```

```jsx
const boundAddTodo = text => dispatch(addTodo(text));
const boundCompleteTodo = index => dispatch(completeTodo(index))

boundAddTodo(text);
boundCompleteTodo(index);
```

이렇게 `dispatch` 메서드와 `action creator` 를 하나로 묶어버릴 수도 있다.

그렇게 해서 만들어진 코드는 다음과 같다

```jsx
//Actions.js

/*
 * action types
 */

export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * other constants
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * action creators
 */

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function toggleTodo(index) {
  return { type: TOGGLE_TODO, index }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}
```

---

## Reducers

### Reducers

> Reducers specify how the application's state changes in response to actions sent to the store. Remember that actions only describe what happened, but don't describe how the application's state changes.

간단히 요약하자면, `Reducers` 는 action들이 store 에 들어오면서 어떻게 애플리케이션의 상태를 변경하는지를 명시하는 요소라는 이야기이다. 

### Designing the State Shape

앞서 말했듯, 모든 애플리케이션의 상태는 하나의 객체(`single object`)에 담긴다. 나머지 구조들을 작성하기 전에, 해당 단일 객체의 모양새(`shape`) 에 대해서 생각해 보자. 내가 만든 애플리케이션의 상태를 가장 간결하게 표현 (`minimal representation`) 해보자면, 어떤 식으로 나올까? 

우리가 만들 TO-DO 앱을 기준으로 생각해보자. 우리는 일단 이 두 개를 저장해야한다.

- 현재 선택되었는지의 여부를 보여주는 filtter(the currently selected visibility filter)
- TO-DO List 의 목록 (the actual list of todos)

유의할 점이 있다. 무엇이든 저장을 할 텐데, 그 때 UI 상태(UI State)와 명확히 구분하여 저장하여야 한다는 점이다.

```jsx
{
	//visibility filter
  visibilityFilter: 'SHOW_ALL',
	//actual todo list
  todos: [
    {
      text: 'Consider using Redux',
      completed: true
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

### Handling Actions

이제 우리가 상태를 저장할 저장소(`storage`) 의 개형을 잡아놓았으니, 우리는 이제 그것과 같이 사용할 `reducer` 를 만들면 된다. reducer 는 순수 함수(pure function)로, 이전의 state 와 action 을 인자로 받아 그것들이 반영된 새로운 상태를 반환하는 기능을 한다. 코드로 표현하자면, 다음과 같을 것이다.

```jsx
let reducer = (previousState, action) => nextState
```

이 기능을 reducer 라고 부르는 이유는, 해당 함수가 `Array.prototype.reduce(reducer, ?initalValue)` 

와 같은, 그러니까 `Array method` 의 `reduce` 와 같은 종류의 함수이기 때문이다.

**거듭해서 강조하지만, 이 함수를 순수함수(pure function)로 유지하는 것은 매우 중요하다.**

reducer의 순수함수적 성격을 유지하기 위해서 절대로 해서는 안 되는 일들을 적어보자면 다음과 같다.

- reducer 의 인자를 훼손시키는 행위(Mutate it's arguments)
- side effect 를 유발할 수 있는 API calling 이나 transition routing
- 그 안에서 non-pure 한 함수를 부르는 경우, 예를 들자면 `Date.now()`, 나 `Math.random()` 같은 것들

 공식 문서에서도 아주아주아주 여러 번 강조하고 있다

> We'll explore how to perform side effects in the advanced walkthrough document. For now, just remember that the **reducer must be pure**. **Given the same arguments, it should calculate the next state and return it. No surprises. No side effects. No API calls. No mutations. Just a calculation.**

마지막 줄이 핵심이다. Reducer 는 그저 연산(Just a calculation) 만 하라고 한다. 

---

# Nested Concepts

Redux 문서를 통해 공부를 하며 이해가 안 가거나 처음 보는 개념들을 정리한 단락입니다. 

## 순수 함수(`pure function`)

참조한 글 : 

[Master the JavaScript Interview: What is a Pure Function?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976)

### So, what is `function`?

function is a process which take some input so called `argument`, and produce some output so called `return value`. 

And functions may serve following purpose

- `Mapping` : it mean, "their return value is based on input value"
- `Procedures` : they making value with specific sequence. And we call such this sequence `procedure`.
- `I/O` : some function exist to communicate with other part of system. Such as screen, storage.

Function map input argument to return value. And it means "for each set of values, there exist an output". For example, we usually use the function in algebra. `f(x) = 2x`. And we can expect the function's output when specific argument get there, such as we pass `2` as argument of function `f`, we expect the `f(2)` value is `4`. This funciton **assures** value. 

 But if the function `f` has side effect such as saving the value into disk, they can not assure the value. So. pure function is

- Give the same input, will always return same output
- Produces no side-effects

### Scope to the word "`no-side-effect`", what does mean exactly?

 So to speak, "pure fucntion must not mutate the external shared storage".

### Thinking this concept with `Redux`

Redux let you compose `reducer` rather than deal the the entire app state inside each reducer. So we don't have to create a deep clone of the entire app state every time although we changed a small part of state. We use `non-destructive array method` or `Object.assign()` instaed of former case I mentioned. 

## `Flux`

`Redux` 와는 또 다른 state management library 이다. 

## Routing Transitions

참조한 글 : 

[Step by step guide of simple routing transition effect for React - with react-router v4 and...](https://medium.com/@khwsc1/step-by-step-guide-of-simple-routing-transition-effect-for-react-with-react-router-v4-and-9152db1566a0)

전환요청을 분기해놓는 행위라는 의미이다. SPA 에서는 요청에 따른 컴포넌트 간의 전환을 통해 전환된 컴포넌트를 새로이 렌더링하는 행위를 말한다. Redux 측에서는 reducer 를 사용할 때 state storage 의 immutable 한 상태를 유지하게끔 하고, pure function 을 위한 no-side-effect 를 강조하고 있는데 reducer 단에서 위와 같은 routing transition 을 하게 된다면 함수 그 자체가 아닌 외부를 건드리게 되어 side effect 가 발생할 것을 우려해 하지 말라고 못박아 놓은 듯 하다.