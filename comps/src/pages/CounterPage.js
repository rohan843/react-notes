import { useEffect } from "react";
import { useState } from "react";
import Button from "../components/Button";

function useSomething(initialCount) {
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    console.log(count);
  }, [count]);
  const handleClick = () => {
    setCount(count + 1);
  };
  return { count, handleClick };
}

function CounterPage({ initialCount }) {
  const { count, handleClick } = useSomething(initialCount);
  return (
    <div>
      <h1>{count}</h1>
      <Button primary onClick={handleClick}>
        Increment Count
      </Button>
    </div>
  );
}

export default CounterPage;
