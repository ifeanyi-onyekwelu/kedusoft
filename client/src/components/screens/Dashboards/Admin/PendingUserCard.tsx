import { Button } from "../../../Button";

function PendingUserCard({ user }: any) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 w-80 space-y-4 h-fit">
      <p className="text-sm font-medium">
        <span className="text-sm">USER ID:</span> {user.id}
      </p>
      <p className="text-sm font-medium">
        <span className="text-sm">NAME:</span> {user.firstName} {user.lastName}
      </p>
      <p className="text-sm font-medium">
        <span className="text-sm">ROLE:</span>{" "}
        <span className="text-blue-600 text-sm">{user.role}</span>
      </p>
      <p className="text-sm font-medium">
        <span className="text-sm">STATUS:</span> {user.status}
      </p>
      <p className="text-sm font-medium">
        <span className="text-sm">PHONE NUMBER:</span> {user.phone}
      </p>
      <p className="text-sm font-medium">
        <span className="text-sm">EMAIL ADDRESS:</span> {user.email}
      </p>
      <p className="text-sm font-medium">
        <span className="text-sm">FILE ATTACHED:</span> {user.file}
      </p>

      <div className="flex justify-between">
        <Button label="View Details" radius="md" to="/admin/users/pending/id" />
        <Button label="Start Verification" radius="md" />
      </div>
    </div>
  );
}

export default PendingUserCard;
