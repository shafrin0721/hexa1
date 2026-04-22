import { Phone, Mail, MapPin, Facebook, Instagram, HelpCircle, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { apiUrl } from "@/lib/api";
import { MESSAGE_MAX_LEN, MESSAGE_MIN_LEN, MAX_NAME_LEN, validateContactForm } from "@/lib/validation";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate form
    const validationError = validateContactForm(name, email, message);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    setSending(true);
    
    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success(data.message || "Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(error.message || "Network error. Please try again later.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-5xl w-full mx-auto rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
        {/* Left Column - Dark Section */}
        <div className="bg-gradient-to-br from-[#1a1e2b] via-[#12151d] to-[#0a0c12] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">Contact Us</h2>
            <p className="text-sm text-gray-400 mb-10">We'd love to hear from you! Reach us anytime.</p>
            
            <div className="space-y-5">
              {/* Phone */}
              <a
                href="tel:+94771234567"
                id="contact-phone-link"
                className="group flex items-start gap-4 p-3 -mx-3 rounded-xl transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 shrink-0 mt-0.5">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Phone</p>
                  <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors duration-300">+94 77 123 4567</p>
                  <p className="text-xs text-gray-500 mt-0.5">Tap to call</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                id="contact-whatsapp-link"
                className="group flex items-start gap-4 p-3 -mx-3 rounded-xl transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300 shrink-0 mt-0.5">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">WhatsApp</p>
                  <p className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors duration-300">+94 77 123 4567</p>
                  <p className="text-xs text-gray-500 mt-0.5">Chat with us on WhatsApp</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:support@hexal.com"
                id="contact-email-link"
                className="group flex items-start gap-4 p-3 -mx-3 rounded-xl transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 shrink-0 mt-0.5">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Email</p>
                  <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors duration-300">support@hexal.com</p>
                  <p className="text-xs text-gray-500 mt-0.5">Open your email client</p>
                </div>
              </a>

              {/* Address */}
              <a
                href="https://www.google.com/maps?q=123+Galle+Road+Colombo+03"
                target="_blank"
                rel="noopener noreferrer"
                id="contact-address-link"
                className="group flex items-start gap-4 p-3 -mx-3 rounded-xl transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Address</p>
                  <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors duration-300">
                    123 Galle Road,<br />
                    Colombo 03, Sri Lanka
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">View on Google Maps</p>
                </div>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="relative z-10 flex gap-3 mt-10 pt-6 border-t border-white/10">
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300"
              aria-label="Visit our Facebook page"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300"
              aria-label="Visit our Instagram profile"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300"
              aria-label="Open help center"
            >
              <HelpCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Right Column - Light Section */}
        <div className="bg-[#f7f8fa] p-8 md:p-10">
          <h2 className="text-xl font-bold text-[#111318] mb-1">Send Us a Message</h2>
          <p className="text-sm text-[#6b707c] mb-8">
            Fill out the form and our team will get back to you soon.
          </p>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="contact-name" className="text-sm font-medium text-[#111318] mb-1.5 block">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your Name"
                required
                maxLength={MAX_NAME_LEN}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#e1e4ea] bg-white px-4 text-sm text-[#111318] placeholder:text-[#b0b4be] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="text-sm font-medium text-[#111318] mb-1.5 block">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="you@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#e1e4ea] bg-white px-4 text-sm text-[#111318] placeholder:text-[#b0b4be] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="text-sm font-medium text-[#111318] mb-1.5 block">
                Message
              </label>
              <textarea
                id="contact-message"
                placeholder="How can we help you?"
                rows={5}
                required
                minLength={MESSAGE_MIN_LEN}
                maxLength={MESSAGE_MAX_LEN}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-[#e1e4ea] bg-white px-4 py-3 text-sm text-[#111318] placeholder:text-[#b0b4be] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none"
              />
              <p className="text-xs text-[#b0b4be] mt-1 text-right">
                {message.length}/{MESSAGE_MAX_LEN}
              </p>
            </div>

            <Button
              id="contact-submit-btn"
              type="submit"
              className="w-full gap-2 h-12 rounded-xl bg-[#111318] hover:bg-[#2b2f38] active:scale-[0.98] transition-all duration-200 text-sm font-semibold shadow-lg shadow-black/20 text-white"
              size="lg"
              disabled={sending}
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;