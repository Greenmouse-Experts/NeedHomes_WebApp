import FlexInfo from "./FlexInfo";

export default function FAQ() {
  const questions = [
    {
      q: "What is NeedHomes and how does it work?",
      a: "NeedHomes is a platform that...",
    },
    {
      q: "Who can invest with NeedHomes?",
      a: "Anyone can invest with NeedHomes...",
    },
    {
      q: "How do I get started on NeedHomes?",
      a: "To get started, simply...",
    },
    {
      q: "What is NeedHomes and how does it work?",
      a: "NeedHomes is a platform that...",
    },
  ];
  return (
    <div className="contain  mx-auto py-22 bg-base-200">
      <div className="grid md:grid-cols-2">
        <FlexInfo className="text-center md:text-left">
          <div className="w-full md:max-w-5/6 space-y-4">
            <h2 className="text-3xl font-black">Frequently Asked Question</h2>
            <p>
              Comm on frequently asked question in real estate investment at
              NeedHomes
            </p>
            <div>
              <button className="btn btn-primary">Contact Us</button>
            </div>
          </div>
        </FlexInfo>
        <div>
          {questions.map((item, idx) => (
            <div key={idx} className="collapse collapse-arrow rounded-box">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-semibold text-md">
                Q: {item.q}
              </div>
              <div className="collapse-content p-2 bg-base-200 pl-4">
                <p>A: {item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
