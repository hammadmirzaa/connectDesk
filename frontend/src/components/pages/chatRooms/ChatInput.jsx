import React, { useRef, useState } from "react";
import { Smile, Paperclip, Send } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  setFile,
  file,
}) {
  const fileInputRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);

  // File handler
  const handlePaperclipClick = () => {
    fileInputRef.current.click();
  };

  // Emoji select
  const handleEmojiSelect = (emoji) => {
    setInput((prev) => prev + emoji.native);
    setShowEmoji(false);
  };

  

  return (
    <div className="relative">
      {/* Preview above the form */}
      {file && (
        <div className="flex justify-end  px-8 bg-[#fafcff] ">
          <div className="relative inline-block">
            {file.type.startsWith("image/") ? (
              <>
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-28 h-28 object-cover rounded border"
                />
                {/* Cross button */}
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center shadow"
                  style={{ fontWeight: "bold", fontSize: "1rem" }}
                  onClick={() => setFile(null)}
                  title="Remove"
                >
                  &times;
                </button>
              </>
            ) : (
              <div className="bg-gray-200 px-3 py-2 rounded text-sm relative">
                {file.name}
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center shadow"
                  style={{ fontWeight: "bold", fontSize: "1rem" }}
                  onClick={() => setFile(null)}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <form
        className="flex items-center gap-2 px-8 py-5 bg-white border-t border-gray-200"
        onSubmit={sendMessage}
      >
        {/* Emoji button */}
        <button
          type="button"
          className="p-2 hover:bg-blue-50 rounded"
          onClick={() => setShowEmoji((prev) => !prev)}
        >
          <Smile className="text-blue-500" />
        </button>
        {/* Emoji picker dropdown */}
        {showEmoji && (
          <div className="absolute bottom-16 left-4 z-50">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="light"
            />
          </div>
        )}

        {/* Paperclip & file upload */}
        <button
          type="button"
          className="p-2 hover:bg-blue-50 rounded"
          onClick={handlePaperclipClick}
        >
          <Paperclip className="text-blue-500" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 p-3 rounded-lg bg-[#f3f5f9] outline-none text-sm"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
