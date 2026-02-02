import FlexInfo from "./FlexInfo";
import Sectiongrid from "./SectionGrid";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Maximize2 } from "lucide-react";

export default function Hero() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="relative h-[75vh] md:h-[85vh] flex items-center overflow-hidden"
      style={{
        backgroundImage: "url(/assets/hero.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark gradient overlay - subtle transition */}
      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/85 via-black/40 to-transparent"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full">
        <Sectiongrid className="py-8 md:py-0">
          <FlexInfo className="text-left max-w-2xl">
            {/* Fluid Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Your Smooth Journey to Property Ownership.
            </h1>

            {/* Benefit List */}
            <ul className="text-sm md:text-base space-y-2 md:space-y-3 mt-4 md:mt-6 text-gray-100 max-w-lg">
              {[
                "Build Wealth the smart way",
                "Co-develop and co-own trusted Real estate investment Portfolio",
                "Track Rental income and project milestone in real time",
                "Access digital contracts, investors dashboard and verified properties.",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="bg-[var(--color-orange)] text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-orange-500/20">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="leading-snug">{text}</span>
                </li>
              ))}
            </ul>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
              <Button
                variant="primary"
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange)]/90 h-12 md:h-14 px-8 text-white font-bold flex items-center justify-center rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                <img src="/apple_white.svg" alt="" className="w-5 h-5 mr-3" />
                Get on iPhone
              </Button>
              <Button
                variant="primary"
                className="bg-white hover:bg-gray-100 text-black h-12 md:h-14 px-8 font-bold flex items-center justify-center rounded-xl transition-all border border-gray-200 shadow-sm active:scale-95"
              >
                <img src="/google_icon.svg" alt="" className="w-5 h-5 mr-3" />
                Get on Android
              </Button>
            </div>
          </FlexInfo>

          <FlexInfo className="hidden lg:flex justify-end items-center">
            {/* Visual space for video thumbnail or property illustration */}
          </FlexInfo>
        </Sectiongrid>
      </div>

      {/* Video Modal remains the same */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          onClick={() => setIsExpanded(false)}
        >
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video
              className="w-full h-full"
              controls
              autoPlay
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-orange-500"
              onClick={() => setIsExpanded(false)}
            >
              <Maximize2 size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
