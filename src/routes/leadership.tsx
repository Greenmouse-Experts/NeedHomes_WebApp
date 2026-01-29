import { createFileRoute } from '@tanstack/react-router'
import { User } from 'lucide-react'
import Footer from '@/components/home/Footer'

export const Route = createFileRoute('/leadership')({
  component: RouteComponent,
})

const team = [
  { name: "Collins Amam", role: "Founder/CEO" },
  { name: "Daniel Aghedo", role: "CTO – Chief Technical Officer" },
  { name: "Jeremiah Ochai", role: "Head of Operations" },
  { name: "Esther Chuna", role: "Client Relations Manager (CRM)" },
  { name: "Andyson Ukaegbu", role: "Admin" },
  { name: "Blessing Monday", role: "Media/Publicity" },
  { name: "Emmanuel Mbaogu Chidozie", role: "Clients Services" },
  { name: "Teusan Gideon David", role: "Head Clients Services" },
  { name: "Esther Ironcho", role: "Sales/Marketing" },
  { name: "Christy Marcel", role: "Marketing" },
  { name: "Taiwo O. Olayinka", role: "Partnerships Lead – Co-development" },
  {
    name: "Barr. Seye Dara",
    role: "Legal Advisors – Real Estate, Finance, gov",
  },
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
                  <div className="aspect-square bg-[#f8f8f8] flex items-center justify-center mb-4 transition-colors group-hover:bg-[#f0f0f0]">
                    <User className="w-16 h-16 text-[#333d42]/20" />
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
