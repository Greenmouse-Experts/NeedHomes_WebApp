export default function Statistics() {
  const stats = [
    {
      amount: '5000',
      title: 'Houses for Investment',
    },
    {
      amount: '10000',
      title: 'Houses for Purchase',
    },
    {
      amount: '8000',
      title: 'Satisfied Customers',
    },
    {
      amount: '500',
      title: 'Agents',
    },
  ] as const

  return (
    <div className="contain mx-auto space-y-8 py-22 bg-gray-100 px-4 md:px-0">
      <h2 className="text-4xl text-center font-bold md:text-left">
        Our Statistics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {stats.map((item, index) => (
          <div
            key={item.title + index}
            className="p-6 grid place-items-center gap-4 text-center bg-white rounded-lg shadow-sm border-2 border-transparent hover:border-[var(--color-orange)] transition-all w-full max-w-[250px]"
          >
            <img
              src={`/stats/stats_${index + 1}.svg`}
              alt={item.title}
              className="w-16 h-16 md:w-20 md:h-20"
            />
            <div>
              <p className="text-3xl md:text-4xl font-bold">{item.amount}</p>
              <p className="text-sm md:text-base text-gray-600 mt-2">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

