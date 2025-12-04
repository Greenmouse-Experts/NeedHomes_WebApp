import FlexInfo from "./FlexInfo";
import Sectiongrid from "./SectionGrid";

export default function Hero() {
  return (
    <div className="bg-base-200">
      <Sectiongrid className="pt-12 lg:pt-0 ">
        <FlexInfo className="leading-loose text-center lg:text-left">
          <h1 className="md:text-5xl   text-4xl  font-bold ">
            Your Smooth Journey <br className="" />
            to Property Ownership.
          </h1>
          <p className="md:text-xl text-md">
            Own your dream home transparently, affordably from anywhere.
             Co-develop verified projects or own fractional property shares and
            track progress from your dashboard.
          </p>
          <div className="lg:flex-row gap-2 flex flex-col mt-6 mb-6 ">
            <button className="btn btn-accent btn-lg  md:w-auto w-[250px] mx-auto md:mx-0">
              <img src="apple_white.svg" alt="" /> Get on Iphone
            </button>
            <button className="btn btn-accent btn-lg w-[250px] md:w-auto mx-auto md:mx-0">
              <img src="google_icon.svg" alt="" />
              Get on Android
            </button>
          </div>
        </FlexInfo>
        <FlexInfo className="lg:justify-end justify-center flex-row items-center">
          <img
            src="home_video.png"
            className="size-8/10 object-contain"
            alt=""
          />
        </FlexInfo>
      </Sectiongrid>
    </div>
  );
}
