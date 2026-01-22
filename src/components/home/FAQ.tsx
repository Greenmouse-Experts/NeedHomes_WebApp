import { useState } from 'react'
import FlexInfo from './FlexInfo'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenIndex, setModalOpenIndex] = useState<number | null>(null)
  
  const questions = [
    {
      q: 'What is Needhomes PropTech Platform?',
      a: 'Needhomes is a property co-development and fractional home-investment platform that enables individuals to co-own, co-develop, and invest in real estate projects affordably, transparently, and digitally.',
    },
    {
      q: 'How does co-development work?',
      a: 'We bring multiple qualified home buyers or investors together to fund, build & own housing units collectively. Each subscriber contributes an agreed portion into the project during construction and receives full legal ownership upon completion. Example: A 12-unit estate → 12 subscribers → construction funded collectively → each owns one fully built home.',
    },
    {
      q: 'Who can join Needhomes projects?',
      a: '✅ First-time home buyers\n✅ Real estate investors (local & diaspora)\n✅ Individuals seeking long-term returns on real estate assets\n✅ Anyone interested in affordable home ownership through structured payments',
    },
    {
      q: 'What project types does Needhomes offer?',
      a: 'Residential estates (terraces, apartments, duplexes), Smart and affordable homes, Mixed-use investment properties (New categories added as we expand regions)',
    },
    {
      q: 'What is Co-Ownership vs Co-Development?',
      a: 'Co-Ownership: Shares in a property after construction for investment & income with rental & capital gain returns. Co-Development: Full unit ownership before/during construction for living + equity with equity gain returns. Needhomes offers both — you choose based on your goals.',
    },
    {
      q: 'How secure is my investment?',
      a: 'We protect subscribers through: ✅ Verified project documentation ✅ Escrow or trustee-managed project accounts ✅ Legal title documentation ✅ Smart contract digital records (coming roadmap) ✅ Insurance on construction-related risks',
    },
    {
      q: 'How much do I need to start?',
      a: 'Contribution varies per project. Typical entry points: ₦500,000 – ₦5M initial deposit for co-development, ₦50,000 and above for co-ownership shares. Installment plans are available up to 18–24 months.',
    },
    {
      q: 'Are there guaranteed returns?',
      a: 'Real estate performance varies, but Needhomes projects are structured for: 12–25% annual capital appreciation and steady rental income (for co-ownership investments). We prioritize risk-mitigated projects only.',
    },
    {
      q: 'How do I monitor my investment?',
      a: 'Through your Needhomes mobile/web dashboard: Project milestone tracking, Payment records and receipts, Legal documentation, Rental income and dividends (where applicable)',
    },
    {
      q: 'What are management and service fees?',
      a: 'We charge a small management fee included in the subscription structure to cover: Platform support, Compliance & legal, Project oversight & reporting. Fee transparency is fully disclosed per project.',
    },
    {
      q: 'Can I exit before the project completes?',
      a: 'Yes. Options include: 1. Sell your position to new subscribers via the platform resale marketplace 2. Transfer to an approved buyer. Exit terms are clearly stated in your contract.',
    },
    {
      q: 'What locations do Needhomes projects cover?',
      a: 'Starting in Lagos, expanding to: Abuja, Port Harcourt, Ogun, Select Sub-Saharan African regions (expansion rollout)',
    },
    {
      q: 'Does Needhomes provide mortgages?',
      a: 'Not directly. However, we partner with mortgage banks and lenders to help subscribers secure: NHF loans, Mortgage refinancing after completion',
    },
    {
      q: 'What documents do subscribers get?',
      a: 'Each subscriber receives: Offer letter & subscription agreement, Payment schedule, Deed of assignment / Sublease agreement (depending on title), Allocation of home unit (upon completion)',
    },
    {
      q: 'How do I get started?',
      a: '1️⃣ Download and register on the Needhomes App 2️⃣ KYC verification 3️⃣ Choose a project 4️⃣ Start your subscription and track progress digitally',
    },
    {
      q: 'Can I invest from abroad (Diaspora)?',
      a: '✅ Yes — 100% digital onboarding. Accepted currencies: USD, GBP, EUR, CAD, NGN. Returns payout: Paid to your foreign/local bank',
    },
  ]

  // Show only first 5 FAQs initially
  const visibleQuestions = questions.slice(0, 5)

  return (
    <>
      <div className="contain mx-auto py-22 bg-gray-100 px-4 md:px-6">
        <div className="grid md:grid-cols-2">
          <FlexInfo className="text-center md:text-left">
            <div className="w-full md:max-w-5/6 space-y-4">
              <h2 className="text-3xl font-black">NEEDHOMES Frequently Asked Questions (FAQ)</h2>
              <p>
                Common frequently asked question in real estate investment at
                NeedHomes
              </p>
              <div>
                <Button variant="primary">Contact Us</Button>
              </div>
            </div>
          </FlexInfo>
          <div>
            {visibleQuestions.map((item, idx) => (
              <div
                key={idx}
                className="mb-2 border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 font-semibold text-md hover:bg-gray-50 transition-colors text-left"
                >
                  <span>Q: {item.q}</span>
                  <span className="text-xl flex-shrink-0 ml-2">{openIndex === idx ? '−' : '+'}</span>
                </button>
                {openIndex === idx && (
                  <div className="p-4 bg-gray-100 pl-4 border-t border-gray-200">
                    <p className="whitespace-pre-line">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
            
            {/* View More Button */}
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setModalOpen(true)}
                className="w-full md:w-auto"
              >
                View More FAQs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-orange-light)] text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold">All Frequently Asked Questions</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 flex-1">
              <div className="space-y-3">
                {questions.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => setModalOpenIndex(modalOpenIndex === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 font-semibold text-sm md:text-md hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="pr-4">Q{idx + 1}: {item.q}</span>
                      <span className="text-xl flex-shrink-0">{modalOpenIndex === idx ? '−' : '+'}</span>
                    </button>
                    {modalOpenIndex === idx && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="whitespace-pre-line text-sm md:text-base text-gray-700">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-gray-600">
                  <p className="font-semibold">Have More Questions?</p>
                  <p>📩 support@needhomes.com.ng | 📞 +234 702 500 5857</p>
                </div>
                <Button 
                  variant="primary"
                  onClick={() => setModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

