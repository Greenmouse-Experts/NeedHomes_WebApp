export default function CoTypes() {
  const co_types = [
    {
      title: "Co-Invest",
      background: "#5853F6",
      photo: "co_invest.png",
      description:
        "Build wealth through partnership—every investment brings you closer to long-term financial success.",
    },
    {
      title: "Co-Build",
      background: "#39383E",
      photo: "co_build.png",
      description:
        "Join a network of forward-thinking investors turning development opportunities into profitable assets",
    },
  ] as const;
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,.7fr))] contain mx-auto gap-12  w-fit justify-center py-22">
      {co_types.map((type, index) => (
        <div
          key={index}
          className="p-4 flex flex-col text-white rounded-md"
          style={{ background: type.background }}
        >
          <div className="text-center space-y-4 mt-12 max-w-md mx-auto">
            <h2 className="text-white font-bold text-xl">{type.title}</h2>
            <p>{type.description}</p>
            <button className="btn btn-primary">Get Started</button>
          </div>
          <img src={type.photo} className="mt-12 mx-4 " alt="" />
        </div>
      ))}
    </div>
  );
}
