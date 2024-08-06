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
        title: `${params.month} ${params.year} Archives | News Help`,
        description: `News of the month ${params.month} in ${params.year}`
    }
}