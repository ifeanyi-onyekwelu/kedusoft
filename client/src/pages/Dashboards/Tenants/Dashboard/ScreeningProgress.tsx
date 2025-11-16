import { Progress } from "@mantine/core";

const ScreeningProgress = ({ data }: { data: { [key: string]: number } }) => (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
            Screening Progress
        </h3>
        <div className="space-y-5">
            {Object.entries(data).map(([label, percentage], index) => (
                <div key={index} className="space-y-1">
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                        <Progress.Root size="xl">
                            <Progress.Section
                                value={percentage}
                                color={
                                    percentage >= 80
                                        ? "green"
                                        : percentage > 50
                                        ? "yellow"
                                        : "red"
                                }
                            >
                                <Progress.Label fz={"10px"} fw={500}>
                                    {label}
                                </Progress.Label>
                            </Progress.Section>
                        </Progress.Root>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ScreeningProgress;
