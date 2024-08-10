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
export async function generateMetadata({params}:{params:{year:string,month:string}}){
    return {
        title: `${params.month} ${params.year} Archives | NewsHelp`,
        description: `News of the month ${params.month} in ${params.year}`,
        robots:{
          follow:true,
          index:true
        },
        category: "archives",
        manifest: '/manifest.json',
    }
}