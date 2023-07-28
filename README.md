# React Notes

## Contents

- [React Notes](#react-notes)
  - [Contents](#contents)
  - [Navigation](#navigation)
    - [Quick Notes](#quick-notes)
    - [Theory of Browser Navigation](#theory-of-browser-navigation)
    - [Theory of Navigation in React](#theory-of-navigation-in-react)
      - [During initial loading](#during-initial-loading)
      - [When a user navigates inside the app](#when-a-user-navigates-inside-the-app)
      - [When user presses the 'back' button](#when-user-presses-the-back-button)
      - [Useful variables and functions](#useful-variables-and-functions)
      - [Navigation Context](#navigation-context)
      - [Utility components](#utility-components)
        - [`Link` Component](#link-component)
        - [`Route` Component](#route-component)
      - [Portals](#portals)
  - [Fragments](#fragments)
  - [Custom Hooks creation: Logic reuse](#custom-hooks-creation-logic-reuse)
  - [Reducers](#reducers)
    - [Basic Usage](#basic-usage)
    - [Immer](#immer)
    - [Summary](#summary)
  - [Redux](#redux)
    - [Redux Store](#redux-store)
      - [Slices](#slices)

<!-- TODO: Add notes from section 1 to section 12 -->

## Navigation

### Quick Notes

1. When any **new request** is made, the default browser behaviour is to **dump all the javascript code and variables**. _This belaviour cannot be prevented_.

2. React servers are programmed by default to _always_ return the `index.html` file irrespective of what path was specified in the URL.

3. When modifying objects in javascript, _always_ create new deep copies. The `map` function and object destructuring can be useful.

4. _NEVER_ directly modify an array or an object (or their elements) if they are a part of the prop system or the state system (part of prop system === being passed as a prop at least once). Make a deep copy instead: `{...prevObj}` or `[...prevArray]`.

5. As a good design pattern, its always recommended to first create a react component, then extract its logic into a custom hook, if needed.

### Theory of Browser Navigation

1. When a user clicks on an `<a>` (anchor) tag, the browser makes a request to the resource specified by the `href` attribute.

2. Once the response is received by the browser, it dumps all existing JS code and variables, and completely starts afresh from the newly recieved document.

> All in all, say that a user is on page `index.html` and clicks a link to go to `posts.html`, all that the user needs to do is click on the associated link, and the new page would load up in just 1 newtork request.
>
> > Note that `posts.html` would have the posts _already_ rendered in it from the server side.
>
> This, however, is disadvantageous for React apps. As we click on, say `posts.html`, we not only need to fetch the `bundle.js` file, but also make API requests to our server to get the posts. This results in multiple (here, 3) requests per click.

### Theory of Navigation in React

#### During initial loading

1. User enters some link, say `example.com/some-endpoint` in their browser's navigation bar.

2. The browser makes a request to our server, at `example.com/some-endpoint`.

3. The server returns the `index.html` file, irrespective of the provided endpoint. This file has a `<script>` tag that causes the browser to also request the server for the `bundle.js` file, which the server returns.

4. Now, before the React app begins, it looks at the url, specifically, at the specified endpoint. Based on the endpoint value, the app loads the proper component on screen.

#### When a user navigates inside the app

1. User clicks on a link.

2. We programatically intercept the navigation event.

3. We check the endpoint the user was trying to go to.

4. We update the address bar, to give the impression to the user that they navigated.

5. Based on the desired endpoint, we render the components that need to be displayed with respect to that endpoint.

#### When user presses the 'back' button

1. We programatically intercept the back navigation event.

2. We check the endpoint the user was trying to go to.

3. We update the address bar, to give the impression to the user that they navigated.

4. Based on the desired endpoint, we render the components that need to be displayed with respect to that endpoint.

> Such methods of navigation have the advantage that now, we needn't worry about fetching API data and resetting JS variabes over and over again. As all JS gets preserved, when a back button is pressed, all we need to do is re - render some previous component, but use the same, previously fetched data.

> Note: When a component is removed from the screen, its local variables and states are **not** preserved. For assured persistence, we place some stateful variable in the context or in some parent component that doesn't get removed from the screen.

#### Useful variables and functions

1. `window.location.pathname` consists the current URL's path.

2. `window.location = NEW URL` causes a full page refresh. Instead, we use `window.history.pushState({}, '', NEW ENDPOINT)` to update the address bar without causing a page refresh.

3. To detect a user clicking a link, we use a `Link` component with an underlying `<a>` element, as follows:

```js
function Link({ to }) {
  const handleClick = (e) => {
    e.preventDefault();
    // Navigate to the path stored in 'to' here onwards.
  };

  return (
    <a onClick={handleClick} href={to}>
      Click
    </a>
  );
}
```

4. We do use `<a>` elements directly, however, we only use them when navigating to some location outside of our app, such as `www.google.com`.

5. When some URL was pushed onto the browser history stack via the `pushState` function described abv. (pt. 2), pressing the back button doesn't cause any page refresh. As all our in - app links were placed on the stack in this way, we needn't worry about any page refresh when a user presses the back button.

6. Whenever the back or the forward button is pressed, the `window` emits a `popstate` event. We can listen for it as follows:

```js
window.addEventListener("popstate", () => {
  // re-render components corresponding to window.location.pathname
});
```

#### Navigation Context

Create a new context for navigation, say it is `NavigationContext` and the corresponding context provider may be `NavigationProvider`:

```js
// /context/navigation.js

import { createContext, useEffect, useState } from "react";

const NavigationContext = createContext();

function NavigationProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname); // The path user actually went to

  // Set up a one - time event handler for the popstate event.
  useEffect(() => {
    const handler = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handler);

    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to); // Update the URL
    setCurrentPath(to); // cause a 'navigation' (re - render)
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export default NavigationContext;
export { NavigationProvider };
```

Now, in the `index.js` file, ensure that this context provider is an ancestor of `<App />` (in general use cases) but the other context providers that need to stay the same across renders must be the ancestors of the `NavigationProvider` context provider.

This context and its provider now basically acheive 2 goals:

1. Whenever the **back/forward button** is pressed (i.e., the `popstate` event is floated), the `currentPath` state is updated, causing the `children` (mainly, `<App />`) to re - render.

2. We also have a `navigate` function for **programmatic navigation**, i.e., changing the current path (`currentPath` state) via code, for cases when the user clicks, for example. This function updates the `currentPath` state, causing the `children` (mainly, `<App />`) to re - render.

> We pass the `currentPath` and the `navigate` function to the child components via the `NavigationContext`.

#### Utility components

##### `Link` Component

We'll use this component to navigate somewhere in - App. _For going to some external link, we'll still use `<a>`_.

Based on the previous code files, the `Link` component simply watches for a click event on a `<a>` tag, captures it, stops its propagation, causes the URL in the search bar to update, and this is followed by a screen re - render.

```js
import { useContext } from "react";
import NavigationContext from "../context/navigation";

function Link({ to, children }) {
  const { navigate } = useContext(NavigationContext);
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return <a onClick={handleClick}>{children}</a>;
}

export default Link;
```

Usage:

```js
<Link to="/dropdown">Go to dropdown</Link>
```

Often, it is useful to also allow for regular `<a>` tag based usage. Consider the case where a user presses the Control key while clicking the link. In such a case, the user would would expect the link to open in a new tab. This will only be possible if we add an `href` to the anchor tag, and handle clicks as below:

```js
function Link({ to, children }) {
  const { navigate } = useContext(NavigationContext);
  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey) return; // Change done here
    e.preventDefault();
    navigate(to);
  };

  return (
    // Change done here
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}
```

##### `Route` Component

This component basically is used to _conditionally display children components_. Basically it accepts a `path` value. It compares this value to the current path from the URL bar. If they match, the `children` are displayed.

```js
import { useContext } from "react";
import NavigationContext from "../context/navigation";

function Route({ children, path }) {
  const { currentPath } = useContext(NavigationContext);
  if (currentPath == path) {
    return children;
  } else {
    return null;
  }
}

export default Route;
```

Usage:

```js
<Route path="/accordion">
  <AccordionPage />
</Route>
<Route path="/dropdown">
  <DropdownPage />
</Route>
```

#### Portals

They are used to specify React to load a specific component at some other location in the `index.html` file. Consider that we want to create a modal component. Generally, a modal component is supposed to cover the entire screen. For this, we might code it as follows:

```js
function Modal() {
  return (
    <div>
      <div className="absolute inset-0 bg-gray-300 opacity-80"></div>
      <div className="absolute inset-40 p-10 bg-white">This is a modal.</div>
    </div>
  );
}

export default Modal;
```

Here, the tailwind class of `absolute` is used to specify a position of absolute for the two `div`s. This lets us, as per our expectations, to position the `div`s on the basis of the `body` element. However, in case this component's final point of usage has any positioned parent element, our modal would break.

To prevent this, we might consider placing each modal in a separate location directly in the `body` element, as follows:

```html
<body>
  <div class="root">...</div>
  <div class="modal-container">We want the modal component displayed here</div>
</body>
```

Such functionality is acheived via portals.

The corresponding change required in our code for the modal component would be:

```js
import ReactDOM from "react-dom";

function Modal() {
  return ReactDOM.createPortal(
    <div>
      <div className="absolute inset-0 bg-gray-300 opacity-80"></div>
      <div className="absolute inset-40 p-10 bg-white">This is a modal.</div>
    </div>,
    document.querySelector(".modal-container") // A reference to where to insert the above JSX
  );
}

export default Modal;
```

## Fragments

Oftentimes, we have React components that return such JSX that is not in our control, and this JSX cannot be wrapped into any HTML element either. In case any attribute needed by react, such as `key` is to be placed in the top level element of this JSX, it cannot be done by simple HTML elements.
In such situations, dummy components such as `Echo` as below may come in handy:

```js
function Echo({ children }) {
  return children;
}
```

We can use this simply as:

```js
<Echo key={"some key"}>{/*Un - editable JSX here*/}</Echo>
```

React provides a simple component to perform just this, called `Fragment`.
We can simply do:

```js
import { Fragment } from "react";

<Fragment key={"some key"}>{/*Un - editable JSX here*/}</Fragment>;
```

## Custom Hooks creation: Logic reuse

If some piece of logic needs to be used at multiple places in a project, we can extract it into a custom hook.

The basic overall process is as simple as:

1. Find code in a component related to a single piece of state.
2. Copy paste it all into a helper function.
3. Fix all the broken references.
4. Use this helper as a hook.

A more detailed and fool-proof method is:

1. Make a function `useSomething`.
2. Find all the non-JSX expressions that refer to 1-2 related pieces of state.
3. Cut them and paste them into the `useSomething` function.
4. Find `not defined` errors in the component.
5. From the hook, return an object that contains the variables that the component needs.
6. In the component, call the hook. Destructure the properties the component needs.
7. Find `not defined` errors in the hook. Pass the missing variables in as arguments to the hook.
8. Rename the hook to something more meaningful.
9. Rename the returned properties to something more descriptive.
10. Extract the hook into a module of its own.

## Reducers

Reducers are created via the `useReducer` hook. They provide a slightly different way of handling state in a component as compared to `useState`. Usually, only 1 of them is used within a component.

`useReducer` is useful when we have several closely related pieces of state, and when future state value depends on the current state.

### Basic Usage

The basic usage is:

```js
const [state, dispatch] = useReducer(reducer, {
  val1: 0,
  val2: "initialValue",
});
```

Here,

- `state`: State variable
- `dispatch`: Function to change state
- `reducer`: Another function, described below
- `{...passed object...}`: Initial value for the `state` variable

The `reducer` function takes 2 parameters, and has the following signature:

```js
const reducer = (state, action) => {
  return ...;
};
```

This function will be called whenever we call the `dispatch` function. Say we execute the below instruction:

```js
dispatch(action);
```

This will call the reducer function. The value of the `state` parameter (i.e., the first parameter) will be the state object itself, and the value of `action` parameter (i.e., the second parameter) will be whatever is passed into `dispatch`.
The return value of the reducer function will be the new value for `state`.
Note that `dispatch` may also be called with no arguments:

```js
dispatch();
```

This will simply mean `action` in `reducer` will be `null`.

There are a few rules for the `reducer` function:

1. Whatever is returned will be the new state.
2. If nothing is returned, the state will be `undefined`.
3. No `async/await`, no `requests`, no `promises` and no outside variables are allowed. (For outside variables, it is more of a good practice to not be used inside, rather than an actual rule.)
4. Like almost everywhere else in React, the `state` object should NOT be modified directly.

```js
// Bad way
const reducer = (state, action) => {
  state.val1 = state.val1 + 1;
  return state;
};

// Good way
const reducer = (state, action) => {
  // Update value of val1.
  return {
    ...state,
    val1: state.val1 + 1,
  };
};

// Good way
const reducer = (state, action) => {
  // Reset the state.
  return {
    val1: 0,
    val2: "initialValue",
  };
};
```

The `action` objects passed into the `reducer` need to be able to describe every action that takes place. For this, a generally accepted convention is:

1. When we need to modify the state, we'll call the `dispatch` function, and _always_ pass the `action` object.
2. The `action` object will have a `type` property that will be a string/enum/constant (all caps). This helps tell the reducer what state update it needs to make.
3. If we need to communicate some data to the reducer, it will be placed in the `payload` property of the `action` object. Try to keep this property _only if_ absolutely necessary. If the data to be communicated is a function of the `state` itself, don't put the computation in `payload`, rather do it in `reducer`.

```js
dispatch({
  type: "update-val2",
  payload: "newValue",
});
```

### Immer

This is an external library that allows us to mutate the state object directly in the `reducer` function. It can be installed as:

```bash
npm i immer
```

The following changes supersede the rules of `reducer` function as described above:

1. We can directly modify the `state` object.
2. We donot have to return a new value.

```js
// Sample reducer WITH Immer library.
const reducer = (state, action) => {
  state.val1 += 1;
  return;
};
```

To enable these changes, we use `immer` in the following way, via the `produce` function:

```js
import { produce } from "immer";

const [state, dispatch] = useReducer(produce(reducer), {
  val1: 0,
  val2: "initialValue",
});
```

### Summary

This makes the code noticeably more modular. From the docs,

> `useReducer` is usually preferable to `useState` when you have complex state logic that involves multiple sub-values. It also lets you optimize performance for components that trigger deep updates because you can pass `dispatch` down instead of callbacks.

Also, this allows for a very specific set of allowed state changes.

## Redux

It is a library for managing state, using the same techniques as `useReducer`.

Within React, we create a component with some state, and then this state object can be passed onto its child components. With Redux however, we create a separate object, called the **Redux Store**. This is responsible for creating and maintaining our state. Individual components can connect to it and access the state.

Redux doesn't require the use of React. To allow for an easy interfacing with Redux from React, we use a library called `react-redux`. This helps in communicating between the React (components) and Redux (Redux store) sides of out project.

Another difference between React and Redux is that in Redux we may have several different reducer functions to manage each property within our state object.

> This pattern of `dispatch -> reducer -> state` both in `useReducer` and in Redux is very popular. This is mainly because the `dispatch` function allows for a central point of any state change initiation. However, this comes at a cost of having too much code to specify what part of the state needs to be changed.

The recommended way to develop Redux projects is to use the Redux Toolkit (RTK) as a wrapper around Redux. It makes the usage very easy.

### Redux Store

It is an object that holds all of our state. Barring extremely large projects, all Redux projects generally have only 1 store.

We usually donot have to interact with the store directly. The React-Redux library handles the store for us. However, if we ever need to manage the store manually for debugging purposes, we do it in the following way:

```js
// To dispatch an action.
store.dispatch({ type: "songs/addSong" });

// To see the state existing in the store.
store.getState();
```

The general setup of the store is:

```js
// In the file: "src/store/index.js". This file should be imported into the "src/index.js" file as:
//      import './store'
import { configureStore, createSlice } from "@reduxjs/toolkit";

// This is one slice, i.e., one property within the store.
const songsSlice = createSlice({
  // The name will be used to identify the slice.
  name: "song",

  // This is the initial state of the slice, here an array. It is referenced by `state` within the reducer.
  initialState: [],

  // These are 2 reducers within the slice. Their names are used to specify the action. The slice will eventually combine all these together into a single reducer function.
  reducers: {
    // Action type: 'song' + '/' + 'addSong' = 'song/addSong'.
    addSong(state, action) {
      // Note that the state itself can be mutated here. The Immer library is used internally.
      state.push(action.payload);
    },
    // Action type: 'song' + '/' + 'removeSong' = 'song/removeSong'.
    removeSong(state, action) {
      //
    },
  },
});

// This is the definition of the state itself. The reducer property allows us to add the various slices to the state, and to specify their state.
const store = configureStore({
  reducer: {
    songs: songsSlice.reducer,
  },
});

// Usage of the dispatch method:
store.dispatch({
  type: "song/addSong",
  payload: "New Song",
});

// Usage of the getState method:   (The complete state object is returned)
const finalState = store.getState();
console.log(finalState);
// The received output is such an object:
//    {
//      "songs":["New Song"],
//    }
```

The keys for the store's state object are set when the store is created. The values are provided by the individual reducers. 

> Its usually nice to store all the state in a single big object.

#### Slices

Slices automatically create reducers and action types for us. (They don't actually affect the underlying `dispatch -> reducer -> state` flow).

Their 3 main roles are:

1. Defining some initial state.
2. Combining 'mini-reducers' into a big reducer.
3. Creating a set of 'action creator' functions, i.e., creating the action types.

