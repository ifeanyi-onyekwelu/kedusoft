import React, { useState, useEffect } from "react";
import {
  Stepper,
  Group,
  TextInput,
  Text,
  Textarea,
  Stack,
  NumberInput,
  Switch,
  Card,
  Container,
  Title,
  LoadingOverlay,
  Box,
  Divider,
  Grid,
  Badge,
  Select,
  MultiSelect,
  Paper,
  ThemeIcon,
  Progress,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconHome,
  IconMapPin,
  IconCash,
  IconPhoto,
  IconCheck,
  IconInfoCircle,
  IconBed,
  IconCar,
  IconShield,
  IconStar,
  IconX,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { ImageUploadStep } from "./ImageUploadStep";
import { LocationPicker } from "../../../../components/maps/LocationPicker";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { usePublicOperations } from "../../../../apis/publicApi";
import uploadToCloudinary from "../../../../utils/uploader";
import { useLoading } from "../../../../hooks/useLoading";
import { ErrorState } from "../../../../components/ErrorState";
import { showNotification } from "../../../../utils/helpers";
import { useDebouncedCallback } from "@mantine/hooks";
import { Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Enhanced interface matching the property model
interface EnhancedPropertyFormData {
  // Basic Property Info
  name: string;
  description: string;
  listing_type: string;
  category_id: string;

  // Property Characteristics
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  kitchens: number;
  floors_no: number;
  size_sqft: number;
  year_built: number;
  furnished: string;
  furnishing_details: any;

  // Water
  water_source: string;
  has_water_heater: boolean;

  // Security
  security_features: any;
  neighborhood_security: string;

  // Parking
  has_parking: boolean;
  parking_type: string;
  parking_security: string;
  parking_spaces: number;

  // Amenities & Facilities
  amenities: any;

  // Location Details
  address: string;
  street: string;
  area: string;
  city: string;
  state: string;
  zipcode: string;
  latitude?: number;
  longitude?: number;
  closest_landmark: string;
  accessibility_features: string[];

  // Financial Details
  payment_structure: string;
  rent_amount: number;
  caution_fee?: number;
  agreement_fee?: number;

  // Availability
  available_from: Date | null;
  minimum_lease_duration: string;

  // Media
  cover_image: string;
  gallery: string[];
  video_tour?: string;
}

const EnhancedAddProperty: React.FC = () => {
  const [active, setActive] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { loading } = useLoading();
  const { savePropertyDraft, createProperty } = useLandlordOperations();
  const { getAllCategories } = usePublicOperations();
  const navigate = useNavigate();

  // Form with complete property model fields
  const form = useForm<EnhancedPropertyFormData>({
    initialValues: {
      // Basic Property Info
      name: "",
      description: "",
      listing_type: "rent",
      category_id: "",

      // Property Characteristics
      bedrooms: 1,
      bathrooms: 1,
      toilets: 1,
      kitchens: 1,
      floors_no: 1,
      size_sqft: 0,
      year_built: new Date().getFullYear(),
      furnished: "unfurnished",
      furnishing_details: {
        items: [],
      },

      // Water
      water_source: "public",
      has_water_heater: false,

      // Security
      security_features: {
        fence: false,
        gate: false,
        cctv: false,
        security_guards: false,
        alarm: false,
      },
      neighborhood_security: "none",

      // Parking
      has_parking: false,
      parking_type: "none",
      parking_security: "none",
      parking_spaces: 0,

      // Amenities & Facilities
      amenities: {
        generator: false,
        borehole: false,
        water_tank: false,
        security: [],
        common_areas: [],
        swimming_pool: false,
        gym: false,
        laundry: false,
        waste_disposal: false,
        visitors_room: false,
      },

      // Location Details
      address: "",
      street: "",
      area: "",
      city: "",
      state: "",
      zipcode: "",
      latitude: undefined,
      longitude: undefined,
      closest_landmark: "",
      accessibility_features: [],

      // Financial Details
      payment_structure: "yearly",
      rent_amount: 0,
      caution_fee: 0,
      agreement_fee: 0,

      // Availability
      available_from: new Date(),
      minimum_lease_duration: "1 year",

      // Media
      cover_image: "",
      gallery: [],
      video_tour: "",
    },
    validate: (values) => {
      const errors: any = {};

      if (active === 0) {
        if (!values.name || values.name.length < 3) {
          errors.name = "Property name must be at least 3 characters";
        }
        if (!values.category_id) {
          errors.category_id = "Category is required";
        }
        if (!values.description || values.description.length < 10) {
          errors.description = "Description must be at least 10 characters";
        }
        if (values.bedrooms < 1) {
          errors.bedrooms = "At least 1 bedroom is required";
        }
        if (values.bathrooms < 1) {
          errors.bathrooms = "At least 1 bathroom is required";
        }
      }

      if (active === 1) {
        if (!values.address) {
          errors.address = "Address is required";
        }
        if (!values.city) {
          errors.city = "City is required";
        }
        if (!values.state) {
          errors.state = "State is required";
        }
      }

      if (active === 2) {
        if (values.rent_amount <= 0) {
          errors.rent_amount = "Rent amount must be greater than 0";
        }
        if (!values.available_from) {
          errors.available_from = "Available from date is required";
        }
      }

      return errors;
    },
  });

  // Nigeria states for dropdown
  const nigeriaStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  // Accessibility features options
  const accessibilityOptions = [
    "Bus stop nearby",
    "Metro station",
    "Taxi stand",
    "BRT station",
    "Airport access",
    "Major road",
    "Highway access",
    "Public transport",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getAllCategories();
      console.log("Categories", categories);
      setCategories(categories || []);

      // Set the first category as default if available
      if (categories && categories.length > 0 && !form.values.category_id) {
        form.setFieldValue("category_id", categories[0].id);
      }
    };

    fetchCategories();
  }, []);

  const nextStep = () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      console.log("Validation errors:", validation.errors);
      return;
    }
    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const handleSubmit = async (values: EnhancedPropertyFormData) => {
    setError(null);

    // Upload images
    const galleryUrls: string[] = [];
    let coverImageUrl = "";

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i]);
        galleryUrls.push(url);

        if (coverImage === i) {
          coverImageUrl = url;
        }
      }
    }

    // Prepare the final payload matching the property model
    const payload = {
      ...values,
      cover_image: coverImageUrl,
      gallery: galleryUrls,
      zipcode: parseFloat(values.zipcode) || 0,
    };

    const response = await createProperty(payload);
    console.log("Response", response);

    showNotification("success", "Success", "Property created successfully!");

    // Reset form
    form.reset();
    setFiles([]);
    setCoverImage(null);
    setActive(0);
  };

  const handleSaveDraft = async () => {
    // Prepare draft data (only include filled fields)
    const draftData = Object.fromEntries(
      Object.entries(form.values).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    await savePropertyDraft(draftData);
    showNotification("success", "Draft Saved", "Property saved as draft");
  };

  // Auto-save functionality
  const debouncedAutoSave = useDebouncedCallback(() => {
    if (
      Object.values(form.values).some(
        (val) => val !== "" && val !== null && val !== undefined && val !== 0
      )
    ) {
      handleSaveDraft();
    }
  }, 10000);

  useEffect(() => {
    debouncedAutoSave();
  }, [form.values, debouncedAutoSave]);

  if (error) {
    return (
      <Container size="lg" py="xl">
        <ErrorState
          message={error}
          loading={false}
          onRetry={() => setError(null)}
        />
      </Container>
    );
  }

  const getStepColor = (step: number) => {
    if (step < active) return "green";
    if (step === active) return "blue";
    return "gray";
  };

  return (
    <Container size="xl" py="xl">
      <Paper
        shadow="md"
        radius="lg"
        p="xl"
        className="bg-gradient-to-br from-white to-gray-50"
      >
        <LoadingOverlay
          visible={loading}
          loaderProps={{
            children: loading ? "Creating Property..." : "Saving Draft...",
          }}
        />

        {/* Header */}
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2} c="gray.8">
              Create New Property
            </Title>
            <Text c="dimmed" size="sm">
              List your property with detailed information to attract quality
              tenants
            </Text>
          </div>
          <Group>
            <Button
              onClick={() => navigate("/property-owner/properties")}
              variant="outlined"
              leftSection={<IconX size={16} />}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
          </Group>
        </Group>

        {/* Progress */}
        <Box mb="xl">
          <Progress
            value={(active / 4) * 100}
            size="lg"
            radius="xl"
            animated
            striped
          />
          <Text size="sm" c="dimmed" mt="xs">
            Step {active + 1} of 5 -{" "}
            {
              [
                "Basic Information",
                "Location & Features",
                "Financial Details",
                "Media Upload",
                "Review",
              ][active]
            }
          </Text>
        </Box>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stepper
            active={active}
            size="sm"
            allowNextStepsSelect={false}
            iconSize={32}
          >
            {/* Step 1: Basic Information */}
            <Stepper.Step
              label="Basic Info"
              description="Property details"
              icon={<IconHome size={20} />}
              color={getStepColor(0)}
            >
              <Stack gap="lg">
                <Card shadow="sm" p="lg" radius="md">
                  <Card.Section p="md" bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" variant="light">
                        <IconHome size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>Property Information</Text>
                        <Text size="sm" c="dimmed">
                          Basic details about your property
                        </Text>
                      </div>
                    </Group>
                  </Card.Section>

                  <Stack gap="md" mt="md">
                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Property Name"
                          placeholder="e.g., Modern 2BR Apartment in VI"
                          required
                          {...form.getInputProps("name")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                          label="Property Category"
                          placeholder="Select category"
                          required
                          data={categories.map((cat) => ({
                            value: cat.id,
                            label: cat.name,
                          }))}
                          {...form.getInputProps("category_id")}
                        />
                      </Grid.Col>
                    </Grid>

                    <Select
                      label="Listing Type"
                      required
                      data={[
                        { value: "rent", label: "For Rent" },
                        { value: "short-let", label: "Short Let" },
                        { value: "lease", label: "Lease" },
                        { value: "sale", label: "For Sale" },
                      ]}
                      {...form.getInputProps("listing_type")}
                    />

                    <Textarea
                      label="Property Description"
                      placeholder="Describe your property in detail..."
                      required
                      minRows={4}
                      {...form.getInputProps("description")}
                    />
                  </Stack>
                </Card>

                <Card shadow="sm" p="lg" radius="md">
                  <Card.Section p="md" bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" variant="light">
                        <IconBed size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>Property Specifications</Text>
                        <Text size="sm" c="dimmed">
                          Room counts and property features
                        </Text>
                      </div>
                    </Group>
                  </Card.Section>

                  <Stack gap="md" mt="md">
                    <Grid>
                      <Grid.Col span={{ base: 6, md: 3 }}>
                        <NumberInput
                          label="Bedrooms"
                          min={1}
                          max={20}
                          required
                          {...form.getInputProps("bedrooms")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 6, md: 3 }}>
                        <NumberInput
                          label="Bathrooms"
                          min={1}
                          max={20}
                          required
                          {...form.getInputProps("bathrooms")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 6, md: 3 }}>
                        <NumberInput
                          label="Toilets"
                          min={1}
                          max={20}
                          {...form.getInputProps("toilets")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 6, md: 3 }}>
                        <NumberInput
                          label="Kitchens"
                          min={1}
                          max={10}
                          required
                          {...form.getInputProps("kitchens")}
                        />
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      <Grid.Col span={{ base: 6, md: 4 }}>
                        <NumberInput
                          label="Size (sqft)"
                          min={100}
                          required
                          {...form.getInputProps("size_sqft")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 6, md: 4 }}>
                        <NumberInput
                          label="Year Built"
                          min={1900}
                          max={new Date().getFullYear()}
                          required
                          {...form.getInputProps("year_built")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <NumberInput
                          label="Number of Floors"
                          min={1}
                          max={100}
                          required
                          {...form.getInputProps("floors_no")}
                        />
                      </Grid.Col>
                    </Grid>

                    <Select
                      label="Furnished Status"
                      required
                      data={[
                        { value: "unfurnished", label: "Unfurnished" },
                        { value: "semi", label: "Semi-Furnished" },
                        { value: "fully", label: "Fully Furnished" },
                      ]}
                      {...form.getInputProps("furnished")}
                    />

                    {(form.values.furnished === "semi" ||
                      form.values.furnished === "fully") && (
                      <Textarea
                        label="Furnishing Details"
                        placeholder="List the furniture and appliances included (e.g., bed, wardrobe, refrigerator, air conditioning, etc.)"
                        minRows={3}
                        onChange={(event) => {
                          const details = event.currentTarget.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item);
                          form.setFieldValue("furnishing_details", {
                            items: details,
                          });
                        }}
                      />
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Stepper.Step>

            {/* Step 2: Location & Features */}
            <Stepper.Step
              label="Location & Features"
              description="Address and amenities"
              icon={<IconMapPin size={20} />}
              color={getStepColor(1)}
            >
              <Stack gap="lg">
                <Card shadow="sm" p="lg" radius="md">
                  <Card.Section p="md" bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" variant="light">
                        <IconMapPin size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>Location Details</Text>
                        <Text size="sm" c="dimmed">
                          Property address and location information
                        </Text>
                      </div>
                    </Group>
                  </Card.Section>

                  <Stack gap="md" mt="md">
                    <TextInput
                      label="Full Address"
                      placeholder="Complete property address"
                      required
                      {...form.getInputProps("address")}
                    />

                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Street"
                          placeholder="Street name"
                          {...form.getInputProps("street")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Area"
                          placeholder="e.g., Victoria Island, Ikeja"
                          {...form.getInputProps("area")}
                        />
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                          label="City"
                          placeholder="City"
                          required
                          {...form.getInputProps("city")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <Select
                          label="State"
                          placeholder="Select state"
                          required
                          data={nigeriaStates}
                          searchable
                          {...form.getInputProps("state")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                          label="Zipcode"
                          placeholder="Postal code"
                          {...form.getInputProps("zipcode")}
                        />
                      </Grid.Col>
                    </Grid>

                    <TextInput
                      label="Closest Landmark"
                      placeholder="e.g., Near Shoprite Mall"
                      {...form.getInputProps("closest_landmark")}
                    />

                    <MultiSelect
                      label="Accessibility Features"
                      placeholder="Select transportation options"
                      data={accessibilityOptions}
                      {...form.getInputProps("accessibility_features")}
                    />

                    {/* Hidden latitude and longitude inputs for form validation */}
                    <Grid style={{ display: "none" }}>
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Latitude"
                          decimalScale={6}
                          {...form.getInputProps("latitude")}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Longitude"
                          decimalScale={6}
                          {...form.getInputProps("longitude")}
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Card>

                {/* Location Picker Component */}
                <LocationPicker
                  onLocationSelect={(location) => {
                    form.setFieldValue("latitude", location.lat);
                    form.setFieldValue("longitude", location.lng);

                    if (location.address) {
                      // Auto-fill address if not already set
                      if (!form.values.address) {
                        form.setFieldValue("address", location.address);
                      }
                    }

                    // Auto-fill address components if available and not already set
                    if (location.addressComponents) {
                      const components = location.addressComponents;
                      if (components.street && !form.values.street) {
                        form.setFieldValue("street", components.street);
                      }
                      if (components.area && !form.values.area) {
                        form.setFieldValue("area", components.area);
                      }
                      if (components.city && !form.values.city) {
                        form.setFieldValue("city", components.city);
                      }
                      if (components.state && !form.values.state) {
                        form.setFieldValue("state", components.state);
                      }
                      if (components.zipcode && !form.values.zipcode) {
                        form.setFieldValue("zipcode", components.zipcode);
                      }
                    }
                  }}
                  initialLocation={
                    form.values.latitude && form.values.longitude
                      ? {
                          lat: form.values.latitude,
                          lng: form.values.longitude,
                        }
                      : undefined
                  }
                  address={form.values.address}
                  onAddressChange={(address) => {
                    if (!form.values.address) {
                      form.setFieldValue("address", address);
                    }
                  }}
                />
                <Card shadow="sm" p="lg" radius="md">
                  <Card.Section p="md" bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" variant="light">
                        <Waves size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>Water & Utilities</Text>
                        <Text size="sm" c="dimmed">
                          Water source and utility information
                        </Text>
                      </div>
                    </Group>
                  </Card.Section>

                  <Stack gap="md" mt="md">
                    <Select
                      label="Water Source"
                      required
                      data={[
                        { value: "public", label: "Public Water Supply" },
                        { value: "borehole", label: "Borehole" },
                        { value: "tank", label: "Water Tank" },
                        { value: "well", label: "Well Water" },
                      ]}
                      {...form.getInputProps("water_source")}
                    />

                    <Switch
                      label="Water Heater Available"
                      {...form.getInputProps("has_water_heater")}
                    />
                  </Stack>
                </Card>
                <Card shadow="sm" p="lg" radius="md">
                  <Card.Section p="md" bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" variant="light">
                        <IconCar size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>Parking Information</Text>
                        <Text size="sm" c="dimmed">
                          Parking availability and details
                        </Text>
                      </div>
                    </Group>
                  </Card.Section>

                  <Stack gap="md" mt="md">
                    <Switch
                      label="Parking Available"
                      {...form.getInputProps("has_parking")}
                    />

                    {form.values.has_parking && (
                      <>
                        <Grid>
                          <Grid.Col span={{ base: 12, md: 6 }}>
                            <Select
                              label="Parking Type"
                              data={[
                                {
                                  value: "compound",
                                  label: "Compound Parking",
                                },
                                {
                                  value: "dedicated",
                                  label: "Dedicated Space",
                                },
                                { value: "street", label: "Street Parking" },
                                { value: "garage", label: "Garage" },
                              ]}
                              {...form.getInputProps("parking_type")}
                            />
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 6 }}>
                            <NumberInput
                              label="Number of Parking Spaces"
                              min={1}
                              {...form.getInputProps("parking_spaces")}
                            />
                          </Grid.Col>
                        </Grid>

                        <Select
                          label="Parking Security"
                          data={[
                            { value: "gate", label: "Gated Parking" },
                            { value: "guard", label: "Security Guard" },
                            { value: "cctv", label: "CCTV Monitored" },
                            { value: "open", label: "Open Parking" },
                          ]}
                          {...form.getInputProps("parking_security")}
                        />
                      </>
                    )}
                  </Stack>
                </Card>
                <Card shadow="sm" p="lg" radius="md">
                  <Card.Section p="md" bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" variant="light">
                        <IconShield size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>Security Features</Text>
                        <Text size="sm" c="dimmed">
                          Security and safety features
                        </Text>
                      </div>
                    </Group>
                  </Card.Section>

                  <Stack gap="md" mt="md">
                    <Group>
                      <Switch
                        label="Fence"
                        checked={form.values.security_features.fence}
                        onChange={(event) =>
                          form.setFieldValue(
                            "security_features.fence",
                            event.currentTarget.checked
                          )
                        }
                      />
                      <Switch
                        label="Gate"
                        checked={form.values.security_features.gate}
                        onChange={(event) =>
                          form.setFieldValue(
                            "security_features.gate",
                            event.currentTarget.checked
                          )
                        }
                      />
                      <Switch
                        label="CCTV"
                        checked={form.values.security_features.cctv}
                        onChange={(event) =>
                          form.setFieldValue(
                            "security_features.cctv",
                            event.currentTarget.checked
                          )
                        }
                      />
                    </Group>

                    <Group>
                      <Switch
                        label="Security Guards"
                        checked={form.values.security_features.security_guards}
                        onChange={(event) =>
                          form.setFieldValue(
                            "security_features.security_guards",
                            event.currentTarget.checked
                          )
                        }
                      />
                      <Switch
                        label="Alarm System"
                        checked={form.values.security_features.alarm}
                        onChange={(event) =>
                          form.setFieldValue(
                            "security_features.alarm",
                            event.currentTarget.checked
                          )
                        }
                      />
                    </Group>

                    <Select
                      label="Neighborhood Security"
                      placeholder="Additional security measures"
                      data={[
                        { value: "vigilante", label: "Vigilante Group" },
                        { value: "police-post", label: "Police Post" },
                        {
                          value: "community-security",
                          label: "Community Security",
                        },
                      ]}
                      {...form.getInputProps("neighborhood_security")}
                    />
                  </Stack>
                </Card>
                <Card shadow="sm" p="lg" radius="md">
                  <Card.Section p="md" bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" variant="light">
                        <IconStar size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>Amenities & Facilities</Text>
                        <Text size="sm" c="dimmed">
                          Additional property amenities
                        </Text>
                      </div>
                    </Group>
                  </Card.Section>

                  <Stack gap="md" mt="md">
                    <Grid>
                      <Grid.Col span={6}>
                        <Switch
                          label="Generator"
                          checked={form.values.amenities.generator}
                          onChange={(event) =>
                            form.setFieldValue(
                              "amenities.generator",
                              event.currentTarget.checked
                            )
                          }
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Switch
                          label="Borehole"
                          checked={form.values.amenities.borehole}
                          onChange={(event) =>
                            form.setFieldValue(
                              "amenities.borehole",
                              event.currentTarget.checked
                            )
                          }
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Switch
                          label="Water Tank"
                          checked={form.values.amenities.water_tank}
                          onChange={(event) =>
                            form.setFieldValue(
                              "amenities.water_tank",
                              event.currentTarget.checked
                            )
                          }
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Switch
                          label="Swimming Pool"
                          checked={form.values.amenities.swimming_pool}
                          onChange={(event) =>
                            form.setFieldValue(
                              "amenities.swimming_pool",
                              event.currentTarget.checked
                            )
                          }
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Switch
                          label="Gym"
                          checked={form.values.amenities.gym}
                          onChange={(event) =>
                            form.setFieldValue(
                              "amenities.gym",
                              event.currentTarget.checked
                            )
                          }
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Switch
                          label="Laundry"
                          checked={form.values.amenities.laundry}
                          onChange={(event) =>
                            form.setFieldValue(
                              "amenities.laundry",
                              event.currentTarget.checked
                            )
                          }
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Switch
                          label="Waste Disposal"
                          checked={form.values.amenities.waste_disposal}
                          onChange={(event) =>
                            form.setFieldValue(
                              "amenities.waste_disposal",
                              event.currentTarget.checked
                            )
                          }
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Switch
                          label="Visitors Room"
                          checked={form.values.amenities.visitors_room}
                          onChange={(event) =>
                            form.setFieldValue(
                              "amenities.visitors_room",
                              event.currentTarget.checked
                            )
                          }
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            </Stepper.Step>

            {/* Step 3: Financial Details */}
            <Stepper.Step
              label="Financial Details"
              description="Pricing and payment"
              icon={<IconCash size={20} />}
              color={getStepColor(2)}
            >
              <Stack gap="lg">
                <Card shadow="sm" p="lg" radius="md">
                  <Card.Section p="md" bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" variant="light">
                        <IconCash size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>Pricing Information</Text>
                        <Text size="sm" c="dimmed">
                          Set your rental pricing and payment terms
                        </Text>
                      </div>
                    </Group>
                  </Card.Section>

                  <Stack gap="md" mt="md">
                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <NumberInput
                          label="Rent Amount (₦)"
                          placeholder="Enter monthly/yearly rent"
                          required
                          min={0}
                          thousandSeparator=","
                          {...form.getInputProps("rent_amount")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                          label="Payment Structure"
                          required
                          data={[
                            { value: "monthly", label: "Monthly Payment" },
                            { value: "yearly", label: "Yearly Payment" },
                            { value: "quarterly", label: "Quarterly Payment" },
                          ]}
                          {...form.getInputProps("payment_structure")}
                        />
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <NumberInput
                          label="Caution Fee (₦)"
                          placeholder="Security deposit amount"
                          min={0}
                          thousandSeparator=","
                          {...form.getInputProps("caution_fee")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <NumberInput
                          label="Agreement Fee (₦)"
                          placeholder="Legal/agreement fee"
                          min={0}
                          thousandSeparator=","
                          {...form.getInputProps("agreement_fee")}
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Card>

                <Card shadow="sm" p="lg" radius="md">
                  <Card.Section p="md" bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" variant="light">
                        <IconInfoCircle size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>Availability</Text>
                        <Text size="sm" c="dimmed">
                          When is the property available?
                        </Text>
                      </div>
                    </Group>
                  </Card.Section>

                  <Stack gap="md" mt="md">
                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <DateInput
                          label="Available From"
                          placeholder="Select date"
                          required
                          minDate={new Date()}
                          {...form.getInputProps("available_from")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                          label="Minimum Lease Duration"
                          required
                          data={[
                            { value: "6 months", label: "6 Months" },
                            { value: "1 year", label: "1 Year" },
                            { value: "2 years", label: "2 Years" },
                            { value: "3 years", label: "3 Years" },
                            { value: "4 years", label: "4 Years" },
                            { value: "5 years", label: "5 Years" },
                          ]}
                          {...form.getInputProps("minimum_lease_duration")}
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            </Stepper.Step>

            {/* Step 4: Media Upload */}
            <Stepper.Step
              label="Media Upload"
              description="Photos and videos"
              icon={<IconPhoto size={20} />}
              color={getStepColor(3)}
            >
              <Card shadow="sm" p="lg" radius="md">
                <Card.Section p="md" bg="gray.0">
                  <Group>
                    <ThemeIcon size="lg" variant="light">
                      <IconPhoto size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={600}>Property Media</Text>
                      <Text size="sm" c="dimmed">
                        Upload high-quality images and videos
                      </Text>
                    </div>
                  </Group>
                </Card.Section>

                <Box mt="md">
                  <ImageUploadStep
                    files={files}
                    setFiles={setFiles}
                    coverImage={coverImage}
                    setCoverImage={setCoverImage}
                  />
                </Box>

                <Box mt="md">
                  <TextInput
                    label="Video Tour URL (Optional)"
                    placeholder="YouTube, Vimeo, or other video URL"
                    {...form.getInputProps("video_tour")}
                  />
                </Box>
              </Card>
            </Stepper.Step>

            {/* Step 5: Review */}
            <Stepper.Step
              label="Review"
              description="Final review"
              icon={<IconCheck size={20} />}
              color={getStepColor(4)}
            >
              <Card shadow="sm" p="lg" radius="md">
                <Card.Section p="md" bg="gray.0">
                  <Group>
                    <ThemeIcon size="lg" variant="light" color="green">
                      <IconCheck size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={600}>Review Your Property</Text>
                      <Text size="sm" c="dimmed">
                        Please review all information before submitting
                      </Text>
                    </div>
                  </Group>
                </Card.Section>

                <Stack gap="md" mt="md">
                  <Grid>
                    <Grid.Col span={12}>
                      <Text fw={600} size="lg">
                        {form.values.name}
                      </Text>
                      <Text c="dimmed">{form.values.description}</Text>
                    </Grid.Col>
                  </Grid>

                  <Divider />

                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text fw={500}>Property Type</Text>
                      <Text c="dimmed">{form.values.listing_type}</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text fw={500}>Size</Text>
                      <Text c="dimmed">{form.values.size_sqft} sqft</Text>
                    </Grid.Col>
                  </Grid>

                  <Grid>
                    <Grid.Col span={{ base: 6, md: 3 }}>
                      <Text fw={500}>Bedrooms</Text>
                      <Badge variant="light">{form.values.bedrooms}</Badge>
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, md: 3 }}>
                      <Text fw={500}>Bathrooms</Text>
                      <Badge variant="light">{form.values.bathrooms}</Badge>
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, md: 3 }}>
                      <Text fw={500}>Kitchens</Text>
                      <Badge variant="light">{form.values.kitchens}</Badge>
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, md: 3 }}>
                      <Text fw={500}>Parking</Text>
                      <Badge
                        variant="light"
                        color={form.values.has_parking ? "green" : "red"}
                      >
                        {form.values.has_parking
                          ? "Available"
                          : "Not Available"}
                      </Badge>
                    </Grid.Col>
                  </Grid>

                  <Divider />

                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text fw={500}>Location</Text>
                      <Text c="dimmed">
                        {form.values.address}, {form.values.city},{" "}
                        {form.values.state}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text fw={500}>Rent Amount</Text>
                      <Text fw={600} size="lg" c="blue">
                        ₦{form.values.rent_amount?.toLocaleString()} /{" "}
                        {form.values.payment_structure}
                      </Text>
                    </Grid.Col>
                  </Grid>

                  <Divider />

                  <div>
                    <Text fw={500} mb="xs">
                      Amenities
                    </Text>
                    <Group gap="xs">
                      {form.values.amenities.generator && (
                        <Badge size="sm" variant="light">
                          Generator
                        </Badge>
                      )}
                      {form.values.amenities.borehole && (
                        <Badge size="sm" variant="light">
                          Borehole
                        </Badge>
                      )}
                      {form.values.amenities.water_tank && (
                        <Badge size="sm" variant="light">
                          Water Tank
                        </Badge>
                      )}
                      {form.values.amenities.swimming_pool && (
                        <Badge size="sm" variant="light">
                          Swimming Pool
                        </Badge>
                      )}
                      {form.values.amenities.gym && (
                        <Badge size="sm" variant="light">
                          Gym
                        </Badge>
                      )}
                      {form.values.amenities.laundry && (
                        <Badge size="sm" variant="light">
                          Laundry
                        </Badge>
                      )}
                      {form.values.has_water_heater && (
                        <Badge size="sm" variant="light">
                          Water Heater
                        </Badge>
                      )}
                    </Group>
                  </div>

                  <Divider />

                  <div>
                    <Text fw={500} mb="xs">
                      Images Uploaded
                    </Text>
                    <Text c="dimmed">{files.length} images selected</Text>
                  </div>
                </Stack>
              </Card>
            </Stepper.Step>
          </Stepper>

          {/* Navigation Buttons */}
          <Group justify="space-between" mt="xl">
            <Group>
              {active > 0 && (
                <Button variant="outlined" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </Group>

            <Group>
              {active < 4 ? (
                <Button onClick={nextStep}>Next Step</Button>
              ) : (
                <Button type="submit" leftSection={<IconCheck size={20} />}>
                  Create Property
                </Button>
              )}
            </Group>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default EnhancedAddProperty;
