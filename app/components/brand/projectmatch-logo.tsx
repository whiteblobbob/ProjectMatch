import Image from "next/image";

type ProjectMatchLogoProps = {
  variant?: "horizontal" | "stacked";
  priority?: boolean;
  className?: string;
  decorative?: boolean;
};

const logoAssets = {
  horizontal: {
    src: "/brand/Layout=Horizontal, Theme=Light.svg",
    width: 267,
    height: 96,
  },
  stacked: {
    src: "/brand/Layout=Stacked, Theme=Light.svg",
    width: 202,
    height: 130,
  },
} as const;

export default function ProjectMatchLogo({
  variant = "horizontal",
  priority = false,
  className,
  decorative = false,
}: ProjectMatchLogoProps) {
  const asset = logoAssets[variant];

  return (
    <Image
      src={asset.src}
      alt={decorative ? "" : "ProjectMatch"}
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={className}
    />
  );
}
