import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "../../components/navigation-bar/guestnavbar";
import Detail from "../../components/detail/projectdetail";
import { fetchProject } from "../../actions/project";
import { fetchProfile } from "../../actions/profile";
import { getSessionUser } from "../../lib/ui/session";
import type { EducationLevel } from "../../lib/validator/profile";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<ProjectDetailSkeleton />}>
            <ProjectDetailContent params={params} />
        </Suspense>
    );
}

async function ProjectDetailContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await fetchProject(id);

    if (!result.success || !("data" in result)) {
        notFound();
    }

    const sessionUser = await getSessionUser();
    let viewer: {
        id: string | null;
        authenticated: boolean;
        verified: boolean;
        isOwner: boolean;
        educationLevel: EducationLevel | null;
        institution: string | null;
        city: string | null;
        province: string | null;
    } = {
        id: null,
        authenticated: false,
        verified: false,
        isOwner: false,
        educationLevel: null,
        institution: null,
        city: null,
        province: null,
    };

    if (sessionUser) {
        const profile = await fetchProfile();
        const profileData = profile.success && "data" in profile ? profile.data : null;
        viewer = {
            id: sessionUser.id,
            authenticated: true,
            verified: profileData?.verified ?? false,
            isOwner: sessionUser.id === result.data.ownerId,
            educationLevel: profileData?.educationLevel ?? null,
            institution: profileData?.institution ?? null,
            city: profileData?.city ?? null,
            province: profileData?.province ?? null,
        };
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <Detail project={result.data} viewer={viewer} />
            </div>
        </>
    );
}

function ProjectDetailSkeleton() {
    return (
        <>
            <div className="h-16 border-b border-slate-200 bg-white" aria-hidden="true" />
            <main
                className="min-h-screen w-full min-w-0 bg-background pb-8"
                aria-label="Memuat detail proyek"
            >
                <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-4 px-4 py-4">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="h-40 animate-pulse rounded-xl border border-border-default bg-white" />
                    <div className="h-28 animate-pulse rounded-xl border border-border-default bg-white" />
                    <div className="h-32 animate-pulse rounded-xl border border-border-default bg-white" />
                </div>
            </main>
        </>
    );
}
