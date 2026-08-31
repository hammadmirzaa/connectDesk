"""
ConnectDesk Seed Script
Run with: python seed_data.py
Creates sample users, workspaces, boards, columns, tasks and chat rooms.
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from workspaces.models import Workspace
from boards.models import Board, Column, Task
from chat.models import ChatRoom, Message

print("\n🌱 Starting ConnectDesk seed...\n")

# ─────────────────────────────────────────────
# 1. USERS
# ─────────────────────────────────────────────
users_data = [
    {"username": "admin",    "email": "admin@connectdesk.com",   "password": "admin123",   "first_name": "Admin",   "last_name": "User",    "is_superuser": True},
    {"username": "alice",    "email": "alice@connectdesk.com",   "password": "alice123",   "first_name": "Alice",   "last_name": "Johnson"},
    {"username": "bob",      "email": "bob@connectdesk.com",     "password": "bob123",     "first_name": "Bob",     "last_name": "Smith"},
    {"username": "carol",    "email": "carol@connectdesk.com",   "password": "carol123",   "first_name": "Carol",   "last_name": "White"},
    {"username": "david",    "email": "david@connectdesk.com",   "password": "david123",   "first_name": "David",   "last_name": "Brown"},
]

created_users = {}
for ud in users_data:
    is_super = ud.pop("is_superuser", False)
    username = ud["username"]
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        print(f"   ↩  User '{username}' already exists, skipping.")
    else:
        password = ud.pop("password")
        user = User(**ud)
        user.set_password(password)
        if is_super:
            user.is_superuser = True
            user.is_staff = True
        user.save()
        print(f"   ✅ Created user: {username}")
    created_users[username] = user

admin = created_users["admin"]
alice = created_users["alice"]
bob   = created_users["bob"]
carol = created_users["carol"]
david = created_users["david"]

# ─────────────────────────────────────────────
# 2. WORKSPACES
# ─────────────────────────────────────────────
workspaces_data = [
    {
        "name": "Product Team",
        "description": "Main workspace for the product and design team.",
        "creator": alice,
        "members": [alice, bob, carol],
    },
    {
        "name": "Engineering",
        "description": "Backend, frontend and DevOps engineers.",
        "creator": bob,
        "members": [bob, alice, david],
    },
    {
        "name": "Marketing Hub",
        "description": "Campaigns, content, and growth initiatives.",
        "creator": carol,
        "members": [carol, david, alice],
    },
]

created_workspaces = []
for wd in workspaces_data:
    members = wd.pop("members")
    creator = wd.pop("creator")
    ws, created = Workspace.objects.get_or_create(name=wd["name"], defaults={**wd, "created_by": creator})
    ws.members.set(members)
    ws.save()
    created_workspaces.append(ws)
    status = "✅ Created" if created else "↩  Exists"
    print(f"   {status} workspace: {ws.name}")

product_ws    = created_workspaces[0]
engineering_ws = created_workspaces[1]
marketing_ws  = created_workspaces[2]

# ─────────────────────────────────────────────
# 3. BOARDS  (5 boards across workspaces)
# ─────────────────────────────────────────────
boards_data = [
    # Product workspace
    {
        "title": "Product Roadmap Q3",
        "workspace": product_ws,
        "creator": alice,
        "background_image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
        "columns": [
            {"title": "Backlog",     "tasks": ["Define user personas", "Competitor analysis", "Accessibility audit", "Onboarding flow redesign"]},
            {"title": "In Progress", "tasks": ["Dashboard wireframes", "Mobile nav prototype", "Color system update"]},
            {"title": "Review",      "tasks": ["Landing page redesign", "Icon library v2"]},
            {"title": "Done",        "tasks": ["Brand guidelines doc", "Style guide published"]},
        ],
    },
    {
        "title": "UX Research Sprint",
        "workspace": product_ws,
        "creator": carol,
        "background_image": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200",
        "columns": [
            {"title": "To Do",       "tasks": ["User interviews (x10)", "Survey setup", "Usability test plan"]},
            {"title": "Doing",       "tasks": ["Synthesise interview notes", "Affinity mapping"]},
            {"title": "Done",        "tasks": ["Screener questionnaire", "Research goals doc"]},
        ],
    },
    # Engineering workspace
    {
        "title": "Backend API v2",
        "workspace": engineering_ws,
        "creator": bob,
        "background_image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
        "columns": [
            {"title": "Todo",        "tasks": ["JWT refresh endpoint", "Rate limiting middleware", "PostgreSQL migration", "Celery task queue setup", "API versioning strategy"]},
            {"title": "In Progress", "tasks": ["WebSocket channels", "File upload service", "Unit tests for auth"]},
            {"title": "Code Review", "tasks": ["Pusher integration", "CORS configuration"]},
            {"title": "Deployed",    "tasks": ["User auth endpoints", "Board CRUD API", "Workspace API"]},
        ],
    },
    {
        "title": "DevOps & Infrastructure",
        "workspace": engineering_ws,
        "creator": david,
        "background_image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200",
        "columns": [
            {"title": "Planned",     "tasks": ["Set up staging environment", "CI/CD pipeline", "Docker compose prod", "SSL certificate automation"]},
            {"title": "In Progress", "tasks": ["Redis cluster setup", "Monitoring dashboard"]},
            {"title": "Completed",   "tasks": ["Render deployment", "PostgreSQL provisioning", "Vercel frontend deploy"]},
        ],
    },
    # Marketing workspace
    {
        "title": "Q3 Marketing Campaign",
        "workspace": marketing_ws,
        "creator": carol,
        "background_image": "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200",
        "columns": [
            {"title": "Ideas",       "tasks": ["Launch email sequence", "LinkedIn content calendar", "Blog posts x4", "Influencer outreach list", "Product Hunt launch prep"]},
            {"title": "Creating",    "tasks": ["Hero video script", "Social media graphics", "Newsletter template"]},
            {"title": "Scheduled",   "tasks": ["Twitter thread series", "YouTube demo video"]},
            {"title": "Published",   "tasks": ["Website SEO audit", "Feature announcement post"]},
        ],
    },
]

for bd in boards_data:
    columns_data = bd.pop("columns")
    creator      = bd.pop("creator")

    board, created = Board.objects.get_or_create(
        title=bd["title"],
        workspace=bd["workspace"],
        defaults={**bd, "creator": creator},
    )
    if created:
        # Add creator + workspace members to board
        board.members.set(bd["workspace"].members.all())
        board.save()
        print(f"\n   ✅ Board: '{board.title}' in [{board.workspace.name}]")

        for col_pos, cd in enumerate(columns_data):
            tasks_titles = cd.pop("tasks")
            col = Column.objects.create(board=board, position=col_pos, **cd)
            print(f"      📋 Column: {col.title}")
            for task_pos, title in enumerate(tasks_titles):
                Task.objects.create(columnId=col, title=title, position=task_pos)
            print(f"         → {len(tasks_titles)} tasks added")
    else:
        print(f"\n   ↩  Board '{board.title}' already exists, skipping.")

# ─────────────────────────────────────────────
# 4. CHAT ROOMS
# ─────────────────────────────────────────────
print("\n")
rooms_data = [
    {"name": "General 💬",       "creator": alice,  "members": [alice, bob, carol, david]},
    {"name": "Engineering 🔧",   "creator": bob,    "members": [bob, david, alice]},
    {"name": "Design Talk 🎨",   "creator": carol,  "members": [carol, alice]},
    {"name": "Random 🎲",        "creator": david,  "members": [alice, bob, carol, david]},
]

for rd in rooms_data:
    members = rd.pop("members")
    creator = rd.pop("creator")
    room, created = ChatRoom.objects.get_or_create(name=rd["name"], defaults={**rd, "created_by": creator})
    room.members.set(members)
    room.save()
    status = "✅ Created" if created else "↩  Exists"
    print(f"   {status} chat room: {room.name}")

    # Seed a couple of messages per room
    if created:
        sample_msgs = [
            (creator, "Hey everyone, welcome to the channel! 👋"),
            (members[1] if len(members) > 1 else creator, "Thanks! Excited to be here."),
        ]
        for sender, content in sample_msgs:
            Message.objects.create(room=room, sender=sender, content=content)

# ─────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────
print(f"""
╔══════════════════════════════════════════╗
║        ✅  Seed Complete!                ║
╠══════════════════════════════════════════╣
║  Users       : {User.objects.count():<5} created/existing       ║
║  Workspaces  : {Workspace.objects.count():<5} created/existing       ║
║  Boards      : {Board.objects.count():<5} created/existing       ║
║  Columns     : {Column.objects.count():<5} created/existing       ║
║  Tasks       : {Task.objects.count():<5} created/existing       ║
║  Chat Rooms  : {ChatRoom.objects.count():<5} created/existing       ║
╠══════════════════════════════════════════╣
║  🔑 Test Credentials:                    ║
║     admin / admin123  (superuser)        ║
║     alice / alice123                    ║
║     bob   / bob123                      ║
║     carol / carol123                    ║
║     david / david123                    ║
╚══════════════════════════════════════════╝
""")
