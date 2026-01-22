import { Button } from '@/components/ui/Button'

export default function Explore() {
  return (
    <div className="contain mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="flex md:justify-start justify-center">
          <div className="md:w-[800px] w-full max-w-[500px]">
            <img
              src="/workings.png"
              className="w-full h-auto object-contain"
              alt="How it works"
            />
          </div>
        </div>
        <div className="leading-loose space-y-6 text-center md:text-left">
          <h2 className="text-base md:text-base">
            At Needhomes, we redefine property ownership, using our PropTech
            platform to make owning real estate easier, more transparent, and
            accessible to everyone. From co-developing verified projects to
            fractional ownership or full home purchase, NeedHomes provides
            secure and flexible pathways to property investment. With us,
            you don't just invest in real estate — you invest in your future.
          </h2>
          <div className="mt-6">
            <Button variant="outline" size="lg">
              Explore How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

