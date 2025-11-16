import StatisticsCard from "../../../components/shared/Dashboard/StatisticsCard";

function Statistics({ statistics }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
      {statistics.map((stat: any, index: any) => (
        <StatisticsCard
          key={index}
          {...stat}
          yearOptions={["2021", "2022", "2023", "2024", "2025"]}
        />
      ))}
    </div>
  );
}

export default Statistics;
