import React from "react";
import { TextInput } from "@mantine/core";

const RecommendationInputs: React.FC = () => {
  const [preferences, setPreferences] = React.useState({
    location: "",
    budget: "",
    propertyType: "",
    amenities: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="recommendation-inputs">
      <h2>Tell us your preferences</h2>
      <TextInput
        label="Preferred Location"
        type="text"
        value={preferences.location}
        onChange={handleChange}
        name="location"
      />
      <TextInput
        label="Budget"
        type="text"
        value={preferences.budget}
        onChange={handleChange}
        name="budget"
      />
      <TextInput
        label="Property Type"
        type="text"
        value={preferences.propertyType}
        onChange={handleChange}
        name="propertyType"
      />
      <TextInput
        label="Amenities"
        type="text"
        value={preferences.amenities}
        onChange={handleChange}
        name="amenities"
      />
    </div>
  );
};

export default TextInput;
