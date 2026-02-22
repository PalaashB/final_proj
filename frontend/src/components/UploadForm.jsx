import { useEffect, useState } from "react";
import { UploadCloud, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { createItem } from "../lib/api.js";

const LOCATIONS = [
  'W.E.B. Du Bois Library',
  'Berkshire Dining Commons',
  'Worcester Dining Commons',
  'Hampshire Dining Commons',
  'Franklin Dining Commons',
  'Lederle Graduate Research Center',
  'Integrated Learning Center',
  'Student Union',
  'Rec Center',
  'South College',
  'Morrill Science Center'
];

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
      <h2 className="text-2xl font-bold text-slate-900">Report a Found Item</h2>
      <p className="mt-2 text-sm text-slate-600">
  Upload a photo and location details.
</p>

      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-700 font-medium">
            Item title
            <input
              type="text"
              value={form.title} 
              onChange={updateField("title")}
              placeholder="Bottle, Airpods, Backpack…"
              required
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-green-900 font-semibold">
          Found at
            <select
              value={form.location}
              onChange={updateField("location")}
              required
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a location</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </label>
          </div>

        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-blue-400 transition-colors">
        <label className="flex cursor-pointer flex-col items-center gap-4">
          <div className="rounded-full bg-blue-500 p-4 shadow-lg shadow-blue-500/30 mx-auto w-fit">
            <UploadCloud className="h-10 w-10 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700">
            Drop the item photo here or click to browse
          </span>
          <span className="text-xs text-slate-500">JPG, PNG, WEBP · Max 5MB</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>

        {previewUrl && (
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 shadow-md">
            <img src={previewUrl} alt="Preview" className="h-72 w-full object-cover" />
          </div>
        )}
      </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-glow inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="relative z-10 flex items-center gap-3">
            {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
            {submitting ? "Processing…" : "Submit to Back2U"}
          </span>
        </button>

        {status.kind === "success" && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500 bg-green-50 px-4 py-3 text-sm text-green-800">
            <CheckCircle className="h-5 w-5" />
            {status.message}
          </div>
        )}

        {status.kind === "error" && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertTriangle className="h-5 w-5" />
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default UploadForm;