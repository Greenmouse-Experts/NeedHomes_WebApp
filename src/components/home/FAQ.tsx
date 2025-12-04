import { useState } from 'react'
import FlexInfo from './FlexInfo'
import { Button } from '@/components/ui/Button'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const questions = [
    {
      q: 'What is NeedHomes and how does it work?',
      a: 'NeedHomes is a platform that...',
    },
    {
      q: 'Who can invest with NeedHomes?',
      a: 'Anyone can invest with NeedHomes...',
    },
    {
      q: 'How do I get started on NeedHomes?',
      a: 'To get started, simply...',
    },
    {
      q: 'What is NeedHomes and how does it work?',
      a: 'NeedHomes is a platform that...',
    },
  ]

  return (
    <div className="contain mx-auto py-22 bg-gray-100">
      <div className="grid md:grid-cols-2">
        <FlexInfo className="text-center md:text-left">
          <div className="w-full md:max-w-5/6 space-y-4">
            <h2 className="text-3xl font-black">Frequently Asked Question</h2>
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
          {questions.map((item, idx) => (
            <div
              key={idx}
              className="mb-2 border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 font-semibold text-md hover:bg-gray-50 transition-colors"
              >
                <span>Q: {item.q}</span>
                <span className="text-xl">{openIndex === idx ? '−' : '+'}</span>
              </button>
              {openIndex === idx && (
                <div className="p-4 bg-gray-100 pl-4 border-t border-gray-200">
                  <p>A: {item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

