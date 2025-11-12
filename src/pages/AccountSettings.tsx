import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { useIsMobile } from "../hooks/use-mobile";
import { useToast } from "../hooks/use-toast";
import { User, Trash2, Camera, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CurrentUser = {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
};

function readCurrentUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCurrentUser(u: CurrentUser | null) {
  if (!u) {
    localStorage.removeItem("currentUser");
  } else {
    localStorage.setItem("currentUser", JSON.stringify(u));
  }
}

// === NEW helpers for persistent user store and image handling ===
function readUsers(): CurrentUser[] {
  try {
    const raw = localStorage.getItem("users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeUsers(users: CurrentUser[]) {
  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch {
    // ignore
  }
}
function upsertUser(user: CurrentUser) {
  if (!user || !user.email) return;
  const users = readUsers();
  const idx = users.findIndex((u) => String(u.email).toLowerCase() === String(user.email).toLowerCase());
  if (idx === -1) {
    users.push(user);
  } else {
    users[idx] = { ...users[idx], ...user };
  }
  writeUsers(users);
}
// convert File -> data URL so avatar survives across reloads/logins
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

const DeleteAccountModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(2,6,23,0.6)",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: "#fff",
          borderRadius: 12,
          padding: 22,
          boxShadow: "0 12px 40px rgba(2,6,23,0.2)",
          position: "relative",
        }}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          <X />
        </button>

        <h2 style={{ margin: "4px 0 10px", fontSize: 20, color: "#0f172a", fontWeight: 700 }}>
          Delete Account
        </h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
          Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              background: "#eef2f7",
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              background: "#dc2626",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(220,38,38,0.24)",
            }}
          >
            Yes, Delete It
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AccountSettings(): JSX.Element {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = React.useState<"profile" | "delete">("profile");
  const [user, setUser] = React.useState<CurrentUser>(() => readCurrentUser() ?? { name: "User", email: "", role: "owner", avatar: "" });

  const [name, setName] = React.useState(user.name ?? "");
  const [email] = React.useState(user.email ?? "");
  const [avatarUrl, setAvatarUrl] = React.useState(
    user.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name ?? "User")}`
  );

  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  React.useEffect(() => {
    const cur = readCurrentUser();
    if (cur) {
      setUser(cur);
      setName(cur.name ?? "");
      setAvatarUrl(cur.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cur.name ?? "User")}`);
    }
  }, []);

  // Save handler: persist to localStorage, show toast and redirect to Interface
  const handleSave = async () => {
    // ensure we keep email (cannot change email here)
    const updated: CurrentUser = {
      ...user,
      name: name.trim(),
      avatar: avatarUrl,
    };

    try {
      // persist current user (active session)
      saveCurrentUser(updated);

      // also persist in central users store so re-login picks up changes
      // (if user.email missing, we only update currentUser)
      if (updated.email) {
        upsertUser(updated);
      }

      // notify other tabs/windows
      try {
        localStorage.setItem("currentUser_last_update", String(Date.now()));
      } catch {
        // ignore
      }

      // show toast (use provided toast helper)
      toast({ title: "Saved", description: "Account details updated." });

      // short delay so user sees toast, then redirect to interface
      setTimeout(() => {
        navigate("/interface");
      }, 500);
    } catch (err) {
      console.error("Failed to save account settings", err);
      toast({ title: "Error", description: "Failed to save account details." });
    }
  };

  const handleUploadAvatar = async (file?: File) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      // save in component state (data URL persists)
      setAvatarUrl(dataUrl);
    } catch (err) {
      console.error("Failed to read avatar", err);
      toast({ title: "Error", description: "Failed to read image file." });
    }
  };

  const handleDeleteAccount = () => {
    const cu = readCurrentUser();
    const ownerEmail = cu?.email ?? "";

    // 1) Remove boardinghouses owned by this user
    try {
      const raw = localStorage.getItem("boardinghouses");
      if (raw) {
        const list = JSON.parse(raw) as any[];
        const remaining = list.filter((b) => String(b.ownerEmail ?? "").toLowerCase() !== String(ownerEmail).toLowerCase());
        localStorage.setItem("boardinghouses", JSON.stringify(remaining));
      }
    } catch (err) {
      console.error("Failed to remove boardinghouses for deleted account", err);
    }

    // 2) Remove profile entry from "users" store
    if (ownerEmail) {
      try {
        const users = readUsers().filter((u) => String(u.email ?? "").toLowerCase() !== String(ownerEmail).toLowerCase());
        writeUsers(users);
      } catch (err) {
        console.error("Failed to remove user from users store", err);
      }

      // 3) Remove credential from registeredUsers so login is prevented
      try {
        const regRaw = localStorage.getItem("registeredUsers");
        if (regRaw) {
          const regs = JSON.parse(regRaw) as any[];
          const remainingRegs = regs.filter((r) => String(r.email ?? "").toLowerCase() !== String(ownerEmail).toLowerCase());
          localStorage.setItem("registeredUsers", JSON.stringify(remainingRegs));
        }
      } catch (err) {
        console.error("Failed to remove credential from registeredUsers", err);
      }
    }

    // 4) Clear session and notify other tabs
    saveCurrentUser(null);
    try {
      localStorage.setItem("currentUser_last_update", String(Date.now()));
    } catch {}

    // 5) Optionally remove remembered email
    try {
      const remembered = localStorage.getItem("rememberedEmail");
      if (remembered && (remembered ?? "").toLowerCase() === ownerEmail.toLowerCase()) {
        localStorage.removeItem("rememberedEmail");
      }
    } catch {}

    toast({ title: "Account deleted", description: "Your account and listings have been removed." });
    navigate("/auth");
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div
        className="main-content"
        style={{
          marginLeft: isMobile ? undefined : 260,
          minHeight: "100vh",
          padding: 28,
          background: "linear-gradient(#f0fdfb, #f8feff)",
        }}
      >
        <h1 style={{ fontSize: 36, marginBottom: 18 }}>Account Settings</h1>

        <div style={{ width: "100%", maxWidth: 980 }}>
          <div style={{ background: "white", borderRadius: 12, padding: 18, boxShadow: "0 8px 30px rgba(2,6,23,0.06)" }}>
            {/* Tabs - rearranged so indicator sits below the tab text */}
            <div style={{ display: "flex", gap: 24, alignItems: "flex-end", borderBottom: "1px solid #e6eef2", paddingBottom: 12 }}>
              <button
                onClick={() => setActiveTab("profile")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <User style={{ color: activeTab === "profile" ? "#1e40af" : "#6b7280" }} />
                  <span style={{ color: activeTab === "profile" ? "#1e40af" : "#374151", fontWeight: 600 }}>Profile</span>
                </div>
                <div
                  aria-hidden
                  style={{
                    height: 3,
                    background: activeTab === "profile" ? "#1e40af" : "transparent",
                    width: 120,
                    borderRadius: 6,
                    marginTop: 6,
                    transition: "background 200ms ease, width 200ms ease",
                  }}
                />
              </button>

              <button
                onClick={() => setActiveTab("delete")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Trash2 style={{ color: activeTab === "delete" ? "#b91c1c" : "#6b7280" }} />
                  <span style={{ color: activeTab === "delete" ? "#b91c1c" : "#374151", fontWeight: 600 }}>Delete Account</span>
                </div>
                <div
                  aria-hidden
                  style={{
                    height: 3,
                    background: activeTab === "delete" ? "#ef4444" : "transparent",
                    width: 140,
                    borderRadius: 6,
                    marginTop: 6,
                    transition: "background 200ms ease, width 200ms ease",
                  }}
                />
              </button>
            </div>

            <div style={{ padding: "22px 6px" }}>
              {activeTab === "profile" ? (
                <div>
                  {/* Profile top */}
                  <div style={{ display: "flex", gap: 20, alignItems: "center", paddingBottom: 18 }}>
                    <div
                      style={{
                        position: "relative",
                        width: 96,
                        height: 96,
                        borderRadius: "50%",
                        overflow: "hidden",
                        boxShadow: "0 6px 20px rgba(2,6,23,0.08)",
                      }}
                    >
                      <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <label style={{ position: "absolute", right: 6, bottom: 6 }}>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUploadAvatar(f);
                          }}
                        />
                        <div
                          style={{
                            background: "#2563eb",
                            color: "white",
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 6px 14px rgba(37,99,235,0.18)",
                          }}
                        >
                          <Camera size={16} />
                        </div>
                      </label>
                    </div>

                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{user.name ?? "User"}</div>
                      <div style={{ color: "#6b7280", marginTop: 4 }}>
                        {user.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account` : "Owner Account"}
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: "none", borderTop: "1px solid #eef2f7", margin: "12px 0 18px" }} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", marginBottom: 6, color: "#374151", fontSize: 13 }}>Full Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e6eef2", background: "white" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: 6, color: "#374151", fontSize: 13 }}>Email Address</label>
                      <input
                        value={email}
                        disabled
                        type="text"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e6eef2", background: "#f8fafc", color: "#6b7280" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                    <button
                      onClick={handleSave}
                      style={{
                        background: "linear-gradient(90deg,#0f172a,#0b1222)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: 999,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 8px 30px rgba(2,6,23,0.18)",
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ background: "#fff7f7", border: "1px solid #f1c0c0", borderRadius: 8, padding: 18 }}>
                    <h3 style={{ margin: "0 0 8px", color: "#b91c1c", fontWeight: 700 }}>Danger Zone</h3>
                    <p style={{ margin: 0, color: "#9a1a1a", lineHeight: 1.5 }}>
                      Deleting your account is permanent and cannot be undone. All your data, including listings and favorites, will be permanently removed.
                    </p>

                    <div style={{ marginTop: 16 }}>
                      <button
                        onClick={() => setDeleteModalOpen(true)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          padding: "10px 18px",
                          borderRadius: 999,
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 8px 24px rgba(239,68,68,0.18)",
                        }}
                      >
                        I understand, delete my account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DeleteAccountModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteAccount} />
      </div>
    </div>
  );
}