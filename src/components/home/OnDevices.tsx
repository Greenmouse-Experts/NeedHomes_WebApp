import { useState } from 'react'
import FlexInfo from './FlexInfo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function GetOnDevices() {
  const [formData, setFormData] = useState({ name: '', email: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // Handle form submission
  }

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-orange) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="contain mx-auto grid px-4 md:px-0 md:grid-cols-2 py-12 text-white text-center md:text-left relative z-10">
        <FlexInfo>
          <div className="mb-4">
            <img src="/logo_white.png" alt="NeedHomes" className="h-12 mb-4" onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }} />
          </div>
          <h2 className="text-4xl font-bold mb-4">Download Our Mobile App</h2>
          <div className="space-x-4 gap-2 mx-auto md:mx-0 flex flex-col md:flex-row">
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-black hover:bg-gray-100 border-white btn-block md:w-auto"
            >
              <img src="/apple_dark.svg" alt="" className="w-5 h-5 mr-2" /> Get
              On iPhone
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-black hover:bg-gray-100 border-white btn-block md:w-auto"
            >
              <img src="/google_icon.svg" alt="" className="w-5 h-5 mr-2" /> Get
              On Android
            </Button>
          </div>
        </FlexInfo>
        <FlexInfo>
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-md text-white p-6 w-full max-w-[390px] md:w-[390px] md:ml-auto md:mr-0 mx-auto space-y-4 flex flex-col ring-2 ring-[var(--color-orange)] rounded-2xl shadow-2xl"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black">NewsLetter</h2>
              <p className="text-lg">Subscribe To Newsletter For Updates</p>
            </div>
            <Input
              type="text"
              className="w-full bg-gray-700/50 text-white border-gray-600 placeholder:text-gray-400 focus:bg-gray-700"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              type="email"
              className="w-full bg-gray-700/50 text-white border-gray-600 placeholder:text-gray-400 focus:bg-gray-700"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Button
              variant="accent"
              size="lg"
              className="max-w-[250px] w-full mx-auto"
            >
              Send
            </Button>
          </form>
        </FlexInfo>
      </div>
    </div>
  )
}

