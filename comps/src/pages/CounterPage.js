import { useEffect } from "react";
import { useState } from "react";
import Button from "../components/Button";

function CounterPage({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    console.log(count);
  }, [count]);
  const handleClick = () => {
    setCount(count + 1);
  };
  return (
    <div>
      <h1>{count}</h1>
      <Button primary onClick={handleClick}>Increment Count</Button>
    </div>
  );
}

export default CounterPage;
