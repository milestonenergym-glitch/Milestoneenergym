'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Clock, ArrowRight, Filter } from 'lucide-react'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const classes = [
  { id: 'c1', name: 'CrossFit HIIT', trainer: 'Rahul Singh', time: '06:00 AM', duration: '60 min', day: 'Mon', type: 'CrossFit', spots: 5, color: '#EF4444' },
  { id: 'c2', name: 'Yoga Flow', trainer: 'Priya Sharma', time: '07:00 AM', duration: '60 min', day: 'Mon', type: 'Yoga', spots: 8, color: '#EC4899' },
  { id: 'c3', name: 'Strength & Power', trainer: 'Arjun Mehta', time: '08:00 AM', duration: '75 min', day: 'Tue', type: 'Strength', spots: 10, color: '#0F52BA' },
  { id: 'c4', name: 'Cardio Blast', trainer: 'Anjali Patel', time: '06:30 AM', duration: '45 min', day: 'Wed', type: 'Cardio', spots: 12, color: '#F59E0B' },
  { id: 'c5', name: 'Functional Fitness', trainer: 'Vikram Das', time: '07:30 AM', duration: '60 min', day: 'Thu', type: 'Functional', spots: 8, color: '#8B5CF6' },
  { id: 'c6', name: 'Zumba Dance', trainer: 'Kavita Roy', time: '06:00 AM', duration: '60 min', day: 'Fri', type: 'Dance', spots: 15, color: '#EC4899' },
  { id: 'c7', name: 'Weekend Warrior', trainer: 'Rahul Singh', time: '08:00 AM', duration: '90 min', day: 'Sat', type: 'CrossFit', spots: 0, color: '#EF4444' },
  { id: 'c8', name: 'Morning Yoga', trainer: 'Priya Sharma', time: '07:00 AM', duration: '60 min', day: 'Sun', type: 'Yoga', spots: 10, color: '#EC4899' },
  { id: 'c9', name: 'HIIT Cardio', trainer: 'Anjali Patel', time: '05:30 AM', duration: '45 min', day: 'Tue', type: 'Cardio', spots: 6, color: '#F59E0B' },
  { id: 'c10', name: 'Power Lifting', trainer: 'Arjun Mehta', time: '09:00 AM', duration: '90 min', day: 'Sat', type: 'Strength', spots: 4, color: '#0F52BA' },
]

export default function ClassSchedule() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeDay, setActiveDay] = useState('Mon')
  const [dbClasses, setDbClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@/app/actions/classes').then(({ getClasses }) => {
      getClasses().then(data => {
        setDbClasses(data)
        setLoading(false)
      })
    })
  }, [])

  const displayClasses = dbClasses.length > 0 ? dbClasses.map(c => ({
    id: c.id,
    name: c.name,
    trainer: c.trainer?.name || 'Milestone Trainer',
    time: c.time || c.scheduleTime,
    duration: c.duration || '60 min',
    day: c.day || 'Mon',
    type: c.classType || 'General',
    spots: c.capacity, // Using capacity for spots for now
    color: '#0F52BA' // Default color since it's not in DB yet
  })) : classes

  const filtered = displayClasses.filter(c => c.day === activeDay)

  return (
    <section
      className="section-padding bg-[#0A0A0A]"
      id="class-schedule"
      aria-labelledby="classes-heading"
    >
      <div className="container-custom" ref={ref}>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="section-label mb-3 inline-block"
            >
              Weekly Schedule
            </motion.span>
            <motion.h2
              id="classes-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Class <span className="text-gradient">Schedule</span>
            </motion.h2>
          </div>
          <Link href="/classes" className="flex items-center gap-2 text-brand-blue-300 hover:text-white text-sm font-medium transition-colors" id="view-all-classes">
            View Full Schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Day Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeDay === day
                  ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-[0_0_20px_rgba(15,82,186,0.4)]'
                  : 'glass text-white/50 hover:text-white border border-white/8'
              }`}
              id={`day-filter-${day.toLowerCase()}`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px]">
          {loading ? (
            <div className="col-span-3 flex items-center justify-center py-16 text-white/50 animate-pulse">
              Loading schedule...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-3 flex items-center justify-center py-16 text-white/30">
              <div className="text-center">
                <Filter className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No classes scheduled for {activeDay}</p>
              </div>
            </div>
          ) : (
            filtered.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 border border-white/8 hover:border-white/15 transition-all group hover:-translate-y-0.5"
                id={`class-${cls.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `${cls.color}20`, color: cls.color }}
                  >
                    {cls.type}
                  </div>
                  <span className={`text-xs font-medium ${cls.spots === 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {cls.spots === 0 ? 'Full' : `${cls.spots} spots`}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-brand-gold transition-colors">{cls.name}</h3>
                <p className="text-white/40 text-sm mb-4">with {cls.trainer}</p>
                <div className="flex items-center gap-4 text-white/50 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {cls.time}
                  </div>
                  <div className="text-white/20">•</div>
                  <span>{cls.duration}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/8">
                  <button
                    disabled={cls.spots === 0}
                    className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${
                      cls.spots === 0
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-gradient-to-r from-brand-blue to-blue-600 text-white hover:opacity-90'
                    }`}
                    id={`book-class-${cls.id}`}
                  >
                    {cls.spots === 0 ? 'Fully Booked' : 'Book Class'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
