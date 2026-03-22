"use client";
import { useEffect, useState } from "react";

type BannerSettings = {
  heading: string;
  subtitle: string;
  image_url: string;
  enabled: boolean;
};

const defaults: BannerSettings = {
  heading: "Elevated. Always.",
  subtitle: "Premium streetwear for the culture. Limited runs, no restocks.",
  image_url: "/hero.jpg",
  enabled: true,
};

export default function BannerSettingsConfig() {
  const [settings, setSettings] = useState<BannerSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/banner");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch banner settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/banner", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.url;
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      let imageUrl = settings.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await fetch("/api/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          image_url: imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();
      setSettings(data);
      setImageFile(null);
      alert("Banner settings saved!");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-sm p-6 mb-8">
        <p className="text-white/40 text-sm">Loading banner settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-sm p-6 mb-8">
      <h3 className="text-white text-sm uppercase tracking-widest mb-4">
        Banner settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/40 mb-1">Heading</label>
          <input
            value={settings.heading}
            onChange={(e) =>
              setSettings({ ...settings, heading: e.target.value })
            }
            className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Subtitle</label>
          <input
            value={settings.subtitle}
            onChange={(e) =>
              setSettings({ ...settings, subtitle: e.target.value })
            }
            className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-white/40 mb-1">
            Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3
                       file:bg-[#3D6B35] file:text-white file:border-0 file:text-xs
                       file:rounded-sm file:cursor-pointer"
          />
          {settings.image_url && !imageFile && (
            <p className="text-xs text-white/30 mt-1">
              Current: {settings.image_url}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) =>
                setSettings({ ...settings, enabled: e.target.checked })
              }
              className="accent-[#3D6B35]"
            />
            Enable Banner
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-5 py-2.5 bg-[#3D6B35] text-white text-xs tracking-widest uppercase rounded-sm hover:bg-[#8A9E7B] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
      <p className="text-xs text-white/40 mt-3">
        Settings are saved to the database and apply site-wide.
      </p>
    </div>
  );
}
