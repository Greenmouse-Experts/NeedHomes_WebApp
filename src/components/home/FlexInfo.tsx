import type { PropsWithChildren } from 'react'

interface FlexInfoProps extends PropsWithChildren {
  className?: string
}

export default function FlexInfo({ className, children }: FlexInfoProps) {
  return (
    <div
      className={`flex-1 px-2 md:px-0 min-h-80 flex flex-col justify-center leading-loose space-y-4 ${
        className ?? ''
      }`}
    >
      {children}
    </div>
  )
}

