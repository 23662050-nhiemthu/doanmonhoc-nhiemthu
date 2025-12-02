import React, { useState, useRef, useEffect } from "react";

// --- CẤU HÌNH API ---
const API_KEY = "AIzaSyDshoKE8b2MExmXQ1RjkwdIPoxeUKq3CTw";
const MODEL_NAME = "gemini-1.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// ✅ SỬA LỖI 1: Thêm 'loading' vào các kiểu dữ liệu hợp lệ cho role
interface Message {
  role: "user" | "bot" | "loading"; // Thêm "loading"
  text: string;
}

// Hàm chuyển đổi format tin nhắn của React sang format Content của Gemini API
const formatMessagesForGemini = (messages: Message[]) => {
  return (
    messages
      // Giữ lại logic lọc tin nhắn loading để không gửi nó lên API
      .filter((msg) => msg.role !== "loading")
      .map((msg) => ({
        // Gemini dùng 'model' thay vì 'bot' cho phản hồi của AI
        role: msg.role === "bot" ? "model" : "user",
        parts: [{ text: msg.text }],
      }))
  );
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Xin chào! Tôi là trợ lý ảo AI. Tôi có thể giúp gì cho bạn?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- LOGIC GỌI API GEMINI (Đã cải tiến để gửi toàn bộ lịch sử) ---
  const sendMessageToGemini = async (currentMessages: Message[]) => {
    try {
      const historyContents = formatMessagesForGemini(currentMessages);

      const payload = {
        contents: historyContents,
        config: {
          temperature: 0.7,
        },
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `Lỗi API: ${response.status} - ${
            errorBody.error.message || response.statusText
          }`
        );
      }

      const data = await response.json();

      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi.";
      return botReply;

      // ✅ SỬA LỖI 2: Sử dụng instanceof hoặc kiểm tra typeof để xử lý lỗi
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Lỗi không xác định.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = (error as any).message;
      } else {
        errorMessage = String(error);
      }
      return `❌ Xin lỗi, tôi đang gặp sự cố kết nối hoặc API. Chi tiết lỗi: ${errorMessage}`;
    }
  };

  // --- XỬ LÝ KHI NGƯỜI DÙNG GỬI TIN ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");
    setIsLoading(true);

    const userMessage: Message = { role: "user", text: userText };
    // 1. Tạo lịch sử mới: Thêm tin nhắn người dùng vào list
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // 2. Thêm tin nhắn Loading tạm thời vào UI (dù isLoading đã có)
    setMessages((prev) => [
      ...prev,
      { role: "loading", text: "Đang suy nghĩ..." },
    ]);

    // 3. Gọi API với TOÀN BỘ lịch sử tin nhắn mới
    const botResponse = await sendMessageToGemini(newMessages);

    // 4. Xóa tin nhắn Loading và thêm tin nhắn Bot vào list
    setMessages((prev) => {
      const filteredPrev = prev.filter((msg) => msg.role !== "loading");
      return [...filteredPrev, { role: "bot", text: botResponse }];
    });
    setIsLoading(false);
  };

  // Xử lý khi nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // --- GIAO DIỆN (UI) ---
  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {/* Header */}
        <div style={styles.header}>
          <h3>🤖 Chatbot Gemini AI</h3>
        </div>

        {/* Khu vực hiển thị tin nhắn */}
        <div style={styles.messageList}>
          {messages
            // Lọc tin nhắn "loading" tạm thời ra khỏi UI map để tránh bị lặp
            .filter((msg) => msg.role !== "loading")
            .map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageRow,
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.bubble,
                    backgroundColor:
                      msg.role === "user" ? "#007bff" : "#e9ecef",
                    color: msg.role === "user" ? "#fff" : "#000",
                  }}
                >
                  {/* Xử lý xuống dòng cho text */}
                  {msg.text.split("\n").map((line, i) => (
                    <p key={i} style={{ margin: 0, minHeight: "1em" }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

          {/* ✅ DÙNG isLoading để hiển thị trạng thái "Đang suy nghĩ..." */}
          {isLoading && (
            <div style={styles.messageRow}>
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor: "#e9ecef",
                  fontStyle: "italic",
                  color: "#666",
                  justifySelf: "flex-start",
                }}
              >
                Đang suy nghĩ...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Khu vực nhập liệu */}
        <div style={styles.inputArea}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            disabled={isLoading}
          />
          <button
            style={{
              ...styles.sendButton,
              backgroundColor: isLoading ? "#ccc" : "#007bff",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onClick={handleSend}
            disabled={isLoading}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

// --- STYLES (CSS-in-JS) ---
const styles = {
  // ... (Giữ nguyên phần Styles của bạn)
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 100px)", // Trừ đi header của Layout
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  chatBox: {
    width: "100%",
    maxWidth: "600px",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column" as "column",
    overflow: "hidden",
  },
  header: {
    padding: "16px",
    backgroundColor: "#2196F3",
    color: "white",
    textAlign: "center" as "center",
    borderBottom: "1px solid #ddd",
  },
  messageList: {
    flex: 1,
    padding: "20px",
    overflowY: "auto" as "auto",
    display: "flex",
    flexDirection: "column" as "column",
    gap: "10px",
  },
  messageRow: {
    display: "flex",
    width: "100%",
  },
  bubble: {
    maxWidth: "75%",
    padding: "10px 15px",
    borderRadius: "15px",
    fontSize: "15px",
    lineHeight: "1.4",
    wordWrap: "break-word" as "break-word",
  },
  inputArea: {
    padding: "15px",
    borderTop: "1px solid #eee",
    display: "flex",
    gap: "10px",
    backgroundColor: "#fafafa",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "16px",
  },
  sendButton: {
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "background 0.2s",
  },
};

export default ChatPage;
