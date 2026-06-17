import { useEffect, useState, useRef } from "react";
import {
    searchUsers,
    createChat,
    getMyChats,
    getMessages,
    sendMessage,
    getUnreadCounts
} from "../../services/chatService";

function getAvatarColor(name = "") {
    const colors = [
        ["#6366F1", "#4F46E5"], ["#8B5CF6", "#7C3AED"], ["#EC4899", "#DB2777"],
        ["#F59E0B", "#D97706"], ["#10B981", "#059669"], ["#3B82F6", "#2563EB"],
        ["#EF4444", "#DC2626"], ["#14B8A6", "#0D9488"],
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name = "", size = 36 }) {
    const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    const [from, to] = getAvatarColor(name);
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: size, height: size, borderRadius: "50%",
            background: `linear-gradient(135deg, ${from}, ${to})`,
            fontSize: size * 0.33, fontWeight: 700, color: "#fff",
            letterSpacing: "0.04em", flexShrink: 0,
            boxShadow: "0 0 0 2px rgba(99,102,241,0.18)",
        }}>
            {initials || "?"}
        </span>
    );
}

const ChatPage = () => {

    const [search, setSearch] =
        useState("");

    const [users, setUsers] =
        useState([]);

    const [chats, setChats] =
        useState([]);

    const [selectedChat, setSelectedChat] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [
        unreadCounts,
        setUnreadCounts
    ] = useState({});
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    useEffect(() => {

        loadChats();
        loadUnreadCounts();

    }, []);

    useEffect(() => {
        if (!selectedChat?._id) return;

        const interval = setInterval(() => {
            loadMessages(selectedChat._id);
        }, 2000);

        return () => clearInterval(interval);
    }, [selectedChat?._id]);

    const loadUnreadCounts =
        async () => {

            try {

                const data =
                    await getUnreadCounts();

                setUnreadCounts(
                    data.counts
                );

            } catch (error) {

                console.log(error);

            }
        };

    useEffect(() => {

        const interval =
            setInterval(() => {

                loadUnreadCounts();

            }, 5000);

        return () =>
            clearInterval(interval);

    }, []);

    const loadChats =
        async () => {

            const data =
                await getMyChats();

            setChats(
                data.chats
            );
        };

    useEffect(() => {

        if (search.length < 2) {

            setUsers([]);

            return;
        }

        searchUser();

    }, [search]);

    const searchUser =
        async () => {

            try {

                const data =
                    await searchUsers(search);

                setUsers(
                    data.users
                );

            } catch (error) {

                console.log(error);

            }
        };

    const startChat =
        async (userId) => {

            try {

                const data =
                    await createChat(
                        userId
                    );

                setSelectedChat(
                    data.chat
                );

                loadChats();

                loadMessages(
                    data.chat._id
                );

                setUsers([]);

                setSearch("");

            } catch (error) {

                console.log(error);

            }
        };

    const loadMessages =
        async (chatId) => {

            try {

                const data =
                    await getMessages(
                        chatId
                    );

                setMessages(
                    data.messages
                );

            } catch (error) {

                console.log(error);

            }
        };

    const handleSend = async () => {
        if (!message.trim()) return;

        try {

            const data = await sendMessage(
                selectedChat._id,
                message
            );

            setMessages(prev => [
                ...prev,
                {
                    ...data.message,
                    sender: {
                        _id: JSON.parse(
                            localStorage.getItem("user")
                        )._id
                    }
                }
            ]);

            setMessage("");

            loadChats(); // add this

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{
            display: "flex",
            height: "88vh",
            background: "#0D1421",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            fontFamily: "'Inter', system-ui, sans-serif",
        }}>

            {/* ── LEFT PANEL ── */}
            <div style={{
                width: 300,
                minWidth: 220,
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background: "#111827",
            }}>

                {/* Panel header */}
                <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                        Messages
                    </div>

                    {/* Search */}
                    <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#475569", pointerEvents: "none" }}>🔍</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search User..."
                            style={{
                                width: "100%", padding: "9px 12px 9px 32px", borderRadius: 10,
                                background: "#0D1421", color: "#E2E8F0",
                                border: "1px solid rgba(255,255,255,0.08)", fontSize: 13,
                                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                                transition: "border-color 0.15s, box-shadow 0.15s",
                            }}
                            onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                        />
                    </div>
                </div>

                {/* Scrollable list */}
                <div style={{ flex: 1, overflowY: "auto" }}>

                    {/* Search Results */}
                    {users.length > 0 && (
                        <div>
                            <div style={{ padding: "8px 16px 4px", fontSize: 10.5, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                People
                            </div>
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => startChat(user._id)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "10px 16px", cursor: "pointer",
                                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.1)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <Avatar name={user.fullName} size={36} />
                                    <div>
                                        <div style={{ color: "#E2E8F0", fontWeight: 600, fontSize: 13.5 }}>
                                            {user.fullName}
                                        </div>
                                        <div style={{ color: "#475569", fontSize: 11.5 }}>
                                            {user.company?.name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                        </div>
                    )}

                    {/* Existing Chats */}
                    {chats.length > 0 && (
                        <div>
                            <div style={{ padding: "8px 16px 4px", fontSize: 10.5, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                Recent
                            </div>
                            {chats.map((chat) => {
                                const currentUser = JSON.parse(
                                    localStorage.getItem("user")
                                );

                                const otherUser = chat.users.find(
                                    (u) => u._id !== currentUser._id
                                );

                                const isActive = selectedChat?._id === chat._id;

                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => {
                                            setSelectedChat(chat);
                                            loadMessages(chat._id);
                                        }}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            padding: "10px 16px", cursor: "pointer",
                                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                                            background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                                            borderLeft: isActive ? "3px solid #6366F1" : "3px solid transparent",
                                            transition: "all 0.15s",
                                        }}
                                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(99,102,241,0.07)"; }}
                                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                                    >
                                        <Avatar name={otherUser?.fullName || ""} size={36} />
                                        <div
                                            style={{
                                                minWidth: 0,
                                                flex: 1
                                            }}
                                        >
                                            <div style={{ color: isActive ? "#F1F5F9" : "#CBD5E1", fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {otherUser?.fullName}
                                            </div>
                                            <div style={{ color: "#475569", fontSize: 11.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {otherUser?.company?.name}
                                            </div>
                                            {
                                                unreadCounts[chat._id] > 0 && (
                                                    <span
                                                        style={{
                                                            background: "#EF4444",
                                                            color: "#fff",
                                                            fontSize: "11px",
                                                            fontWeight: "700",
                                                            borderRadius: "999px",
                                                            minWidth: "20px",
                                                            height: "20px",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            padding: "0 6px",
                                                            marginTop: "4px"
                                                        }}
                                                    >
                                                        {unreadCounts[chat._id]}
                                                    </span>
                                                )
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {chats.length === 0 && users.length === 0 && (
                        <div style={{ padding: "40px 16px", textAlign: "center", color: "#475569", fontSize: 13 }}>
                            Search to start a conversation
                        </div>
                    )}
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div style={{
                            padding: "14px 20px",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            background: "#0D1421",
                            display: "flex", alignItems: "center", gap: 12,
                        }}>
                            {(() => {
                                const currentUser = JSON.parse(localStorage.getItem("user"));
                                const other = selectedChat.users.find(u => u._id !== currentUser._id);
                                return (
                                    <>
                                        <Avatar name={other?.fullName || ""} size={38} />
                                        <div>
                                            <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>
                                                {other?.fullName}
                                            </div>
                                            {other?.company?.name && (
                                                <div style={{ color: "#475569", fontSize: 12 }}>
                                                    {other.company.name}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
                            {messages.length === 0 ? (
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#475569" }}>
                                    <span style={{ fontSize: 32 }}>💬</span>
                                    <span style={{ fontSize: 13 }}>No messages yet — say hello!</span>
                                </div>
                            ) : messages.map((msg) => {
                                const currentUser = JSON.parse(localStorage.getItem("user"));
                                const isMine = msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id;
                                return (
                                    <div
                                        key={msg._id}
                                        style={{
                                            display: "flex",
                                            justifyContent: isMine ? "flex-end" : "flex-start",
                                            alignItems: "flex-end",
                                            gap: 8,
                                        }}
                                    >
                                        {!isMine && (() => {
                                            const cu = JSON.parse(localStorage.getItem("user"));
                                            const other = selectedChat.users.find(u => u._id !== cu._id);
                                            return <Avatar name={other?.fullName || ""} size={26} />;
                                        })()}
                                        <div
                                            style={{
                                                maxWidth: "68%",
                                                padding: "10px 14px",
                                                borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                                background: isMine
                                                    ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                                                    : "rgba(255,255,255,0.06)",
                                                color: isMine ? "#fff" : "#E2E8F0",
                                                fontSize: 14,
                                                lineHeight: 1.55,
                                                boxShadow: isMine ? "0 2px 12px rgba(99,102,241,0.3)" : "none",
                                                border: isMine ? "none" : "1px solid rgba(255,255,255,0.08)",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Send Box */}
                        <div style={{
                            display: "flex", gap: 10, padding: "12px 16px",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                            background: "#0D1421", alignItems: "center",
                        }}>
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type message..."
                                style={{
                                    flex: 1, padding: "11px 14px", borderRadius: 12,
                                    background: "rgba(255,255,255,0.05)", color: "#E2E8F0",
                                    border: "1px solid rgba(255,255,255,0.08)", fontSize: 14,
                                    outline: "none", fontFamily: "inherit",
                                    transition: "border-color 0.15s, box-shadow 0.15s",
                                }}
                                onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    padding: "11px 22px", borderRadius: 12, border: "none",
                                    background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                                    color: "#fff", fontSize: 14, fontWeight: 700,
                                    cursor: "pointer", letterSpacing: "0.01em", flexShrink: 0,
                                    boxShadow: "0 0 16px rgba(99,102,241,0.35)",
                                    transition: "opacity 0.15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                            >
                                Send ↑
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{
                        flex: 1, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        gap: 14, color: "#475569",
                    }}>
                        <span style={{
                            width: 64, height: 64, borderRadius: 18,
                            background: "rgba(99,102,241,0.1)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
                        }}>
                            💬
                        </span>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: 4 }}>Your messages</div>
                            <div style={{ fontSize: 13 }}>Select a chat to start messaging</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};

export default ChatPage;