import { useState } from "react";
import {
  Button,
  Container,
  TextInput,
  Textarea,
  Select,
  Group,
  Text,
  Box,
} from "@mantine/core";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconMessageDots,
  IconHelpCircle,
  IconAlertCircle,
} from "@tabler/icons-react";
import { PageHero } from "@/components/shared/public/PageHero";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowSuccess(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <PageHero
        badgeText="Reliable Support"
        title="Let’s start a"
        highlightText="conversation."
        subtitle="Whether you're looking for a new home or need assistance with your current lease, our team is here to provide expert guidance."
        bgImageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Box className="bg-white border border-gray-100 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-100/50">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-primary mb-2 font-montserrat">
                    Send a Message
                  </h2>
                  <p className="text-gray-500">
                    Expected response time: Under 24 hours
                  </p>
                </div>

                {showSuccess && (
                  <div className="mb-8 p-5 bg-green-50 text-green-800 border border-green-100 rounded-2xl flex items-center gap-3 animate-pulse">
                    <IconMessageDots size={22} />
                    <span className="font-semibold">
                      Thank you! Your message has been sent successfully.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <TextInput
                      label="Full Name"
                      placeholder="Chidi Benson"
                      required
                      size="lg"
                      classNames={{
                        input:
                          "rounded-2xl border-gray-200 focus:border-primary px-5",
                      }}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <TextInput
                      label="Email Address"
                      placeholder="chidi@example.com"
                      required
                      size="lg"
                      classNames={{
                        input:
                          "rounded-2xl border-gray-200 focus:border-primary px-5",
                      }}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <TextInput
                      label="Phone Number"
                      placeholder="+234..."
                      size="lg"
                      classNames={{
                        input:
                          "rounded-2xl border-gray-200 focus:border-primary px-5",
                      }}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    <Select
                      label="Inquiry Type"
                      placeholder="Select category"
                      required
                      size="lg"
                      classNames={{
                        input:
                          "rounded-2xl border-gray-200 focus:border-primary px-5",
                      }}
                      data={[
                        "General Inquiry",
                        "Property Question",
                        "Technical Support",
                        "Partnership",
                      ]}
                      value={formData.subject}
                      onChange={(value) =>
                        setFormData({ ...formData, subject: value || "" })
                      }
                    />
                  </div>

                  <Textarea
                    label="Message"
                    placeholder="How can we help you today?"
                    required
                    minRows={5}
                    size="lg"
                    classNames={{
                      input:
                        "rounded-2xl border-gray-200 focus:border-primary px-5 py-4",
                    }}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />

                  <Button
                    type="submit"
                    size="xl"
                    fullWidth
                    loading={isSubmitting}
                    className="bg-primary hover:scale-[1.01] transition-transform rounded-2xl h-16 text-lg font-bold"
                  >
                    {isSubmitting ? "Processing..." : "Send Inquiry"}
                  </Button>
                </form>
              </Box>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-8">
              {/* Direct Channels */}
              <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
                <h3 className="text-xl font-bold text-primary mb-8">
                  Contact Information
                </h3>

                <div className="space-y-8">
                  <Group align="center" wrap="nowrap">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                      <IconMapPin size={22} className="text-primary" />
                    </div>
                    <div>
                      <Text fw={700} size="sm" className="text-primary">
                        Headquarters
                      </Text>
                      <Text size="sm" color="dimmed" className="leading-tight">
                        Victoria Island, Lagos
                      </Text>
                    </div>
                  </Group>

                  <Group align="center" wrap="nowrap">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                      <IconPhone size={22} className="text-secondary" />
                    </div>
                    <div>
                      <Text fw={700} size="sm" className="text-primary">
                        Phone Support
                      </Text>
                      <Text size="sm" color="dimmed">
                        +234 812 345 6789
                      </Text>
                    </div>
                  </Group>

                  <Group align="center" wrap="nowrap">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                      <IconMail size={22} className="text-accent" />
                    </div>
                    <div>
                      <Text fw={700} size="sm" className="text-primary">
                        Email Support
                      </Text>
                      <Text size="sm" color="dimmed">
                        support@letsten.com
                      </Text>
                    </div>
                  </Group>
                </div>
              </div>

              {/* Quick Support Links */}
              <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-lg shadow-blue-900/20">
                <h3 className="text-xl font-bold mb-6">Support Center</h3>
                <div className="space-y-4">
                  <Button
                    variant="white"
                    fullWidth
                    size="md"
                    leftSection={<IconHelpCircle size={20} />}
                    className="text-primary rounded-2xl font-bold"
                  >
                    Help Center
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    size="md"
                    color="white"
                    leftSection={<IconMessageDots size={20} />}
                    className="rounded-2xl border-white/30 hover:bg-white/10"
                  >
                    Live Chat
                  </Button>
                </div>
              </div>

              {/* Emergency Support */}
              <div className="p-8 border border-red-100 rounded-[2.5rem] bg-red-50/20">
                <Group gap="xs" mb={8}>
                  <IconAlertCircle size={24} className="text-red-600" />
                  <Text fw={800} color="red.8" size="md">
                    Emergency?
                  </Text>
                </Group>
                <Text size="sm" color="dimmed" mb={12}>
                  Available 24/7 for urgent property issues.
                </Text>
                <Text fw={900} className="text-red-600 text-xl tracking-tight">
                  0800-PROPERTY
                </Text>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ContactUs;
