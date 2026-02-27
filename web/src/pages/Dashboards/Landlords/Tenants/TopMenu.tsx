import {
    IconDownload,
    IconEdit,
    IconSquareRoundedX,
    IconTrash,
} from "@tabler/icons-react";
import React from "react";

function TopMenu() {
    return (
        <div className="p-4">
            <h2 className="text-md">Tenant Details</h2>

            <ul className="flex items-center space-x-4">
                <li>
                    <IconEdit />
                </li>
                <li>
                    <IconDownload />
                </li>
                <li>
                    <IconTrash />
                </li>
                <li>
                    <IconSquareRoundedX />
                </li>
            </ul>
        </div>
    );
}

export default TopMenu;
