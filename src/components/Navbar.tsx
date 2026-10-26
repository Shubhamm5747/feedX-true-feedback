'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'




const Navbar = () => {
    const {data :session} = useSession()
    const user:User = session?.user //checked documentation and they also used session instead of data

  return (
    <nav className="p-4 md:px-8 md:py-5 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          FeedX
        </Link>
        {session ? (
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto text-center sm:text-left">
            <span className="text-sm sm:text-base text-gray-200 truncate max-w-xs sm:max-w-none">
              Welcome, <strong className="text-white">{user?.username || user?.email}</strong>
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full sm:w-auto bg-slate-100 text-black hover:bg-slate-200"
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="w-full sm:w-auto">
            <Link href="/sign-in" className="w-full block sm:inline-block">
              <Button className="w-full sm:w-auto bg-slate-100 text-black hover:bg-slate-200" variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
