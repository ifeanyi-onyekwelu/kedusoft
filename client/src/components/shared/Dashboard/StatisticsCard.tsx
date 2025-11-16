import formatAmount from "../../../utils/helpers";

const StatisticsCard = ({
  title,
  value,
  extraText,
}: {
  title: string;
  value: number;
  extraText?: { label: string; value: string; color: string }[];
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200 space-y-2">
      <h3 className="text-xs font-semibold text-gray-800">{title}</h3>
      <p className="text-md font-medium">{formatAmount(value)}</p>
      {extraText && (
        <div className="text-[10px] flex justify-between items-center">
          {extraText.map((item, index) => (
            <p key={index} className={`text-${item.color}-500`}>
              {item.label}: {item.value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatisticsCard;
