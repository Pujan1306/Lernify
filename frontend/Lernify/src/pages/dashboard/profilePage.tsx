import React, { useState } from "react";
import { useTheme } from "../../components/theme-provider";
import { themeMeta, type ThemeName } from "../../lib/themes";
import { User, Image as ImageIcon, Palette, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { sileo } from "sileo";

export default function Profile() {
  const { theme, setTheme, mode, toggleMode } = useTheme();
  const { user, isLoading, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);

    try {
      const response = await authService.updateProfile(e.target.files[0]);
      if (response.success) {
        updateProfile(response.user)
        sileo.success({title:  response.message})
      }
    } catch (error) {
      sileo.error({title: error instanceof Error ? error.message : "Failed to update image"})
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="col-span-1 md:col-span-1 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-background shadow-md flex items-center justify-center">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">{user?.username || "Guest User"}</h2>
            <p className="text-muted-foreground text-sm">{user?.email || "No email provided"}</p>
          </div>
          
          <div className="w-full pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account Type</span>
              <span className="font-medium text-foreground capitalize">{user?.type || "Standard"}</span>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-border pb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-card-foreground">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Color Theme</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.entries(themeMeta) as [ThemeName, { name: string; description: string }][]).map(([key, meta]) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                        theme === key 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      }`}
                    >
                      <span className="font-medium text-foreground">{meta.name}</span>
                      <span className="text-xs text-muted-foreground mt-1 line-clamp-2">{meta.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Dark Mode</h4>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark interface</p>
                </div>
                <button
                  onClick={toggleMode}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  style={{ backgroundColor: mode === 'dark' ? 'var(--primary)' : 'var(--muted)' }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      mode === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
