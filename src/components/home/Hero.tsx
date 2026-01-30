import FlexInfo from "./FlexInfo";
import Sectiongrid from "./SectionGrid";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Play, Maximize2 } from "lucide-react";

export default function Hero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="relative pt-6 overflow-hidden"
      style={{
        backgroundImage: "url(/assets/hero.jpg)",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
      }}
    >
      {/* Dark gradient overlay - from darker to transparent */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10">
        <Sectiongrid className="pt-12 lg:pt-0">
          <FlexInfo className="leading-loose text-left lg:text-left">
            <h1 className="md:text-5xl text-4xl font-bold text-white">
              Your Smooth Journey <br className="" />
              to Property Ownership.
            </h1>
            <ul className="md:text-base text-sm space-y-3 mt-6 text-gray-100">
              <li className="flex items-center gap-3">
                <span className="bg-[var(--color-orange)] text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 text-xs">
                  ✓
                </span>
                <span>Build Wealth the smart way</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-[var(--color-orange)] text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 text-xs">
                  ✓
                </span>
                <span>
                  Co-develop and co-own trusted Real estate investment Portfolio
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-[var(--color-orange)] text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 text-xs">
                  ✓
                </span>
                <span>
                  Track Rental income and project milestone in real time
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-[var(--color-orange)] text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 text-xs">
                  ✓
                </span>
                <span>
                  Access digital contracts, investors dashboard and verified
                  properties.
                </span>
              </li>
            </ul>
            <div className="lg:flex-row gap-2 flex flex-col mt-6 mb-6">
              <Button
                variant="primary"
                size="lg"
                className="md:w-auto w-[250px] mx-auto md:mx-0 flex items-center justify-center"
              >
                <img src="/apple_white.svg" alt="" className="w-5 h-5 mr-2" />
                Get on iPhone
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="w-[250px] md:w-auto mx-auto md:mx-0 flex items-center justify-center"
              >
                <img src="/google_icon.svg" alt="" className="w-5 h-5 mr-2" />
                Get on Android
              </Button>
            </div>
          </FlexInfo>
          <FlexInfo className="lg:justify-end justify-center flex-row items-center">
            <div className="relative size-8/10 flex items-center justify-center">
              {/* {!isVideoPlaying ? (
                <div
                  className="relative cursor-pointer group w-full h-full"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <img
                    src="https://images.unsplash.com/photo-1612637968894-660373e23b03?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-full h-full object-contain"
                    alt="Property showcase"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 hover:bg-white rounded-full p-6 shadow-lg transition-all group-hover:scale-110">
                      <Play className="w-12 h-12 text-[var(--color-orange)] fill-[var(--color-orange)]" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <video
                    className="w-full h-full object-contain rounded-lg"
                    controls
                    autoPlay
                    src="https://res.cloudinary.com/dmlgns85e/video/upload/v1768491983/WhatsApp_Video_2026-01-14_at_15.25.21_darvy8.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    title="Expand video"
                  >
                    <Maximize2 size={24} />
                  </button>
                </div>
              )} */}
              <div className="relative w-full h-full">
                <video
                  className="w-full h-full object-contain rounded-lg"
                  controls
                  autoPlay
                  src="https://res.cloudinary.com/dmlgns85e/video/upload/v1768491983/WhatsApp_Video_2026-01-14_at_15.25.21_darvy8.mp4"
                >
                  Your browser does not support the video tag.
                </video>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  title="Expand video"
                >
                  <Maximize2 size={24} />
                </button>
              </div>
            </div>
          </FlexInfo>
        </Sectiongrid>
      </div>

      {/* Expanded Video Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <video
                className="absolute inset-0 w-full h-full"
                controls
                autoPlay
                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-white text-center mt-4 text-sm">
              Click outside to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
