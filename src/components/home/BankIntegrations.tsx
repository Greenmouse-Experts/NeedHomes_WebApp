export default function BankIntegrations() {
  const banks = [
    { name: "membership_1", logo: "/membership/member_1.png" },
    { name: "membership_2", logo: "/membership/member_2.png" },
  ];

  return (
    <div className="contain mx-auto py-22 px-4 md:px-6">
      <h2 className="text-center mx-auto max-w-xl text-3xl font-semibold">
        Professional Membership
      </h2>
      <div className="mt-12">
        <div className="flex gap-8 md:gap-16 justify-center items-center flex-wrap">
          {banks.map((bank, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-2 size-52 "
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
  );
}
