import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  IconDownload,
  IconX,
  IconUser,
  IconMail,
  IconPhone,
  IconIdBadge,
  IconHome,
  IconClock,
} from "@tabler/icons-react";
import StatusBadge from "../../../../components/StatusBadge";
import { formatDate } from "../../../../utils/helpers";
import { ErrorState } from "../../../../components/ErrorState";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useLoading } from "../../../../hooks/useLoading";
import { useLandlordOperations } from "../../../../apis/landlordApi";

function ApplicantDetails() {
  const { id } = useParams();
  const { loading, withLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [applicantData, setApplicantData] = useState<any>(null);
  const navigate = useNavigate();
  const { getApplicant } = useLandlordOperations();

  const fetchApplicantDetails = async () => {
    try {
      const response = await withLoading(getApplicant(id!));
      setApplicantData(response);
      setError(null);
    } catch (err) {
      console.log("Error fetching applicants details", err);
      setError("Failed to fetch applicant details");
    }
  };

  useEffect(() => {
    fetchApplicantDetails();
  }, [id]);

  const handleBackToList = () => {
    navigate("/property-owner/applications/applicants");
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "email":
        // Open email client
        if (applicant?.email) {
          window.open(`mailto:${applicant.email}`);
        }
        break;
      case "message":
        // Navigate to messaging system
        navigate(`/property-owner/messages?tenant=${applicant?.id}`);
        break;
      case "screening":
        // Handle screening invitation
        console.log("Invite to screening:", applicant?.id);
        // TODO: Implement screening invitation logic
        break;
      case "reject":
        // Handle application rejection
        console.log("Reject application:", applicant?.id);
        // TODO: Implement rejection logic
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  if (loading)
    return <LoadingSpinner fullScreen label="Fetching applicant details" />;
  if (error)
    return (
      <ErrorState
        message={error}
        loading={loading}
        onRetry={fetchApplicantDetails}
      />
    );
  if (!applicantData)
    return <ErrorState message="No applicant data found" loading={loading} />;

  const { applicant, applications } = applicantData;

  const renderField = (label: string, value: any, icon?: React.ReactNode) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b">
      <span className="text-gray-600 font-medium flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="col-span-2">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <button
              onClick={handleBackToList}
              className="text-blue-600 hover:text-blue-800 mb-2 text-sm flex items-center"
            >
              ← Back to applicants
            </button>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <IconUser size={24} />
              {applicant.firstName} {applicant.lastName}
            </h2>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleAction("email")}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
              title="Send email to applicant"
            >
              <IconMail size={20} />
            </button>
            <button
              className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
              title="Download documents"
            >
              <IconDownload size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Main Applicant Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Personal Information
              </h3>
              <div className="space-y-3">
                {renderField(
                  "Full Name",
                  `${applicant.firstName} ${
                    applicant.middleName ? applicant.middleName + " " : ""
                  }${applicant.lastName}`,
                  <IconUser size={18} />
                )}
                {renderField("Email", applicant.email, <IconMail size={18} />)}
                {renderField(
                  "Phone",
                  applicant.phone_number,
                  <IconPhone size={18} />
                )}
                {renderField(
                  "Date of Birth",
                  formatDate(applicant.date_of_birth)
                )}
                {renderField("Marital Status", applicant.marital_status)}
                {renderField("Occupation", applicant.occupation)}
                {renderField("Employment Status", applicant.employment_status)}
                {renderField("Employer", applicant.employer_name)}
                {renderField(
                  "Monthly Income",
                  applicant.monthly_income
                    ? `$${Number(applicant.monthly_income).toLocaleString()}`
                    : null
                )}
                {renderField(
                  "Annual Income",
                  applicant.annual_income
                    ? `$${Number(applicant.annual_income).toLocaleString()}`
                    : null
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Current Address
              </h3>
              <div className="space-y-3">
                {renderField(
                  "Street Address",
                  applicant.street_address,
                  <IconHome size={18} />
                )}
                {renderField("Apartment/Suite", applicant.apartment_or_suite)}
                {renderField("Street", applicant.street)}
                {renderField("City", applicant.city)}
                {renderField("State/Province", applicant.state)}
                {renderField("Country", applicant.country)}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Account Status & Verification
              </h3>
              <div className="space-y-3">
                {renderField(
                  "Email Verified",
                  applicant.is_email_verified ? "✅ Yes" : "❌ No"
                )}
                {renderField(
                  "Identity Verified",
                  applicant.is_verified ? "✅ Yes" : "❌ No"
                )}
                {renderField(
                  "Account Active",
                  applicant.is_active ? "✅ Active" : "❌ Inactive"
                )}
                {renderField(
                  "Onboarding Complete",
                  applicant.is_onboarded ? "✅ Complete" : "⏳ Pending"
                )}
                {renderField("Member Since", formatDate(applicant.joined_at))}
                {renderField(
                  "Last Login",
                  applicant.last_successful_login
                    ? formatDate(applicant.last_successful_login)
                    : "Never"
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Applications ({applications.length})
              </h3>
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div
                    key={app.id}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <IconHome size={18} />
                          {app.property?.address || "Unknown Property"}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1">
                          Applied: {formatDate(app.created_at)}
                        </div>
                      </div>
                      {/* <StatusBadge status={app.status} /> */}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-gray-500">Last Updated</div>
                        <div>{formatDate(app.updated_at)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Screening</div>
                        <div>{app.screening?.status || "Not started"}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Link
                        to={`/property-owner/applications/${app.id}/${app.property.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Application →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar with Documents and Actions */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Documents
              </h3>
              <div className="space-y-3">
                {/* Identity Documents from User model */}
                {applicant.identity_card && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center gap-2">
                      <IconIdBadge size={18} className="text-gray-500" />
                      <span className="text-sm">Identity Card</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Download
                    </button>
                  </div>
                )}
                {applicant.national_id_card && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center gap-2">
                      <IconIdBadge size={18} className="text-gray-500" />
                      <span className="text-sm">National ID Card</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Download
                    </button>
                  </div>
                )}

                {/* Additional documents if available */}
                {applicant.documents?.length > 0
                  ? applicant.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div className="flex items-center gap-2">
                          <IconIdBadge size={18} className="text-gray-500" />
                          <span className="text-sm">{doc.type}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Download
                        </button>
                      </div>
                    ))
                  : !applicant.identity_card &&
                    !applicant.national_id_card && (
                      <div className="text-gray-500 text-sm">
                        No documents uploaded
                      </div>
                    )}
              </div>
            </div>

            {/* <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Screening Status
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b">
                  <span className="text-gray-600 font-medium">
                    Overall Status
                  </span>
                  <div className="col-span-2">
                    <StatusBadge
                      status={applicant.screening_status || "not_started"}
                      variant="screening"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b">
                  <span className="text-gray-600 font-medium">
                    Last Checked
                  </span>
                  <span className="col-span-2">
                    {applicant.last_screened
                      ? formatDate(applicant.last_screened)
                      : "Never"}
                  </span>
                </div>
              </div>
            </div> */}

            {/*
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleAction("email")}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded"
                >
                  <span className="flex items-center gap-2">
                    <IconMail size={18} />
                    Send Email
                  </span>
                  →
                </button>
                <button
                  onClick={() => handleAction("screening")}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded"
                >
                  <span className="flex items-center gap-2">
                    <IconClock size={18} />
                    Invite to Screening
                  </span>
                  →
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded text-red-600"
                >
                  <span className="flex items-center gap-2">
                    <IconX size={18} />
                    Reject Application
                  </span>
                  →
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantDetails;
