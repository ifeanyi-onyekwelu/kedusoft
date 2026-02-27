import { Container, Text, Badge } from "@mantine/core";
interface PageHeroProps {
  title: string;
  subtitle: string;
  highlightText: string;
  badgeText?: string; // Optional badge
  bgImageUrl: string;
  children?: React.ReactNode; // The '?' makes it optional
}

export const PageHero = ({
  title,
  subtitle,
  highlightText,
  badgeText,
  bgImageUrl,
  children,
}: PageHeroProps) => {
  return (
    <section className="relative bg-primary overflow-hidden pt-20 pb-32">
      {/* Blended Background Image */}
      <div
        className="absolute right-0 top-0 h-full w-full md:w-1/2 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url('${bgImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to left, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 40%, transparent 100%)",
        }}
      />

      <Container size="lg" className="relative z-10">
        <div className="max-w-3xl">
          {badgeText && (
            <Badge
              color="blue.4"
              variant="filled"
              className="mb-6 rounded-md px-4 py-3 h-auto uppercase tracking-widest text-[10px] font-bold"
            >
              {badgeText}
            </Badge>
          )}

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight font-sora">
            {title} <br />
            <span className="text-secondary">{highlightText}</span>
          </h1>

          <p className="text-xl text-blue-100/70 mb-10 max-w-xl leading-relaxed font-serif">
            {subtitle}
          </p>

          {/* This allows you to pass custom elements like Search Bars or Buttons */}
          {children}
        </div>
      </Container>
    </section>
  );
};
