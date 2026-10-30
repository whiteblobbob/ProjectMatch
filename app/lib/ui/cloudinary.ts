import { getCldImageUrl } from "next-cloudinary";

export function cloudinaryAvatarUrl(publicId: string, cloudName: string) {
  return getCldImageUrl(
    {
      src: publicId,
      width: 256,
      height: 256,
      crop: "fill",
      gravity: "face",
    },
    { cloud: { cloudName } },
  );
}

export function cloudinaryDocumentUrl(publicId: string, cloudName: string) {
  return getCldImageUrl(
    {
      src: publicId,
      width: 1600,
    },
    { cloud: { cloudName } },
  );
}
