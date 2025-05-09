"use client"
import React from "react"
import AlertBoxWidget from "../../../components/AlertBox/AlertBoxWidget"

const AlexBoxPage = ({ params }: { params: any }) => {
  const { accountAddress } = React.use<{
    accountAddress: string
  }>(params)
  if (!accountAddress) return null
  return (
    <div>
      <AlertBoxWidget accountAddress={accountAddress} />
    </div>
  )
}

export default AlexBoxPage
