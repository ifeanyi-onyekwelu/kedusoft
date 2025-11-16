import { IconArrowLeft, IconClock, IconMapPin } from "@tabler/icons-react";
import { Divider } from "@mantine/core";
import { Button } from "../../../../components/Button";

function TransactionDetails() {
  return (
    <div className="relative flex items-center justify-center flex-col">
      <IconArrowLeft size={20} stroke={1} className="absolute top-0 left-0" />

      <div className="flex items-center justify-between space-x-5 md:mt-32 w-full md:w-3/4">
        <div className="flex items-center space-x-5">
          <img
            src="/images/avatar.jpg"
            alt="Man"
            className="rounded-full h-20 w-20 object-cover"
          />

          <div className="space-y-3">
            <p>Application ID: 10001010</p>
            <div className="flex items-center space-x-1">
              <IconMapPin size={25} className="p-1 bg-[#E7EBEA] rounded-full" />
              <span className="text-xs">
                Plot 278b, Hillville. Lekki Lagos.
              </span>
            </div>
          </div>
        </div>

        <span className="text-xs p-2 px-3 bg-[#FF9792] rounded-md font-medium text-red-900">
          Unpaid
        </span>
      </div>

      <div className="p-12 md:w-3/5 space-y-5">
        <h3 className="text-sm">Application Details</h3>
        <Divider size="sm" className="w-1/3" />
        <p className="font-medium">Two Bedroom Apartment</p>
        <p className="text-md font-medium">
          Price:{" "}
          <span className="text-[20px] text-[#4A1B9B] font-semibold">
            #400,000
          </span>
        </p>
        <div className="flex items-center space-x-1">
          <IconClock
            size={25}
            className="p-1 bg-[#E7EBEA] rounded-full text-green-400"
          />
          <span className="text-xs text-gray-500">Date of Application</span>
          <span className="text-sm font-medium">Sept 23, 2024</span>
        </div>
        <div className="flex items-center space-x-1">
          <IconClock
            size={25}
            className="p-1 bg-[#E7EBEA] rounded-full text-green-400"
          />
          <span className="text-xs text-gray-500">Date of Screening</span>
          <span className="text-sm font-medium">Sept 23, 2024</span>
        </div>
      </div>

      <div className="px-12 w-3/5">
        <div className="space-x-5 flex">
          <Button label="Pay for rent" to="" variant="filled" />
          <Button label="Message PO" to="" variant="outlined" />
        </div>
      </div>
    </div>
  );
}

export default TransactionDetails;
