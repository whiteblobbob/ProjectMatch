"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import {
  ArrowRightIcon,
  BehanceIcon,
  CameraIcon,
  DiscordIcon,
  DribbbleIcon,
  ExternalLinkIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkIcon,
  LinkedinIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  TelegramIcon,
  TiktokIcon,
  WhatsappIcon,
  XIcon,
  XSocialIcon,
  YoutubeIcon,
} from "@/app/components/ui/icons";
import { InstitutionPicker } from "@/app/components/ui/institution-picker";
import { LocationPicker } from "@/app/components/ui/location-picker";
import { SelectControl } from "@/app/components/ui/select-control";
import { formatRegion } from "@/app/lib/regions";
import { cloudinaryAvatarUrl } from "@/app/lib/ui/cloudinary";
import {
  MAX_PROFILE_CONTACTS,
  detectContactPlatform,
  isValidPublicUrl,
  normalizePublicUrl,
} from "@/app/lib/ui/profile-public-info";
import {
  ProfileForm,
  ProfileView,
  educationLevelOptions,
} from "@/app/lib/ui/profile";
import VerificationForm from "../auth/verification/verification-form";

type CatalogOption = {
  id: string;
  name: string;
};

type ProfilProps = {
  initialProfile: ProfileView;
  roles: CatalogOption[];
  cloudName: string;
};

type AvatarPreview = {
  dataUrl: string;
  fileName: string;
  file: File;
};

const acceptedAvatarTypes = ["image/jpeg", "image/png"];
const maxAvatarSize = 5 * 1024 * 1024;

function editableProfile(profile: ProfileView): ProfileForm {
  return {
    name: profile.name,
    institution: profile.institution,
    institutionName: profile.institutionName,
    educationLevel: profile.educationLevel ?? "MAHASISWA",
    bio: profile.bio,
    province: profile.province,
    city: profile.city,
    portfolioLink: profile.portfolioLink,
    contacts: profile.contacts.length > 0 ? [...profile.contacts] : [""],
    skills: profile.skills,
  };
}

function getInitials(name: string) {
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  return initials.toLocaleUpperCase("id-ID") || "PM";
}

export default function Profil({ initialProfile, roles, cloudName }: ProfilProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState<ProfileForm>(() => editableProfile(initialProfile));
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [draftAvatar, setDraftAvatar] = useState<AvatarPreview | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const verifyCloseButtonRef = useRef<HTMLButtonElement>(null);

  const educationLabel = educationLevelOptions.find(
    (option) => option.value === profile.educationLevel,
  )?.label ?? "Jenjang belum diisi";

  const publicInfo = useMemo(
    () => ({ location: formatRegion(profile.city, profile.province), portfolioUrl: profile.portfolioLink, contacts: profile.contacts }),
    [profile.city, profile.province, profile.portfolioLink, profile.contacts],
  );

  const completeness = useMemo(() => {
    const completed = [
      profile.name,
      profile.institution,
      profile.bio,
      profile.educationLevel,
      profile.skills.length > 0,
      publicInfo.location,
      publicInfo.portfolioUrl,
      publicInfo.contacts.length > 0,
    ].filter(Boolean).length;
    return Math.round((completed / 8) * 100);
  }, [profile, publicInfo]);

  const availableEducationOptions = educationLevelOptions;

  const availableSkillOptions = useMemo(
    () => roles.filter(
      (role) => !draft.skills.some((skill) => skill.toLocaleLowerCase("id-ID") === role.name.toLocaleLowerCase("id-ID")),
    ),
    [draft.skills, roles],
  );

  useEffect(() => {
    if (!isEditing) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        setIsEditing(false);
        setError("");
        setSkillInput("");
        setDraftAvatar(null);
        setRemoveAvatar(false);
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isEditing, isPending]);

  useEffect(() => {
    if (!isVerifying) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    verifyCloseButtonRef.current?.focus();

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsVerifying(false);
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVerifying]);

  function openEditor(focusTarget?: "skills" | "photo") {
    setDraft(editableProfile(profile));
    setSkillInput("");
    setError("");
    setNotice("");
    setDraftAvatar(null);
    setRemoveAvatar(false);
    setIsEditing(true);
    if (focusTarget === "skills") requestAnimationFrame(() => document.getElementById("profile-skill-select")?.focus());
    if (focusTarget === "photo") requestAnimationFrame(() => avatarButtonRef.current?.focus());
  }

  function closeEditor() {
    if (isPending) return;
    setIsEditing(false);
    setError("");
    setSkillInput("");
    setDraftAvatar(null);
    setRemoveAvatar(false);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!acceptedAvatarTypes.includes(file.type)) {
      setError("Gunakan foto berformat JPG atau PNG.");
      return;
    }
    if (file.size > maxAvatarSize) {
      setError("Ukuran foto maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("Foto belum dapat dibaca. Silakan pilih file lain.");
        return;
      }
      setDraftAvatar({ dataUrl: reader.result, fileName: file.name, file });
      setRemoveAvatar(false);
      setError("");
    };
    reader.onerror = () => setError("Foto belum dapat dibaca. Silakan pilih file lain.");
    reader.readAsDataURL(file);
  }

  function addSkill() {
    const skill = skillInput.trim();
    if (!skill) {
      setError("Pilih keahlian terlebih dahulu.");
      return;
    }
    if (draft.skills.length >= 12) {
      setError("Maksimal 12 keahlian.");
      return;
    }
    if (draft.skills.some((item) => item.toLocaleLowerCase("id-ID") === skill.toLocaleLowerCase("id-ID"))) {
      setError("Keahlian tersebut sudah ditambahkan.");
      return;
    }

    setDraft((current) => ({ ...current, skills: [...current.skills, skill] }));
    setSkillInput("");
    setError("");
    requestAnimationFrame(() => document.getElementById("profile-skill-select")?.focus());
  }

  function addContact() {
    setDraft((current) => {
      if (current.contacts.length >= MAX_PROFILE_CONTACTS) return current;
      return { ...current, contacts: [...current.contacts, ""] };
    });
  }

  function updateContact(index: number, value: string) {
    setDraft((current) => ({
      ...current,
      contacts: current.contacts.map((contact, contactIndex) => contactIndex === index ? value : contact),
    }));
  }

  function removeContact(index: number) {
    setDraft((current) => {
      const contacts = current.contacts.filter((_, contactIndex) => contactIndex !== index);
      return { ...current, contacts: contacts.length > 0 ? contacts : [""] };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (Boolean(draft.province) !== Boolean(draft.city)) {
      setError("Pilih provinsi dan kota/kabupaten domisili.");
      return;
    }

    if (!draft.institution) {
      setError("Pilih sekolah atau kampus dari daftar.");
      return;
    }

    const invalidContact = draft.contacts.find((contact) => contact.trim() && !isValidPublicUrl(contact));
    if (invalidContact) {
      setError("Pastikan setiap kontak berupa tautan yang valid.");
      return;
    }
    if (draft.portfolioLink.trim() && !isValidPublicUrl(draft.portfolioLink)) {
      setError("Link portofolio belum valid.");
      return;
    }

    const resolvedRoles = draft.skills
      .map((skill) => roles.find((role) => role.name.toLocaleLowerCase("id-ID") === skill.toLocaleLowerCase("id-ID"))?.id)
      .filter((roleId): roleId is string => Boolean(roleId));

    if (resolvedRoles.length !== draft.skills.length) {
      const unmatched = draft.skills.filter(
        (skill) => !roles.some((role) => role.name.toLocaleLowerCase("id-ID") === skill.toLocaleLowerCase("id-ID")),
      );
      setError(`Keahlian berikut belum tersedia: ${unmatched.join(", ")}. Pilih dari daftar keahlian.`);
      return;
    }

    setIsPending(true);

    const province = draft.province.trim();
    const city = draft.city.trim();
    const portfolioLink = draft.portfolioLink.trim() ? normalizePublicUrl(draft.portfolioLink) : "";
    const contacts = draft.contacts.map(normalizePublicUrl).filter(Boolean);

    const avatarWasChanged = Boolean(draftAvatar) || removeAvatar;

    const result = await updateProfile(
      {
        name: draft.name,
        institution: draft.institution,
        bio: draft.bio,
        province,
        city,
        portfolioLink,
        contacts,
        educationLevel: draft.educationLevel,
        userRoles: resolvedRoles.map((roleId) => ({ roleId })),
      },
      { avatar: draftAvatar?.file, removeAvatar },
    );

    if (!result.success) {
      const details = result.fieldErrors
        ? Object.values(result.fieldErrors).flat().join(" ")
        : result.error;
      setError(details || result.error);
      setIsPending(false);
      return;
    }

    const nextCloudId = "data" in result ? result.data?.profileCloudId : undefined;

    const nextProfile: ProfileView = {
      ...profile,
      name: draft.name,
      institution: draft.institution,
      institutionName: draft.institutionName,
      bio: draft.bio,
      province,
      city,
      portfolioLink,
      contacts,
      educationLevel: draft.educationLevel,
      skills: draft.skills,
      profileCloudId: nextCloudId === undefined ? profile.profileCloudId : nextCloudId,
    };

    setProfile(nextProfile);
    setDraft(editableProfile(nextProfile));
    setDraftAvatar(null);
    setRemoveAvatar(false);
    setIsPending(false);
    setIsEditing(false);
    setNotice(
      avatarWasChanged
        ? "Profil dan foto berhasil diperbarui."
        : "Profil berhasil diperbarui.",
    );
    router.refresh();
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {notice && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-emerald-100" aria-label="Tutup pemberitahuan"><XIcon className="size-4" /></button>
          </div>
        )}

        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <ProfileAvatar
                  name={profile.name}
                  imageUrl={profile.profileCloudId ? cloudinaryAvatarUrl(profile.profileCloudId, cloudName) : null}
                  className="size-24 rounded-3xl border border-white/15 text-3xl shadow-lg shadow-blue-950/30"
                />
                <button
                  type="button"
                  onClick={() => openEditor("photo")}
                  className="absolute -bottom-2 -right-2 inline-flex size-10 items-center justify-center rounded-xl border-2 border-slate-950 bg-white text-slate-800 shadow-md transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  aria-label="Ubah foto profil"
                  title="Ubah foto profil"
                >
                  <CameraIcon />
                </button>
              </div>
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-inset ring-white/15">
                  {educationLabel}
                </span>
                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {profile.name || "Lengkapi profilmu"}
                </h1>
                <p className="mt-2 text-sm text-slate-300">{profile.institutionName || "Sekolah atau kampus belum diisi"}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPinIcon className="size-3.5" />
                  {publicInfo.location || "Lokasi belum diisi"}
                </p>
                <p className="mt-1 truncate text-xs text-slate-400">{profile.email} · hanya terlihat olehmu</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openEditor()}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 lg:self-auto"
            >
              <PencilIcon className="size-4" />
              Ubah profil
            </button>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="about-heading">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Tentang saya</p>
                  <h2 id="about-heading" className="mt-1 text-lg font-bold text-slate-950">Perkenalan singkat</h2>
                </div>
                <button type="button" onClick={() => openEditor()} className="rounded-lg px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Edit</button>
              </div>
              <p className={`mt-5 text-sm leading-7 ${profile.bio ? "text-slate-700" : "italic text-slate-500"}`}>
                {profile.bio || "Ceritakan minat, pengalaman, dan jenis kontribusi yang ingin kamu berikan kepada tim."}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="skills-heading">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Kontribusi</p>
                  <h2 id="skills-heading" className="mt-1 text-lg font-bold text-slate-950">Keahlian</h2>
                  <p className="mt-1 text-sm text-slate-500">Tambahkan kemampuan apa pun yang bisa kamu bawa ke dalam proyek.</p>
                </div>
                <button
                  type="button"
                  onClick={() => openEditor("skills")}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-brand-primary hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <PlusIcon className="size-[18px] shrink-0" />
                  Tambah keahlian
                </button>
              </div>

              {profile.skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <button type="button" onClick={() => openEditor("skills")} className="mt-5 w-full rounded-xl border border-dashed border-slate-300 p-5 text-left text-sm text-slate-600 hover:border-blue-300 hover:bg-blue-50/50">
                  Belum ada keahlian. Klik untuk menambahkan keahlian pertamamu.
                </button>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="portfolio-heading">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Karya</p>
                  <h2 id="portfolio-heading" className="mt-1 text-lg font-bold text-slate-950">Portofolio utama</h2>
                  <p className="mt-1 text-sm text-slate-500">Tautan ini otomatis ditawarkan saat kamu mengajukan bergabung.</p>
                </div>
                <button type="button" onClick={() => openEditor()} className="self-start rounded-lg px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Edit</button>
              </div>

              {publicInfo.portfolioUrl ? (
                <a
                  href={publicInfo.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <span className="min-w-0 truncate">{publicInfo.portfolioUrl}</span>
                  <ExternalLinkIcon className="size-4 shrink-0" />
                </a>
              ) : (
                <button type="button" onClick={() => openEditor()} className="mt-5 w-full rounded-xl border border-dashed border-slate-300 p-5 text-left text-sm text-slate-600 hover:border-blue-300 hover:bg-blue-50/50">
                  Belum ada portofolio. Tambahkan satu tautan utama untuk digunakan saat melamar.
                </button>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="history-heading">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Kolaborasi</p>
                  <h2 id="history-heading" className="mt-1 text-lg font-bold text-slate-950">Riwayat proyek</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{profile.totalProjectsCompleted} selesai</span>
              </div>
              {profile.totalProjectsCompleted === 0 && (
                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                  <p className="font-semibold text-slate-800">Belum ada proyek yang selesai</p>
                  <p className="mt-1 text-sm text-slate-500">Proyek yang telah diselesaikan akan tampil di sini.</p>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="completion-heading">
              <div className="flex items-center justify-between gap-3">
                <h2 id="completion-heading" className="font-bold text-slate-950">Kelengkapan profil</h2>
                <span className="text-sm font-bold text-brand-primary">{completeness}%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-[width]" style={{ width: `${completeness}%` }} /></div>
              <p className="mt-3 text-sm leading-6 text-slate-600">Profil yang lengkap membantu calon rekan tim memahami kontribusimu.</p>
              {completeness < 100 && <button type="button" onClick={() => openEditor()} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline">Lengkapi sekarang <ArrowRightIcon className="size-4" /></button>}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="verification-heading">
              <div className="flex items-center justify-between gap-3">
                <h2 id="verification-heading" className="font-bold text-slate-950">Verifikasi pendidikan</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${profile.verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {profile.verified ? "Terverifikasi" : "Belum terverifikasi"}
                </span>
              </div>
              {profile.verified ? (
                <p className="mt-3 text-sm leading-6 text-slate-600">Akunmu sudah terverifikasi sebagai pelajar atau mahasiswa.</p>
              ) : (
                <>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Verifikasi status pelajar atau mahasiswamu agar profilmu lebih dipercaya calon rekan tim.</p>
                  <button type="button" onClick={() => setIsVerifying(true)} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white transition hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Verifikasi</button>
                </>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="font-bold text-slate-950">Kontak publik</h2>
              {publicInfo.contacts.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {publicInfo.contacts.map((contact) => {
                    const platform = detectContactPlatform(contact);
                    return (
                      <li key={contact}>
                        <a href={normalizePublicUrl(contact)} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                          <ContactPlatformBadge platform={platform} />
                          <span className="min-w-0 flex-1 truncate">{platform.label}</span>
                          <ExternalLinkIcon className="size-4 shrink-0 text-slate-400" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-500">Belum ada kontak yang ditampilkan kepada pengguna lain.</p>
              )}
              <div className="mt-4 rounded-xl bg-amber-50 px-3 py-3 text-xs leading-5 text-amber-800">Email akun tetap privat. Hanya kontak yang kamu isi di formulir yang akan ditampilkan.</div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-bold text-slate-950">{profile.totalProjectsCompleted}</p><p className="mt-1 text-xs leading-5 text-slate-500">Proyek selesai</p></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-bold text-slate-950">{profile.avgCommitmentScore > 0 ? profile.avgCommitmentScore.toFixed(1) : "—"}</p><p className="mt-1 text-xs leading-5 text-slate-500">Skor komitmen</p></div>
            </section>
          </aside>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="edit-profile-heading">
          <button type="button" aria-label="Tutup editor profil" className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" onClick={closeEditor} />
          <section className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Profil saya</p><h2 id="edit-profile-heading" className="mt-1 text-xl font-bold text-slate-950">Ubah profil</h2><p className="mt-1 text-sm text-slate-500">Tampilkan kemampuan dan identitas pelajarmu dengan jelas.</p></div>
              <button ref={closeButtonRef} type="button" disabled={isPending} onClick={closeEditor} className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50" aria-label="Tutup"><XIcon className="size-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto">
              <div className="space-y-6 px-5 py-6 sm:px-7">
                <fieldset>
                  <legend className="text-sm font-semibold text-slate-900">Foto profil</legend>
                  <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                    <ProfileAvatar
                      name={draft.name || profile.name}
                      imageUrl={
                        removeAvatar
                          ? null
                          : draftAvatar?.dataUrl ??
                            (profile.profileCloudId ? cloudinaryAvatarUrl(profile.profileCloudId, cloudName) : null)
                      }
                      className="size-20 shrink-0 rounded-2xl border border-slate-200 text-2xl shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {removeAvatar
                          ? "Foto akan dihapus"
                          : draftAvatar?.fileName ?? (profile.profileCloudId ? "Foto profil saat ini" : "Gunakan foto yang mudah dikenali")}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Gunakan JPG atau PNG hingga 5 MB dengan wajah terlihat jelas.</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <input
                          ref={avatarInputRef}
                          id="profile-avatar"
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleAvatarChange}
                          disabled={isPending}
                          className="sr-only"
                        />
                        <button
                          ref={avatarButtonRef}
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={isPending}
                          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-900 px-3.5 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:opacity-50"
                        >
                          <CameraIcon />
                          {draftAvatar || profile.profileCloudId ? "Ganti foto" : "Pilih foto"}
                        </button>
                        {draftAvatar && !removeAvatar && (
                          <button
                            type="button"
                            onClick={() => setDraftAvatar(null)}
                            disabled={isPending}
                            className="min-h-10 rounded-xl px-3.5 text-xs font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                          >
                            Batalkan pilihan
                          </button>
                        )}
                        {profile.profileCloudId && !draftAvatar && !removeAvatar && (
                          <button
                            type="button"
                            onClick={() => setRemoveAvatar(true)}
                            disabled={isPending}
                            className="min-h-10 rounded-xl px-3.5 text-xs font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                          >
                            Hapus foto
                          </button>
                        )}
                        {removeAvatar && (
                          <button
                            type="button"
                            onClick={() => setRemoveAvatar(false)}
                            disabled={isPending}
                            className="min-h-10 rounded-xl px-3.5 text-xs font-semibold text-brand-primary hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
                          >
                            Urungkan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nama lengkap" htmlFor="profile-name">
                    <input id="profile-name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} required minLength={2} maxLength={80} disabled={isPending} autoComplete="name" placeholder="Nama lengkapmu" className={inputClass} />
                  </Field>
                  <Field label="Status pendidikan" htmlFor="profile-education">
                    <SelectControl id="profile-education" value={draft.educationLevel} onChange={(event) => setDraft((current) => ({ ...current, educationLevel: event.target.value as ProfileForm["educationLevel"], institution: "", institutionName: "" }))} disabled={isPending} className="rounded-xl">
                      {availableEducationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </SelectControl>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Status berasal dari data registrasi dan hanya dapat dipertahankan atau diperbarui ke jenjang berikutnya.
                    </p>
                  </Field>
                </div>

                <InstitutionPicker
                  key={draft.educationLevel}
                  id="profile-institution"
                  label="Sekolah atau kampus"
                  kind={draft.educationLevel === "MAHASISWA" ? "university" : "school"}
                  value={draft.institution ? { npsn: draft.institution, name: draft.institutionName } : null}
                  onChange={(option) => setDraft((current) => ({
                    ...current,
                    institution: option?.npsn ?? "",
                    institutionName: option?.name ?? "",
                  }))}
                  hint="Cari dan pilih institusi dari daftar resmi."
                  disabled={isPending}
                />

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Domisili</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Pilih provinsi dan kota/kabupaten, tanpa alamat lengkap.</p>
                  <LocationPicker
                    idPrefix="profile-location"
                    className="mt-2"
                    province={draft.province}
                    city={draft.city}
                    onProvinceChange={(value) => setDraft((current) => ({ ...current, province: value, city: "" }))}
                    onCityChange={(value) => setDraft((current) => ({ ...current, city: value }))}
                    disabled={isPending}
                  />
                </div>

                <Field label="Tentang dirimu" htmlFor="profile-bio" hint={`${draft.bio.length}/500 karakter`}>
                  <textarea id="profile-bio" value={draft.bio} onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))} maxLength={500} rows={4} disabled={isPending} placeholder="Ceritakan minat, pengalaman, dan kontribusi yang kamu tawarkan..." className={`${inputClass} resize-y py-3`} />
                </Field>

                <Field label="Link portofolio utama (opsional)" htmlFor="profile-portfolio" hint="Digunakan otomatis saat kamu mengajukan bergabung.">
                  <div className="relative">
                    <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="profile-portfolio"
                      type="url"
                      value={draft.portfolioLink}
                      onChange={(event) => setDraft((current) => ({ ...current, portfolioLink: event.target.value }))}
                      onBlur={(event) => setDraft((current) => ({ ...current, portfolioLink: normalizePublicUrl(event.target.value) }))}
                      maxLength={300}
                      disabled={isPending}
                      placeholder="https://figma.com/... atau https://behance.net/..."
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </Field>

                <fieldset>
                  <legend className="text-sm font-semibold text-slate-900">Keahlian</legend>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Pilih keahlian dari daftar, lalu tekan Tambah.</p>
                  <div className="mt-2 flex gap-2">
                    <SelectControl id="profile-skill-select" value={skillInput} onChange={(event) => setSkillInput(event.target.value)} disabled={isPending || draft.skills.length >= 12 || availableSkillOptions.length === 0} containerClassName="flex-1" className="rounded-xl" aria-label="Pilih keahlian">
                      <option value="" disabled>Pilih keahlian</option>
                      {availableSkillOptions.map((role) => <option key={role.id} value={role.name}>{role.name}</option>)}
                    </SelectControl>
                    <button type="button" onClick={addSkill} disabled={isPending || draft.skills.length >= 12} className="min-h-12 shrink-0 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50">Tambah</button>
                  </div>
                  <div className="mt-3 flex min-h-10 flex-wrap gap-2">
                    {draft.skills.map((skill) => (
                      <span key={skill} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-blue-50 pl-4 pr-2 text-sm font-medium text-blue-800 ring-1 ring-inset ring-blue-100">
                        {skill}
                        <button type="button" disabled={isPending} onClick={() => setDraft((current) => ({ ...current, skills: current.skills.filter((item) => item !== skill) }))} className="inline-flex size-7 items-center justify-center rounded-full hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" aria-label={`Hapus keahlian ${skill}`}><XIcon className="size-4" /></button>
                      </span>
                    ))}
                    {draft.skills.length === 0 && <span className="text-sm italic text-slate-400">Belum ada keahlian.</span>}
                  </div>
                  <p className="mt-2 text-right text-xs text-slate-500">{draft.skills.length}/12 keahlian</p>
                </fieldset>

                <fieldset>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <legend className="text-sm font-semibold text-slate-900">Kontak dan media sosial</legend>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Tempel tautan profil; jenis platform akan dikenali otomatis.</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{draft.contacts.filter((contact) => contact.trim()).length}/{MAX_PROFILE_CONTACTS} kontak</span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {draft.contacts.map((contact, index) => {
                      const platform = detectContactPlatform(contact);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-300 bg-white focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-blue-100">
                            <div className="flex h-12 w-14 shrink-0 items-center justify-center border-r border-slate-200" title={platform.label}>
                              <ContactPlatformBadge platform={platform} />
                            </div>
                            <input
                              type="url"
                              value={contact}
                              onChange={(event) => updateContact(index, event.target.value)}
                              onBlur={(event) => updateContact(index, normalizePublicUrl(event.target.value))}
                              maxLength={300}
                              disabled={isPending}
                              placeholder={index === 0 ? "https://instagram.com/namamu" : `Link media sosial ${index + 1}`}
                              className="h-12 min-w-0 flex-1 rounded-r-xl bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
                              aria-label={`Kontak atau media sosial ${index + 1}`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeContact(index)}
                            disabled={isPending}
                            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                            aria-label={`Hapus kontak ${index + 1}`}
                          >
                            <XIcon className="size-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {draft.contacts.length < MAX_PROFILE_CONTACTS && (
                    <button
                      type="button"
                      onClick={addContact}
                      disabled={isPending}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-brand-primary transition hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
                    >
                      <PlusIcon className="size-4" />
                      Tambah kontak
                    </button>
                  )}
                </fieldset>

                {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
              </div>

              <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
                <button type="button" disabled={isPending} onClick={closeEditor} className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50">Batal</button>
                <button type="submit" disabled={isPending} className="min-h-11 rounded-xl bg-brand-primary px-5 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">{isPending ? "Menyimpan…" : "Simpan perubahan"}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {isVerifying && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="verification-form-title">
          <button type="button" aria-label="Tutup verifikasi" className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" onClick={() => setIsVerifying(false)} />
          <section className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-end border-b border-slate-200 px-5 py-4 sm:px-7">
              <button ref={verifyCloseButtonRef} type="button" onClick={() => setIsVerifying(false)} className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" aria-label="Tutup">×</button>
            </div>
            <div className="min-h-0 overflow-y-auto px-5 py-6 sm:px-7">
              <VerificationForm />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

const inputClass = "min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500";

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-end justify-between gap-3"><label htmlFor={htmlFor} className="text-sm font-semibold text-slate-900">{label}</label>{hint && <span className="text-right text-xs text-slate-500">{hint}</span>}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ProfileAvatar({
  name,
  imageUrl,
  className,
}: {
  name: string;
  imageUrl: string | null;
  className: string;
}) {
  return (
    <div
      role="img"
      aria-label={imageUrl ? `Foto profil ${name}` : `Inisial profil ${name}`}
      className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 bg-cover bg-center font-bold text-white ${className}`}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      {!imageUrl && getInitials(name)}
    </div>
  );
}

function ContactPlatformBadge({ platform }: { platform: ReturnType<typeof detectContactPlatform> }) {
  const colorClass = {
    instagram: "bg-pink-50 text-pink-700",
    linkedin: "bg-sky-50 text-sky-700",
    github: "bg-slate-900 text-white",
    behance: "bg-blue-50 text-blue-700",
    dribbble: "bg-rose-50 text-rose-700",
    tiktok: "bg-slate-900 text-white",
    x: "bg-slate-900 text-white",
    youtube: "bg-red-50 text-red-700",
    discord: "bg-indigo-50 text-indigo-700",
    facebook: "bg-blue-50 text-blue-700",
    whatsapp: "bg-emerald-50 text-emerald-700",
    telegram: "bg-sky-50 text-sky-700",
    link: "bg-slate-100 text-slate-600",
  }[platform.id] ?? "bg-slate-100 text-slate-600";

  const PlatformIcon = {
    instagram: InstagramIcon,
    linkedin: LinkedinIcon,
    github: GithubIcon,
    behance: BehanceIcon,
    dribbble: DribbbleIcon,
    tiktok: TiktokIcon,
    x: XSocialIcon,
    youtube: YoutubeIcon,
    discord: DiscordIcon,
    facebook: FacebookIcon,
    whatsapp: WhatsappIcon,
    telegram: TelegramIcon,
    link: LinkIcon,
  }[platform.id] ?? LinkIcon;

  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
      title={platform.label}
    >
      <PlatformIcon className="size-4" />
    </span>
  );
}

