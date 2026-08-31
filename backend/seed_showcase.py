"""
ConnectDesk Showcase Seed - for Upwork screenshots
Run: python -X utf8 seed_showcase.py
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from workspaces.models import Workspace
from boards.models import Board, Column, Task
from chat.models import ChatRoom, Message

# Get existing users
try:
    alice = User.objects.get(username='alice')
    bob   = User.objects.get(username='bob')
    carol = User.objects.get(username='carol')
    david = User.objects.get(username='david')
except User.DoesNotExist:
    print("Run seed_data.py first to create users!")
    exit(1)

# Get or create workspace
ws, _ = Workspace.objects.get_or_create(
    name="Product Team",
    defaults={"description": "Main product workspace", "created_by": alice}
)
ws.members.set([alice, bob, carol, david])

# ── SHOWCASE BOARD ──────────────────────────────────────────
board, created = Board.objects.get_or_create(
    title="ConnectDesk Platform — Sprint 7",
    workspace=ws,
    defaults={
        "creator": alice,
        "background_image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600",
    }
)
board.members.set([alice, bob, carol, david])
board.save()

if not created:
    # Clear existing columns to re-seed fresh
    board.columns.all().delete()

print(f"Board: {board.title}")

columns_data = [
    {
        "title": "Backlog",
        "tasks": [
            "Implement OAuth2 social login (Google, GitHub)",
            "Add two-factor authentication (2FA)",
            "Design onboarding tour for new users",
            "Build notification preferences center",
            "Create mobile-responsive navbar",
            "Add dark mode toggle with persistence",
            "Set up end-to-end test suite (Playwright)",
            "Integrate Stripe billing for Pro plan",
            "Build CSV export for board tasks",
            "Add keyboard shortcuts overlay",
            "Performance audit — reduce bundle size",
            "Create public API documentation (Swagger)",
        ]
    },
    {
        "title": "In Progress",
        "tasks": [
            "Real-time cursor presence in boards",
            "Drag-and-drop task reordering across columns",
            "File attachment support in tasks (S3)",
            "Implement @mention notifications in chat",
            "Board activity timeline feed",
            "Task due date picker + reminders",
            "Search across workspaces and boards",
            "Emoji reactions on chat messages",
            "Custom board backgrounds (upload or Unsplash)",
        ]
    },
    {
        "title": "In Review",
        "tasks": [
            "Pusher WebSocket chat — code review",
            "JWT refresh token rotation logic",
            "Workspace member roles (Admin / Member)",
            "Board invite via email link",
            "Task label / tag system",
            "Kanban column WIP limits",
        ]
    },
    {
        "title": "QA / Testing",
        "tasks": [
            "Cross-browser testing (Safari, Firefox, Edge)",
            "Mobile layout QA — iOS & Android",
            "Auth flow edge cases — expired token handling",
            "Load test: 500 concurrent WebSocket connections",
            "Accessibility audit (WCAG 2.1 AA)",
        ]
    },
    {
        "title": "Done",
        "tasks": [
            "Initial Django REST API setup",
            "React frontend boilerplate + routing",
            "User registration & JWT authentication",
            "Workspace CRUD API + frontend",
            "Kanban board creation & listing",
            "Column creation & drag-to-reorder",
            "Task CRUD with position persistence",
            "Pusher integration for live chat",
            "CORS configuration for local dev",
            "PostgreSQL database setup & migrations",
            "Deploy backend to Render",
            "Deploy frontend to Vercel",
            "Custom user profile + avatar upload",
            "Board member management (invite/remove)",
            "Chat room creation + messaging",
            "AI chatbot integration (Cohere)",
        ]
    },
]

for pos, cd in enumerate(columns_data):
    task_titles = cd["tasks"]
    col = Column.objects.create(board=board, title=cd["title"], position=pos)
    print(f"  Column '{col.title}': {len(task_titles)} tasks")
    for t_pos, title in enumerate(task_titles):
        Task.objects.create(columnId=col, title=title, position=t_pos)

# ── CHAT ROOMS + MESSAGES ───────────────────────────────────
chat_data = [
    {
        "name": "General",
        "members": [alice, bob, carol, david],
        "messages": [
            (alice, "Hey team! Sprint 7 planning is live on the board. Let's crush it this week! 🚀"),
            (bob,   "Awesome! I'll pick up the Pusher WebSocket chat ticket today."),
            (carol, "I'm on the drag-and-drop task reordering — the DnD Kit implementation looks clean."),
            (david, "Starting the load test for 500 concurrent WebSocket connections. Will report back."),
            (alice, "Perfect. @carol can you also review the board activity timeline once your ticket is done?"),
            (carol, "Sure thing! I'll tackle that right after."),
            (bob,   "Just pushed the WebSocket fix to the review branch. PR is up 👆"),
            (david, "Load test results: p99 latency is 42ms. Well within SLA. ✅"),
            (alice, "Incredible work everyone. Demo is on Friday — let's make sure QA is done by Thursday EOD."),
            (carol, "On it. Mobile QA looks good so far on iOS, checking Firefox now."),
            (bob,   "The JWT refresh token rotation PR just got approved. Merging now."),
            (david, "Accessibility audit flagged 3 issues — creating tickets in Backlog now."),
            (alice, "Great catch David. Let's prioritise those before the demo."),
            (carol, "Dark mode looks STUNNING by the way 🌙 Really polished."),
            (bob,   "Agreed! The glassmorphism effect on the sidebar is chef's kiss 👌"),
        ]
    },
    {
        "name": "Engineering",
        "members": [bob, david, alice],
        "messages": [
            (bob,   "Should we go with Celery + Redis for background task processing or use Django channels?"),
            (david, "I'd go Celery for anything not real-time — better retry logic."),
            (alice, "Agreed. Let's scope the email notification worker as a Celery task."),
            (bob,   "Cool. I'll set up the task queue config today. Redis is already running."),
            (david, "One thing — our S3 bucket policy needs updating for the file attachment feature."),
            (alice, "I'll sort the IAM permissions. Should be done in 30 mins."),
            (bob,   "File upload endpoint is working locally. Presigned URLs are a great approach."),
            (david, "Deployed the staging environment. All green ✅ — check https://staging.connectdesk.app"),
            (alice, "Staging looks great! API response times are fast. Nice work."),
            (bob,   "Bundle size is down to 187KB gzipped after the tree-shaking fixes. 🔥"),
            (david, "Should we enable Brotli compression on the CDN edge?"),
            (alice, "Yes — let's enable it. Should shave another 15-20% off."),
        ]
    },
    {
        "name": "Design & UX",
        "members": [alice, carol],
        "messages": [
            (carol, "Figma file is updated with the new component library. Link shared in Notion."),
            (alice, "Love the new card design! The subtle shadow on hover is a nice touch."),
            (carol, "I was going for a premium feel — like Linear meets Notion."),
            (alice, "Nailed it. Can you also mock up the empty state for when there are no boards yet?"),
            (carol, "On it! I was thinking a friendly illustration + a clear CTA button."),
            (alice, "Perfect. Keep it minimal — users should feel guided, not overwhelmed."),
            (carol, "The onboarding checklist design is done. Want me to share it for review?"),
            (alice, "Yes please! Let's get Bob to look at it from a feasibility standpoint too."),
            (carol, "Shared to the General channel. Also updated the color tokens for dark mode."),
            (alice, "The contrast ratios are all WCAG AA compliant now?"),
            (carol, "Yes! Ran it through Stark. All clear ✅"),
        ]
    },
    {
        "name": "Random",
        "members": [alice, bob, carol, david],
        "messages": [
            (david, "Anyone else think the new Figma Dev Mode is an absolute game changer?"),
            (bob,   "100%! The code snippets for CSS variables are so useful."),
            (carol, "I've been using it all week. Saves so much back-and-forth with devs."),
            (alice, "Quick poll: should our next team offsite be in Lisbon or Barcelona? 🌍"),
            (bob,   "Barcelona! The food is unmatched 🥘"),
            (david, "Lisbon for me — startup vibes and cheaper coffee ☕"),
            (carol, "I vote Barcelona too but I'm biased 😄"),
            (alice, "Haha. We'll put it to a proper vote on Friday. Barcelona is winning so far!"),
            (bob,   "Just discovered that our app is faster than Trello in every benchmark 👀"),
            (david, "Of course it is — we built it right 😎"),
            (carol, "Someone post that on Twitter 😂"),
            (alice, "Maybe after the Upwork demo 🚀"),
        ]
    },
]

for cd in chat_data:
    members = cd["members"]
    msgs    = cd["messages"]
    room, created = ChatRoom.objects.get_or_create(
        name=cd["name"],
        defaults={"created_by": members[0]}
    )
    room.members.set(members)
    room.save()

    if created or room.messages.count() < len(msgs):
        # Clear old messages and re-seed
        room.messages.all().delete()
        for sender, content in msgs:
            Message.objects.create(room=room, sender=sender, content=content)
        print(f"  Chat '{room.name}': {len(msgs)} messages")
    else:
        print(f"  Chat '{room.name}': already seeded")

print(f"""
╔══════════════════════════════════════════════╗
║  Showcase board ready for screenshots!       ║
╠══════════════════════════════════════════════╣
║  Board : ConnectDesk Platform - Sprint 7     ║
║  Columns: 5  |  Tasks: 48  |  Chats: 4      ║
║  Chat messages: 48 realistic conversations   ║
╠══════════════════════════════════════════════╣
║  Login: alice / alice123                     ║
╚══════════════════════════════════════════════╝
""")
