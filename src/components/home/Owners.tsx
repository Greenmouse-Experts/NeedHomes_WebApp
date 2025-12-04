import FlexInfo from './FlexInfo'
import Sectiongrid from './SectionGrid'

export default function Owners() {
  return (
    <div className="py-12">
      <Sectiongrid>
        <FlexInfo className="px-6">
          <img src="/ownership.png" alt="Fractional Ownership" className="" />
        </FlexInfo>

        <FlexInfo>
          <div className="mx-auto max-w-md space-y-6 text-center md:text-left">
            <h2 className="md:text-5xl text-4xl font-bold">
              What is Fractional Ownership?
            </h2>
            <p className="text-lg leading-loose">
              Fractional ownership is a structure in which multiple individuals
              or entities can each purchase a portion of an asset.
              <br /> Each investor buys a fraction of the property, sharing both
              the cost and the potential profit.
            </p>
          </div>
        </FlexInfo>
      </Sectiongrid>
    </div>
  )
}

