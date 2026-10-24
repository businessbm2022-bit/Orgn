import React from "react";
import { useCms } from "../../../context/CmsContext";
import { Save, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";

export const NavFooterModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const navigation = draft.navigation;
  const settings = draft.globalSettings;

  const handleToggleNavVisible = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: prev.navigation.items.map((item) =>
          item.id === id ? { ...item, visible: !item.visible } : item
        ),
      },
    }));
  };

  const handleNavLabel = (id: string, label: string) => {
    updateDraft((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: prev.navigation.items.map((item) =>
          item.id === id ? { ...item, label } : item
        ),
      },
    }));
  };

  const handleNavMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= navigation.items.length) return;

    updateDraft((prev) => {
      const next = [...prev.navigation.items];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return {
        ...prev,
        navigation: {
          ...prev.navigation,
          items: next.map((it, i) => ({ ...it, order: i })),
        },
      };
    });
  };

  const handleCopyrightChange = (val: string) => {
    updateDraft((prev) => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        footerCopyrightText: val,
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Navigation & Footer Manager
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Configure primary navigation links, footer copyright line, and destination anchors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => saveDraft()}
          disabled={isSaving}
          className="px-5 py-2.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 space-y-5">
        <span className="text-xs font-mono uppercase tracking-wider text-[#247BFF] block font-semibold">
          TOP BAR NAVIGATION LINKS
        </span>

        <div className="space-y-3">
          {navigation.items.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 rounded-lg bg-[#080A0F] border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center font-mono text-[11px] text-[#247BFF]">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleNavLabel(item.id, e.target.value)}
                  className="px-3 py-1.5 rounded bg-[#10141D] border border-white/15 text-xs text-white font-medium focus:border-[#247BFF] w-40"
                />
                <span className="text-xs font-mono text-[#A7B0C0]">{item.href}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleNavVisible(item.id)}
                  className={`p-1.5 rounded text-xs ${
                    item.visible ? "text-emerald-400 bg-emerald-400/10" : "text-[#A7B0C0] bg-white/5"
                  }`}
                  title={item.visible ? "Link Visible" : "Link Hidden"}
                >
                  {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1.5 rounded bg-white/5 text-[#A7B0C0] hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavMove(idx, "down")}
                  disabled={idx === navigation.items.length - 1}
                  className="p-1.5 rounded bg-white/5 text-[#A7B0C0] hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Settings */}
      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 space-y-5">
        <span className="text-xs font-mono uppercase tracking-wider text-white/90 block font-semibold">
          FOOTER COPYRIGHT & TRIGGER SETTINGS
        </span>

        <div>
          <label className="block text-xs text-[#A7B0C0] mb-2">
            Copyright Line Label
          </label>
          <input
            type="text"
            value={settings.footerCopyrightText}
            onChange={(e) => handleCopyrightChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
          />
          <span className="text-[11px] text-[#A7B0C0] mt-2 block">
            Public output: <strong>© {new Date().getFullYear()} {settings.footerCopyrightText}</strong>
          </span>
        </div>

        <div className="p-4 rounded-lg bg-[#080A0F] border border-white/5 text-xs text-[#A7B0C0]">
          <strong className="text-white block mb-1">Security & Admin Access Protection:</strong>
          Clicking the copyright line in the footer remains permanently wired to the administrator login trigger, ensuring you will never be locked out of the CMS even when editing text.
        </div>
      </div>
    </div>
  );
};
