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
        message: `Item "${data.item.title}" is now indexed across the system.`
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
      <h2 className="text-4xl font-bold text-[#1B4D3E]">Report a Found Item</h2>
      <p className="mt-3 text-lg text-[#143A2F]">
        Upload a photo and location details.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-3 text-lg text-[#1B4D3E] font-semibold">
            Item title
            <input
              type="text"
              value={form.title}
              onChange={updateField("title")}
              placeholder="Bottle, Airpods, Backpack…"
              required
              className="rounded-xl border-2 border-[#1B4D3E]/30 bg-white px-5 py-4 text-lg text-[#1B4D3E] placeholder:text-[#1B4D3E]/50 focus:border-[#FF8C42] focus:outline-none focus:ring-4 focus:ring-[#FF8C42]/20 transition-all shadow-sm hover:border-[#1B4D3E]/50 hover:shadow-md"
            />
          </label>

          <label className="flex flex-col gap-3 text-lg text-[#1B4D3E] font-semibold">
            Found at
            <select
              value={form.location}
              onChange={updateField("location")}
              required
              className="rounded-xl border-2 border-[#1B4D3E]/30 bg-white px-5 py-4 text-lg text-[#1B4D3E] focus:border-[#FF8C42] focus:outline-none focus:ring-4 focus:ring-[#FF8C42]/20 appearance-none cursor-pointer transition-all shadow-sm hover:border-[#1B4D3E]/50 hover:shadow-md"
            >
              <option value="" disabled>Select a location</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-2xl border-3 border-dashed border-[#1B4D3E]/30 bg-[#F5E6D3]/30 p-12 text-center hover:border-[#FF8C42]/50 hover:bg-[#F5E6D3]/50 transition-all duration-300">
          <label className="flex cursor-pointer flex-col items-center gap-5">
            <div className="rounded-2xl bg-[#FF8C42] p-6 shadow-2xl shadow-[#FF8C42]/50 mx-auto w-fit hover:scale-110 transition-transform duration-300">
              <UploadCloud className="h-12 w-12 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1B4D3E]">
              Drop the item photo here or click to browse
            </span>
            <span className="text-lg text-[#143A2F]">JPG, PNG, WEBP · Max 5MB</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          {previewUrl && (
            <div className="mt-8 overflow-hidden rounded-2xl border-2 border-[#1B4D3E]/30 shadow-2xl">
              <img src={previewUrl} alt="Preview" className="h-80 w-full object-cover" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-glow w-full inline-flex items-center justify-center gap-3 rounded-xl bg-[#FF8C42] px-8 py-5 text-xl font-bold text-white shadow-2xl shadow-[#FF8C42]/50 transition-all hover:bg-[#FF8C42]/90 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
          {submitting ? "Processing…" : "Submit to Back2U"}
        </button>

        {status.kind === "success" && (
          <div className="flex items-center gap-3 rounded-xl border-2 border-green-600 bg-green-50 px-5 py-4 text-lg font-semibold text-green-900 shadow-lg">
            <CheckCircle className="h-5 w-5" />
            {status.message}
          </div>
        )}

        {status.kind === "error" && (
          <div className="flex items-center gap-3 rounded-xl border-2 border-red-600 bg-red-50 px-5 py-4 text-lg font-semibold text-red-900 shadow-lg">
            <AlertTriangle className="h-5 w-5" />
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default UploadForm;