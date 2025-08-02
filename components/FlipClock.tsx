"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function FlipClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => num.toString().padStart(2, "0")

  const stats = [
    { label: "DAY", value: formatNumber(time.getDate()) },
    { label: "MONTH", value: formatNumber(time.getMonth() + 1) },
    { label: "YEAR", value: time.getFullYear().toString() },
    { label: "HOUR", value: formatNumber(time.getHours()) },
    { label: "MIN", value: formatNumber(time.getMinutes()) },
    { label: "SEC", value: formatNumber(time.getSeconds()) },
  ]

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 mb-2">
            <div className="text-2xl md:text-3xl font-bold text-white font-mono">{stat.value}</div>
          </div>
          <div className="text-xs text-gray-400 font-sans tracking-wider">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
