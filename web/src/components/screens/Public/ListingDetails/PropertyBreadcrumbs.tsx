import { Link } from "react-router-dom";

export default function PropertyBreadcrumbs({
  property,
}: {
  property: Property;
}) {
  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ol className="flex space-x-2">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link to="/listings" className="hover:underline">
            Properties
          </Link>
        </li>
        <li>/</li>
        <li className="text-gray-800">{property.name}</li>
      </ol>
    </nav>
  );
}
