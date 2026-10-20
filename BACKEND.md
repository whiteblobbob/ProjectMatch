# Backend ProjectMatch

- Validation: zod

## Database
- `User` (id, name, instance, status_id, bio, total_projects_completed, avg_commitment_score, updated_at, created_at)
- `User_Role` (user_id, role_id) with `user_id, role_id` as the unique constraint
- `Status` (id, status_name) example: SMP, SMA, D4, S1
- `Role` (id, role_name) example: Backend Engineer, UI/UX Designer
- `Project` (id, owner_id, title, description, deadline, updated_at, created_at, status: `DRAFT`, `OPEN_RECRUITMENT`, `IN_PROGRESS`, `COMPLETED`)
- `Project_Status_Criteria` (project_id, status_id) with `project_id, status_id` as the unique constraint
- `Project_Role` (project_id, role_id, filled_amount, maximum_capacity) with `project_id, role_id` as the unique constraint
- `Application` (project_id, applicant_id, role_id, message, portfolio_link, status: `PENDING`, `ACCEPTED`, `REJECTED`) with `project_id, applicant_id` as the unique constraint
- `Project_Member` (project_id, user_id, role_id) with `project_id, user_id` as the unique constraint
- `Peer_Review` (project_id, reviewer_id, reviewee_id, commitment_score: 1-5, role_validated: boolean, feedback, created_at) with `project_id, reviewer_id, reviewee_id` as the unique constraint

##