import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ApplicationForm from "../../components/project/application-form";
import ProjectDetail from "../../components/detail/projectdetail";
import { ActiveFilterChips } from "../../components/explore/project-filters";

vi.mock("next/link", () => ({ default: "a" }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
vi.mock("../../actions/project", () => ({ sendApplication: vi.fn(), reportProject: vi.fn() }));

const profile: ComponentProps<typeof ApplicationForm>["profile"] = {
  name: "Applicant", email: "", institution: "school", institutionName: "School",
  educationLevel: "SMA", bio: "", province: "", city: "", portfolioLink: "",
  contacts: [], skills: [], verified: true, profileCloudId: null,
  totalProjectsCompleted: 0, avgCommitmentScore: 0,
};

const project: ComponentProps<typeof ProjectDetail>["project"] = {
  id: "project", title: "Project", description: "Description", deadline: null,
  collaborationMode: "ONLINE", collaborationTool: null, workHoursPerWeek: 1,
  status: "OPEN_RECRUITMENT", category: { name: "Category" },
  owner: { id: "owner", name: "Owner", institutionName: "School", institution: "school", province: null, city: null },
  educationLevels: ["SMA"], range: "ALL", allowedInstitutions: [], extraCriteria: null, sourceLink: null,
  projectRoles: [
    { roleName: "Robotics Mentor", slotsAvailable: 1 },
    { roleName: "Filled Position", slotsAvailable: 0 },
  ],
  projectMembers: [],
};

const viewer: ComponentProps<typeof ProjectDetail>["viewer"] = {
  id: "applicant", authenticated: true, verified: true, isOwner: false,
  educationLevel: "SMA", institution: "school", province: null, city: null,
};

describe("role names in the UI", () => {
  it("offers all open positions to an applicant with no profile roles", () => {
    const html = renderToStaticMarkup(createElement(ApplicationForm, { project, profile }));
    expect(html).toContain('<option value="Robotics Mentor">');
    expect(html).not.toContain('value="Filled Position"');
    expect(html).not.toContain("belum ada di profil");
    const submit = html.match(/<button[^>]*type="submit"[^>]*>/)?.[0];
    expect(submit).toBeDefined();
    expect(submit).not.toContain(' disabled=""');
  });

  it("allows an eligible viewer to apply without profile-role matching", () => {
    const html = renderToStaticMarkup(createElement(ProjectDetail, { project, viewer }));
    expect(html).toContain('href="/project/project/apply"');
  });

  it("continues enforcing education and audience requirements", () => {
    const education = renderToStaticMarkup(createElement(ProjectDetail, { project, viewer: { ...viewer, educationLevel: "SMP" } }));
    const audience = renderToStaticMarkup(createElement(ProjectDetail, {
      project: { ...project, range: "INTERNAL" }, viewer: { ...viewer, institution: "other-school" },
    }));
    for (const html of [education, audience]) {
      expect(html).not.toContain('href="/project/project/apply"');
      expect(html).toContain("Kamu belum memenuhi persyaratan");
    }
  });

  it("shows custom filter chips without a matching catalog entry", () => {
    const html = renderToStaticMarkup(createElement(ActiveFilterChips, {
      filters: { search: "", categoryId: "", roleName: "robotics", collaborationTool: "", mode: "", commitment: "", proximity: "", institution: "" },
      categories: [], roles: [], institutionOption: null, onRemove: vi.fn(), onClear: vi.fn(),
    }));
    expect(html).toContain("Peran: robotics");
  });
});
