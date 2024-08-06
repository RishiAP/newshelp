import React from "react"
export default function CategoryLayout({
    children
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>{children}</>
    )
  }
export async function generateMetadata({params}:{params:{category:string}}){
    return {
        title: `${params.category} | News Help`,
        description: `Latest news on ${params.category}`
    }
}