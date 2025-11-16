import { Button } from "../../../../components/Button";
import { IconDownload } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function TableMenu() {
  return (
    <div className="flex justify-end items-center px-10 py-3">
      <Link
        to="/admin/users/all"
        className="text-primary font-semibold text-lg"
      >
        View All
      </Link>
    </div>
  );
}

export default TableMenu;
