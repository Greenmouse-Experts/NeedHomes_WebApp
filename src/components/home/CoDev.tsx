export default function CoDev() {
  const dev_steps = [
    {
      title: 'Funding',
      description:
        'Pool of investors comes together to contribute agreed amount paying either outright or installment before and during construction.',
      icon: '/funding-icon.svg',
    },
    {
      title: 'Construction',
      description:
        'Projects are professionally designed, managed, and monitored by Needhomes and its construction partners until completion.',
      icon: '/construction-icon.svg',
    },
    {
      title: 'Ownership',
      description:
        'When completed, investors receive full ownership of the property.',
      icon: '/ownership-icon.svg',
    },
  ] as const

  return (
    <div className="relative isolate flex flex-col min-h-[520px] px-4 md:px-6 pb-12 md:pb-0">
      <img
        src="/co_dev.png"
        alt="Co-Development"
        className="absolute -z-10 h-full w-full inset-0 object-cover"
      />
      <div className="space-y-12 py-12 text-white flex flex-col w-full">
        <div className="mx-auto max-w-3xl text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold">What is Co-Development?</h2>
          <p>
            We bring multiple qualified home buyers or investors together to fund, build & own housing units collectively. Each subscriber contributes an agreed portion into the project during construction and receives full legal ownership upon completion.
          </p>
        </div>
      </div>
      <div className="text-white w-full contain mx-auto">
        <div className="flex flex-wrap justify-center md:mb-12">
          {dev_steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 p-4 w-full max-w-[350px]"
            >
              <div className="flex bg-white rounded-full p-4">
                <img
                  src={step.icon}
                  alt={step.title}
                  className="flex-1 object-contain size-10"
                />
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
               <p className="text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

