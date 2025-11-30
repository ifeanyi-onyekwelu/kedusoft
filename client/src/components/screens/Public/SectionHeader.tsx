import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderSmallProps {
  badgeTitle?: string;
  badgeIcon?: ReactNode;
  title: string;
  emphasizedText?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const SectionHeaderSmall = ({
  badgeTitle,
  badgeIcon,
  title,
  emphasizedText,
  description,
  align = "center",
  className = "",
}: SectionHeaderSmallProps) => {
  const alignment = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.div
      className={`flex flex-col gap-3 ${alignment[align]} mb-10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Small Badge */}
      {badgeTitle && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
          {badgeIcon && (
            <span className="text-accent text-base">{badgeIcon}</span>
          )}
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {badgeTitle}
          </span>
        </div>
      )}

      {/* Main Title + Emphasis */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
          {emphasizedText && (
            <>
              {" "}
              <span className="text-accent">{emphasizedText}</span>
            </>
          )}
        </h2>
      </div>

      {/* Optional description */}
      {description && (
        <p className="text-gray-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeaderSmall;
