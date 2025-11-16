import React, { useState } from "react";
import { TextInput } from "@mantine/core";

const OnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferences: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    preferences: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = { name: "", email: "", phone: "", preferences: "" };
    let isValid = true;

    if (!formData.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email) {
      formErrors.email = "Email is required";
      isValid = false;
    }
    if (!formData.phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    }
    if (!formData.preferences) {
      formErrors.preferences = "Preferences are required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit form data to the server or handle it as needed
      console.log("Form submitted:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        name="name"
        error={errors.name}
      />
      <TextInput
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        name="email"
        error={errors.email}
      />
      <TextInput
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        name="phone"
        error={errors.phone}
      />
      <TextInput
        label="Preferences"
        type="text"
        value={formData.preferences}
        onChange={handleChange}
        name="preferences"
        error={errors.preferences}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default OnboardingForm;
