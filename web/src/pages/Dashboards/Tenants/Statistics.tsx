import UniversalStatCard from "../../../components/shared/Dashboard/UniversalStatCard";

interface StatisticItem {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  subtitle?: string;
  onClick?: () => void;
}

function Statistics({ statistics }: { statistics: StatisticItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {statistics.map((stat, index) => (
        <UniversalStatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          subtitle={stat.subtitle}
          onClick={stat.onClick}
        />
      ))}
    </div>
  );
}

export default Statistics;
