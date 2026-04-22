import { useCallback, useEffect, useRef, useState } from "react";
import { User, Eye, Bell, Shield, Camera, Trash2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiUrl } from "@/lib/api";
import { clampFontSize, isValidEmail, isValidPhone, MAX_NAME_LEN } from "@/lib/validation";
import { useTheme } from "next-themes";
import { useAvatar } from '@/context/AvatarContext';

const PROFILE_EMAIL_KEY = "hexal_profile_email";

function avatarStorageKey(email) {
  return `hexal_profile_avatar:${email.trim().toLowerCase()}`;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face";

const sidebarItems = [
  { label: "Profile Settings", icon: User, id: "profile" },
  { label: "Accessibility", icon: Eye, id: "accessibility" },
  { label: "Notifications", icon: Bell, id: "notifications" },
  { label: "Security", icon: Shield, id: "security" }
];

const LANGUAGE_OPTIONS = ["English (US)", "English (UK)", "Spanish", "French"];

function readAndCompressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result;
      if (typeof src !== "string") {
        reject(new Error("Could not read file"));
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max = 256;
        let w = img.width;
        let h = img.height;
        if (w > max || h > max) {
          if (w > h) {
            h = Math.round(h * max / w);
            w = max;
          } else {
            w = Math.round(w * max / h);
            h = max;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not create canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("Invalid image"));
      img.src = src;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function Settings() {
  const { updateAvatar } = useAvatar();
  const { setTheme } = useTheme();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileEmail, setProfileEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem(PROFILE_EMAIL_KEY);
    if (stored) return stored;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return parsed?.email || "";
      } catch {
        return "";
      }
    }
    return "";
  });
  const [signedInEmail, setSignedInEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [fontSize, setFontSize] = useState([50]);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English (US)");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [updating2FA, setUpdating2FA] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    setTheme(darkMode ? "dark" : "light");
  }, [darkMode, setTheme]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.email) setSignedInEmail(parsed.email);
      } catch {
        setSignedInEmail("");
      }
    }
  }, []);

  const applyAvatarFromProfile = useCallback((email, serverAvatar) => {
    const key = avatarStorageKey(email);
    const local = localStorage.getItem(key);
    if (serverAvatar && serverAvatar.trim()) {
      setAvatarSrc(serverAvatar.trim());
    } else if (local) {
      setAvatarSrc(local);
    } else {
      setAvatarSrc(null);
    }
  }, []);

  async function fetchProfileForEmail(email) {
    if (!email) return;
    setLoadingProfile(true);
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      toast.error("Please enter a valid email address.");
      setLoadingProfile(false);
      return;
    }
    try {
      const res = await fetch(`${apiUrl("/api/profile")}?email=${encodeURIComponent(trimmed)}`);
      if (res.status === 404) {
        toast.info("No saved profile found for this email.");
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmailNotif(true);
        setTwoFactorEnabled(false);
        applyAvatarFromProfile(trimmed, null);
        return;
      }
      if (!res.ok) {
        toast.error("Could not load profile.");
        return;
      }
      const p = await res.json();
      setFirstName(p.first_name ?? "");
      setLastName(p.last_name ?? "");
      setPhone(p.phone ?? "");
      setDarkMode(Boolean(p.dark_mode));
      setFontSize([typeof p.font_size === "number" ? p.font_size : 50]);
      if (typeof p.language === "string" && LANGUAGE_OPTIONS.includes(p.language)) {
        setLanguage(p.language);
      }
      setEmailNotif(Boolean(p.email_notif));
      setTwoFactorEnabled(Boolean(p.two_factor_enabled));
      applyAvatarFromProfile(trimmed, p.profile_photo);
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Network error while loading profile.");
    } finally {
      setLoadingProfile(false);
    }
  }

  useEffect(() => {
    if (profileEmail) {
      void fetchProfileForEmail(profileEmail);
    }
  }, [profileEmail]);

  async function saveProfile() {
  const email = profileEmail.trim();
  if (!email) {
    toast.error("Email is required.");
    return;
  }
  if (!isValidEmail(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }
  const fn = firstName.trim();
  const ln = lastName.trim();
  if (fn.length > MAX_NAME_LEN || ln.length > MAX_NAME_LEN) {
    toast.error(`First and last names must be at most ${MAX_NAME_LEN} characters.`);
    return;
  }
  if (!isValidPhone(phone)) {
    toast.error("Phone number must contain 7 to 15 digits, or be empty.");
    return;
  }
  const fontSizeValue = clampFontSize(fontSize[0] ?? 50);
  setSaving(true);
  try {
    const res = await fetch(apiUrl("/api/profile"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        first_name: fn,
        last_name: ln,
        phone: phone.trim(),
        dark_mode: darkMode,
        font_size: fontSizeValue,
        language,
        email_notif: emailNotif,
        profile_photo: avatarSrc,
        two_factor_enabled: twoFactorEnabled,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(typeof data.error === "string" ? data.error : "Could not save profile.");
      return;
    }
    localStorage.setItem(PROFILE_EMAIL_KEY, email);
    if (avatarSrc && avatarSrc.startsWith("data:")) {
      localStorage.setItem(avatarStorageKey(email), avatarSrc);
      // Update global avatar context
      updateAvatar(avatarSrc, email);
    }
    toast.success("Profile saved successfully.");
    await fetchProfileForEmail(email);
  } catch (error) {
    console.error("Save profile error:", error);
    toast.error("Network error while saving profile.");
  } finally {
    setSaving(false);
  }
}

  function handleAvatarButtonClick() {
    fileInputRef.current?.click();
  }

  async function handleAvatarFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) {
      if (file) toast.error("Please choose an image file.");
      return;
    }
    try {
      const dataUrl = await readAndCompressImage(file);
      setAvatarSrc(dataUrl);
      if (profileEmail.trim()) {
        localStorage.setItem(avatarStorageKey(profileEmail), dataUrl);
      }
      toast.success("Profile photo updated. Click save to keep changes.");
    } catch {
      toast.error("Could not process this image.");
    }
  }

  function handleRemoveAvatar() {
  const email = profileEmail.trim();
  setAvatarSrc(null);
  if (email) {
    localStorage.removeItem(avatarStorageKey(email));
    // Update global avatar context to null
    updateAvatar(null, email);
  }
  toast.success("Profile photo removed.");
}

  async function handleTwoFactorToggle(checked) {
    const email = profileEmail.trim() || signedInEmail.trim();
    if (!email || !isValidEmail(email)) {
      toast.error("Load a valid profile email first.");
      return;
    }
    setUpdating2FA(true);
    try {
      const res = await fetch(apiUrl("/api/profile/security/2fa"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, enabled: checked }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Could not update 2FA setting.");
        return;
      }
      setTwoFactorEnabled(Boolean(data.two_factor_enabled));
      toast.success(checked ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
    } catch {
      toast.error("Network error while updating 2FA.");
    } finally {
      setUpdating2FA(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    const email = profileEmail.trim() || signedInEmail.trim();
    if (!email || !isValidEmail(email)) {
      toast.error("A valid signed-in email is required.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      toast.error("New password must include uppercase, lowercase, and a number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    setUpdatingPassword(true);
    try {
      const res = await fetch(apiUrl("/api/profile/security/password"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Could not update password.");
        return;
      }
      toast.success("Password updated successfully.");
      setPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Network error while changing password.");
    } finally {
      setUpdatingPassword(false);
    }
  }

  function clearStoredEmail() {
    localStorage.removeItem(PROFILE_EMAIL_KEY);
    setProfileEmail("");
    toast.success("Saved email cleared from this device.");
  }

  const cardClass = "bg-white dark:bg-card rounded-xl p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] border border-transparent dark:border-border";

  return (
    <div className="container py-12 flex justify-center">
      <div className="flex gap-8 max-w-5xl w-full mx-auto">
        <aside className="w-56 shrink-0">
          <nav className="space-y-1 bg-white dark:bg-card rounded-xl p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] border border-transparent dark:border-border">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-[#f0f2f5] dark:bg-muted text-[#111318] dark:text-foreground"
                    : "text-[#6b707c] dark:text-muted-foreground hover:text-[#111318] hover:dark:text-foreground hover:bg-[#f4f5f7] dark:hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#111318] dark:text-foreground mb-6">Profile Settings</h2>

              <div className="mb-4">
                <label htmlFor="profile-email" className="text-sm font-medium text-[#111318] dark:text-foreground mb-1.5 block">
                  Email
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    id="profile-email"
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full h-10 rounded-lg border border-black/5 dark:border-border bg-white dark:bg-background px-3 text-sm text-[#111318] dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#111318]/70 dark:focus:ring-ring sm:flex-1"
                    placeholder="you@gmail.com"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0"
                    disabled={loadingProfile}
                    onClick={() => void fetchProfileForEmail(profileEmail)}
                  >
                    Load Profile
                  </Button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-hidden="true"
                onChange={(e) => void handleAvatarFileChange(e)}
              />

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-[#e1e4ea] dark:bg-muted overflow-hidden">
                    <img
                      src={avatarSrc || DEFAULT_AVATAR}
                      alt=""
                      className={`h-full w-full object-cover ${avatarSrc ? "" : "opacity-50"}`}
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-sm hover:opacity-90"
                    aria-label="Change profile photo"
                    onClick={handleAvatarButtonClick}
                  >
                    <Camera className="h-3 w-3 text-primary-foreground" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111318] dark:text-foreground">Profile Photo</p>
                  <p className="text-xs text-[#9ca0aa] dark:text-muted-foreground">Upload Photo</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-8 px-2 text-destructive hover:text-destructive"
                    onClick={handleRemoveAvatar}
                    disabled={!avatarSrc}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remove Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="first-name" className="text-sm font-medium text-[#111318] dark:text-foreground mb-1.5 block">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={MAX_NAME_LEN}
                    placeholder="First Name"
                    className="w-full h-10 rounded-lg border border-black/5 dark:border-border bg-white dark:bg-background px-3 text-sm text-[#111318] dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#111318]/70 dark:focus:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="text-sm font-medium text-[#111318] dark:text-foreground mb-1.5 block">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={MAX_NAME_LEN}
                    placeholder="Last Name"
                    className="w-full h-10 rounded-lg border border-black/5 dark:border-border bg-white dark:bg-background px-3 text-sm text-[#111318] dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#111318]/70 dark:focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="text-sm font-medium text-[#111318] dark:text-foreground mb-1.5 block">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full h-10 rounded-lg border border-black/5 dark:border-border bg-white dark:bg-background px-3 text-sm text-[#111318] dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#111318]/70 dark:focus:ring-ring"
                />
              </div>

              <Button
                type="button"
                onClick={saveProfile}
                disabled={saving || loadingProfile}
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 hover:text-white active:scale-[0.98] shadow-sm hover:shadow-md transition-all disabled:opacity-60"
              >
                {saving ? "Saving Profile..." : "Save Profile"}
              </Button>
            </section>
          )}

          {activeTab === "accessibility" && (
            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#111318] dark:text-foreground mb-6">Accessibility</h2>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-[#111318] dark:text-foreground">Dark Mode</p>
                  <p className="text-xs text-[#9ca0aa] dark:text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-[#111318] dark:text-foreground">Font Size</p>
                  <span className="text-xs font-medium text-[#111318] dark:text-foreground">{fontSize[0]}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#9ca0aa] dark:text-muted-foreground">A</span>
                  <Slider value={fontSize} onValueChange={setFontSize} min={50} max={100} step={5} className="flex-1" />
                  <span className="text-base text-[#9ca0aa] dark:text-muted-foreground">A</span>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="language" className="text-sm font-medium text-[#111318] dark:text-foreground mb-1.5 block">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-10 rounded-lg border border-black/5 dark:border-border bg-white dark:bg-background px-3 text-sm text-[#111318] dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#111318]/70 dark:focus:ring-ring"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={saveProfile} disabled={saving}>
                Save accessibility settings
              </Button>
            </section>
          )}

          {activeTab === "notifications" && (
            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#111318] dark:text-foreground mb-6">Notification Preferences</h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#111318] dark:text-foreground">Email Notifications</p>
                    <p className="text-xs text-[#9ca0aa] dark:text-muted-foreground">Receive all important updates and alerts via email</p>
                  </div>
                  <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                </div>
              </div>
              <Button type="button" variant="outline" className="mt-6 w-full sm:w-auto" onClick={saveProfile} disabled={saving}>
                Save notification preference
              </Button>
            </section>
          )}

          {activeTab === "security" && (
            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#111318] dark:text-foreground mb-6">Security</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#111318] dark:text-foreground">Two-factor authentication</p>
                    <p className="text-xs text-[#9ca0aa] dark:text-muted-foreground">Require OTP verification during login.</p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled} 
                    disabled={updating2FA} 
                    onCheckedChange={(v) => void handleTwoFactorToggle(v)} 
                  />
                </div>

                <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      <KeyRound className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>Enter your current password, then your new password.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="current-pw">Current Password</Label>
                        <Input 
                          id="current-pw" 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          placeholder="Enter current password" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-pw">New Password</Label>
                        <Input 
                          id="new-pw" 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          placeholder="At least 8 characters" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-pw">Confirm New Password</Label>
                        <Input 
                          id="confirm-pw" 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          placeholder="Confirm new password" 
                        />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={updatingPassword}>
                          {updatingPassword ? "Updating..." : "Update Password"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="border-t border-border pt-6">
                  <p className="text-sm font-medium text-[#111318] dark:text-foreground mb-2">Signed-in Email</p>
                  <p className="text-xs text-[#9ca0aa] dark:text-muted-foreground mb-3">{signedInEmail || "No signed-in user found."}</p>
                  <Button type="button" variant="secondary" onClick={clearStoredEmail}>
                    Clear stored email
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;