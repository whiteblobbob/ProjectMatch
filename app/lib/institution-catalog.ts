export type InstitutionOption = {
  id: string;
  name: string;
  category: string;
  city: string;
  province: string;
  kind: "student" | "university";
};

export const institutionOptions: InstitutionOption[] = [
  {
    id: "school-sman-1-denpasar",
    name: "SMA Negeri 1 Denpasar",
    category: "SMA",
    city: "Denpasar",
    province: "Bali",
    kind: "student",
  },
  {
    id: "school-smkn-1-denpasar",
    name: "SMK Negeri 1 Denpasar",
    category: "SMK",
    city: "Denpasar",
    province: "Bali",
    kind: "student",
  },
  {
    id: "school-sman-1-badung",
    name: "SMA Negeri 1 Kuta Utara",
    category: "SMA",
    city: "Badung",
    province: "Bali",
    kind: "student",
  },
  {
    id: "school-smpn-1-denpasar",
    name: "SMP Negeri 1 Denpasar",
    category: "SMP",
    city: "Denpasar",
    province: "Bali",
    kind: "student",
  },
  {
    id: "university-unud",
    name: "Universitas Udayana",
    category: "Universitas",
    city: "Badung",
    province: "Bali",
    kind: "university",
  },
  {
    id: "university-primakara",
    name: "Universitas Primakara",
    category: "Universitas",
    city: "Denpasar",
    province: "Bali",
    kind: "university",
  },
  {
    id: "university-itb",
    name: "Institut Teknologi Bandung",
    category: "Institut",
    city: "Bandung",
    province: "Jawa Barat",
    kind: "university",
  },
  {
    id: "university-ui",
    name: "Universitas Indonesia",
    category: "Universitas",
    city: "Depok",
    province: "Jawa Barat",
    kind: "university",
  },
];
