import { Button, Group, Image, Stack, TextInput } from "@mantine/core";
import { IconSearch, IconSettings } from "@tabler/icons-react";
import { motion } from "framer-motion";

function Feed() {
  return (
    <motion.div className="p-10">
      <motion.div className="md:max-w-6xl w-full mx-auto">
        <Group justify="space-between">
          <motion.h2 className="text-3xl font-semibold">Feed</motion.h2>

          <Button
            leftSection={<IconSettings />}
            color="green"
            variant="subtle"
            size="md"
          >
            Feed Settings
          </Button>
        </Group>
      </motion.div>

      <motion.div className="p-10 h-[400px]">
        <Stack
          className="max-w-fit mx-auto text-center h-full"
          align="center"
          justify="center"
        >
          <Image />
          <motion.h2 className="text-3xl font-semibold">
            No updates Found
          </motion.h2>
          <motion.p>
            Start building your feed by saving searches and favoriting homes.
          </motion.p>
          <Group wrap="nowrap" gap={7} w={"100%"}>
            <TextInput
              placeholder="Street address, city, state, zip"
              className="w-full"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-primary-dark transition-colors rounded-md"
            >
              <IconSearch className="w-9 h-9 p-2 text-white" />
            </motion.button>
          </Group>
        </Stack>
      </motion.div>
    </motion.div>
  );
}

export default Feed;
