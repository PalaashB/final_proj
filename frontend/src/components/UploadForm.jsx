import { useEffect, useState } from "react";
import { UploadCloud, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { createItem } from "../lib/api.js";

const INITIAL_FORM = {
  title: "",
  location: "",
  description: "",
  finderContact: ""
};

function UploadForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setStatus({ kind: "error", message: "Please upload a JPG, PNG, or WEBP image." });
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setImageFile(file);
    setStatus({ kind: "idle", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      setStatus({ kind: "error", message: "Attach a photo before submitting." });
      return;
    }

    setSubmitting(true);
    setStatus({ kind: "idle", message: "" });

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("location", form.location);
    payload.append("description", form.description);
    payload.append("finder_contact", form.finderContact);
    payload.append("image", imageFile);

    try {
      const data = await createItem(payload);
      setStatus({
        kind: "success",
        message: `Item “${data.item.title}” is now indexed across the system.`
      });
      setForm(INITIAL_FORM);
      setImageFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);

      window.dispatchEvent(new CustomEvent("echolocator:refresh-data"));
    } catch (error) {
      setStatus({ kind: "error", message: error.message || "Upload failed. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-emerald-200">Report a Found Item</h2>
      <p className="mt-1 text-sm text-slate-400">
        CLIP transforms your photo into a 512-d vector so people can find it even if they describe it differently.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Item title
            <input
              type="text"
              value={form.title}
              onChange={updateField("title")}
              placeholder="Hydroflask, MacBook Air, Backpack…"
              required
              className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Found at
            <input
              type="text"
              value={form.location}
              onChange={updateField("location")}
              placeholder="Library Atrium, Cafeteria, Block B"
              required
              className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Describe it
          <textarea
            rows={4}
            value={form.description}
            onChange={updateField("description")}
            placeholder="Engravings, stickers, context about where you found it…"
            className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Contact info (optional)
          <input
            type="text"
            value={form.finderContact}
            onChange={updateField("finderContact")}
            placeholder="Email, phone, Telegram handle…"
            className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          />
        </label>

        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-center">
          <label className="flex cursor-pointer flex-col items-center gap-3">
            <UploadCloud className="h-8 w-8 text-emerald-300" />
            <span className="text-sm font-semibold text-slate-200">
              Drop the item photo here or click to browse
            </span>
            <span className="text-xs text-slate-500">JPG, PNG, WEBP · Max ~5MB recommended</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          {previewUrl && (
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-700">
              <img src={previewUrl} alt="Preview" className="h-64 w-full object-cover" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          {submitting ? "Vectorizing…" : "Upload to Echo-Locator"}
        </button>

        {status.kind === "success" && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            <CheckCircle className="h-4 w-4" />
            {status.message}
          </div>
        )}

        {status.kind === "error" && (
          <div className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            <AlertTriangle className="h-4 w-4" />
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default UploadForm;