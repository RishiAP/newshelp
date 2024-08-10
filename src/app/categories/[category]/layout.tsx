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
        title: `${params.category} | NewsHelp`,
        description: `Latest news on ${params.category}`,
        robots:{
          follow:true,
          index:true
        },
        category: `${params.category}`,
        manifest: '/manifest.json',
    }
}