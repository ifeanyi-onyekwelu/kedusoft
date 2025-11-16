import { IconArrowBackUp } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function QrVerificationComponent() {
  return (
    <div className="space-y-2 w-full md:w-3/4">
      <div className="bg-white p-10 rounded space-y-10">
        <Link to="/tenants/settings/verification">
          <IconArrowBackUp stroke={1} />
        </Link>

        <div className="space-y-5 flex flex-col items-start">
          <h3>Use your mobile device to verify</h3>

          <img
            src="/images/mobile-phone.png"
            alt="Mobile Phone"
            className="w-40 h-72"
          />
        </div>

        <div className="space-y-5 flex flex-col items-start">
          <h3>
            Follow the directions to verify your identity using Persona on your
            mobile device.
          </h3>

          <div className="flex md:flex-row flex-col items-center px-5">
            <img
              src="/images/test-qr.svg"
              alt="Test QR Code"
              className="w-full md:w-1/2"
            />

            <div className="space-y-3">
              <h4>Directions:</h4>

              <ol className="text-md text-gray-400">
                <li>1. Open the camera app on your phone</li>
                <li>2. Scan QR code to the left</li>
                <li>3. Follow the steps on your phone</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrVerificationComponent;
