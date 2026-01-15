interface Links {
  name: string
  path?: string
}

const companyLinks = [
  {
    name: 'About Us',
    path: '/',
  },
  {
    name: 'Customer stories',
    path: '/',
  },
  {
    name: 'Careers',
    path: '/',
  },
  {
    name: 'FAQ',
    path: '/',
  },
] satisfies Links[]

const investment_links: Links[] = [
  {
    name: 'How it works',
    path: '/',
  },
  {
    name: 'Fractional Ownership',
    path: '/',
  },
  {
    name: 'Co-Development',
    path: '/',
  },
  {
    name: 'ROI calculator',
    path: '/',
  },
  {
    name: 'Partner with us',
    path: '/',
  },
]

const resources_links: Links[] = [
  {
    name: 'Real Estate Insights',
    path: '/',
  },
  {
    name: 'Proptech News',
    path: '/',
  },
  {
    name: 'Home Buying Tips',
    path: '/',
  },
]

const support_links = [
  {
    name: 'Live Chat',
    path: '/',
  },
  {
    name: 'Book a call',
    path: '/',
  },
  {
    name: 'Support Email',
    path: '/',
  },
]

export default function Footer() {
  return (
    <div className="pt-12 pb-2" style={{ background: '#39383E' }}>
      <footer className="contain mx-auto px-4 md:px-6 *:text-left">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="max-w-2xs space-y-3 text-white flex-1">
            <img src="/need_homes_logo.png" alt="NeedHomes" className="h-18" />
            <div></div>
            <p>+234 702 500 5857</p>
            <p>sales@needhomes.ng</p>
          </div>
          <section className="grid flex-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
            <RenderLinks title="Company" links={companyLinks} />
            <RenderLinks title="Investment" links={investment_links} />
            <RenderLinks title="Resources" links={resources_links} />
            <RenderLinks title="Support" links={support_links} />
          </section>
        </div>
        <div className="flex flex-col md:flex-row md:items-center mt-28 text-white *:text-left">
          <p className="">
            © 2025 Needhomes Property Investment Limited. All rights reserved.
          </p>
          <div className="md:ml-auto space-x-2 flex gap-2">
            <p>Privacy Policy</p>
            <p>Terms and Conditions</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const RenderLinks = ({ title, links }: { title: string; links: Links[] }) => {
  return (
    <div className="w-full text-white">
      <h2 className="text-xl font-bold">{title}</h2>
      <ul className="space-y-3 my-2">
        {links.map((item: Links, index) => {
          return (
            <li key={item.name + index}>
              <a href="#" className="hover:text-[var(--color-orange)] transition-colors">
                {item.name}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

