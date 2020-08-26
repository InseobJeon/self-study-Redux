<!-- # 08/25, redux(2) -->

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

자, 이제 우리가 이전에 정의한 `action` 에 근거하는 reducer 를 작성해보자. 일단은 초기 상태(`initial state`) 를 잡아주어야 한다. 우리의 reducer 는 처음에는 `undefined` state 를 호출할 것이다. 그래서 초기 state 를 `todoApp` 이라는 `reducer` 의 인자, `state` 의 기본값으로 넘겨준다. `state===undefined? : state = initialState` 와 같은 조건문으로 해 주어도 되지만, 이 과정은 ES6 의 default parameter  를 이용하여 하는 것이 더욱 간결하다. 

```jsx
import { VisibilityFilters } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}

// todoApp's state argument's defaul parameter is initialState
function todoApp(state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}
```

```jsx
import {
  SET_VISIBILITY_FILTER,
  VisibilityFilters
} from './actions'

...

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

이제 `switch / case` 를 통해서 `reducer` 를 마저 완성해보자. todoApp 이라는 reducer 에서 `action.type` 이 `SET_VISIBILITY_FILTER` 인 경우, `Object.assign()` 을 통해서 빈 객체에 `state` 의 속성들, 그리고 `{visibilityFilter: action.filter}` 라는 객체의 속성들을 복제한 뒤 그것을 return 한다. 이전 state 와 새로운 state 가 합쳐져서 새로운 state 를 반환하고, side effect, API calling, Transition Routing, non-pure function calling 등이 전혀 없는 순수함수(pure function)의 조건을 만족하였다. 

공식 문서에서는  `Object.assign(state, { visibilityFilter: action.filter }` 와 같이 `state` 에 복제하지 말라는 말을 엄청나게 강조하고 있다. 위의 코드처럼 첫 번째 인자로 `{}`, 빈 객체를 새로 만들고 거기다가 속성들을 복사하여 그 새로 만든, 그리고 나머지 인자들의 속성들이 복제되어 들어간 그 빈 객체를 return 하라고 한다(You must supply an empty object as the first parameter)

그리고 `default:` 라는 케이스, 그러니까 우리가 감지하지 않은 `action.type` 에 대해서는 그냥 기존의 state 를 흘려보내는 식으로 처리하라고 한다.

### Handling More Actions

두 개의 action 을 더 추가해보자. 우리가 `SET_VISIBILITY_FILTER` 를 추가했던 것처럼, `ADD_TODO`, 그리고 `TOGGLE_TODO` 를 추가한다. 그리고 우리의 `reducer` 를 그에 맞춰서 더 확장해주자 

```jsx
import { ADD_TODO,
         TOGGLE_TODO,
         VisibilityFilters, 
         SET_VISIBILITY_FILTER
        } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
		
    default:
        return state;
  }
}
```

이전과 마찬가지로 `state` 를 직접 수정(wrtie)하지 않는다. 대신 우리는 새로운 객체를 `Object.assign()` 을 통해 return 해 줄 뿐이다. 새로운 `todos` 항목들은 위의 `Object.assign()` 메서드를 기반으로 빈 객체인 target 에 기존 `state.todos` 를 spread operator 로 받아와 복사하고, 새로운 객체 하나가 뒤에 복사된 뒤 그렇게 복사된 것들을 return 한다. 사실상 순차적으로 이어붙여진(conctaten) 것이다. 새로운 todo 는 action 으로부터 가져온 데이터에 기반하여 갱신된다는 사실을 잘 알아두자. 

이제 마지막으로! `TOGGLE_TODO` 핸들러를 추가해보자

```jsx
import { ADD_TODO,
         TOGGLE_TODO,
         VisibilityFilters, 
         SET_VISIBILITY_FILTER
        } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: state.todos.map((todo, index) => {
          if (index === action.index) {
            return Object.assign({}, todo, {
              completed: !todo.completed
            })
          }
          return todo
        })
      })
    default:
        return state;
  }
}
```

`case TOGGLE_TODO:` 도 마찬가지로 `Object.assign()` 을 통해 객체를 복사하는 것부터 시작한다. 그리고 `todos` 또한 `map()` 을 통해 복사를 해서 immutability 를 유지한다. 만약 우리가 만들어 놓은 `toggleTodo` 라는 메서드가 호출되어 index 가 return 되면, 조건문을 통해 action.index 와 같은 todo 를 찾고, 해당 todo 의 `completed` 라는 state 를 `!todo.completed` 로 값을 반전시켜준다. 

여기서 또 유의할 점은, immutability 를 지키기 위해 `TOGGLE_TODO` 로 호출된 todo 마저도 `Object.assign()` 을 통해서 복사해준다는 점이다. 

### Splitting Reducers

```jsx
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: state.todos.map((todo, index) => {
          if (index === action.index) {
            return Object.assign({}, todo, {
              completed: !todo.completed
            })
          }
          return todo
        })
      })
    default:
      return state
  }
}
```

이제 우리의 `reducer` 코드가 완성되었다. 그런데 약간은 난잡한(rather verbose) 감이 없잖아 있는 편이다. 그렇다면, 이 코드를 조금 더 이해하기 쉽게(easier to comprehend) 나눠볼 수는 없을까? 

생각해 보면 우리는 지금 `visibilityFilter` 라는 상태와 `todos` 라는 상태를 변화시키고 있는데, 이 둘의 관계는 독립적이라고 볼 수 있다. isibilityFilter 가 달라지는 것과 todo tasks 들이 달라지는 건 별도의 관계이다. 물론, 의존적인 관계였다면 이야기는 달라지겠지만 우리의 경우는 그렇지 않으니 해당 `reducer` 를 나눌 수 있겠다. 

```jsx
import { ADD_TODO,
         TOGGLE_TODO,
         VisibilityFilters, 
         SET_VISIBILITY_FILTER
        } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}

function todos(state = [], action) {
	switch (action.type) {
		case ADD_TODO:
			return [
				...state,
				{
					text: action.text,
					completed: false
				}
			]
		case TOGGLE_TODO: 
			return state.map((todo, index) => {
				if (index === action.index) {
					return Object.assign({}, todo, {
						completed: !todo.completed
					})
				}
			 return todo
			})
		default:
			return state
	}
}

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: todos(state.todos, action)
      })
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: todos(state.todos, action)
      })
    default:
      return state
  }
}
```

새로 만든 reducer 인 `todos` 에 주목하라. 마찬가지로 저 reducer 의 인자에도 action 과 함께 `state` 를 넣어주었다. 혹시라도 처음 reducer 가 호출되어 state 에 `undefined` 를 집어넣는 경우를 대비해, 아직 state 가 없는 경우를 대비하여 `default parameter` 도 마찬가지로 넣어주었다. 

그러나 차이점이 존재한다. 우리가 나눠내기 전의 reducer 인 `todoApp` 의 `default parameter` 는  `initialState` 인 것였다. 반면, 새로 만든 reducer 인 `todos` 의 인자 state 의 default parameter 는 비어있는 배열(`[]`)이라는 차이점이 있다. 

우리는 이렇게 reducer 를 나누어 줌으로써 각각의 reducer 가 관리하는 상태들도 분리하였다. 역할을 명확히 분리하여 가독성과 코드 이해를 높인 것이다. 이러한 reducer 의 역할 기준 분할을 reducer 합성 (reducer composition) 이라고 하며, 이는 Redux 를 사용하여 만드는 애플리케이션에 사용하는 아주 기초적인 패턴이라고 할 수 있다. (This is called reducer composition, and it's the fundamental pattern of building Redux apps)

이제 이렇게 나누어 놓은 reducer 들을 하나의 Object 로 합쳐보자. 

```jsx
import { ADD_TODO,
         TOGGLE_TODO,
         VisibilityFilters, 
         SET_VISIBILITY_FILTER
        } from './actions'

const { SHOW_ALL } = VisibilityFilters

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

하나로 다 합쳐져 있던 reducer 를 state 에 따라 나누어 주고, 그리고 그 나눠낸 reducer 들을 그렇게 관리한 state 들을 통합하는 reducer 안에서 부품과도 같이 사용해주었다. 이렇게 되면 우리가 처음에 썼던 `initialState` 와도 같은 초기값을 할당해 주는 번거로움도 없어지고, 코드의 명확성도 더욱 올릴 수 있다. 

중요한 점이 있다면 각각의 reducer 가 참고하는 `global` scope 에 있는 state 를 관리한다는 사실이다. state 라는 parameter 는 각각의 reducer 마다 다르며, 그 각각의 state 는 전체의 state 의 일부 중 그들이 관리하는 state 라는 사실을 명심하자. 

이제 정말 마지막 과정이다. `combineReducers()` 라는 Redux 측에서 제공하는 메서드를 사용해보자. 우리는 이 메서드를 통해서 방금 만든  `todoApp` , 그러니까 각각의 reducer 로 관리하는 state 의 일부분을 통합해서 return 하는 reducer 를 더욱 간단하게 정리할 수 있다. 

```jsx
import { combineReducers } from 'redux'

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```

위에 작성한 코드는 밑의 코드를 export 한 것과 똑같다. 

```jsx
export default function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

이렇게 해서 만들어진 reducer 코드가 완성되었다

```jsx
import { combineReducers } from 'redux'
import {
  ADD_TODO,
  TOGGLE_TODO,
  SET_VISIBILITY_FILTER,
  VisibilityFilters
} from './actions'
const { SHOW_ALL } = VisibilityFilters

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```

---

 

## Store

### Store

> The Store is the object that brings them(action, reducer) together. The store has the following responsibilities

Redux 의 Store 는 action 과 reducer 를 담는 Object이다. 그리고 이 store 는 하기한 사항들을 준수한다(The store has the following responsibilities)

- Holds application's state
- Allow access to state via `getState()`
- Allow state to be updated via `dispatch(action)`
- Registers listeners via `subscribe(listener)`
- Handles unregistering of listeners via the function returned by `subscribe(listener)`

그러니까 state 에 접근하기 위해서는 `getState()`, state 를 업데이트 하기 위해서는 `dispatch(action)`, 리스너를 생성하기 위해서는 `subscribe(listener)`, 그리고 등록되지 않은 리스너를 관리하기 위해서는 `subscribe(listener)` 의 return 값으로 날아오는 함수를 통해 활용하라고 한다. 

Redux 의 store 는 "단 하나" 라는 사실을 아는 것이 매우 중요하다. 

reducer 를 미리 구현해 놓았기 때문에, store 를 만드는 과정은 쉽다. 우리가 `combineReducers()` 를 통해서 여러가지의 reducer 들을 합쳐놓았기 때문에(`todoApp` 으로 합쳐놓았었다), 그것을 import 로 불러와 주고, redux 모듈로부터 `createStore()` 메서드를 불러온 뒤, 그 안에 인자로 넣어주면 된다. 

```jsx
import { createStore } from 'redux'
import todoApp from './reducers'
const store = createStore(todoApp)
```

부가적인 선택지로 초기값(initial state)으로 잡아주고 싶은 값을 `createStore()` 의 두 번째 인자로 넘겨줄 수도 있다. 이렇게 하는 초기값 설정은 client 의 state 를 서버에서 돌아가는 redux 를 통해 구현한 애플리케이션의 state 와 `hydrating` 하는데 매우 유용하다

### Dispatching Actions

우리는 `createStore()` 메서드를 통해 store 까지도 만들었다. 이제 우리의 프로그램이 작동하는지 확인해보자! UI 가 없더라도, 콘솔을 통해서 테스트해볼 수 있다... 라고 하는데, 어떻게 작동시켜야 할지 모르겠다. 일단 모르겠으니 나중에 하는 방법을 알게 되면 돌아와서 테스트 해 보고, 그 다음단계로 넘어가보자. 

## Data Flow

### Data Flow

> Redux architecture revolves around a strict unidirectional data flow.

Redux 의 아키텍처는 엄격한 단방향의 데이터 흐름(strict unidirectional data flow) 를 중요하게 여긴다. 

이 말을 풀어서 설명하자면, (Redux를 통해 만든) 애플리케이션의 모든 데이터들은 동일한 life cycle pattern 에 따르며, 이 덕분에 내가 만든 애플리케이션의 코드의 결과물을 예상하기 쉬워지며, 또 이해하기 쉬워진다. 또한 이는 데이터 정규화(data normalization)을 더욱 쉽게끔 만들어 주기 때문에 각각 독립적이고, 여러 개의 같은 데이터가 복제되어 존재하는 일들을 막아준다, 즉 DB를 더 깔끔하게 짜는데 도움이 된다는 의미이다! 

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

## `switch, case`

참조한 글 : 

[switch](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/switch)

```jsx
let caseFunction = (fruit) => {
    switch(fruit) {
        case "orange":
            console.log("i love orange");
            break;
        case "grape":
            console.log("hmm... grape? so so");
            break;
        case "mango":
            console.log("mango!! it's my favorite fruit ever!!");
            break;
        default:
            console.log("is any there no more fruit not these?");
    }
}
```

`switch` 기능을 수행하는 `caseFunction` 을 작성해보았다. 작동 과정은 인자로 들어온 `fruit` 를 `case` 의 값과 비교한다. 값을 비교할 때는 엄격한 비교(`strict comparison`, `===`)를 통해 비교한다. 어떻게 보면 조금 더 간결하고 인간의 언어와 닮은 `if` 문이라고 볼 수 있겠다. 

Redux 공식 문서의 `switch` 를 통해 만든 `reducer` 는 `action.type` 이 `SET_VISIBILITY_FILTER` 인지, 아닌지(`default`) 를 비교하는 조건분기식이라고 볼 수 있겠다. 

## `Obejct.assign()`

참조한 글 : 

[Object.assign()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

열거할 수 있는 하나 이상의 속성을 가진 객체로부터 다른 객체로 속성을 복사할 때 사용하는 메서드이다. 

```jsx
let obj1 = {a: 1}
let obj1Assigned = obj1
obj1.b = 2;

obj1
//{a: 1, b: 2}
obj1Assigned
//{a: 1, b: 2}

Boolean(obj1 === obj1Assigned)
//true
```

다른 변수에 객체를 할당하는 식으로 넣는다면 원본 객체가 변경되는 순간 같이 변경된다. 그리고 그 둘이 같은지 엄격한 비교를 통해 확인해 보면, 같다고 나온다. 

그러나 `Object.assign()` 을 사용하면, 이야기가 달라진다. 해당 메서드의 구조는 `Object.assign(target, ...sources)` 으로, target 이란 인자로 받는 객체에 source(하나 이상이 될 수 있다)들의 속성들(properties)이 복제된다. 

```jsx
let obj2 = {a: 1}
let obj2WithAssignMethod = Object.assign({}, obj2);

obj2.b = 2

obj2
//{a: 1, b: 2}

obj2WithAssignMethod
//{a: 1}

Boolean(obj2 === obj2WithAssignMethod)
//false
```

엄연히 다른 객체로 인식되며, 원본 객체가 변경되어도 `Object.assign` 을 통해 속성을 복제받고 새로 만들어진 객체(여기서는 `obj2WithAssignMethod`) 변하지 않는다. 즉, `immutable` 한 속성을 유지할 수 있는 것이다. 그렇기 때문에 redux 의 reducer 에서는 객체를 복제할 때 해당 메서드를 사용한다. 

## `hydrating` meaning in programming

참조한 글 : 

[What does it mean to hydrate an object?](https://stackoverflow.com/questions/6991135/what-does-it-mean-to-hydrate-an-object)

질문자 또한 Hydrating 이 무엇인지 잘 몰라서 프로그래밍에서 Hydrating 이 어떤 의미로 쓰이는지 물어보았다. 그 곳에 달린 답변을 보았다. Java 와 관련된 답변이지만 언어에 국한되는 개념은 아닌 거 같아서 참고하여 정리한다.

> **With respect to the more generic term hydrate**
Hydrating an object is taking an object that exists in memory, that doesn't yet contain any domain data ("real" data), and then populating it with domain data (such as from a database, from the network, or from a file system).

어떠한 Object 를 `hydrate` 한다는 것은 메모리 안에 존재하는, 그러나 어떠한 domain data 도 아직 가지고 있지 않은 Object 에다가 데이터베이스나, 네트워크, 혹은 파일 시스템으로부터 값을 받아서 그 값을 넣어주는 행위를 의미한다(`populating`) 

그러니까 데이터베이스나 웹 서버에서 어떤 데이터를 참조는 하는데, 그 데이터를 아직 실제로 받아오지는 않은 상황이라는 이야기이다.

그렇다면 Redux 공식 문서의 "This is useful for hydrating the state of the client to match the state of a Redux application running on the server" 는, 아래와 같이 이해하면 될 듯 하다.

`createStore(reducer, inital_data)` 와 같이 두 번째 인자로 초기값을 할당해 주는 경우는 client 의 state 가 서버의 state 에 맞추어 데이터를 미리 참조하고 차차 받아오게 하는 상황(hydrating) 에 굉장히 유용합니다. 

추가로 populating 이라는 단어도 프로그래밍에서 어떻게 쓰이는지를 잘 몰라 검색해서 quora 링크를 통해 답변을 찾을 수 있었다. 일반적으로는 데이터베이스 테이블이나 객체, 변수, 혹은 UI form 에 값을 넣어주는 행위라고 한다. 

> Populating, the term is often used to mean to put values into - normally refers to either a database table, an object/variable, or a user interface form.

## `data normalization`

관게형 데이터베이스에서 중ㅂ족을 최소화하게 데이터를 구조화 하는 일련의 과정을 의미한다. 한국어로 번역하자면 "데이터(베이스) 정규화" 가 되겠다.

## Revolve around something

어떤 것을 중점적으로 다룬다는 의미를 가진 chunk 이다. revolve 라는 단어만 알고 "주축을 중심으로 회전한다" 정도로 해석했는데, 이상해서 찾아보니 이런 뜻이었다. 

## End up with something

"결국 어떻게 하게된다" 라는 의미를 가진 chunk 이다. 이 또한 직역해서 "이렇게 끝나버린다" 라는 의미인가? 싶었다가 마찬가지로 그렇게 해석을 했는데 이상해서 찾아보니 이런 뜻이었다.