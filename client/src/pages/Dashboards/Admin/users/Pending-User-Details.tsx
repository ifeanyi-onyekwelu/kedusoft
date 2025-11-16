import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/Button";
import PendingUserCard from "../../../../components/screens/Dashboards/Admin/PendingUserCard";
import { TextInput } from "@mantine/core";

function PendingUserDetails() {
  const user = {
    id: "0101001",
    firstName: "Davey",
    lastName: "Jones",
    role: "landlord",
    email: "ifeanyi@gmail.com",
    phone: "+234 811 320 8256",
    status: "active",
    file: "international_passport",
  };

  return (
    <>
      <div className="mb-3">
        <div className="flex items-center justify-between py-2">
          <Link to="/admin/users" className="flex items-center space-x-2">
            <IconArrowLeft className="w-5 h-5 p-1 bg-primary rounded-md text-white stroke-2" />
            <span>Pending User Verification</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          <PendingUserCard user={user} />

          <div className="p-6 rounded-md bg-white space-y-7 col-span-2">
            <h3 className="font-semibold text-2xl">Ifeanyi Onyekwelu</h3>
            <hr className="border border-black" />
            <img
              src=""
              alt="User profile image"
              className="border-4 border-green-600 rounded-full w-36 h-36 mt-5"
            />
            <form className="space-y-5 mt-5">
              <h4 className="font-bold text-md">Personal Details</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-5">
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <TextInput
                    label="First Name"
                    value="Ifeanyi"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                  <TextInput
                    label="Middle Name"
                    value="Anthony"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                  <TextInput
                    label="Last Name"
                    value="Onyekwelu"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                </div>
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <TextInput
                    label="Marital Status"
                    value="Married"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                  <TextInput
                    label="Date of Birth"
                    value="12 - 02 - 1990"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                  <TextInput
                    label="Occupation"
                    value="Accountant"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                </div>
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextInput
                    label="Phone Number"
                    value="0811320256"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                  <TextInput
                    label="Email Address"
                    value="ifeanyi@gmail.com"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                </div>
                <TextInput
                  label="Address"
                  value="28, Oladokun Street, Off Odozie, Ikeja, Lagos."
                  radius="sm"
                  style={{ flex: 1 }}
                  readOnly
                  className="col-span-3"
                />
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextInput
                    label="Place of Employment"
                    value="Ministry of Health, Alausa Ikeja"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                  <TextInput
                    label="Date of Employment"
                    value="13 - 09 - 2015"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                  <TextInput
                    label="Current Annual Income"
                    value="N 200,000"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                  <TextInput
                    label="Employment"
                    value="Full-time"
                    radius="sm"
                    style={{ flex: 1 }}
                    readOnly
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PendingUserDetails;
