# chatbot/views.py

import os
import json
import random
import logging
import requests

from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import cohere
import json
import logging
import re
import demjson3


# Set up logging
logger = logging.getLogger(__name__)


WALLPAPERS = [
    "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1612831455544-bb7f0c530e84?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1618005198919-d3d4e5a8f94c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1616627985843-4cdb7f31c5e9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1616401786637-1d6d9c7c4d14?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1604152135912-04a693e20f04?auto=format&fit=crop&w=1600&q=80",
]

API_BASE = settings.API_BASE


def extract_json_from_text(text):
        # Extract the first {...} JSON object from text
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            return match.group(0)
        return None

def auto_fix_json(json_str):
        # Remove trailing commas before } or ]
        json_str = re.sub(r',(\s*[\}\]])', r'\1', json_str)
        # Ensure keys have double quotes (naive, but helps for simple mistakes)
        json_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', json_str)
        return json_str

class ChatbotService:
    def __init__(self, token):
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    def clean_text(self, text):
        return text.strip().strip('"').strip("'").strip()

    # ------- API integrations -------

    def get_workspaces(self):
        try:
            res = requests.get(f"{API_BASE}/workspaces/", headers=self.headers)
            return res.json() if res.status_code == 200 else []
        except Exception as e:
            logger.error(f"Error getting workspaces: {e}")
            return []

    def get_workspace_id_by_name(self, name):
        workspaces = self.get_workspaces()
        for ws in workspaces:
            if ws["name"].lower() == name.lower():
                return ws["id"]
        return None

    def get_boards(self):
        try:
            res = requests.get(f"{API_BASE}/boards/", headers=self.headers)
            return res.json() if res.status_code == 200 else []
        except Exception as e:
            logger.error(f"Error getting boards: {e}")
            return []

    def get_board_by_title(self, title):
        boards = self.get_boards()
        return next((b for b in boards if b["title"].lower() == title.lower()), None)

    def get_columns(self, board_id):
        try:
            res = requests.get(f"{API_BASE}/columns/?board={board_id}", headers=self.headers)
            return res.json() if res.status_code == 200 else []
        except Exception as e:
            logger.error(f"Error getting columns: {e}")
            return []

    def get_column_by_title(self, board_id, column_title):
        columns = self.get_columns(board_id)
        return next((c for c in columns if c["title"].lower() == column_title.lower()), None)

    def get_tasks(self):
        try:
            res = requests.get(f"{API_BASE}/tasks/", headers=self.headers)
            return res.json() if res.status_code == 200 else []
        except Exception as e:
            logger.error(f"Error getting tasks: {e}")
            return []

    def create_board(self, title, workspace_name):
        workspace_id = self.get_workspace_id_by_name(workspace_name)
        if not workspace_id:
            return {"success": False, "message": f"Workspace '{workspace_name}' not found."}

        random_wallpaper = random.choice(WALLPAPERS)
        payload = {
            "title": title,
            "workspace": workspace_id,
            "background_image": random_wallpaper,
        }

        try:
            res = requests.post(f"{API_BASE}/boards/", json=payload, headers=self.headers)
            if res.status_code == 201:
                return {"success": True, "message": f"Board '{title}' created successfully in workspace '{workspace_name}'."}
            else:
                return {"success": False, "message": f"Failed to create board. Status: {res.status_code}"}
        except Exception as e:
            return {"success": False, "message": f"Error creating board: {str(e)}"}

    def delete_board(self, title):
        board = self.get_board_by_title(title)
        if not board:
            return {"success": False, "message": f"Board '{title}' not found."}

        try:
            res = requests.delete(f"{API_BASE}/boards/{board['id']}/", headers=self.headers)
            if res.status_code == 204:
                return {"success": True, "message": f"Board '{title}' deleted successfully."}
            else:
                return {"success": False, "message": "Failed to delete board."}
        except Exception as e:
            return {"success": False, "message": f"Error deleting board: {str(e)}"}

    def list_boards(self):
        boards = self.get_boards()
        if boards:
            board_list = "\n".join([f"• {b['title']}" for b in boards])
            return {"success": True, "message": f"Your Boards:\n{board_list}"}
        else:
            return {"success": True, "message": "No boards found."}

    def create_task(self, task_title, board_title, column_title):
        board = self.get_board_by_title(board_title)
        if not board:
            return {"success": False, "message": f"Board '{board_title}' not found."}

        column = self.get_column_by_title(board['id'], column_title)
        if not column:
            return {"success": False, "message": f"Column '{column_title}' not found in board '{board_title}'."}

        payload = {
            "title": task_title,
            "columnId": column["id"]
        }

        try:
            res = requests.post(f"{API_BASE}/tasks/", json=payload, headers=self.headers)
            if res.status_code == 201:
                return {"success": True, "message": f"Task '{task_title}' created successfully in '{column_title}' column."}
            else:
                return {"success": False, "message": f"Failed to create task. Status: {res.status_code}"}
        except Exception as e:
            return {"success": False, "message": f"Error creating task: {str(e)}"}

    def delete_task(self, task_title):
        tasks = self.get_tasks()
        task = next((t for t in tasks if t["title"].lower() == task_title.lower()), None)
        if not task:
            return {"success": False, "message": f"Task '{task_title}' not found."}

        try:
            res = requests.delete(f"{API_BASE}/tasks/{task['id']}/", headers=self.headers)
            if res.status_code == 204:
                return {"success": True, "message": f"Task '{task_title}' deleted successfully."}
            else:
                return {"success": False, "message": "Failed to delete task."}
        except Exception as e:
            return {"success": False, "message": f"Error deleting task: {str(e)}"}

    def create_column(self, column_title, board_title):
        board = self.get_board_by_title(board_title)
        if not board:
            return {"success": False, "message": f"Board '{board_title}' not found."}

        payload = {
            "title": column_title,
            "board": board["id"]
        }

        try:
            res = requests.post(f"{API_BASE}/columns/", json=payload, headers=self.headers)
            if res.status_code == 201:
                return {"success": True, "message": f"Column '{column_title}' created successfully in board '{board_title}'."}
            else:
                return {"success": False, "message": f"Failed to create column. Status: {res.status_code}"}
        except Exception as e:
            return {"success": False, "message": f"Error creating column: {str(e)}"}

    def list_tasks(self, board_title):
        board = self.get_board_by_title(board_title)
        if not board:
            return {"success": False, "message": f"Board '{board_title}' not found."}

        columns = self.get_columns(board['id'])
        if not columns:
            return {"success": True, "message": f"Board '{board_title}' has no columns yet."}

        result = f"Tasks in {board_title}:\n"
        for col in columns:
            result += f"\n{col['title']}:\n"
            try:
                res = requests.get(f"{API_BASE}/tasks/?columnId={col['id']}", headers=self.headers)
                tasks = res.json() if res.status_code == 200 else []
                if tasks:
                    for task in tasks:
                        result += f"  • {task['title']}\n"
                else:
                    result += "  (No tasks)\n"
            except Exception as e:
                result += f"  Error loading tasks: {str(e)}\n"

        return {"success": True, "message": result}

    def list_columns(self, board_title):
        board = self.get_board_by_title(board_title)
        if not board:
            return {"success": False, "message": f"Board '{board_title}' not found."}

        columns = self.get_columns(board['id'])
        if columns:
            column_list = "\n".join([f"• {col['title']}" for col in columns])
            return {"success": True, "message": f"Columns in {board_title}:\n{column_list}"}
        else:
            return {"success": True, "message": f"No columns found in board '{board_title}'."}

    # ------- OpenAI-powered understanding and suggestion --------



    def extract_json_from_text(text):
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            return match.group(0)
        return None


    def ai_understand_message(self, message):
        co = cohere.Client(settings.COHERE_API_KEY)
        system_prompt = (
            "You are a helpful assistant for a workspace management app like Trello. "
            "Understand the user's intent based on their input. "
            "Possible actions: create/list/delete board, create/list/delete column, create/list/delete task. "
            "If a name or info is missing, suggest 3 creative names for that entity. "
            "Respond ONLY in strict valid JSON, nothing else. "
            "Do NOT add any commentary, just return the JSON object. "
            'Example output: {"intent": "create_board", "params": {"board_title": "Project X", "workspace_name": "Marketing"}, "suggestions": [], "message": ""}'
        )
        full_prompt = (
            f"{system_prompt}\n\n"
            f"User input: {message}\n"
            f"JSON output:"
        )
        try:
            response = co.generate(
                model='command',
                prompt=full_prompt,
                max_tokens=350,
                temperature=0.7,
                stop_sequences=["\n\n"]
            )
            content = response.generations[0].text.strip()
            json_str = extract_json_from_text(content.replace("'", '"'))
            if not json_str:
                raise ValueError("No JSON found in LLM output")
            try:
                return json.loads(json_str)
            except Exception:
                try:
                    return demjson3.decode(json_str)
                except Exception:
                    json_str_fixed = auto_fix_json(json_str)
                    return json.loads(json_str_fixed)
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.error(f"Cohere API/parse error: {e}")
            return {
                "intent": "unknown",
                "params": {},
                "suggestions": [],
                "message": "Sorry, I couldn't understand that. Try rephrasing."
            }



    def handle_command(self, command):
        logger.info(f"AI parsing command: {command}")
        small_talk_triggers = ["hi", "hello", "hey", "salam", "how are you", "what's up"]
        if any(command.lower().strip().startswith(greet) for greet in small_talk_triggers):
            try:
                co = cohere.Client('tCYz6qQrYbHADcOxrlUqx9QZlxtmWQ4JOdl1N673')
                response = co.generate(
                    model='command',
                    prompt=f"You are a friendly chatbot assistant. Respond to this casually and kindly: {command}",
                    max_tokens=50,
                    temperature=0.8,
                    stop_sequences=["\n"]
                )
                return {
                    "success": True,
                    "message": response.generations[0].text.strip()
                }
            except Exception as e:
                logger.error(f"Greeting fallback error: {e}")
                return {
                    "success": True,
                    "message": "Hello! 😊 How can I assist you today?"
                }
        ai_response = self.ai_understand_message(command)
        intent = ai_response.get("intent")
        params = ai_response.get("params", {})
        suggestions = ai_response.get("suggestions", [])
        ai_message = ai_response.get("message", "")

        # Mapping intent to backend logic
        if intent == "create_board":
            board_title = params.get("board_title")
            workspace_name = params.get("workspace_name")
            if not board_title and suggestions:
                return {"success": False, "message": f"Please provide a board name. Suggestions: {', '.join(suggestions)}"}
            if not workspace_name:
                return {"success": False, "message": "Please specify a workspace for the board."}
            return self.create_board(board_title, workspace_name)

        if intent == "delete_board":
            board_title = params.get("board_title")
            if not board_title and suggestions:
                return {"success": False, "message": f"Which board do you want to delete? Suggestions: {', '.join(suggestions)}"}
            return self.delete_board(board_title)

        if intent == "add_task" or intent == "create_task":
            task_title = params.get("task_title")
            column_title = params.get("column_title")
            board_title = params.get("board_title")
            missing = []
            if not task_title: missing.append("task title")
            if not column_title: missing.append("column")
            if not board_title: missing.append("board")
            if missing:
                msg = f"Missing info: {', '.join(missing)}."
                if suggestions:
                    msg += f" Suggestions: {', '.join(suggestions)}"
                return {"success": False, "message": msg}
            return self.create_task(task_title, board_title, column_title)

        if intent == "delete_task":
            task_title = params.get("task_title")
            if not task_title and suggestions:
                return {"success": False, "message": f"Which task do you want to delete? Suggestions: {', '.join(suggestions)}"}
            return self.delete_task(task_title)

        if intent == "create_column":
            column_title = params.get("column_title")
            board_title = params.get("board_title")
            if not column_title and suggestions:
                return {"success": False, "message": f"Please provide a column name. Suggestions: {', '.join(suggestions)}"}
            if not board_title:
                return {"success": False, "message": "Please specify a board for the column."}
            return self.create_column(column_title, board_title)

        if intent == "list_boards":
            return self.list_boards()
        if intent == "list_columns":
            board_title = params.get("board_title")
            if not board_title:
                return {"success": False, "message": "Please specify which board."}
            return self.list_columns(board_title)
        if intent == "list_tasks":
            board_title = params.get("board_title")
            if not board_title:
                return {"success": False, "message": "Please specify which board."}
            return self.list_tasks(board_title)

        # Unknown/ambiguous intent fallback
        return {
            "success": True,
            "message": ai_message or """I can help you manage your workspace! Try commands like:
- list boards
- create board Project X in workspace ConnectDesk
- delete board Project X
- add task Fix login to column To Do in board Project X
- create column Review in board Project X
(Just use simple language!)"""
        }


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot_message(request):
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip()

        if not message:
            return Response({
                "success": False,
                "response": "Please provide a message."
            }, status=400)

        # Get user's token
        token = None
        if hasattr(request.auth, 'access_token'):
            token = request.auth.token
        elif hasattr(request.auth, 'key'):
            token = request.auth.key
        else:
            token = str(request.auth)

        logger.info(f"Processing message: {message}")

        chatbot = ChatbotService(token)
        result = chatbot.handle_command(message)

        return Response({
            "success": True,
            "response": result["message"],
            "command_success": result["success"]
        })

    except Exception as e:
        logger.error(f"Error in chatbot_message: {str(e)}")
        return Response({
            "success": False,
            "response": f"An error occurred: {str(e)}"
        }, status=500)
