import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/Button";
import { useEffect, useState } from "react";
import { TextInput } from "@mantine/core";
import RentalHistoryTable from "../../../../components/screens/Dashboards/Admin/PropertiesTable";

function UserDetails() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  //   if (!user) {
  //     return <div>Loading...</div>;
  //   }

  const properties = [
    {
      id: "0101001",
      address: "28, Lincon Road, Bariga, Lagos",
      status: "present",
      type: "2 Bedroom",
      owner: "Sarah",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between py-2 mb-3">
        <Link to="/admin/users" className="flex items-center space-x-2 mb-5">
          <IconArrowLeft className="w-5 h-5 p-1 bg-primary rounded-md text-white stroke-2" />
          <span>All Users</span>
        </Link>

        <div className="flex space-x-2">
          <Button label="Message User" />
          <Button label="Suspend Account" />
          <Button label="Reset Password" />
          <Button label="Delete Account" />
        </div>
      </div>

      <div className="p-6 rounded-md bg-white space-y-7">
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
            <hr className="border border-gray-300 col-span-3"></hr>
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
            <hr className="border border-gray-300 col-span-3"></hr>
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

        <h4 className="font-bold text-md">User Info</h4>
        <div className="space-y-7">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">User ID</span>
            <span className="text-sm font-medium">94567T001</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <span className="text-sm font-medium">94567T001</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Verification</span>
            <span className="text-sm font-medium flex space-x-3 py-2 px-4 border border-green-600 rounded-full ">
              <span>Verified</span>
              <IconCheck className="w-5 h-5 rounded-full p-1 text-white bg-green-600" />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Date Registered</span>
            <span className="text-sm font-medium">12-03-24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Date Verified</span>
            <span className="text-sm font-medium">12-03-24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Profile Update</span>
            <span className="text-sm font-medium">12-03-24</span>
          </div>
        </div>

        <h4 className="font-bold text-md">Recent Activities</h4>
        <div className="space-y-7">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Activity</span>
            <span className="text-sm font-medium">Time</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Logged In</span>
            <span className="text-sm font-medium">12-03-22 .09:32</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Submitted Screening Document
            </span>
            <span className="text-sm font-medium">12-03-22 .09:32</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Signed Lease Agreement Document
            </span>
            <span className="text-sm font-medium">12-03-22 .09:32</span>
          </div>
        </div>

        <h4 className="font-bold text-md">Rental History</h4>
        <RentalHistoryTable data={properties} />

        <h4 className="font-bold text-md">Permissions</h4>
        <div className="space-y-7">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Edit Profile</span>
            <span className="text-sm font-medium">Time</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">View Properties</span>
            <span className="text-sm font-medium">12-03-22 .09:32</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Edit Leases</span>
            <span className="text-sm font-medium">12-03-22 .09:32</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Accept Screening Invite</span>
            <span className="text-sm font-medium">12-03-22 .09:32</span>
          </div>
        </div>

        <h4 className="font-bold text-md">Controls</h4>
        <div className="space-y-7">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Hide User Account</span>
            <span className="text-sm font-medium">Time</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Ban User</span>
            <span className="text-sm font-medium">12-03-22 .09:32</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
