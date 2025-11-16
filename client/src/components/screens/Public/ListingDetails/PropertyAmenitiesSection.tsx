import { Check } from "lucide-react";

function formatAmenityName(key: string) {
  return key
    .replace(/[_\-]/g, " ") // replace underscores/hyphens
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase -> words
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toStringArray(value: any): string[] {
  if (!value && value !== 0) return [];
  if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean);
  if (typeof value === "string") return value.trim() ? [value] : [];
  if (typeof value === "number") return [String(value)];
  return [];
}

export default function PropertyAmenitiesSection({
  property,
}: {
  property: Property;
}) {
  const amenities = property?.amenities ?? {};
  const entries = Object.entries(amenities);
  if (entries.length === 0) return null;

  // We'll collect:
  // - top-level boolean amenities that are true (facilities)
  // - grouped lists (arrays / strings / nested object lists)
  const facilities: string[] = [];
  const groups: { title: string; items: string[] }[] = [];

  for (const [key, value] of entries) {
    if (typeof value === "boolean") {
      if (value) facilities.push(formatAmenityName(key));
      continue;
    }

    if (Array.isArray(value)) {
      const items = toStringArray(value);
      if (items.length) groups.push({ title: formatAmenityName(key), items });
      continue;
    }

    if (typeof value === "string" || typeof value === "number") {
      const items = toStringArray(value);
      if (items.length) groups.push({ title: formatAmenityName(key), items });
      continue;
    }

    // If value is an object (nested), try to flatten it:
    if (value && typeof value === "object") {
      const nested = Object.entries(value as Record<string, any>);
      const nestedBooleanLabels: string[] = [];
      const nestedGroups: { title: string; items: string[] }[] = [];

      for (const [nKey, nValue] of nested) {
        if (typeof nValue === "boolean") {
          if (nValue) nestedBooleanLabels.push(formatAmenityName(nKey));
        } else if (
          Array.isArray(nValue) ||
          typeof nValue === "string" ||
          typeof nValue === "number"
        ) {
          const items = toStringArray(nValue);
          if (items.length)
            nestedGroups.push({ title: formatAmenityName(nKey), items });
        } else if (nValue && typeof nValue === "object") {
          // deeper nested: try to stringify primitive children
          const deepItems = Object.entries(nValue)
            .filter(([_, dv]) =>
              typeof dv === "boolean"
                ? dv === true
                : typeof dv === "string" || typeof dv === "number"
            )
            .map(([dnk, dv]) =>
              typeof dv === "boolean" ? formatAmenityName(dnk) : String(dv)
            );
          if (deepItems.length)
            nestedGroups.push({
              title: formatAmenityName(nKey),
              items: deepItems,
            });
        }
      }

      if (nestedBooleanLabels.length) {
        // Merge nested booleans under a parent group so it's clear they belong to this key
        groups.push({
          title: formatAmenityName(key),
          items: nestedBooleanLabels,
        });
      }

      for (const ng of nestedGroups)
        groups.push({
          title: `${formatAmenityName(key)} • ${ng.title}`,
          items: ng.items,
        });
    }
  }

  if (facilities.length === 0 && groups.length === 0) return null;

  return (
    <section
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6"
      aria-labelledby="amenities-heading"
    >
      <h3
        id="amenities-heading"
        className="text-lg font-semibold text-gray-800"
      >
        Amenities
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Facilities</h4>
            <ul className="space-y-2">
              {facilities.map((label, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <Check size={18} className="text-green-500" />
                  <span className="text-gray-700">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {groups.map((g, idx) => (
          <div key={idx}>
            <h4 className="font-medium text-gray-800 mb-3">{g.title}</h4>
            <ul className="space-y-2">
              {g.items.map((item, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check size={18} className="text-green-500" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
