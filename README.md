# IT Helpdesk System

A full‑featured IT ticket helpdesk system built with **Next.js 16**, **Supabase**, and **Tailwind CSS**.  
It enables employees to submit support tickets and allows IT staff / technicians to manage, assign, and resolve them efficiently.

---

## 🚀 Features

- **Role‑based access control** – Admin, IT, Technician, Employee.
- **Ticket lifecycle** – Create, assign, update status, comment, resolve, and reopen.
- **Comments** – Public and internal (staff‑only) comments.
- **History tracking** – Every status change and assignment is logged.
- **Category management** – Admins can create/update/activate categories.
- **User management** – Admins can create, activate/deactivate, change roles, and delete users.
- **System settings** – Company name and support email (admin only).
- **Profile management** – Users can update their name, email, and password.
- **Dark mode** – Toggleable theme persisted in local storage.
- **Responsive UI** – Works on desktop and mobile.
- **Secure** – Supabase Row Level Security (RLS) ensures data isolation.

---

## 🧑‍💻 Roles & Permissions

| Role       | Permissions |
|------------|-------------|
| **Admin**  | Full access: manage users, categories, settings, and all tickets (assign, update status, comment internally). |
| **IT**     | Can view and manage all tickets, assign technicians, update status, post internal comments. |
| **Technician** | Same as IT but cannot manage users or settings. |
| **Employee** | Can create tickets, view their own tickets, post public comments, reopen resolved tickets (creates a new ticket). |

All staff roles (Admin, IT, Technician) can see internal comments and full ticket history.

---

## 🔑 Default Credentials (Development)

> **Note:** The system does **not** include pre‑seeded users.  
> For local development, create users via the **Admin → Users** panel.  
> Use the temporary password `12345678` for all roles during testing.

| Role       | Example Email          | Password |
|------------|------------------------|----------|
| Admin      | admin@gmail.com        | 12345678 |
| IT         | it@gmail.com           | 12345678 |
| Technician | tech@gmail.com         | 12345678 |
| Employee   | employee@gmail.com     | 12345678 |

You can create these accounts by signing up through the Supabase dashboard or using the **Create User** form in the admin UI.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication & Database**: Supabase (PostgreSQL + Auth)
- **State Management**: Zustand
- **Forms & Validation**: React Hook Form + Zod
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript (strict mode)

---

## 📦 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd it-ticket-helpdesk-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**  
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Apply database migrations**  
   (Using Supabase CLI or the Studio SQL editor)
   ```bash
   supabase migration up
   ```
   Migrations are located in `supabase/migrations/`.

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Database Schema (Core Tables)

- **profiles** – Extends `auth.users` with `full_name`, `role`, `is_active`.
- **tickets** – Main ticket table with status, assignments, timestamps.
- **ticket_comments** – Comments with `public`/`internal` visibility.
- **ticket_history** – Tracks field changes (status, assignments).
- **ticket_categories** – Categories managed by admin.
- **system_settings** – Company name, support email.
- **email_notifications** – Queued notifications (sent via cron / webhook).
- **audit_logs** – Admin actions for compliance.

RLS policies restrict access based on roles and ownership.

---

## 📋 CRUD Operations & Key Actions

| Entity   | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| **Tickets** | ✅ (Employees) | ✅ (Own or staff) | ✅ (Status, assignment) | ❌ | Tickets are never deleted; they can be cancelled/closed. |
| **Comments** | ✅ (Participants) | ✅ (Visible) | ❌ | ❌ | Internal comments only for staff. |
| **Users** | ✅ (Admin) | ✅ (Admin) | ✅ (Role/status) | ✅ (Admin) | Deleting a user also removes their auth entry. |
| **Categories** | ✅ (Admin) | ✅ (All) | ✅ (Admin) | ❌ | Can be deactivated instead of deleted. |
| **Settings** | ✅ (Admin) | ✅ (Admin) | ✅ (Admin) | ❌ | Single row (singleton table). |

### Additional actions:
- **Reopen ticket** – Employee can reopen a resolved/closed ticket, creating a new ticket linked to the previous one.
- **First review** – Automatically marks a ticket as reviewed when a staff member views it.
- **Assignment** – IT can assign an IT lead and/or a technician.

---

## 📁 Project Structure (Highlights)

```
src/
├── app/                 # Next.js pages (App Router)
│   ├── (auth)/          # Login, forgot/reset password
│   ├── (dashboard)/     # Authenticated pages (tickets, users, etc.)
│   └── api/             # API routes (users, notifications)
├── components/          # Reusable UI components
├── services/            # Data layer (Supabase queries)
├── stores/              # Zustand stores
├── types/               # TypeScript definitions
├── validations/         # Zod schemas
├── lib/                 # Utilities, Supabase clients
├── config/              # App config, navigation items
└── constants/           # Role, route, status constants
```

---

## 🔒 Security & Best Practices

- All database access is protected by **Row Level Security**.
- Supabase **Service Role** is used only for administrative actions (user creation/deletion).
- Input validation with **Zod** on both client and server (API routes).
- Authentication via Supabase Auth with session management.
- No secrets are hardcoded – all sensitive values come from environment variables.

---

## 🧪 Testing (Not yet configured)

The project does not currently include automated tests.  
Future work may add unit/integration tests using Jest / React Testing Library.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please follow the existing code style and architecture.

---

## 📄 License

This project is proprietary and not yet open‑sourced. All rights reserved.

---

## ✨ Future Roadmap (Not implemented yet)

- AI‑powered ticket summarisation and category prediction (tables already exist).
- Real‑time notifications via Supabase Realtime.
- Docker deployment and CI/CD pipeline.
- PWA support for offline access.

---

## 📧 Support

For any issues, contact your system administrator or open an issue in the project repository.

---