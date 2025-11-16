import { Illustration } from "./NotFoundIllustration";
import { Button } from "../../components/Button";

function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="relative w-3/4 h-full">
        <Illustration className="absolute opacity-5 top-40 -z-10" />
        <div className="h-full text-center flex items-center">
          <div className="flex flex-col items-center space-y-3 justify-center">
            <h1 className="text-7xl font-bold">Nothing to see here</h1>
            <p className="text-gray-400 text-lg">
              Page you are trying to open does not exist. You may have mistyped
              the address, or the page has been moved to another URL. If you
              think this is an error contact support.
            </p>
            <Button label="Go back to home page" variant="filled" to="/" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
