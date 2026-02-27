import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ApplicationsTable from "../../../../components/screens/Dashboards/Admin/ApplicationsTable";

function AllApplications() {
  const applications = [
    {
      id: "0101001",
      applicant: "28, Lincon Road, Bariga, Lagos",
      property: "RST000000001",
      date: "12 - 03 -24",
      status: "completed",
      result: "Approved",
    },
    {
      id: "0101001",
      applicant: "28, Lincon Road, Bariga, Lagos",
      property: "RST000000001",
      date: "12 - 03 -24",
      status: "In-progress",
      result: "Pending",
    },
    {
      id: "0101001",
      applicant: "28, Lincon Road, Bariga, Lagos",
      property: "RST000000001",
      date: "12 - 03 -24",
      status: "Completed",
      result: "Rejected",
    },
  ];

  return (
    <>
      <Link
        to="/admin/applications"
        className="flex items-center space-x-2 mb-5"
      >
        <IconArrowLeft className="w-5 h-5 p-1 bg-primary rounded-md text-white stroke-2" />
        <span>All Applications</span>
      </Link>
      <ApplicationsTable data={applications} />
    </>
  );
}

export default AllApplications;
