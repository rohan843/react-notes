1. Use `performance.now()` at various positions in the code to see what function executes when, and what rerender happens when. This can help deal with concurrency issues in the browser.

> Try using `window.fnCallTime = performance.now()` inside a function. Now, `fnCallTime` is a value accessible via the browser console.

2. When creating modals, we often have to disable scrolling while the modal is being displayed. We can use a cleanup function within the modal, such as:

```js
useEffect(() => {
  document.body.classList.add("overflow-hidden");
  return () => {
    document.body.classList.remove("overflow-hidden");
  };
}, []);
```

This "disables" scrolling every time a modal is loaded, and enables it when the modal is finally removed from the DOM.
