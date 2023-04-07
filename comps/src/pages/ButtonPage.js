import Button from "../components/Button";
import { GoBell } from "react-icons/go";

function ButtonPage() {

  return (
    <div>
      <div>
        <Button primary rounded className='mb-5'>
          <GoBell />
          Hi There
        </Button>
      </div>
      <div>
        <Button secondary outline>
          Hi There
        </Button>
      </div>
      <div>
        <Button danger rounded outline>
          Hi There
        </Button>
      </div>
      <div>
        <Button warning>Hi There</Button>
      </div>
      <div>
        <Button success>Hi There</Button>
      </div>
    </div>
  );
}

export default ButtonPage;
