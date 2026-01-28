import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function Header() {
    return (
        <header className="border-b border-border bg-background/80 backdrop-blur-xl py-2">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href={"/"}>
                        <Image
                            src="/images/valmore-logo.png"
                            alt="Valmore Logo"
                            width={56}
                            height={56}
                            className="rounded-lg"
                        />
                    </Link>
                </div>
            </div>
        </header>
    )
}