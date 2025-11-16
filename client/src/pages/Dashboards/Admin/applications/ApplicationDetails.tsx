import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ImageGallery from "../../../../components/screens/Public/ImageGallery";
import { Button } from "../../../../components/Button";
import { TextInput } from "@mantine/core";

function ApplicationsDetails({ property }: any) {
  const images = [
    { url: "/images/property-1.jpeg" },
    { url: "/images/property-2.jpeg" },
    { url: "/images/property-3.jpeg" },
    { url: "/images/property-4.jpeg" },
  ];

  return (
    <>
      <div className="flex items-center justify-between py-2 mb-3">
        <Link to="/admin/users" className="flex items-center space-x-2 mb-5">
          <IconArrowLeft className="w-5 h-5 p-1 bg-primary rounded-md text-white stroke-2" />
          <span>All Applications</span>
        </Link>

        <div className="flex space-x-2">
          <Button label="Message Owner" />
          <Button label="Edit Property" />
          <Button label="Delete Property" />
        </div>
      </div>

      <div className="p-6 rounded-md bg-white space-y-7">
        <div className="p-6 rounded-md bg-white space-y-7">
          <h3 className="font-semibold text-2xl">RST00000001</h3>
          <hr className="border border-black" />
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
        </div>

        <h4 className="font-bold text-md">Photos</h4>
        <ImageGallery images={images} />

        <h4 className="font-bold text-md">Description</h4>
        <p className="text-sm font-medium">
          Luxurious 2 Bedroom Flat Situated in Lekki , Phase 1 , Lagos. The
          pefect home that suits your style. Furnished with all amenities.
        </p>

        <h4 className="font-bold text-md">Address</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            21, Satellite Town, Lekki Phase1 , Lagos.
          </span>
          <span className="text-sm font-medium">Lekki Phase 1, Lagos</span>
        </div>

        <h4 className="font-bold text-md">Property Info</h4>
        <div className="space-y-7">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Property ID</span>
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
            <span className="text-sm font-medium">Annual Rent</span>
            <span className="text-sm font-medium">N 750 000</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Type</span>
            <span className="text-sm font-medium">2 Bedroom</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Built</span>
            <span className="text-sm font-medium">2020</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Terms of Release</span>
            <span className="text-sm font-medium">Yearly</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Listed By</span>
            <span className="text-sm font-medium flex items-center space-x-2">
              <span>Emmanuel John</span>
              <IconCheck className="w-5 h-5 rounded-full p-1 text-white bg-green-600" />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Date Listed</span>
            <span className="text-sm font-medium">12 -03 -24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Updaetd</span>
            <span className="text-sm font-medium">12 -05 -24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <span className="text-sm font-medium">Emmanuel John</span>
          </div>
        </div>

        <h4 className="font-bold text-md">Amenities</h4>
        <div className="space-y-7">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Bedroom</span>
            <span className="text-sm font-medium">2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Bathroom</span>
            <span className="text-sm font-medium">1</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Parking</span>
            <span className="text-sm font-medium">1 Indoor</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplicationsDetails;
