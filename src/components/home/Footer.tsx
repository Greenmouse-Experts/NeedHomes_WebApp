import { Link } from '@tanstack/react-router'
import { Phone, Mail, MailIcon, MailCheck } from 'lucide-react'

interface Links {
  name: string
  path?: string
  icon?: React.ReactNode
}

const companyLinks = [
  {
    name: 'About Us',
    path: '/about-us',
  },
  {
    name: 'Leadership',
    path: '/leadership',
  },
  {
    name: 'Careers',
    path: '/careers',
  },
  {
    name: 'Partner with us',
    path: '/partner-with-us',
  },
  {
    name: 'Contact Us',
    path: '/contact-us',
  },
] satisfies Links[]

const investment_links: Links[] = [
  {
    name: 'Fractional Ownership',
    path: '/',
  },
  {
    name: 'Co-Development',
    path: '/',
  },
  {
    name: 'Land Banking',
    path: '/',
  },
  {
    name: 'Outright Purchase',
    path: '/',
  },
  {
    name: 'Save to Own',
    path: '/',
  },
]

const resources_links: Links[] = [
  {
    name: 'Blog',
    path: '/blog',
  },
  {
    name: 'FAQs',
    path: '/faqs',
  },
  {
    name: 'How it works',
    path: '/how-it-works',
  },
]

const support_links = [
  {
    name: '+234 702 500 5857',
    path: 'tel:+2347025005857',
    icon: <Phone className="w-4 h-4 shrink-0" />,
  },
  {
    name: 'sales@needhomes.ng',
    path: 'mailto:sales@needhomes.ng',
    icon: <Mail className="w-4 h-4 shrink-0" />,
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
            <Link to="/privacy-policy" className="hover:text-[var(--color-orange)] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms-and-conditions" className="hover:text-[var(--color-orange)] transition-colors">
              Terms and Conditions
            </Link>
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
              <Link to={item.path || '/'} className="hover:text-[var(--color-orange)] transition-colors flex items-center gap-2">
                {item.icon && item.icon}
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

