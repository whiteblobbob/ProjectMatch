"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { createPeerReview } from "@/app/actions/project";

export type PeerReviewParticipant = {
  userId: string;
  name: string | null;
  roleName: string;
  isOwner: boolean;
};

export type ParticipantReview = {
  revieweeId: string;
  commitmentScore: number;
  feedback: string | null;
};

type PeerReviewSectionProps = {
  projectId: string;
  currentUserId: string;
  participants: PeerReviewParticipant[];
  reviews: ParticipantReview[];
};

const scoreOptions = [
  { value: 1, label: "1 - Sangat kurang" },
  { value: 2, label: "2 - Kurang" },
  { value: 3, label: "3 - Cukup" },
  { value: 4, label: "4 - Baik" },
  { value: 5, label: "5 - Sangat baik" },
];

export default function PeerReviewSection({
  projectId,
  currentUserId,
  participants,
  reviews,
}: PeerReviewSectionProps) {
  const reviewByReviewee = new Map(reviews.map((review) => [review.revieweeId, review]));
  const teammates = participants.filter((participant) => participant.userId !== currentUserId);

  return (
    <section aria-labelledby="peer-review-heading">
      <h2 id="peer-review-heading" className="text-lg font-bold text-slate-950">Penilaian rekan tim</h2>
      <p className="mt-1 text-sm text-slate-500">
        Berikan penilaian komitmen untuk setiap rekan yang berkolaborasi di proyek ini.
      </p>

      {teammates.length > 0 ? (
        <div className="mt-4 space-y-3">
          {teammates.map((participant) => {
            const review = reviewByReviewee.get(participant.userId);

            return review ? (
              <article key={participant.userId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-950">{participant.name || "Pengguna ProjectMatch"}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {participant.roleName}
                      {participant.isOwner ? " · Pembuat proyek" : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Sudah dinilai
                  </span>
                </div>
                <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Skor komitmen</dt>
                    <dd className="font-semibold text-slate-900">{review.commitmentScore}/5</dd>
                  </div>
                  {review.feedback ? (
                    <div>
                      <dt className="text-slate-500">Umpan balik</dt>
                      <dd className="mt-1 text-slate-800">{review.feedback}</dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ) : (
              <ReviewForm key={participant.userId} projectId={projectId} participant={participant} />
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-600">
          Belum ada rekan tim lain untuk dinilai.
        </p>
      )}
    </section>
  );
}

function ReviewForm({ projectId, participant }: { projectId: string; participant: PeerReviewParticipant }) {
  const router = useRouter();
  const scoreId = useId();
  const feedbackId = useId();
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError("");

    const result = await createPeerReview({
      projectId,
      revieweeId: participant.userId,
      commitmentScore: score,
      feedback: feedback.trim() || undefined,
    });

    setIsPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-slate-950">{participant.name || "Pengguna ProjectMatch"}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {participant.roleName}
            {participant.isOwner ? " · Pembuat proyek" : ""}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Belum dinilai
        </span>
      </div>

      <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4">
        <div>
          <label htmlFor={scoreId} className="block text-sm font-medium text-slate-700">
            Skor komitmen
          </label>
          <select
            id={scoreId}
            value={score}
            onChange={(event) => setScore(Number(event.target.value))}
            disabled={isPending}
            className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-70"
          >
            {scoreOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={feedbackId} className="block text-sm font-medium text-slate-700">
            Umpan balik <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <textarea
            id={feedbackId}
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            disabled={isPending}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-70"
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-3 text-xs font-medium text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
        >
          {isPending ? "Mengirim..." : "Kirim penilaian"}
        </button>
      </div>
    </form>
  );
}
