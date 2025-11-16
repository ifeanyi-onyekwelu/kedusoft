import { useEffect, useState } from "react";
import Statistics from "../Statistics";
import Table from "./Table";
import { getAllApplications } from "../../../../apis/tenantApi";
import EmptyState from "../../../../components/EmptyState";
import { Button } from "../../../../components/Button";
import { ErrorState } from "../../../../components/ErrorState";
import { useLoading } from "../../../../hooks/useLoading";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";

interface StatusCounts {
  viewed: number;
  rejected: number;
  pending: number;
  "in-progress": number;
  accepted: number;
  sent: number;
}

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    viewed: 0,
    rejected: 0,
    pending: 0,
    "in-progress": 0,
    accepted: 0,
    sent: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const { withLoading, loading } = useLoading();

  const fetchApplications = async () => {
    setError(null);
    try {
      const response = await withLoading(getAllApplications());
      console.log("Applications response:", response);

      const { applications, status_counts } = response;

      setStatusCounts(status_counts);
      setApplications(applications);
    } catch (error) {
      setError("Failed to fetch applications. Please try again later.");
      console.error("Error fetching applications", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const statistics = [
    { title: "Total Applications", value: applications.length },
    { title: "Approved", value: statusCounts.accepted },
    { title: "In Progress", value: statusCounts["in-progress"] },
    { title: "Pending Review", value: statusCounts.pending },
  ];

  if (loading)
    return (
      <LoadingSpinner
        label="Fetching applications please wait...."
        fullScreen
      />
    );
  if (error)
    return (
      <ErrorState
        message={error}
        onRetry={fetchApplications}
        loading={loading}
      />
    );

  return (
    <div className="px-6 space-y-10 py-5">
      <Statistics statistics={statistics} />

      <div>
        {applications.length ? (
          <>
            <Table applications={applications} />
          </>
        ) : (
          <EmptyState>
            <div className="space-y-4 flex flex-col justify-center items-center">
              <h2 className="text-4xl font-semibold text-gray-800">
                No Applications Made
              </h2>
              <p className="text-sm text-gray-500">
                Looks like you haven't applied to any property yet
              </p>

              <Button
                label="Browse Properties"
                to="/listings"
                variant="outlined"
              />
            </div>
          </EmptyState>
        )}
      </div>
    </div>
  );
}

export default Applications;
