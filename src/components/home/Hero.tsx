import FlexInfo from "./FlexInfo";
import Sectiongrid from "./SectionGrid";
import { Button } from "@/components/ui/Button";

export default function Hero() {
  return (
    <div className="bg-gray-100 pt-6">
      <Sectiongrid className="pt-12 lg:pt-0">
        <FlexInfo className="leading-loose text-left lg:text-left">
          <h1 className="md:text-5xl text-4xl font-bold">
            Your Smooth Journey <br className="" />
            to Property Ownership.
          </h1>
          <ul className="md:text-base text-sm space-y-3 mt-6">
            <li className="flex items-start gap-3">
              <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span>Build Wealth the smart way</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span>Co-develop and co-own trusted Real estate investment Portfolio</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span>Track Rental income and project milestone in real time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span>Access digital contracts, investors dashboard and verified properties.</span>
            </li>
          </ul>
          <div className="lg:flex-row gap-2 flex flex-col mt-6 mb-6">
            <Button
              variant="accent"
              size="lg"
              className="md:w-auto w-[250px] mx-auto md:mx-0 flex items-center justify-center"
            >
              <img src="/apple_white.svg" alt="" className="w-5 h-5 mr-2" />
              Get on iPhone
            </Button>
            <Button
              variant="accent"
              size="lg"
              className="w-[250px] md:w-auto mx-auto md:mx-0 flex items-center justify-center"
            >
              <img src="/google_icon.svg" alt="" className="w-5 h-5 mr-2" />
              Get on Android
            </Button>
          </div>
        </FlexInfo>
        <FlexInfo className="lg:justify-end justify-center flex-row items-center">
          <img
            src="/home_video.png"
            className="size-8/10 object-contain"
            alt="Property showcase"
          />
        </FlexInfo>
      </Sectiongrid>
    </div>
  );
}
