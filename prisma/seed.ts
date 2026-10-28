/**
 * Database seeder for ProjectMatch.
 *
 * Wipes every table (FK-safe reverse order) and inserts a consistent,
 * cross-referenced dummy dataset — at least 5 records per table.
 *
 * Run with:  npm run db:seed   (= `dotenv -e .env.development -- tsx prisma/seed.ts`)
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Run the seeder through `npm run db:seed` so the .env.development values are loaded.",
  );
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });

const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

// Internal keys ("alice", "marcus", ...) model the seed roster and map to
// deterministic IDs so every cross-reference remains stable across reruns.
type UserKey =
  | "alice"
  | "marcus"
  | "priya"
  | "diego"
  | "hana"
  | "omar"
  | "nora"
  | "liam"
  | "sofia"
  | "kenji"
  | "maya"
  | "noah";

const seededUserIds: Record<UserKey, string> = {
  alice: "2f6d4b8e-1a3c-4d7f-9b52-0e8c6a1d4f90",
  marcus: "7c1e9a43-5b2d-4f86-a0c7-3d9e1b6f2845",
  priya: "a4b8d2f6-0c91-4e73-b5a8-6f1d3c9e2470",
  diego: "e9c3a7b1-6f42-4d58-8b0e-2a7c5d1f9364",
  hana: "5d0f8b2c-9a64-4e17-b3c6-1f7d0a8e2459",
  omar: "b7e2c6a9-3d51-4f08-9c74-0a6e1b5d8327",
  nora: "c1a8e4f2-7b35-4d69-92f0-6e3c5a1b8472",
  liam: "8d4f1b6a-2c97-4e53-a0b8-5f7d9c3e1624",
  sofia: "f3b7d1e9-6a42-4c85-9e0f-2d8b5a7c1346",
  kenji: "6e2a9c4f-1b78-4d35-8f06-3c5b7e9a2148",
  maya: "a9c5e1b7-3d64-4f28-90a6-7b2e8c1d4539",
  noah: "4b8f2d6a-9c31-4e75-a0d8-5f3b7c1e2469",
};

// Completed-project participants review every other participant — no
// self-reviews, and (projectId, reviewerId, revieweeId) stays unique.
const peerReviewSeed: Array<{
  reviewer: UserKey;
  reviewee: UserKey;
  commitmentScore: number;
  feedback: string;
}> = [
  { reviewer: "diego", reviewee: "alice", commitmentScore: 5, feedback: "Rebuilt the gallery in two sprints." },
  { reviewer: "diego", reviewee: "marcus", commitmentScore: 5, feedback: "Set up the routing and led the releases." },
  { reviewer: "diego", reviewee: "omar", commitmentScore: 4, feedback: "Great mockups, some delays on icon sets." },
  { reviewer: "alice", reviewee: "diego", commitmentScore: 5, feedback: "Kept the scope tight and shipped on time." },
  { reviewer: "alice", reviewee: "marcus", commitmentScore: 5, feedback: "Pair-programmed the auth flow with me." },
  { reviewer: "alice", reviewee: "omar", commitmentScore: 5, feedback: "Design handoff was crisp." },
  { reviewer: "marcus", reviewee: "diego", commitmentScore: 4, feedback: "On time but some scope drift near the end." },
  { reviewer: "marcus", reviewee: "alice", commitmentScore: 5, feedback: "Fastest reviewer on the team." },
  { reviewer: "marcus", reviewee: "omar", commitmentScore: 4, feedback: "Solid mockups, needed a nudge sometimes." },
  { reviewer: "omar", reviewee: "diego", commitmentScore: 4, feedback: "Held daily check-ins with us." },
  { reviewer: "omar", reviewee: "alice", commitmentScore: 5, feedback: "Took feedback openly and iterated." },
  { reviewer: "omar", reviewee: "marcus", commitmentScore: 5, feedback: "Carried the heavier technical work." },
];

const deterministicPick = <T>(values: readonly T[], index: number) =>
  values[(index * 7 + 3) % values.length];

async function main() {
  // ---------------------------------------------------------------------------
  // Wipe everything in reverse-FK order, then reseed — all or nothing.
  // ---------------------------------------------------------------------------
  await prisma.$transaction(
    async (tx) => {
      await tx.notification.deleteMany();
      await tx.peerReview.deleteMany();
      await tx.projectMember.deleteMany();
      await tx.application.deleteMany();
      await tx.projectRole.deleteMany();
      await tx.projectStatusCriteria.deleteMany();
      await tx.project.deleteMany();
      await tx.userRole.deleteMany();
      await tx.user.deleteMany();
      await tx.role.deleteMany();
      await tx.status.deleteMany();
      await tx.category.deleteMany();

      // -------------------------------------------------------------------------
      // Lookups
      // -------------------------------------------------------------------------
      const statuses = await tx.status.createManyAndReturn({
        data: [
          { name: "SMP/sederajat" },
          { name: "SMA/SMAK/sederajat" },
          { name: "Mahasiswa" },
        ],
      });
      const categories = await tx.category.createManyAndReturn({
        data: [
          { name: "Lomba" },
          { name: "Proyek" },
        ],
      });
      const statusFor = (index: number) => deterministicPick(statuses, index);
      const categoryFor = (index: number) => deterministicPick(categories, index);

      const roles = await tx.role.createManyAndReturn({
        data: [
          { name: "Frontend Developer" },
          { name: "Backend Developer" },
          { name: "Full-Stack Developer" },
          { name: "UI/UX Designer" },
          { name: "Project Manager" },
        ],
      });
      const [frontend, backend, fullstack, uidesigner, projectManager] = roles;

      // -------------------------------------------------------------------------
      // Users (12: project owners plus a member/reviewer pool)
      // -------------------------------------------------------------------------
      const users = {
        alice: await tx.user.create({
          data: {
            id: seededUserIds.alice,
            name: "Alice Chen",
            instance: "State University",
            status: { connect: { id: statusFor(0).id } },
            bio: "Computer science senior who loves shipping small web tools.",
            contactInfo: "https://github.com/alicechen",
            userRoles: {
              create: [
                { role: { connect: { id: fullstack.id } } },
                { role: { connect: { id: uidesigner.id } } },
              ],
            },
          },
        }),
        marcus: await tx.user.create({
          data: {
            id: seededUserIds.marcus,
            name: "Marcus Webb",
            instance: "Nexa Software",
            status: { connect: { id: statusFor(1).id } },
            bio: "Product minded engineer tinker. React, PostgreSQL and clean DX.",
            contactInfo: "https://linkedin.com/in/marcuswebb",
            userRoles: {
              create: [
                { role: { connect: { id: frontend.id } } },
                { role: { connect: { id: projectManager.id } } },
              ],
            },
          },
        }),
        priya: await tx.user.create({
          data: {
            id: seededUserIds.priya,
            name: "Priya Raman",
            instance: "Coders Guild",
            status: { connect: { id: statusFor(2).id } },
            bio: "Mentoring juniors through their first production deploys for a decade.",
            contactInfo: "priya@codersguild.dev",
            userRoles: {
              create: [
                { role: { connect: { id: backend.id } } },
                { role: { connect: { id: projectManager.id } } },
              ],
            },
          },
        }),
        diego: await tx.user.create({
          data: {
            id: seededUserIds.diego,
            name: "Diego Ferrer",
            instance: "TechWorks Bootcamp",
            status: { connect: { id: statusFor(3).id } },
            bio: "Bootcamp grad looking for teammates to practice with.",
            userRoles: { create: [{ role: { connect: { id: frontend.id } } }] },
          },
        }),
        hana: await tx.user.create({
          data: {
            id: seededUserIds.hana,
            name: "Hana Suzuki",
            instance: "Weekend Builders",
            status: { connect: { id: statusFor(4).id } },
            bio: "Ship tiny games on weekends. Pragmatic APIs on the side.",
            contactInfo: "https://hanasuzuki.dev",
            userRoles: { create: [{ role: { connect: { id: backend.id } } }] },
          },
        }),
        omar: await tx.user.create({
          data: {
            id: seededUserIds.omar,
            name: "Omar Badr",
            instance: "Metro College",
            status: { connect: { id: statusFor(5).id } },
            bio: "Design student sketching interfaces before writing any code.",
            userRoles: { create: [{ role: { connect: { id: uidesigner.id } } }] },
          },
        }),
        nora: await tx.user.create({
          data: {
            id: seededUserIds.nora,
            name: "Nora Patel",
            instance: "Northside Academy",
            status: { connect: { id: statusFor(6).id } },
            bio: "Student organizer building tools for local study groups.",
            userRoles: { create: [{ role: { connect: { id: frontend.id } } }] },
          },
        }),
        liam: await tx.user.create({
          data: {
            id: seededUserIds.liam,
            name: "Liam Okafor",
            instance: "Open Source Lab",
            status: { connect: { id: statusFor(7).id } },
            bio: "Backend learner focused on reliable APIs and useful documentation.",
            contactInfo: "https://github.com/liamokafor",
            userRoles: { create: [{ role: { connect: { id: backend.id } } }] },
          },
        }),
        sofia: await tx.user.create({
          data: {
            id: seededUserIds.sofia,
            name: "Sofia Alvarez",
            instance: "Creative Coding Club",
            status: { connect: { id: statusFor(8).id } },
            bio: "Visual storyteller translating community ideas into friendly interfaces.",
            userRoles: { create: [{ role: { connect: { id: uidesigner.id } } }] },
          },
        }),
        kenji: await tx.user.create({
          data: {
            id: seededUserIds.kenji,
            name: "Kenji Tan",
            instance: "Harbor Polytechnic",
            status: { connect: { id: statusFor(9).id } },
            bio: "Full-stack builder interested in civic technology and data tools.",
            userRoles: { create: [{ role: { connect: { id: fullstack.id } } }] },
          },
        }),
        maya: await tx.user.create({
          data: {
            id: seededUserIds.maya,
            name: "Maya Singh",
            instance: "Riverside School",
            status: { connect: { id: statusFor(10).id } },
            bio: "Product-minded collaborator who enjoys turning rough ideas into plans.",
            userRoles: { create: [{ role: { connect: { id: projectManager.id } } }] },
          },
        }),
        noah: await tx.user.create({
          data: {
            id: seededUserIds.noah,
            name: "Noah Williams",
            instance: "Maker House",
            status: { connect: { id: statusFor(11).id } },
            bio: "Weekend maker experimenting with accessible education projects.",
            userRoles: {
              create: [
                { role: { connect: { id: frontend.id } } },
                { role: { connect: { id: backend.id } } },
              ],
            },
          },
        }),
      };

      // -------------------------------------------------------------------------
      // Projects — 8 open, 1 in progress, 1 completed.
      // Members never include the owner, filled roles have no remaining slots,
      // and in-progress/completed projects have zero open roles left.
      // -------------------------------------------------------------------------
      const campusMarketplace = await tx.project.create({
        data: {
          ownerId: users.alice.id,
          categoryId: categoryFor(0).id,
          title: "Campus Marketplace",
          description:
            "Buy and sell used textbooks and equipment inside one university. Chat, listings and safe hand-over checkpoints.",
          deadline: daysFromNow(60),
          onSite: false,
          workHoursPerWeek: 10,
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(0).id } } },
              { status: { connect: { id: statusFor(1).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: frontend.id, slotsAvailable: 1 },
              { roleId: uidesigner.id, slotsAvailable: 2 },
            ],
          },
        },
      });

      const habitsTracker = await tx.project.create({
        data: {
          ownerId: users.marcus.id,
          categoryId: categoryFor(1).id,
          title: "Daily Habits Tracker",
          description:
            "A mobile habit tracker with streaks, gentle reminders and an importable on-device dataset.",
          deadline: daysFromNow(45),
          onSite: false,
          workHoursPerWeek: 8,
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(2).id } } },
              { status: { connect: { id: statusFor(3).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: backend.id, slotsAvailable: 1 },
              { roleId: frontend.id, slotsAvailable: 2 },
            ],
          },
        },
      });

      const puzzleGame = await tx.project.create({
        data: {
          ownerId: users.hana.id,
          categoryId: categoryFor(2).id,
          title: "Indie Puzzle Game",
          description:
            "A cozy tile-sliding puzzle with a small coop mode and a lobby. Ships for web and desktop.",
          deadline: daysFromNow(90),
          onSite: true,
          workHoursPerWeek: 6,
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(4).id } } },
              { status: { connect: { id: statusFor(5).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: uidesigner.id, slotsAvailable: 1 },
              { roleId: frontend.id, slotsAvailable: 2 },
            ],
          },
        },
      });

      // In progress — roles fully covered by members (no slots left).
      await tx.project.create({
        data: {
          ownerId: users.priya.id,
          categoryId: categoryFor(3).id,
          title: "SaaS Admin Dashboard",
          description:
            "An admin dashboard surface for a rising SaaS workspace with KPI charts and team management.",
          deadline: daysFromNow(30),
          onSite: true,
          workHoursPerWeek: 12,
          status: "IN_PROGRESS",
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(6).id } } },
              { status: { connect: { id: statusFor(7).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: frontend.id, slotsAvailable: 0 },
              { roleId: uidesigner.id, slotsAvailable: 0 },
            ],
          },
          projectMembers: {
            create: [
              { userId: users.marcus.id, roleId: frontend.id },
              { userId: users.diego.id, roleId: uidesigner.id },
            ],
          },
        },
      });

      // Completed — every participant reviews everyone else at the end.
      const portfolioHub = await tx.project.create({
        data: {
          ownerId: users.diego.id,
          categoryId: categoryFor(4).id,
          title: "Portfolio Hub",
          description:
            "A shared template site hosting mini portfolios for three students of the same design cohort.",
          deadline: daysAgo(5),
          onSite: false,
          workHoursPerWeek: 5,
          status: "COMPLETED",
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(8).id } } },
              { status: { connect: { id: statusFor(9).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: frontend.id, slotsAvailable: 0 },
              { roleId: fullstack.id, slotsAvailable: 0 },
              { roleId: uidesigner.id, slotsAvailable: 0 },
            ],
          },
          projectMembers: {
            create: [
              { userId: users.alice.id, roleId: frontend.id },
              { userId: users.marcus.id, roleId: fullstack.id },
              { userId: users.omar.id, roleId: uidesigner.id },
            ],
          },
        },
      });

      await tx.project.create({
        data: {
          ownerId: users.nora.id,
          categoryId: categoryFor(5).id,
          title: "Study Group Scheduler",
          description:
            "A lightweight scheduler that helps classmates find overlapping study times and share agendas.",
          deadline: daysFromNow(35),
          onSite: false,
          workHoursPerWeek: 7,
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(10).id } } },
              { status: { connect: { id: statusFor(11).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: frontend.id, slotsAvailable: 1 },
              { roleId: projectManager.id, slotsAvailable: 1 },
            ],
          },
        },
      });

      await tx.project.create({
        data: {
          ownerId: users.liam.id,
          categoryId: categoryFor(6).id,
          title: "Community API Catalog",
          description:
            "A searchable directory of neighborhood APIs, open datasets and examples for student projects.",
          deadline: daysFromNow(55),
          onSite: false,
          workHoursPerWeek: 9,
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(0).id } } },
              { status: { connect: { id: statusFor(2).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: backend.id, slotsAvailable: 2 },
              { roleId: uidesigner.id, slotsAvailable: 1 },
            ],
          },
        },
      });

      await tx.project.create({
        data: {
          ownerId: users.sofia.id,
          categoryId: categoryFor(7).id,
          title: "Museum Story Map",
          description:
            "An interactive map for a small museum that connects exhibits with short local history stories.",
          deadline: daysFromNow(70),
          onSite: true,
          workHoursPerWeek: 6,
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(1).id } } },
              { status: { connect: { id: statusFor(2).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: uidesigner.id, slotsAvailable: 1 },
              { roleId: frontend.id, slotsAvailable: 1 },
            ],
          },
        },
      });

      await tx.project.create({
        data: {
          ownerId: users.kenji.id,
          categoryId: categoryFor(8).id,
          title: "Civic Data Challenge",
          description:
            "A collaborative challenge turning public transport data into clear, useful community insights.",
          deadline: daysFromNow(80),
          onSite: false,
          workHoursPerWeek: 11,
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(3).id } } },
              { status: { connect: { id: statusFor(5).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: fullstack.id, slotsAvailable: 1 },
              { roleId: backend.id, slotsAvailable: 1 },
            ],
          },
        },
      });

      await tx.project.create({
        data: {
          ownerId: users.maya.id,
          categoryId: categoryFor(9).id,
          title: "Accessible Learning Kit",
          description:
            "A set of accessible learning activities and reusable templates for after-school workshops.",
          deadline: daysFromNow(50),
          onSite: true,
          workHoursPerWeek: 8,
          projectStatusCriteria: {
            create: [
              { status: { connect: { id: statusFor(6).id } } },
              { status: { connect: { id: statusFor(8).id } } },
            ],
          },
          projectRoles: {
            create: [
              { roleId: projectManager.id, slotsAvailable: 1 },
              { roleId: uidesigner.id, slotsAvailable: 1 },
            ],
          },
        },
      });

      // -------------------------------------------------------------------------
      // Applications — only on the open projects, never by owners or members.
      // -------------------------------------------------------------------------
      await tx.application.createMany({
        data: [
          {
            projectId: campusMarketplace.id,
            applicantId: users.marcus.id,
            roleId: frontend.id,
            message: "I have shipped two marketplaces before, happy to lead the frontend.",
            portfolioLink: "https://github.com/marcuswebb",
          },
          {
            projectId: campusMarketplace.id,
            applicantId: users.omar.id,
            roleId: uidesigner.id,
            message: "I will sketch the listing flow in Figma for your review.",
            portfolioLink: "https://omar.design",
          },
          {
            projectId: habitsTracker.id,
            applicantId: users.alice.id,
            roleId: frontend.id,
            message: "Daily streaks UI is a fun fit for my mobile web practice.",
            portfolioLink: "https://github.com/alicechen",
          },
          {
            projectId: habitsTracker.id,
            applicantId: users.diego.id,
            roleId: backend.id,
            message: "Practice-first learner, I want to own the sync API.",
            portfolioLink: "https://github.com/diegoferrer",
          },
          {
            projectId: puzzleGame.id,
            applicantId: users.omar.id,
            roleId: frontend.id,
            message: "I can turn your tile animations into playable web mocks.",
          },
          {
            projectId: puzzleGame.id,
            applicantId: users.priya.id,
            roleId: uidesigner.id,
            message: "Happy to bring my guild design reviews into the cozy frames.",
          },
        ],
      });

      // Peer reviews on the completed project.
      await tx.peerReview.createMany({
        data: peerReviewSeed.map((review) => ({
          projectId: portfolioHub.id,
          reviewerId: users[review.reviewer].id,
          revieweeId: users[review.reviewee].id,
          commitmentScore: review.commitmentScore,
          feedback: review.feedback,
        })),
      });

      // -------------------------------------------------------------------------
      // Notifications — mixed read/unread, themed on the seeded activity.
      // (Accepted applicants' application rows were "deleted on accept", so an
      //  "Application Accepted" notification for a previous applicant is consistent.)
      // -------------------------------------------------------------------------
      await tx.notification.createMany({
        data: [
          {
            userId: users.marcus.id,
            title: "New Application Received",
            message: 'You have received a new application for project "Daily Habits Tracker" from Diego Ferrer.',
          },
          {
            userId: users.hana.id,
            title: "New Application Received",
            message: 'You have received a new application for project "Indie Puzzle Game" from Priya Raman.',
            read: true,
          },
          {
            userId: users.alice.id,
            title: "Application Accepted",
            message: 'Your application for project "Portfolio Hub" has been accepted.',
            read: true,
          },
          {
            userId: users.marcus.id,
            title: "Application Accepted",
            message: 'Your application for project "Portfolio Hub" has been accepted.',
            read: true,
          },
          {
            userId: users.omar.id,
            title: "Application Accepted",
            message: 'Your application for project "Portfolio Hub" has been accepted.',
          },
          {
            userId: users.alice.id,
            title: "Welcome to ProjectMatch",
            message: "Complete your profile, pick your roles, and start applying.",
          },
        ],
      });

      // -------------------------------------------------------------------------
      // Aggregate consistency — profile stats must match the seeded data.
      // -------------------------------------------------------------------------
      // Completed-project participants (owner + members): Portfolio Hub.
      const completedParticipants = new Set(
        [
          users.diego.id, // owner
          users.alice.id, // member
          users.marcus.id, // member
          users.omar.id, // member
        ],
      );

      const scoresByUser = new Map<string, number[]>();
      for (const { reviewee, commitmentScore } of peerReviewSeed) {
        const revieweeId = users[reviewee].id;
        scoresByUser.set(revieweeId, [...(scoresByUser.get(revieweeId) ?? []), commitmentScore]);
      }

      for (const user of Object.values(users)) {
        const scores = scoresByUser.get(user.id) ?? [];
        const avg = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;

        // Reviewee averages rounded to one decimal place.
        await tx.user.update({
          where: { id: user.id },
          data: {
            totalProjectsCompleted: completedParticipants.has(user.id) ? 1 : 0,
            avgCommitmentScore: avg,
          },
        });
      }
    },
    { timeout: 20_000 },
  );

  // ---------------------------------------------------------------------------
  // Summary (re-queried after commit so it reflects the database state)
  // ---------------------------------------------------------------------------
  const counts = {
    status: await prisma.status.count(),
    category: await prisma.category.count(),
    role: await prisma.role.count(),
    user: await prisma.user.count(),
    userRole: await prisma.userRole.count(),
    project: await prisma.project.count(),
    projectStatusCriteria: await prisma.projectStatusCriteria.count(),
    projectRole: await prisma.projectRole.count(),
    projectMember: await prisma.projectMember.count(),
    application: await prisma.application.count(),
    peerReview: await prisma.peerReview.count(),
    notification: await prisma.notification.count(),
  };

  console.log("Seed complete:");
  console.table(counts);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
