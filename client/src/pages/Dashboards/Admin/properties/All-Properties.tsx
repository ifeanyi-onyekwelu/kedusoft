import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import PropertiesTable from "../../../../components/screens/Dashboards/Admin/PropertiesTable";

function AllProperties() {
    const properties = [
        {
            id: "0101001",
            address: "28, Lincon Road, Bariga, Lagos",
            status: "present",
            type: "2 Bedroom",
            owner: "Sarah",
            price: 20000,
        },
        {
            id: "0101001",
            address: "28, Lincon Road, Bariga, Lagos",
            status: "present",
            type: "2 Bedroom",
            owner: "Sarah",
            price: 20000,
        },
        {
            id: "0101001",
            address: "28, Lincon Road, Bariga, Lagos",
            status: "present",
            type: "2 Bedroom",
            owner: "Sarah",
            price: 20000,
        },
    ];

    return (
        <>
            <Link to="/admin/users" className="flex items-center space-x-2 mb-5">
                <IconArrowLeft className="w-5 h-5 p-1 bg-primary rounded-md text-white stroke-2" />
                <span>All Properties</span>
            </Link>
            <PropertiesTable data={properties} price showMenu />
        </>
    );
}

export default AllProperties;
