import requests
import re
import random

WALLPAPERS = [
  "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1612831455544-bb7f0c530e84?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1618005198919-d3d4e5a8f94c?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1616627985843-4cdb7f31c5e9?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1616401786637-1d6d9c7c4d14?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1604152135912-04a693e20f04?auto=format&fit=crop&w=1600&q=80", 
];


API_BASE = "http://localhost:8000/api"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxMTg5NTcwLCJpYXQiOjE3NTExMDMxNzAsImp0aSI6IjE5NzQxNzNhNTczYTQyOTE4MTliMDM1NDE3MjNlMDljIiwidXNlcl9pZCI6MX0.9afSLKJm4xluBMPK_cg8YojYJH4TWIwxQnzZ2WcVeVs"  # Replace with your valid token

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# --- Workspace Helpers ---
def get_workspaces():
    res = requests.get(f"{API_BASE}/workspaces/", headers=HEADERS)
    return res.json() if res.status_code == 200 else []

def get_workspace_id_by_name(name):
    workspaces = get_workspaces()
    for ws in workspaces:
        if ws["name"].lower() == name.lower():
            return ws["id"]
    return None

# --- Utility Functions ---
def get_boards():
    res = requests.get(f"{API_BASE}/boards/", headers=HEADERS)
    return res.json() if res.status_code == 200 else []

def get_board_by_title(title):
    boards = get_boards()
    return next((b for b in boards if b["title"].lower() == title.lower()), None)

def get_columns(board_id):
    res = requests.get(f"{API_BASE}/columns/?board={board_id}", headers=HEADERS)
    return res.json() if res.status_code == 200 else []

def get_column_by_title(board_id, column_title):
    columns = get_columns(board_id)
    return next((c for c in columns if c["title"].lower() == column_title.lower()), None)

def get_tasks():
    res = requests.get(f"{API_BASE}/tasks/", headers=HEADERS)
    return res.json() if res.status_code == 200 else []

# --- Board Operations ---
def create_board(title, workspace_name):
    workspace_id = get_workspace_id_by_name(workspace_name)
    if not workspace_id:
        print(f"⚠️ Workspace '{workspace_name}' not found.")
        return

    # Pick a random wallpaper
    random_wallpaper = random.choice(WALLPAPERS)

    payload = {
        "title": title,
        "workspace": workspace_id,
        "background_image": random_wallpaper,  # Add random wallpaper
    }

    res = requests.post(f"{API_BASE}/boards/", json=payload, headers=HEADERS)

    if res.status_code == 201:
        print(f"✅ Board '{title}' created in workspace '{workspace_name}'.")
    else:
        print("❌ Status Code:", res.status_code)
        print("❌ Response:", res.text)

def delete_board(title):
    board = get_board_by_title(title)
    if not board:
        print(f"⚠️ Board '{title}' not found.")
        return
    res = requests.delete(f"{API_BASE}/boards/{board['id']}/", headers=HEADERS)
    print(f"🗑️ Board '{title}' deleted." if res.status_code == 204 else "❌ Failed to delete board.")

def list_boards():
    boards = get_boards()
    if boards:
        print("📋 Boards:")
        for b in boards:
            print(f" - {b['title']}")
    else:
        print("⚠️ No boards found.")

# --- Task Operations ---
def create_task(task_title, board_title, column_title):
    board = get_board_by_title(board_title)
    if not board:
        print(f"⚠️ Board '{board_title}' not found.")
        return
    column = get_column_by_title(board['id'], column_title)
    if not column:
        print(f"⚠️ Column '{column_title}' not found in board '{board_title}'.")
        return
    payload = {
        "title": task_title,
        "columnId": column["id"]
    }

    res = requests.post(f"{API_BASE}/tasks/", json=payload, headers=HEADERS)
    print(f"✅ Task '{task_title}' created." if res.status_code == 201 else f"❌ Failed: {res.text}")

def delete_task(task_title):
    tasks = get_tasks()
    task = next((t for t in tasks if t["title"].lower() == task_title.lower()), None)
    if not task:
        print(f"⚠️ Task '{task_title}' not found.")
        return
    res = requests.delete(f"{API_BASE}/tasks/{task['id']}/", headers=HEADERS)
    print(f"🗑️ Task '{task_title}' deleted." if res.status_code == 204 else "❌ Failed to delete task.")

def list_tasks(board_title):
    board = get_board_by_title(board_title)
    if not board:
        print(f"⚠️ Board '{board_title}' not found.")
        return
    columns = get_columns(board['id'])
    print(f"🧾 Tasks in '{board_title}':")
    for col in columns:
        print(f" 📂 Column: {col['title']}")
        res = requests.get(f"{API_BASE}/tasks/?columnId={col['id']}", headers=HEADERS)
        tasks = res.json() if res.status_code == 200 else []
        for task in tasks:
            print(f"   🔸 {task['title']}")

def create_column(column_title, board_title):
    board = get_board_by_title(board_title)
    if not board:
        print(f"⚠️ Board '{board_title}' not found.")
        return
    payload = {
        "title": column_title,
        "board": board["id"]
    }
    res = requests.post(f"{API_BASE}/columns/", json=payload, headers=HEADERS)
    print(f"✅ Column '{column_title}' created in board '{board_title}'." if res.status_code == 201 else f"❌ Failed: {res.text}")

def delete_column(column_title, board_title):
    board = get_board_by_title(board_title)
    if not board:
        print(f"⚠️ Board '{board_title}' not found.")
        return
    column = get_column_by_title(board["id"], column_title)
    if not column:
        print(f"⚠️ Column '{column_title}' not found in board '{board_title}'.")
        return
    res = requests.delete(f"{API_BASE}/columns/{column['id']}/", headers=HEADERS)
    print(f"🗑️ Column '{column_title}' deleted." if res.status_code == 204 else f"❌ Failed: {res.text}")

def rename_column(old_title, new_title, board_title):
    board = get_board_by_title(board_title)
    if not board:
        print(f"⚠️ Board '{board_title}' not found.")
        return
    column = get_column_by_title(board["id"], old_title)
    if not column:
        print(f"⚠️ Column '{old_title}' not found in board '{board_title}'.")
        return
    payload = {
        "title": new_title
    }
    res = requests.patch(f"{API_BASE}/columns/{column['id']}/", json=payload, headers=HEADERS)
    print(f"✏️ Column renamed to '{new_title}'." if res.status_code == 200 else f"❌ Failed: {res.text}")

def list_columns(board_title):
    board = get_board_by_title(board_title)
    if not board:
        print(f"⚠️ Board '{board_title}' not found.")
        return
    columns = get_columns(board['id'])
    if columns:
        print(f"📂 Columns in '{board_title}':")
        for col in columns:
            print(f" - {col['title']}")
    else:
        print("⚠️ No columns found.")


# --- Command Interpreter ---
def handle_command(command):
    command = command.strip()

    # ✅ Create board in workspace
    match = re.search(
        r"(?:create|make)\s+board\s+['\"](.+?)['\"]\s+(?:in\s+)?workspace\s+['\"](.+?)['\"]",
        command, re.IGNORECASE
    )
    if match:
        board_title = match.group(1).strip()
        workspace_name = match.group(2).strip()
        return create_board(board_title, workspace_name)

    # ✅ Delete board
    match = re.search(
        r"(?:delete|remove)\s+board\s+['\"](.+?)['\"]",
        command, re.IGNORECASE
    )
    if match:
        board_title = match.group(1).strip()
        return delete_board(board_title)

    # ✅ List boards
    if re.search(r"\b(list|show)\s+boards\b", command, re.IGNORECASE):
        return list_boards()

    # ✅ Create task
    match = re.search(
        r"(?:add|create)\s+task\s+['\"](.+?)['\"]\s+(?:in|to)\s+column\s+['\"](.+?)['\"]\s+(?:in\s+)?board\s+['\"](.+?)['\"]",
        command, re.IGNORECASE
    )
    if match:
        task_title = match.group(1).strip()
        column_title = match.group(2).strip()
        board_title = match.group(3).strip()
        return create_task(task_title, board_title, column_title)

    # ✅ Delete task
    match = re.search(
        r"(?:delete|remove)\s+task\s+['\"](.+?)['\"]",
        command, re.IGNORECASE
    )
    if match:
        task_title = match.group(1).strip()
        return delete_task(task_title)

    # ✅ List tasks
    match = re.search(
        r"(?:list|show)\s+tasks\s+(?:in\s+)?board\s+['\"](.+?)['\"]",
        command, re.IGNORECASE
    )
    if match:
        board_title = match.group(1).strip()
        return list_tasks(board_title)
    
        # ✅ Create column
    match = re.search(r"(?:create|add)\s+column\s+['\"](.+?)['\"]\s+in\s+board\s+['\"](.+?)['\"]", command, re.IGNORECASE)
    if match:
        column_title = match.group(1).strip()
        board_title = match.group(2).strip()
        return create_column(column_title, board_title)

    # ✅ Delete column
    match = re.search(r"(?:delete|remove)\s+column\s+['\"](.+?)['\"]\s+(?:from\s+)?board\s+['\"](.+?)['\"]", command, re.IGNORECASE)
    if match:
        column_title = match.group(1).strip()
        board_title = match.group(2).strip()
        return delete_column(column_title, board_title)

    # ✅ Rename column
    match = re.search(r"(?:rename|update)\s+column\s+['\"](.+?)['\"]\s+to\s+['\"](.+?)['\"]\s+in\s+board\s+['\"](.+?)['\"]", command, re.IGNORECASE)
    if match:
        old_title = match.group(1).strip()
        new_title = match.group(2).strip()
        board_title = match.group(3).strip()
        return rename_column(old_title, new_title, board_title)

    # ✅ List columns
    match = re.search(r"(?:list|show)\s+columns\s+(?:in\s+)?board\s+['\"](.+?)['\"]", command, re.IGNORECASE)
    if match:
        board_title = match.group(1).strip()
        return list_columns(board_title)


    # ❌ Unknown
    print("🤖 I only understand board and task related commands. Try things like:")
    print(" • create board 'Project X' in workspace 'ConnectDesk'")
    print(" • add task 'Design UI' to column 'To Do' in board 'Project X'")
    print(" • delete board 'Project X'")


# --- Run Bot ---
if __name__ == "__main__":
    print("🤖 Kanban ChatBot – Natural Command Parser (Boards + Tasks)")
    print("Type 'exit' to quit.\n")
    while True:
        try:
            user_input = input("You > ")
            if user_input.lower() in ["exit", "quit"]:
                break
            handle_command(user_input)
        except KeyboardInterrupt:
            print("\n👋 Exiting.")
            break
