import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/contact-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-[#333D42] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl text-white">
            Contact us<span className="text-orange-500">.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Office Info */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-muted-foreground mb-8">
              <Clock className="h-5 w-5 text-orange-500" />
              <p>
                Our offices are open Monday to Friday, from 8:00 AM to 5:00 PM,
                excluding public holidays.
              </p>
            </div>

            {/* Office Location */}
            <div className="bg-[#F8F9FA] p-8 rounded-sm">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-xl mb-3">Our Office</h3>
                  <p className="text-gray-600 leading-relaxed">
                    9 Orchid Road, Lekki, Lagos
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-[#333D42] p-6 rounded-sm text-white">
                <h3 className="font-bold mb-4">Phone & WhatsApp</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">+234 702 500 5857</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#333D42] p-6 rounded-sm text-white">
                <h3 className="font-bold mb-4">Email</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">support@needhomes.ng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-5">
            <div className="bg-[#333D42] p-8 rounded-sm text-white">
              <h2 className="text-2xl font-serif mb-8">
                Send a message<span className="text-orange-500">.</span>
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-gray-400">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#3d484e] border-none rounded p-3 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-gray-400">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#3d484e] border-none rounded p-3 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-gray-400">
                      Telephone No *
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-[#3d484e] border-none rounded p-3 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-gray-400">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full bg-[#3d484e] border-none rounded p-3 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-gray-400">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-[#3d484e] border-none rounded p-3 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <p className="text-[10px] text-gray-400 leading-tight">
                  By providing your name, phone number and email you consent to
                  NeedHomes Property Investment Limited's use of your personal data in
                  accordance with the Privacy Policy.
                </p>

                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-orange-600 text-white py-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
