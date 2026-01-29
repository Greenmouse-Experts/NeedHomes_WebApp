import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/home/Footer'

export const Route = createFileRoute('/leadership')({
  component: RouteComponent,
})

const team = [
  { name: "Collins Amam", role: "Founder/CEO", image: "/assets/ceo.jpg" },
  { name: "Daniel Aghedo", role: "CTO – Chief Technical Officer", image: "/assets/cto.jpg" },
  { name: "Jeremiah Ochai", role: "Head of Operations", image: "/assets/hoo.jpg" },
  { name: "Esther Chuna", role: "Client Relations Manager (CRM)", image: "/assets/crm.jpg" },
  { name: "Andyson Ukaegbu", role: "Admin", image: "/assets/admin.jpg" },
  { name: "Blessing Monday", role: "Media/Publicity", image: "/assets/mediapub.jpg" },
  { name: "Emmanuel Mbaogu Chidozie", role: "Clients Services", image: "/assets/clientservice.jpg" },
  { name: "Teusan Gideon David", role: "Head Clients Services", image: "/assets/hcs.jpg" },
  { name: "Esther Ironcho", role: "Sales/Marketing", image: "/assets/salesmarket.jpg" },
  { name: "Christy Marcel", role: "Marketing", image: "/assets/marketing.jpg" },
  // { name: "Taiwo O. Olayinka", role: "Partnerships Lead – Co-development", image: "/assets/Rectangle 21299.png" },
  // {
  //   name: "Barr. Seye Dara",
  //   role: "Legal Advisors – Real Estate, Finance, gov",
  //   image: "/assets/Rectangle 21299(1).png",
  // },
];

function RouteComponent() {
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-[#333d42] py-20">
          <div className="contain mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
              Leadership<span className="text-brand-orange">.</span>
            </h1>
          </div>
        </section>
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-4xl font-serif font-medium text-[#333d42]">
                Meet the Team<span className="text-brand-orange">.</span>
              </h2>
              <p className="text-muted-foreground mt-4">
                The dedicated professionals driving innovation and excellence in
                property investment at NeedHomes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <div key={i} className="group">
                  <div className="aspect-square bg-[#f8f8f8] mb-4 overflow-hidden rounded-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-serif font-medium text-[#333d42]">
                    {member.name}
                  </h3>
                  <p className="text-sm text-brand-orange font-medium">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
