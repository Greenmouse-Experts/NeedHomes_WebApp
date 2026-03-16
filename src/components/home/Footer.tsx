import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Youtube } from "lucide-react";

interface Links {
  name: string;
  path?: string;
  icon?: React.ReactNode;
}

const companyLinks = [
  {
    name: "About Us",
    path: "/about-us",
  },
  {
    name: "Leadership",
    path: "/leadership",
  },
  {
    name: "Careers",
    path: "/careers",
  },
  {
    name: "Partner with us",
    path: "/partner-with-us",
  },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
] satisfies Links[];

const investment_links: Links[] = [
  {
    name: "Fractional Ownership",
    path: "/",
  },
  {
    name: "Co-Development",
    path: "/",
  },
  {
    name: "Land Banking",
    path: "/",
  },
  {
    name: "Outright Purchase",
    path: "/",
  },
  {
    name: "Save to Own",
    path: "/",
  },
];

const resources_links: Links[] = [
  {
    name: "Blog",
    path: "/blogs",
  },
  {
    name: "FAQs",
    path: "/faqs",
  },
  {
    name: "How it works",
    path: "/how-it-works",
  },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/needhomespdc_community?igsh=MWpobnl2enJ3czlpaA==",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@needhomespdc?_r=1&_t=ZS-94jqiFlqKgc",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/+23409018464742",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/needhomes-property-investment-limited",
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@needhomespdc2847?si=VOpOpAUUPFYN4DTQ",
    icon: <Youtube className="w-5 h-5" />,
  },
];

export default function Footer() {
  return (
    <div className="pt-12 pb-2" style={{ background: "#39383E" }}>
      <footer className="contain mx-auto px-4 md:px-6 *:text-left">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="max-w-2xs space-y-3 text-white flex-1">
            <img src="/need_homes_logo.png" alt="NeedHomes" className="h-18" />
            <div></div>
            <p>+234 702 500 5857</p>
            <p>sales@needhomes.ng</p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="hover:text-[var(--color-orange)] transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <section className="grid flex-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
            <RenderLinks title="Company" links={companyLinks} />
            <RenderLinks title="Investment" links={investment_links} />
            <RenderLinks title="Resources" links={resources_links} />
          </section>
        </div>
        <div className="flex flex-col md:flex-row md:items-center mt-28 text-white *:text-left">
          <p className="">
            © 2025 Needhomes Property Investment Limited. All rights reserved.
          </p>
          <div className="md:ml-auto space-x-2 flex gap-2">
            <Link
              to="/privacy-policy"
              className="hover:text-[var(--color-orange)] transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              to="/terms-and-conditions"
              className="hover:text-[var(--color-orange)] transition-colors"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const RenderLinks = ({ title, links }: { title: string; links: Links[] }) => {
  return (
    <div className="w-full text-white">
      <h2 className="text-xl font-bold">{title}</h2>
      <ul className="space-y-3 my-2">
        {links.map((item: Links, index) => {
          return (
            <li key={item.name + index}>
              <Link
                to={item.path || "/"}
                className="hover:text-[var(--color-orange)] transition-colors flex items-center gap-2"
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
