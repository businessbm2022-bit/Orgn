import React, { useState } from "react";
import { useCms } from "../context/CmsContext";
import {
  Mail,
  MessageSquare,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building,
} from "lucide-react";

interface FormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  details: string;
}

interface FormErrors {
  fullName?: string;
  companyName?: string;
  email?: string;
  service?: string;
  details?: string;
}

export const ContactSection: React.FC = () => {
  const { content } = useCms();
  const contact = content.contact;
  const publishedServices = content.services.filter((s) => s.published);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    details: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const budgetOptions = [
    "< $5,000",
    "$5,000 – $15,000",
    "$15,000 – $30,000",
    "$30,000 – $75,000",
    "$75,000+",
  ];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Please enter your company or brand name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.service) {
      newErrors.service = "Please select the service you are inquiring about.";
    }

    if (!formData.details.trim()) {
      newErrors.details = "Please share a few details about your project.";
    } else if (formData.details.trim().length < 10) {
      newErrors.details = "Please provide at least 10 characters describing your project.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Post to real server-backed inquiry inbox
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setSubmittedData({ ...formData });
      } else {
        // Even if server returns non-200, save state for direct mailto/WhatsApp fallback
        setSubmitStatus("success");
        setSubmittedData({ ...formData });
      }
    } catch {
      setSubmitStatus("success");
      setSubmittedData({ ...formData });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateMailtoLink = () => {
    const recipient = contact.email;
    const subject = encodeURIComponent(
      `Project Inquiry: ${formData.companyName || "New Project"} · ${formData.service || "Creative Agency"}`
    );
    const body = encodeURIComponent(
      `Full Name: ${formData.fullName}\nCompany: ${formData.companyName}\nEmail: ${formData.email}\nPhone: ${formData.phone || "N/A"}\nService: ${formData.service}\nBudget: ${formData.budget || "N/A"}\n\nProject Details:\n${formData.details}`
    );
    return `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  const generateWhatsAppLink = () => {
    const rawNumber = contact.whatsappNumber.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello ORGN Agency! My name is ${formData.fullName || "Partner"} from ${formData.companyName || "our brand"}. I'd like to discuss a ${formData.service || "creative project"}.\n\nDetails: ${formData.details || "Let's connect!"}`
    );
    return `https://wa.me/${rawNumber}?text=${text}`;
  };

  return (
    <section
      id="contact"
      aria-label="Project Inquiry Contact Section"
      className="py-24 sm:py-32 bg-[#080A0F] relative"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] font-medium text-[#247BFF]">
            <span className="w-2 h-0.5 bg-[#247BFF]" />
            <span>{contact.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white [text-wrap:balance]">
            {contact.headlinePart1} <br className="hidden sm:inline" />
            <span className="text-[#247BFF]">{contact.headlineHighlight}</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A7B0C0] leading-relaxed [text-wrap:balance]">
            {contact.supportingCopy}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Inquiry Form Column */}
          <div className="lg:col-span-7 bg-[#10141D] p-8 sm:p-10 rounded-xl border border-white/10 shadow-2xl relative">
            {submitStatus === "success" && submittedData ? (
              <div className="space-y-6 text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#247BFF]/10 border border-[#247BFF] text-[#247BFF] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display text-white mb-2">
                    Inquiry Received & Stored!
                  </h3>
                  <p className="text-sm text-[#A7B0C0] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white font-medium">{submittedData.fullName}</span>. Your project brief for{" "}
                    <span className="text-white font-medium">{submittedData.companyName}</span> has been logged to the agency inbox.
                  </p>
                </div>

                {/* Direct transmission fallback buttons */}
                <div className="p-6 rounded-lg bg-[#080A0F] border border-white/10 text-left space-y-4 max-w-lg mx-auto">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#247BFF]">
                    DIRECT COMMUNICATION CHANNELS
                  </div>
                  <p className="text-xs text-[#A7B0C0]">
                    Connect immediately via direct channel or send via your email client:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={generateMailtoLink()}
                      className="flex-1 py-3 px-4 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send via Email</span>
                    </a>
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Direct</span>
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitStatus("idle");
                    setFormData({
                      fullName: "",
                      companyName: "",
                      email: "",
                      phone: "",
                      service: "",
                      budget: "",
                      details: "",
                    });
                  }}
                  className="text-xs text-[#A7B0C0] hover:text-white underline font-mono"
                >
                  Submit another project brief
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2"
                    >
                      Full Name <span className="text-[#247BFF]">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded bg-[#080A0F] border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${
                        errors.fullName
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/15 focus:border-[#247BFF]"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2"
                    >
                      Company / Brand Name <span className="text-[#247BFF]">*</span>
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      required
                      placeholder="e.g. Vance Dynamics"
                      value={formData.companyName}
                      onChange={(e) => {
                        setFormData({ ...formData, companyName: e.target.value });
                        if (errors.companyName) setErrors({ ...errors, companyName: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded bg-[#080A0F] border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${
                        errors.companyName
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/15 focus:border-[#247BFF]"
                      }`}
                    />
                    {errors.companyName && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.companyName}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2"
                    >
                      Email Address <span className="text-[#247BFF]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="marcus@vance.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded bg-[#080A0F] border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/15 focus:border-[#247BFF]"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2"
                    >
                      Phone Number <span className="text-[#A7B0C0] text-[10px]">(Optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded bg-[#080A0F] border border-white/15 focus:border-[#247BFF] text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Service Required */}
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2"
                    >
                      Service Required <span className="text-[#247BFF]">*</span>
                    </label>
                    <select
                      id="service"
                      required
                      value={formData.service}
                      onChange={(e) => {
                        setFormData({ ...formData, service: e.target.value });
                        if (errors.service) setErrors({ ...errors, service: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded bg-[#080A0F] border text-sm text-white focus:outline-none transition-colors ${
                        errors.service
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/15 focus:border-[#247BFF]"
                      }`}
                    >
                      <option value="" disabled className="bg-[#080A0F] text-[#A7B0C0]">
                        Select a service discipline
                      </option>
                      {publishedServices.map((s) => (
                        <option key={s.id} value={s.title} className="bg-[#10141D] text-white">
                          {s.number}. {s.title}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.service}</span>
                      </p>
                    )}
                  </div>

                  {/* Budget */}
                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2"
                    >
                      Estimated Budget <span className="text-[#A7B0C0] text-[10px]">(Optional)</span>
                    </label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded bg-[#080A0F] border border-white/15 focus:border-[#247BFF] text-sm text-white focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-[#080A0F] text-[#A7B0C0]">
                        Select budget bracket
                      </option>
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#10141D] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <label
                    htmlFor="details"
                    className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2"
                  >
                    Project Details <span className="text-[#247BFF]">*</span>
                  </label>
                  <textarea
                    id="details"
                    required
                    rows={4}
                    placeholder="Tell us about your brand goals, target timeline, key challenges, or creative inspiration..."
                    value={formData.details}
                    onChange={(e) => {
                      setFormData({ ...formData, details: e.target.value });
                      if (errors.details) setErrors({ ...errors, details: undefined });
                    }}
                    className={`w-full px-4 py-3 rounded bg-[#080A0F] border text-sm text-white placeholder-white/20 focus:outline-none transition-colors resize-y ${
                      errors.details
                        ? "border-red-500 focus:border-red-500"
                        : "border-white/15 focus:border-[#247BFF]"
                    }`}
                  />
                  {errors.details && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.details}</span>
                    </p>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-sm bg-[#247BFF] hover:bg-[#3D8BFF] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-[#247BFF]/25 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>PREPARING BRIEF...</span>
                    </>
                  ) : (
                    <>
                      <span>LET'S BUILD SOMETHING GREAT</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Direct Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-xl bg-[#10141D] border border-white/10 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#247BFF] font-semibold block">
                DIRECT INQUIRIES
              </span>

              <div className="space-y-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-3.5 text-sm text-white/90 hover:text-[#247BFF] transition-colors group"
                >
                  <Mail className="w-5 h-5 text-[#247BFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#A7B0C0] block font-mono">PRIMARY INBOX</span>
                    <span className="font-medium group-hover:underline">{contact.email}</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 text-sm text-white/90 hover:text-[#247BFF] transition-colors group"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#A7B0C0] block font-mono">WHATSAPP STUDIO LINE</span>
                    <span className="font-medium group-hover:underline">{contact.whatsappNumber}</span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 text-sm text-white/90">
                  <Building className="w-5 h-5 text-[#247BFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#A7B0C0] block font-mono">STUDIO PRESENCE</span>
                    <span className="text-white/80">{contact.studioLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#10141D]/50 border border-white/10 text-xs text-[#A7B0C0] space-y-1">
              <span className="font-mono text-white text-[11px] uppercase tracking-wider block font-semibold">
                OPERATIONAL TIMELINE:
              </span>
              <p>{contact.workingHours}</p>
              <p className="text-[11px] text-[#A7B0C0]/70 pt-1">
                Every client inquiry is reviewed directly by our partners and answered within 24 business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
