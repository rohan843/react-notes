import { useEffect } from "react";
import { useState } from "react";
import Button from "../components/Button";

function useCounter(initialCount) {
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    console.log(count);
  }, [count]);
  const increment = () => {
    setCount(count + 1);
  };
  return { count, increment };
}

function CounterPage({ initialCount }) {
  const { count, increment } = useCounter(initialCount);
  return (
    <div>
      <h1>{count}</h1>
      <Button primary onClick={increment}>
        Increment Count
      </Button>
    </div>
  );
}

export default CounterPage;
