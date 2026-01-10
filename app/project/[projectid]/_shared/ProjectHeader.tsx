import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import Image from 'next/image'

function ProjectHeader() {
  return (
    <div className='flex items-center justify-center p-3 shadow'>
        <div className="flex items-center gap-2 flex-1">
        <Image
          src="/Logo.png"
          alt="logo"
          width={35}
          height={35}
          className="rounded-full"
        />
        <h2 className="text-xl font-semibold">
          <span className="text-primary">UIUX</span> Design
        </h2>
      </div>
      <Button><Save/>Save</Button>
    </div>
  )
}

export default ProjectHeader