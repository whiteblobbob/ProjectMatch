import { cloudinaryAvatarUrl } from "@/app/lib/ui/cloudinary";

export default function UserAvatar({ name, profileCloudId, className = "", cloudName }: { name: string | null | undefined; profileCloudId?: string | null; className?: string; cloudName?: string }) {
  const cloud = cloudName ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const url = profileCloudId && cloud ? cloudinaryAvatarUrl(profileCloudId, cloud) : null;
  const initials = (name ?? "").trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "PM";
  return <span role="img" aria-label={`Foto profil ${name || "pengguna"}`} className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-cover bg-center ${className}`} style={url ? { backgroundImage: `url(${url})` } : undefined}>{!url && initials}</span>;
}
