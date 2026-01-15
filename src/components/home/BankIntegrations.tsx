export default function BankIntegrations() {
  const banks = [
    { name: 'Stanbic', logo: '/banks/stanbic.png' },
    { name: 'Paystack', logo: '/banks/paystack.png' },
    { name: 'Alat', logo: '/banks/alat.png' },
  ]

  return (
    <div className="contain mx-auto py-22 px-4 md:px-6">
      <h2 className="text-center mx-auto max-w-xl text-3xl font-semibold">
        Integrate with leading financial institution
      </h2>
      <div className="mt-12">
        <div className="flex gap-8 md:gap-16 justify-center items-center flex-wrap">
          {banks.map((bank, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-16 w-32 md:h-20 md:w-40"
            >
              <img
                src={bank.logo}
                alt={bank.name}
                className="h-full w-full object-contain hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

