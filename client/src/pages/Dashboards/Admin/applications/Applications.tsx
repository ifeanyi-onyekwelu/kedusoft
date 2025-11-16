import StatsCard from "../StatsCard";
import DoughnutChart from "../DoughnutChart";
import { IconArrowUp } from "@tabler/icons-react";
import ApplicationsTable from "../../../../components/screens/Dashboards/Admin/ApplicationsTable";
import { useEffect, useState } from "react";
import { getAllApplications } from "../../../../apis/adminApi";

interface Application {
  id: string;
  applicant: string;
  property: string;
  date: string;
  status: string;
  result: string;
}

function Applications() {
  // const applications = [
  //   {
  //     id: "0101001",
  //     applicant: "28, Lincon Road, Bariga, Lagos",
  //     property: "RST000000001",
  //     date: "12 - 03 -24",
  //     status: "completed",
  //     result: "Approved",
  //   },
  //   {
  //     id: "0101001",
  //     applicant: "28, Lincon Road, Bariga, Lagos",
  //     property: "RST000000001",
  //     date: "12 - 03 -24",
  //     status: "In-progress",
  //     result: "Pending",
  //   },
  //   {
  //     id: "0101001",
  //     applicant: "28, Lincon Road, Bariga, Lagos",
  //     property: "RST000000001",
  //     date: "12 - 03 -24",
  //     status: "Completed",
  //     result: "Rejected",
  //   },
  // ];

  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsData, setApplicationsData] = useState<{
    screening: number,
    rent: number,
    approved: number,
    pending: number,
    rejected: number,
  }>(
    {
      screening: 0,
      rent: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
    }
  );

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getAllApplications();

        console.log("FETCH ALL APPLICATIONS RESPONSE", response);
        setApplications(response['applications'] || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    }

    fetchApplications();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex space-x-5 items-center">
        <h3 className="font-semibold text-2xl text-black">Applications</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Application Type">
          <div className="flex items-center justify-between text-sm mt-1">
            <DoughnutChart
              labels={["Property Rent", "Screening Fee"]}
              data={[applicationsData?.rent, applicationsData?.screening]}
              colors={["#4AD795", "#509CF5"]}
            />
            <div className="flex flex-col">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">{applicationsData.rent}</h4>
                  <p className="text-[10px]">Rent Payment</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">{applicationsData?.screening}</h4>
                  <p className="text-[10px]">Screening Fee</p>
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
        <StatsCard title="Total Applications">
          <div className="flex items-center justify-between text-sm mt-1">
            <DoughnutChart
              labels={["Approved", "Pending Verification", "Rejected"]}
              data={[applicationsData.approved, applicationsData.pending, applicationsData.rejected]}
              colors={["#4AD795", "#f5a623", "#ff3b30"]}
            />

            <div className="flex flex-col">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">{applicationsData.approved}</h4>
                  <p className="text-[10px]">Approved</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#509CF5]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">{applicationsData.pending}</h4>
                  <p className="text-[10px]">Pending</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4AD795]"></div>
                <div className="">
                  <h4 className="font-bold text-sm">{applicationsData.rejected}</h4>
                  <p className="text-[10px]">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
      </div>

      <ApplicationsTable data={applications} all />
    </div>
  );
}

export default Applications;
