import FlexInfo from './FlexInfo'
import SectionGrid from './SectionGrid'
import { Button } from '@/components/ui/Button'

export default function Explore() {
  return (
    <div className="mb-12">
      <SectionGrid>
        <FlexInfo className="">
          <div className="flex flex-1 md:justify-start justify-center">
            <div className="md:size-[520px] size-80">
              <img
                src="/workings.png"
                className="size-full object-contain"
                alt="How it works"
              />
            </div>
          </div>
        </FlexInfo>
        <FlexInfo className="leading-loose space-y-6 text-center md:text-left">
          <h2 className="text-md md:text-lg">
            At Needhomes, we redefine property ownership, using our PropTech
            platform to make owning real estate easier, more transparent, and
            accessible to everyone. From co-developing verified projects to
            fractional ownership or full home purchase, NeedHomes provides
            secure and flexible pathways to property investment.With NeedHomes,
            you don't just invest in real estate — you invest in your future.
          </h2>
          <div className="mt-6">
            <Button variant="outline" size="lg">
              Explore How It Works
            </Button>
          </div>
        </FlexInfo>
      </SectionGrid>
    </div>
  )
}

