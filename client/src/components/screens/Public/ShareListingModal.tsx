import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { Modal, Button, Group, Image, Text, Stack } from "@mantine/core";
import { X, Phone, Share2, Mail, Copy } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { formatPrice } from "../../../utils/helpers";

interface ShareListingModalProps {
  property: Property;
  opened: boolean;
  close: () => void;
}

function ShareListingModal({
  property,
  opened,
  close,
}: ShareListingModalProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareToSocial = (platform: string) => {
    let url = "";
    const text = `Check out this property: ${property.name} in ${
      property.address
    } for ${formatPrice(property.rent_amount)}`;

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          shareUrl
        )}&title=${encodeURIComponent(property.name)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(
          "Property Listing"
        )}&body=${encodeURIComponent(text + " " + shareUrl)}`;
        break;
    }
    window.open(url, "_blank");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      notifications.show({
        title: "Link copied!",
        message: "You can now share it anywhere",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Failed to copy",
        message: "Try again",
        color: "red",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Share this property" centered>
      <Stack>
        {/* Property Info */}
        <Group align="flex-start">
          <Image
            src={property?.gallery[0]}
            alt={property.name}
            radius="md"
            width={100}
            height={100}
          />
          <Stack>
            <Text fw={600}>{property.name}</Text>
            <Text size="sm" c="dimmed">
              {property.address}
            </Text>
            <Text size="sm" fw={500} c="blue">
              {formatPrice(property.rent_amount)}
            </Text>
          </Stack>
        </Group>

        {/* Call Button */}
        <Button fullWidth leftSection={<Phone size={16} />} color="blue">
          Call: +234 {property.landlord?.phone_number}
        </Button>

        {/* Social Share */}
        <Stack>
          <Text fw={500} size="sm">
            <Share2 size={16} style={{ display: "inline", marginRight: 6 }} />
            Share via
          </Text>
          <Group grow>
            <Button
              leftSection={<IconBrandFacebook size={16} />}
              color="blue"
              onClick={() => shareToSocial("facebook")}
            >
              Facebook
            </Button>
            <Button
              leftSection={<IconBrandTwitter size={16} />}
              color="cyan"
              onClick={() => shareToSocial("twitter")}
            >
              Twitter
            </Button>
          </Group>
          <Group grow>
            <Button
              leftSection={<IconBrandLinkedin size={16} />}
              color="indigo"
              onClick={() => shareToSocial("linkedin")}
            >
              LinkedIn
            </Button>
            <Button
              leftSection={<Mail size={16} />}
              color="gray"
              onClick={() => shareToSocial("email")}
            >
              Email
            </Button>
          </Group>
        </Stack>

        {/* Copy Link */}
        <Button
          fullWidth
          variant="light"
          color="dark"
          leftSection={<Copy size={16} />}
          onClick={copyLink}
        >
          Copy Link
        </Button>
      </Stack>
    </Modal>
  );
}

export default ShareListingModal;
