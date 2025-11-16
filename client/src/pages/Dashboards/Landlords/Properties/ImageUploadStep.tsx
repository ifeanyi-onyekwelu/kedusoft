// ImageUploadStep.tsx
import { Group, Image, Text, Card, Badge, SimpleGrid } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconX, IconCheck, IconPhone } from "@tabler/icons-react";

interface ImageUploadStepProps {
  files: File[];
  setFiles: (files: File[]) => void;
  coverImage: number | null; // Changed to store index instead of URL
  setCoverImage: (index: number) => void; // Changed to accept index
}

export function ImageUploadStep({
  files,
  setFiles,
  coverImage,
  setCoverImage,
}: ImageUploadStepProps) {
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    const isCover = coverImage === index; // Compare with index now

    return (
      <Card
        key={index}
        p={0}
        radius="md"
        withBorder
        onClick={() => setCoverImage(index)}
        style={{ cursor: "pointer", position: "relative" }}
      >
        <Image
          src={imageUrl}
          alt={`Preview ${index}`}
          height={160}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
        {isCover && (
          <Badge
            color="green"
            variant="filled"
            style={{ position: "absolute", top: 10, right: 10 }}
            leftSection={<IconCheck size={12} />}
          >
            Cover
          </Badge>
        )}
      </Card>
    );
  });

  return (
    <div>
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        onDrop={(newFiles) => {
          const updatedFiles = [...files, ...newFiles];
          setFiles(updatedFiles);
          // Automatically set first image as cover if none is set
          if (coverImage === null && updatedFiles.length > 0) {
            setCoverImage(0);
          }
        }}
        maxSize={5 * 1024 ** 2} // 5MB
        className="h-[300px] flex items-center justify-center border border-primary border-dashed cursor-pointer"
      >
        <Group justify="center">
          <Dropzone.Accept>
            <IconPhoto size={50} stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={50} stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={50} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Upload at least one image (max 5MB each)
            </Text>
          </div>
        </Group>
      </Dropzone>

      {files.length > 0 && (
        <>
          <Text mt="md" mb="xs">
            Click an image to set as cover (required)
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt="md">
            {previews}
          </SimpleGrid>
        </>
      )}
    </div>
  );
}
