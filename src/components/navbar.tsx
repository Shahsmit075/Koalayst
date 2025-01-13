import Link from "next/link"
import { MaxWidthWrapper } from "./max-width-wrapper"
import { SignOutButton } from "@clerk/nextjs"
import { Button, buttonVariants } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"

export const Navbar = async () => {
  const user = await currentUser()

  return (
    <nav className="sticky z-[100] h-26 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="text-3xl font-semibold flex h-16 items-center justify-between">
          {/* <Link href="/" className="flex z-40 font-semibold">
          Koala<span className="text-brand-700">yst</span>
          </Link> */}

          <Link href="/" className="flex items-center z-90 font-bold">
              <img 
                src="/brand-asset-profile-picture.png" 
                alt="Logo" 
                className="h-22 w-24 mr-2" 
              />
              <span className="text-3xl font-extrabold tracking-wide">
                Koala<span className="text-brand-700">yst</span>
              </span>
            </Link>

          <div className="text-xl font-semibold h-full flex items-center space-x-4">
            {user ? (
              <>
                <SignOutButton>
                  <Button size="sm" variant="ghost">
                    Sign out
                  </Button>
                </SignOutButton>

                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1",
                  })}
                >
                  Dashboard <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/upgrade"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign in
                </Link>

                <div className=" text-xl font-semibold h-8 w-px bg-gray-200" />

                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1.5",
                  })}
                >
                  Sign up <ArrowRight className="size-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
