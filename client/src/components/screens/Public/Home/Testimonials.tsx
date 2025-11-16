import { Box, Container, Group, Avatar, Text, Title, rem } from "@mantine/core";
import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import { IconQuote } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Tech Professional",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Finding my perfect apartment was effortless with this platform. The virtual tours saved me countless hours, and the landlord was extremely responsive throughout the process.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Medical Resident",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "As someone who relocated for work, this service made securing a rental from abroad seamless. The verification process gave me confidence in the property's legitimacy.",
    rating: 4,
  },
  {
    id: 3,
    name: "Amina Diallo",
    role: "Graduate Student",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    text: "The lease comparison tool helped me understand exactly what I was signing. No hidden fees or surprises - just transparent renting from start to finish.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Okafor",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    text: "After three bad rental experiences elsewhere, I finally found a properly maintained home through this service. The maintenance request system works incredibly well.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
      </div>

      <Container size="xl" className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-6"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            TRUSTED BY TENANTS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            What Our <span className="text-primary">Customers</span> Say
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Hear from thousands of satisfied renters who found their perfect
            home through our platform
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {[
              { value: "4.9/5", label: "Average Rating" },
              { value: "5,000+", label: "Happy Tenants" },
              { value: "10,000+", label: "Reviews" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Carousel
            slideSize={{ base: "100%", sm: "50%" }}
            slideGap="xl"
            align="start"
            height="100%"
            loop
            withIndicators
            styles={{
              indicator: {
                backgroundColor: "#5f3dc4",
                width: rem(12),
                height: rem(5),
                position: "relative",
                top: "30px",
                transition: "all 0.2s ease",
                "&[data-active]": {
                  width: rem(24),
                },
              },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <Carousel.Slide key={testimonial.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <Box
                    p={32}
                    bg="white"
                    className="rounded-2xl border-2 border-gray-200 hover:border-primary/40 transition-all duration-300 h-full flex flex-col"
                  >
                    {/* Quote and Rating */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-primary/10 p-3 rounded-xl">
                        <IconQuote size={28} color="#5f3dc4" />
                      </div>
                      <Group gap={2}>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5"
                            fill={
                              i < testimonial.rating ? "#fab005" : "#e5e7eb"
                            }
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </Group>
                    </div>

                    {/* Testimonial Text */}
                    <Text
                      fz="md"
                      mb="xl"
                      className="text-gray-700 leading-relaxed flex-1 font-medium"
                      style={{ lineHeight: 1.7 }}
                    >
                      "{testimonial.text}"
                    </Text>

                    {/* User Info */}
                    <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100">
                      <Avatar
                        src={testimonial.image}
                        alt={testimonial.name}
                        size={56}
                        radius="xl"
                        className="border-3 border-primary/20"
                      />
                      <div className="flex-1">
                        <Text fw={700} fz="md" c="#2d3748" mb={2}>
                          {testimonial.name}
                        </Text>
                        <Text c="dimmed" fz="sm" fw={500} mb={4}>
                          {testimonial.role}
                        </Text>
                        <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <Text fz="xs" fw={600}>
                            Verified Tenant
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Box>
                </motion.div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Text c="dimmed" fz="sm">
            Trusted by over 5,000 renters across Nigeria • Join them today
          </Text>
        </motion.div>
      </Container>
    </section>
  );
};

export default Testimonials;
