"use client"

import { CirclePlus } from "lucide-react"
import { Button } from "./ui/button"

export function BtnReload() {
  const reload = () => window.location.reload()

  return (
    <Button type="button" onClick={reload} className="flex items-center gap-1" variant="outline">
       <CirclePlus size={18} />
    </Button>
  )
}