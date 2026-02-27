import { RingProgress, Text } from "@mantine/core";

function ScreeningScore({ score }: { score: any }) {
  return (
    <div className="p-5 rounded-md shadow bg-white flex items-center justify-center">
      <RingProgress
        size={160}
        thickness={17}
        sections={[{ value: score, color: "#008CDB" }]}
        transitionDuration={250}
        label={
          <Text ta="center" fw={900} px={5}>
            {score}% RMS
          </Text>
        }
      />
    </div>
  );
}

export default ScreeningScore;
