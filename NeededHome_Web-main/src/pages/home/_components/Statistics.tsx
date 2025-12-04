export default function Statistics() {
  const stats = [
    {
      amount: 1000,
      title: "Houses for Investment",
    },
    {
      amount: 1000,
      title: "Houses for Investment",
    },
    {
      amount: 1000,
      title: "Houses for Investment",
    },
    {
      amount: 1000,
      title: "Agent",
    },
  ] as const;
  return (
    <div className="contain mx-auto space-y-8 py-22 bg-base-200  px-4 md:px-0">
      <h2 className="text-4xl  text-center font-bold md:text-left">
        Our Statistics
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,auto))] justify-center md:justify-between">
        {stats.map((item, index) => (
          <div
            key={item.title + index}
            className="p-4 grid place-items-center gap-3 text-center "
          >
            <img src={`stats/stats_${index + 1}.svg`} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
