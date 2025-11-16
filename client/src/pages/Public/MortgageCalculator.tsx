import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconCalculator,
  IconHome,
  IconCash,
  IconPercentage,
  IconCalendar,
  IconChartBar,
  IconInfoCircle,
} from "@tabler/icons-react";
import {
  Container,
  Card,
  Text,
  NumberInput,
  Select,
  Button,
  Group,
  Stack,
  Grid,
  Progress,
  Divider,
  Alert,
  Tooltip,
  Table,
  Badge,
} from "@mantine/core";

interface MortgageCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  affordablePrice: number;
  monthlyIncome: number;
  debtToIncomeRatio: number;
}

const MortgageCalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState<number>(25000000);
  const [downPayment, setDownPayment] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(18);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(500000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(50000);
  const [calculation, setCalculation] = useState<MortgageCalculation | null>(
    null
  );

  const calculateMortgage = () => {
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Monthly payment calculation
    const monthlyPayment =
      (loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    // Affordability calculation (typically 28% of income)
    const maxMonthlyPayment = monthlyIncome * 0.28;
    const maxLoanAmount =
      (maxMonthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) /
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    const affordablePrice = maxLoanAmount + downPayment;

    // Debt-to-income ratio
    const debtToIncomeRatio =
      ((monthlyPayment + monthlyDebts) / monthlyIncome) * 100;

    setCalculation({
      monthlyPayment,
      totalPayment,
      totalInterest,
      affordablePrice,
      monthlyIncome,
      debtToIncomeRatio,
    });
  };

  useEffect(() => {
    calculateMortgage();
  }, [
    propertyPrice,
    downPayment,
    interestRate,
    loanTerm,
    monthlyIncome,
    monthlyDebts,
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAffordabilityColor = (ratio: number) => {
    if (ratio <= 28) return "green";
    if (ratio <= 36) return "yellow";
    return "red";
  };

  const getAffordabilityText = (ratio: number) => {
    if (ratio <= 28) return "Excellent - Well within recommended limits";
    if (ratio <= 36) return "Good - Within acceptable range";
    if (ratio <= 43) return "Caution - Above recommended but may be acceptable";
    return "High Risk - Above safe lending limits";
  };

  // Sample amortization schedule (first 12 months)
  const generateAmortizationSchedule = () => {
    if (!calculation) return [];

    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    let remainingBalance = loanAmount;
    const schedule = [];

    for (let month = 1; month <= 12; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = calculation.monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        month,
        payment: calculation.monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance,
      });
    }

    return schedule;
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
              <IconCalculator size={32} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mortgage Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your monthly mortgage payments and determine how much
            house you can afford
          </p>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, md: 5 }}>
            {/* Input Form */}
            <Card className="p-6 sticky top-4">
              <Text size="lg" fw={600} mb="md">
                <IconHome size={20} className="inline mr-2" />
                Loan Details
              </Text>

              <Stack gap="md">
                <NumberInput
                  label="Property Price"
                  placeholder="Enter property price"
                  value={propertyPrice}
                  onChange={(value) => setPropertyPrice(Number(value) || 0)}
                  thousandSeparator=","
                  prefix="₦"
                  min={0}
                  leftSection={<IconCash size={16} />}
                />

                <NumberInput
                  label="Down Payment"
                  placeholder="Enter down payment"
                  value={downPayment}
                  onChange={(value) => setDownPayment(Number(value) || 0)}
                  thousandSeparator=","
                  prefix="₦"
                  min={0}
                  leftSection={<IconCash size={16} />}
                />

                <NumberInput
                  label="Interest Rate (%)"
                  placeholder="Enter annual interest rate"
                  value={interestRate}
                  onChange={(value) => setInterestRate(Number(value) || 0)}
                  min={0}
                  max={50}
                  step={0.1}
                  decimalScale={2}
                  leftSection={<IconPercentage size={16} />}
                />

                <Select
                  label="Loan Term"
                  value={loanTerm.toString()}
                  onChange={(value) => setLoanTerm(Number(value) || 20)}
                  data={[
                    { value: "15", label: "15 years" },
                    { value: "20", label: "20 years" },
                    { value: "25", label: "25 years" },
                    { value: "30", label: "30 years" },
                  ]}
                  leftSection={<IconCalendar size={16} />}
                />

                <Divider my="sm" />

                <Text size="md" fw={600}>
                  Affordability Check
                </Text>

                <NumberInput
                  label="Monthly Income"
                  placeholder="Enter your monthly income"
                  value={monthlyIncome}
                  onChange={(value) => setMonthlyIncome(Number(value) || 0)}
                  thousandSeparator=","
                  prefix="₦"
                  min={0}
                  leftSection={<IconCash size={16} />}
                />

                <NumberInput
                  label="Monthly Debts"
                  placeholder="Other monthly debt payments"
                  value={monthlyDebts}
                  onChange={(value) => setMonthlyDebts(Number(value) || 0)}
                  thousandSeparator=","
                  prefix="₦"
                  min={0}
                  leftSection={<IconCash size={16} />}
                />

                <Button
                  fullWidth
                  size="md"
                  onClick={calculateMortgage}
                  leftSection={<IconCalculator size={16} />}
                >
                  Recalculate
                </Button>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="md">
              {/* Results */}
              {calculation && (
                <>
                  <Card className="p-6">
                    <Text size="lg" fw={600} mb="md">
                      <IconChartBar size={20} className="inline mr-2" />
                      Calculation Results
                    </Text>

                    <Grid>
                      <Grid.Col span={6}>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Text size="sm" c="dimmed" mb="xs">
                            Monthly Payment
                          </Text>
                          <Text size="xl" fw={700} c="blue">
                            {formatCurrency(calculation.monthlyPayment)}
                          </Text>
                        </div>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Text size="sm" c="dimmed" mb="xs">
                            Loan Amount
                          </Text>
                          <Text size="xl" fw={700} c="green">
                            {formatCurrency(propertyPrice - downPayment)}
                          </Text>
                        </div>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <Text size="sm" c="dimmed" mb="xs">
                            Total Interest
                          </Text>
                          <Text size="lg" fw={600} c="orange">
                            {formatCurrency(calculation.totalInterest)}
                          </Text>
                        </div>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <div className="text-center p-4 bg-cyan-50 rounded-lg">
                          <Text size="sm" c="dimmed" mb="xs">
                            Total Payment
                          </Text>
                          <Text size="lg" fw={600} c="cyan">
                            {formatCurrency(calculation.totalPayment)}
                          </Text>
                        </div>
                      </Grid.Col>
                    </Grid>

                    <Divider my="md" />

                    <Text size="md" fw={600} mb="xs">
                      Down Payment Percentage
                    </Text>
                    <Progress
                      value={(downPayment / propertyPrice) * 100}
                      size="lg"
                      color="blue"
                      mb="md"
                    />
                    <Text size="sm" c="dimmed">
                      {((downPayment / propertyPrice) * 100).toFixed(1)}% of
                      property price
                    </Text>
                  </Card>

                  {/* Affordability Analysis */}
                  <Card className="p-6">
                    <Text size="lg" fw={600} mb="md">
                      Affordability Analysis
                    </Text>

                    <Alert
                      icon={<IconInfoCircle />}
                      color={getAffordabilityColor(
                        calculation.debtToIncomeRatio
                      )}
                      mb="md"
                    >
                      <Text fw={600}>
                        Debt-to-Income Ratio:{" "}
                        {calculation.debtToIncomeRatio.toFixed(1)}%
                      </Text>
                      <Text size="sm">
                        {getAffordabilityText(calculation.debtToIncomeRatio)}
                      </Text>
                    </Alert>

                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Recommended maximum</Text>
                      <Badge color="green" variant="light">
                        28%
                      </Badge>
                    </Group>
                    <Progress
                      value={Math.min(calculation.debtToIncomeRatio, 50)}
                      size="md"
                      color={getAffordabilityColor(
                        calculation.debtToIncomeRatio
                      )}
                      mb="md"
                    />

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Text size="sm" c="dimmed" mb="xs">
                        Based on your income, you can afford:
                      </Text>
                      <Text size="lg" fw={700} c="blue">
                        {formatCurrency(calculation.affordablePrice)}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Maximum recommended property price
                      </Text>
                    </div>
                  </Card>

                  {/* Amortization Schedule Sample */}
                  <Card className="p-6">
                    <Text size="lg" fw={600} mb="md">
                      Payment Schedule (First Year)
                    </Text>

                    <div className="overflow-x-auto">
                      <Table>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Month</Table.Th>
                            <Table.Th>Payment</Table.Th>
                            <Table.Th>Principal</Table.Th>
                            <Table.Th>Interest</Table.Th>
                            <Table.Th>Balance</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {generateAmortizationSchedule().map((row) => (
                            <Table.Tr key={row.month}>
                              <Table.Td>{row.month}</Table.Td>
                              <Table.Td>{formatCurrency(row.payment)}</Table.Td>
                              <Table.Td>
                                {formatCurrency(row.principal)}
                              </Table.Td>
                              <Table.Td>
                                {formatCurrency(row.interest)}
                              </Table.Td>
                              <Table.Td>{formatCurrency(row.balance)}</Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </div>

                    <Text size="xs" c="dimmed" mt="md">
                      * This is a simplified calculation. Actual mortgage terms
                      may vary based on lender requirements, credit score, and
                      other factors.
                    </Text>
                  </Card>
                </>
              )}
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Tips Section */}
        <Card className="p-6 mt-8 bg-blue-50">
          <Text size="lg" fw={600} mb="md" c="blue">
            💡 Mortgage Tips
          </Text>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <ul className="space-y-2 text-sm">
                <li>• Aim for a down payment of at least 20% to avoid PMI</li>
                <li>• Keep debt-to-income ratio below 28% for better rates</li>
                <li>• Consider shorter loan terms to save on interest</li>
                <li>• Factor in property taxes and insurance costs</li>
              </ul>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <ul className="space-y-2 text-sm">
                <li>• Shop around for the best interest rates</li>
                <li>• Get pre-approved before house hunting</li>
                <li>• Consider your long-term financial goals</li>
                <li>• Budget for maintenance and repairs</li>
              </ul>
            </Grid.Col>
          </Grid>
        </Card>
      </motion.div>
    </Container>
  );
};

export default MortgageCalculator;
