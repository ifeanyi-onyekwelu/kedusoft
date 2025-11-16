import { useState } from "react";
import { motion } from "framer-motion";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconChartBar,
  IconMapPin,
  IconCalendar,
  IconHome,
  IconBuildingSkyscraper,
  IconArrowUp,
  IconArrowDown,
  IconInfoCircle,
} from "@tabler/icons-react";
import {
  Container,
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Grid,
  Select,
  Tabs,
  Alert,
  Progress,
  SimpleGrid,
} from "@mantine/core";
import { LineChart, BarChart, DonutChart } from "@mantine/charts";

const MarketInsights = () => {
  const [selectedState, setSelectedState] = useState("Lagos");
  const [selectedPeriod, setSelectedPeriod] = useState("12");

  // Sample market data
  const marketStats = {
    Lagos: {
      averagePrice: 450000,
      priceChange: 12.5,
      totalListings: 2845,
      newListings: 234,
      averageDays: 45,
      mostPopularType: "Apartment",
      priceRanges: {
        "Below ₦200k": 15,
        "₦200k - ₦400k": 35,
        "₦400k - ₦600k": 25,
        "₦600k - ₦800k": 15,
        "Above ₦800k": 10,
      },
    },
    Abuja: {
      averagePrice: 380000,
      priceChange: 8.3,
      totalListings: 1856,
      newListings: 145,
      averageDays: 52,
      mostPopularType: "House",
      priceRanges: {
        "Below ₦200k": 20,
        "₦200k - ₦400k": 40,
        "₦400k - ₦600k": 22,
        "₦600k - ₦800k": 12,
        "Above ₦800k": 6,
      },
    },
    Rivers: {
      averagePrice: 280000,
      priceChange: -2.1,
      totalListings: 987,
      newListings: 89,
      averageDays: 38,
      mostPopularType: "Duplex",
      priceRanges: {
        "Below ₦200k": 25,
        "₦200k - ₦400k": 45,
        "₦400k - ₦600k": 20,
        "₦600k - ₦800k": 8,
        "Above ₦800k": 2,
      },
    },
  };

  // Price trend data
  const priceHistoryData = [
    { month: "Jan", Lagos: 420000, Abuja: 350000, Rivers: 285000 },
    { month: "Feb", Lagos: 425000, Abuja: 355000, Rivers: 282000 },
    { month: "Mar", Lagos: 430000, Abuja: 360000, Rivers: 280000 },
    { month: "Apr", Lagos: 435000, Abuja: 365000, Rivers: 278000 },
    { month: "May", Lagos: 440000, Abuja: 370000, Rivers: 275000 },
    { month: "Jun", Lagos: 445000, Abuja: 375000, Rivers: 278000 },
    { month: "Jul", Lagos: 450000, Abuja: 380000, Rivers: 280000 },
  ];

  // Property type distribution
  const propertyTypeData = [
    { name: "Apartments", value: 45, color: "#3b82f6" },
    { name: "Houses", value: 30, color: "#10b981" },
    { name: "Duplex", value: 15, color: "#f59e0b" },
    { name: "Self-Contain", value: 10, color: "#ef4444" },
  ];

  // Regional comparison
  const regionalData = [
    { region: "Lagos", avgPrice: 450000, listings: 2845, growth: 12.5 },
    { region: "Abuja", avgPrice: 380000, listings: 1856, growth: 8.3 },
    { region: "Rivers", avgPrice: 280000, listings: 987, growth: -2.1 },
    { region: "Enugu", avgPrice: 220000, listings: 743, growth: 5.2 },
    { region: "Oyo", avgPrice: 180000, listings: 654, growth: 3.8 },
  ];

  const currentStats = marketStats[selectedState as keyof typeof marketStats];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <Container size="xl" py="xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <IconChartBar size={32} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Market Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get comprehensive market analysis and trends to make informed
            property decisions
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <Group gap="md">
            <Select
              label="Select State"
              value={selectedState}
              onChange={(value) => setSelectedState(value || "Lagos")}
              data={[
                { value: "Lagos", label: "Lagos State" },
                { value: "Abuja", label: "Federal Capital Territory" },
                { value: "Rivers", label: "Rivers State" },
              ]}
              leftSection={<IconMapPin size={16} />}
            />
            <Select
              label="Time Period"
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value || "12")}
              data={[
                { value: "3", label: "Last 3 months" },
                { value: "6", label: "Last 6 months" },
                { value: "12", label: "Last 12 months" },
                { value: "24", label: "Last 2 years" },
              ]}
              leftSection={<IconCalendar size={16} />}
            />
          </Group>
        </Card>

        <Tabs defaultValue="overview" className="mb-8">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconHome size={16} />}>
              Market Overview
            </Tabs.Tab>
            <Tabs.Tab value="trends" leftSection={<IconTrendingUp size={16} />}>
              Price Trends
            </Tabs.Tab>
            <Tabs.Tab value="analysis" leftSection={<IconChartBar size={16} />}>
              Detailed Analysis
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            {/* Key Metrics */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} className="mb-8">
              <Card className="p-6 text-center">
                <Text size="sm" c="dimmed" mb="xs">
                  Average Rent Price
                </Text>
                <Text size="xl" fw={700} c="blue" mb="xs">
                  {formatCurrency(currentStats.averagePrice)}
                </Text>
                <Group gap="xs" justify="center">
                  {currentStats.priceChange >= 0 ? (
                    <IconArrowUp size={16} className="text-green-600" />
                  ) : (
                    <IconArrowDown size={16} className="text-red-600" />
                  )}
                  <Text
                    size="sm"
                    c={currentStats.priceChange >= 0 ? "green" : "red"}
                    fw={600}
                  >
                    {formatPercentage(currentStats.priceChange)}
                  </Text>
                </Group>
              </Card>

              <Card className="p-6 text-center">
                <Text size="sm" c="dimmed" mb="xs">
                  Total Listings
                </Text>
                <Text size="xl" fw={700} c="orange" mb="xs">
                  {currentStats.totalListings.toLocaleString()}
                </Text>
                <Badge color="orange" variant="light" size="sm">
                  {currentStats.newListings} new this month
                </Badge>
              </Card>

              <Card className="p-6 text-center">
                <Text size="sm" c="dimmed" mb="xs">
                  Avg. Days on Market
                </Text>
                <Text size="xl" fw={700} c="green" mb="xs">
                  {currentStats.averageDays}
                </Text>
                <Text size="xs" c="dimmed">
                  Days until rented/sold
                </Text>
              </Card>

              <Card className="p-6 text-center">
                <Text size="sm" c="dimmed" mb="xs">
                  Most Popular Type
                </Text>
                <Text size="xl" fw={700} c="violet" mb="xs">
                  {currentStats.mostPopularType}
                </Text>
                <Text size="xs" c="dimmed">
                  Highest demand
                </Text>
              </Card>
            </SimpleGrid>

            {/* Regional Comparison */}
            <Card className="p-6 mb-8">
              <Text size="lg" fw={600} mb="md">
                Regional Comparison
              </Text>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3">State</th>
                      <th className="text-right p-3">Avg. Price</th>
                      <th className="text-right p-3">Total Listings</th>
                      <th className="text-right p-3">Price Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((region) => (
                      <tr
                        key={region.region}
                        className="border-b border-gray-100"
                      >
                        <td className="p-3 font-medium">{region.region}</td>
                        <td className="p-3 text-right">
                          {formatCurrency(region.avgPrice)}
                        </td>
                        <td className="p-3 text-right">
                          {region.listings.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              region.growth >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {region.growth >= 0 ? (
                              <IconArrowUp size={14} />
                            ) : (
                              <IconArrowDown size={14} />
                            )}
                            {formatPercentage(region.growth)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Property Type Distribution */}
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card className="p-6">
                  <Text size="lg" fw={600} mb="md">
                    Property Type Distribution
                  </Text>
                  <DonutChart
                    data={propertyTypeData}
                    chartLabel="Properties"
                    withTooltip
                    size={200}
                    thickness={30}
                  />
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card className="p-6">
                  <Text size="lg" fw={600} mb="md">
                    Price Range Distribution
                  </Text>
                  <Stack gap="sm">
                    {Object.entries(currentStats.priceRanges).map(
                      ([range, percentage]) => (
                        <div key={range}>
                          <Group justify="space-between" mb="xs">
                            <Text size="sm">{range}</Text>
                            <Text size="sm" fw={600}>
                              {percentage}%
                            </Text>
                          </Group>
                          <Progress value={percentage} size="sm" />
                        </div>
                      )
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="trends" pt="md">
            <Card className="p-6 mb-8">
              <Text size="lg" fw={600} mb="md">
                Price Trend Analysis (Last 7 Months)
              </Text>
              <LineChart
                h={300}
                data={priceHistoryData}
                dataKey="month"
                series={[
                  { name: "Lagos", color: "blue.6" },
                  { name: "Abuja", color: "green.6" },
                  { name: "Rivers", color: "orange.6" },
                ]}
                curveType="linear"
                strokeWidth={3}
                gridAxis="xy"
                withLegend
                legendProps={{ verticalAlign: "top", height: 50 }}
              />
            </Card>

            <Alert icon={<IconInfoCircle />} color="blue" mb="md">
              <Text fw={600} mb="xs">
                Market Analysis Summary
              </Text>
              <Text size="sm">
                Lagos shows the strongest price growth at{" "}
                {formatPercentage(12.5)}, driven by high demand and limited
                supply. Abuja maintains steady growth while Rivers shows a
                slight decline due to economic factors affecting the oil
                industry.
              </Text>
            </Alert>
          </Tabs.Panel>

          <Tabs.Panel value="analysis" pt="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card className="p-6">
                  <Text size="lg" fw={600} mb="md">
                    Market Indicators
                  </Text>
                  <Stack gap="md">
                    <div>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">Market Health</Text>
                        <Badge color="green" variant="light">
                          Strong
                        </Badge>
                      </Group>
                      <Progress value={78} color="green" size="sm" />
                    </div>

                    <div>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">Demand Level</Text>
                        <Badge color="blue" variant="light">
                          High
                        </Badge>
                      </Group>
                      <Progress value={85} color="blue" size="sm" />
                    </div>

                    <div>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">Price Stability</Text>
                        <Badge color="orange" variant="light">
                          Moderate
                        </Badge>
                      </Group>
                      <Progress value={65} color="orange" size="sm" />
                    </div>

                    <div>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">Investment Potential</Text>
                        <Badge color="violet" variant="light">
                          Good
                        </Badge>
                      </Group>
                      <Progress value={72} color="violet" size="sm" />
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card className="p-6">
                  <Text size="lg" fw={600} mb="md">
                    Key Insights
                  </Text>
                  <Stack gap="md">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Text fw={600} size="sm" c="blue" mb="xs">
                        💡 Buyer's Market Indicator
                      </Text>
                      <Text size="xs">
                        Current inventory levels suggest balanced market
                        conditions with good negotiation opportunities for
                        buyers.
                      </Text>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <Text fw={600} size="sm" c="green" mb="xs">
                        📈 Investment Opportunity
                      </Text>
                      <Text size="xs">
                        Rental yields in {selectedState} are above national
                        average, making it attractive for investment properties.
                      </Text>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <Text fw={600} size="sm" c="orange" mb="xs">
                        ⏰ Market Timing
                      </Text>
                      <Text size="xs">
                        Properties spend an average of{" "}
                        {currentStats.averageDays} days on market, indicating{" "}
                        {currentStats.averageDays < 45 ? "quick" : "moderate"}{" "}
                        turnover.
                      </Text>
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>

            <Card className="p-6 mt-6 bg-gray-50">
              <Text size="lg" fw={600} mb="md">
                📊 Market Forecast
              </Text>
              <Text size="sm" mb="md">
                Based on current trends and economic indicators, we project the
                following for the next 6 months:
              </Text>
              <ul className="space-y-2 text-sm">
                <li>
                  • <strong>Price Growth:</strong> Expected to moderate to 3-5%
                  annually
                </li>
                <li>
                  • <strong>Inventory:</strong> Slight increase in available
                  properties
                </li>
                <li>
                  • <strong>Demand:</strong> Continued strong demand in prime
                  locations
                </li>
                <li>
                  • <strong>Best Opportunities:</strong> Emerging neighborhoods
                  with infrastructure development
                </li>
              </ul>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </motion.div>
    </Container>
  );
};

export default MarketInsights;
