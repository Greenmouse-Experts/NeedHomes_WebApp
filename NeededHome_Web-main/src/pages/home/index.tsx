import { useState } from "react";
import Header from "./_components/Header";
import { PlayIcon } from "lucide-react";
import Sectiongrid from "./_components/SectionGrid";
import FlexInfo from "./_components/FlexInfo";
import Statistics from "./_components/Statistics";
import CoDev from "./_components/CoDev";
import Owners from "./_components/Owners";
import CoTypes from "./_components/CoTypes";
import BankIntegrations from "./_components/BankIntegrations";
import Footer from "./_components/Footer";
import FAQ from "./_components/FAQ";
import GetOnDevices from "./_components/OnDevices";
import Hero from "./_components/Hero";
import Explore from "./_components/Explore";
export default function index() {
  const [showVideo, setVideo] = useState<boolean>(false);
  return (
    <>
      <Header />
      <Hero />
      <Explore />
      <div className="space-y-12  md:px-0">
        <div className="">
          <section className="bg-base-200">
            <Statistics />
          </section>
          <section className=" md:mx-0">
            <CoDev />
          </section>
          <section className="bg-base-200">
            <Owners />
          </section>
          <section>
            <CoTypes />
          </section>
          <section className="md:py-22 py-4 bg-base-200 px-4 md:px-0">
            <div className="h-[420px] flex">
              <img
                src="how-it-works.png"
                className="w-full flex-1 mx-auto object-contain"
                alt=""
              />
            </div>
          </section>
          <section>
            <BankIntegrations />
          </section>
          <section className=" bg-base-200">
            <FAQ />
          </section>
          <section className="">
            <GetOnDevices />
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
