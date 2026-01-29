import { createFileRoute, redirect } from "@tanstack/react-router";
import Hero from "@/components/home/Hero";
import Explore from "@/components/home/Explore";
import Statistics from "@/components/home/Statistics";
import CoDev from "@/components/home/CoDev";
import Owners from "@/components/home/Owners";
import CoTypes from "@/components/home/CoTypes";
import BankIntegrations from "@/components/home/BankIntegrations";
import FAQ from "@/components/home/FAQ";
import GetOnDevices from "@/components/home/OnDevices";
import Footer from "@/components/home/Footer";
import LogoutModal from "@/components/LogoutModal";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: () => {
    // redirect({
    //   to: "/",
    // });
  },
});

function HomePage() {
  return (
    <>
      <Hero />
      <Explore />
      <div className="space-y-12 md:px-0">
        <div className="">
          <section className="bg-gray-100">
            <Statistics />
          </section>
          <section className="md:mx-0">
            <CoDev />
          </section>
          <section className="bg-gray-100">
            <Owners />
          </section>
          <section>
            <CoTypes />
          </section>
          <section className="md:py-22 py-8 bg-gray-100 px-4 md:px-0">
            <div className="h-[300px] sm:h-[400px] md:h-[420px] flex">
              <img
                src="/how-it-works.png"
                className="w-full flex-1 mx-auto object-contain"
                alt="How it works"
              />
            </div>
          </section>
          <section>
            <BankIntegrations />
          </section>
          <section className="bg-gray-100">
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
