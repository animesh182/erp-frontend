import Link from 'next/link'
import React from 'react'
import { CompanyIcon } from '../companyicon'

const LoginTextHeader = () => {
  return (
    <div className="lg:flex flex-col justify-center space-y-2 pr-20 pb-6 pt-20 hidden">
        
    
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <CompanyIcon size={40} color="#1169C4" />
      <span className="text-primary text-xl">Avinto AS</span>
    </Link>

  <div className="text-secondary-foreground  text-2xl font-semibold">Welcome to Avinto ERP.</div>
  <div className="text-muted-foreground text-sm leading-5">
  Avinto ERP is a software dedicated to Avinto and their employees. It is a radically new type of CRM. Built on an entirely new
<br/>type of data architecture, you&apos;ll have profiles and records <br/>of
every interaction within your network in minutes, always
updated in real-time.
<br/>
<br/>
You&apos;ll be able to track your performance and attendance in
the company.
<br/>
<br/>
Let&apos;s begin.
  </div>
</div>
  )
}

export default LoginTextHeader



export const LoginTextFooter = () => {
  return (
  <>
    By inserting your email you confirm you agree to Avinto contacting you about our
product and services. You can opt out at any time by clicking unsubscribe in our
emails. Find out more about how we use data in our  <Link href="/"><u>privacy policy</u></Link>.
</>
  )
}



