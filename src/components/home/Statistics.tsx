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
    <div className="contain mx-auto space-y-8 py-22 bg-gray-100 px-4 md:px-6">
      <h2 className="text-4xl text-center font-bold md:text-left">
        Our Statistics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center">
        {stats.map((item, index) => (
          <div
            key={item.title + index}
            className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px]"
          >
            <img
              src={`/stats/stats_${index + 1}.svg`}
              alt={item.title}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

