// StatsCard.tsx
interface StatsCardProps {
  title: string;
  children?: React.ReactNode;
}

const StatsCard = ({ title, children }: StatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col gap-2">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default StatsCard;
