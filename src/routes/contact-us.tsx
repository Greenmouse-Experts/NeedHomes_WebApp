import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const Route = createFileRoute("/contact-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We're here to help. Send us a message
            and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="p-3 bg-brand-orange/10 rounded-full mb-4">
                <Mail className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <a
                href="mailto:info@example.com"
                className="text-muted-foreground hover:text-brand-orange transition-colors"
              >
                info@example.com
              </a>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="p-3 bg-brand-orange/10 rounded-full mb-4">
                <Phone className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <a
                href="tel:+1234567890"
                className="text-muted-foreground hover:text-brand-orange transition-colors"
              >
                +1 (234) 567-890
              </a>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="p-3 bg-brand-orange/10 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="font-bold text-lg mb-2">Visit Us</h3>
              <p className="text-muted-foreground">
                123 Main Street, Anytown, USA 12345
              </p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-2 bg-card p-8 md:p-10 rounded-2xl shadow-lg border border-border">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-foreground"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-semibold text-foreground"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none"
                  placeholder="How can we help?"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full md:w-max px-8 py-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 rounded-3xl overflow-hidden shadow-xl border border-border bg-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-primary">Our Location</h2>
          </div>
          <div className="aspect-video w-full grayscale hover:grayscale-0 transition-all duration-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.298533729864!2d-122.4194158846817!3d37.77492947975932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858087e9c9a0b1%3A0x4f1f5f3f3f3f3f3f!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1678901234567!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
