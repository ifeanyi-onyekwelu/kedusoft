import React, { useState } from "react";
import { Modal, Button } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconCopy,
  IconCheck,
  IconMail,
  IconX,
  IconLink,
} from "@tabler/icons-react";
import { toast } from "react-hot-toast";

interface Property {
  id: string | number;
  name: string;
  address: string;
  rent_amount: number;
  gallery: string[];
}

interface ShareListingModalProps {
  property: Property;
  opened: boolean;
  close: () => void;
}

const ShareListingModal = ({
  property,
  opened,
  close,
}: ShareListingModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleSocialShare = (platform: string) => {
    let url = "";
    const text = `Check out this property: ${property.name} - ${property.address}`;

    switch (platform) {
      case "WhatsApp":
        url = `https://wa.me/?text=${encodeURIComponent(
          text + " " + shareUrl
        )}`;
        break;
      case "Facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "Twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "LinkedIn":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
    }
    window.open(url, "_blank", "width=600,height=400");
  };

  const socialPlatforms = [
    { name: "WhatsApp", icon: IconBrandWhatsapp, color: "#25D366" },
    { name: "Facebook", icon: IconBrandFacebook, color: "#1877F2" },
    { name: "Twitter", icon: IconBrandTwitter, color: "#1DA1F2" },
    { name: "LinkedIn", icon: IconBrandLinkedin, color: "#0A66C2" },
  ];

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      size="lg"
      overlayProps={{ backgroundOpacity: 0.5, blur: 3 }}
      classNames={{
        content: "!bg-white !shadow-2xl",
        header: "!bg-white !border-b !border-gray-200 !px-8 !py-6",
        title: "!font-black !text-2xl !text-[#008CDB]",
        close: "!text-gray-400 hover:!text-gray-600",
      }}
      title="Share This Property"
    >
      <div className="px-8 pb-8 space-y-8">
        {/* Property Info Card */}
        <div className="flex gap-4 p-4 bg-gradient-to-br from-[#008CDB]/5 to-[#CF8205]/5 border border-gray-200 rounded-xl">
          <img
            src={property.gallery?.[0]}
            alt={property.name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
              {property.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">{property.address}</p>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <IconLink size={20} className="text-[#008CDB]" stroke={2.5} />
            <h4 className="font-semibold text-gray-900">Copy Link</h4>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 bg-gray-50 focus:outline-none cursor-default"
            />
            <button
              onClick={copyLink}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                copied
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-[#008CDB] text-white hover:bg-[#1e054a] border border-[#008CDB]"
              }`}
            >
              {copied ? (
                <>
                  <IconCheck size={18} stroke={2.5} />
                  Copied
                </>
              ) : (
                <>
                  <IconCopy size={18} stroke={2.5} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <IconMail size={20} className="text-[#008CDB]" stroke={2.5} />
            <h4 className="font-semibold text-gray-900">
              Share on Social Media
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.name}
                  onClick={() => handleSocialShare(platform.name)}
                  className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#CF8205] transition-all duration-200 group"
                >
                  <Icon
                    size={20}
                    className="text-gray-700 group-hover:text-[#CF8205]"
                    stroke={2}
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#CF8205]">
                    {platform.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Share Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 leading-relaxed">
            💡 <span className="font-semibold">Tip:</span> Share this property
            with friends and family to get more information about it.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="light"
            color="gray"
            onClick={close}
            leftSection={<IconX size={18} />}
            className="flex-1 !h-12 !font-semibold !text-gray-600"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareListingModal;
