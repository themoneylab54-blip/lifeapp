import { useState } from "react";
import { useJournal } from "@/hooks/useJournal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Journal() {
  const { entries, loading, addEntry, deleteEntry } = useJournal();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;

    setSaving(true);
    try {
      await addEntry(content);
      setContent("");
    } catch (error) {
      console.error("Failed to save entry:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFD60A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="py-6">
        <h1 className="text-2xl font-black mb-6 px-5">Journal</h1>

        {/* Input Section */}
        <div className="bg-[#121212] rounded-2xl p-5 mx-5 mb-6 border border-gray-900">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez vos pensées..."
            rows={5}
            className="bg-background border-border text-foreground resize-none mb-3"
          />
          <Button
            onClick={handleSave}
            disabled={!content.trim() || saving}
            className="w-full bg-[#FFD60A] text-black hover:bg-[#FFD60A]/90 font-bold"
          >
            {saving ? "Sauvegarde..." : "SAUVEGARDER"}
          </Button>
        </div>

        {/* Entries Feed */}
        <div className="px-5 space-y-4">
          {entries.length === 0 ? (
            <div className="text-center text-gray-600 py-12 text-sm">
              Aucune entrée pour le moment
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-900 relative group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs text-gray-500">
                    {format(entry.createdAt, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF453A] hover:bg-gray-900 p-1.5 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
