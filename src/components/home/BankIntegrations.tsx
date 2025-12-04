export default function BankIntegrations() {
  const banks = [
    { name: 'Access Bank', logo: '/banks/access.png' },
    { name: 'Eco Bank', logo: '/banks/eco.png' },
    { name: 'Paystack', logo: '/banks/paystack.png' },
    { name: 'UBA', logo: '/banks/uba.png' },
    { name: 'Wema Bank', logo: '/banks/wema.png' },
  ]

  return (
    <div className="contain mx-auto py-22">
      <h2 className="text-center mx-auto max-w-xl text-3xl font-black">
        Integrate with leading financial institution
      </h2>
      <div className="h-20 contain mx-auto mt-12">
        <div className="flex gap-8 justify-center items-center flex-wrap">
          {banks.map((bank, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-16 w-32"
            >
              <img
                src={bank.logo}
                alt={bank.name}
                className="h-full w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

