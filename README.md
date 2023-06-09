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

<!-- TODO: Add notes from section 1 to section 12 -->

## Navigation

### Quick Notes

1. When any **new request** is made, the default browser behaviour is to **dump all the javascript code and variables**. _This belaviour cannot be prevented_.

2. React servers are programmed by default to _always_ return the `index.html` file irrespective of what path was specified in the URL.

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
    document.querySelector(".modal-container")   // A reference to where to insert the above JSX
  );
}

export default Modal;
```
