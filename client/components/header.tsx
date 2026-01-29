import Link from "next/link"

export function Header() {
    return (
        <header className="border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <Link
                    href="/"
                    className="group flex items-center gap-2 cursor-pointer"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
                        V
                    </div>

                    <span className="text-lg font-semibold tracking-tight">
                        Valmore
                    </span>
                </Link>
            </div>
        </header>
    )
}
