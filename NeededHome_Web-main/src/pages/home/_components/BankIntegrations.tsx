import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
//@ts-ignore
const modules = import.meta.glob<string, { default: string }>(
  "/src/assets/banks/*",
  { eager: true },
);

export default function BankIntegrations() {
  const [emblaRef] = useEmblaCarousel(
    { loop: false, skipSnaps: true, containScroll: "keepSnaps" },
    [Autoplay()],
  );
  //@ts-ignore
  const images = Object.values(modules).map((m) => m.default);
  return (
    <div className="contain mx-auto py-22">
      <h2 className="text-center  mx-auto max-w-xl text-3xl font-black">
        Integrate with leading financial institution
      </h2>
      <div className="h-20 contain mx-auto mt-12">
        <div className="embla" ref={emblaRef}>
          <div className="embla__contain  gap-2 justify-center">
            {images.map((item, index) => (
              <div
                className="embla__slide aspect-video   md:flex-[0_0_220px] h-15 md:h-22"
                key={"slide" + index}
              >
                <img src={item} alt="" className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
