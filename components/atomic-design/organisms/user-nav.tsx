"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atomic-design/molecules"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/atomic-design/atoms"

export function UserNav() {
  const { data: session } = useSession()
  
  // Extract user information with fallbacks
  const userImage = session?.user?.image || "/placeholder.svg?height=32&width=32"
  const userName = session?.user?.name || "User"
  const userEmail = session?.user?.email || "user@example.com"
  
  // Get initials for avatar fallback
  const initials = userName
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              await signOut({ redirect: false });

              let auth0Domain = process.env.NEXT_PUBLIC_AUTH0_ISSUER || "";
              if (!auth0Domain.startsWith("https://") && !auth0Domain.startsWith("http://")) {
                auth0Domain = `https://${auth0Domain}`;
              }

              const returnTo = encodeURIComponent(window.location.origin);
              const logoutUrl = `${auth0Domain}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${returnTo}`;

              window.location.href = logoutUrl;
            } catch (error) {
              console.error("Logout error:", error);
            }
          }}
          className="cursor-pointer"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

