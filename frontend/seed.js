const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with default frontend data...')

  // 1. Seed Plans
  console.log('Seeding Plans...')
  await prisma.plan.createMany({
    data: [
      { name: 'Monthly', durationInDays: 30, price: 1500, colorTheme: '#0F52BA', popular: false, features: '["All Equipment Access","Cardio Zone","Locker Room","Parking","Basic Diet Guidance"]' },
      { name: 'Quarterly', durationInDays: 90, price: 3999, originalPrice: 4500, colorTheme: '#0F52BA', popular: false, features: '["Everything in Monthly","Group Classes","Diet Consultation","1 PT Session/month","Progress Tracking"]' },
      { name: 'Half Yearly', durationInDays: 180, price: 6999, originalPrice: 9000, colorTheme: '#D4AF37', popular: true, features: '["Everything in Quarterly","2 PT Sessions/month","Nutrition Plan","Body Composition Analysis","Priority Support"]' },
      { name: 'Yearly', durationInDays: 365, price: 11999, originalPrice: 18000, colorTheme: '#0F52BA', popular: false, features: '["Everything in Half Yearly","Unlimited PT Sessions","Custom Diet Plan","Transformation Program","VIP Member Badge"]' }
    ]
  })

  // 2. Seed Trainers (Users + TrainerProfiles)
  console.log('Seeding Trainers...')
  const trainers = [
    { name: 'Rahul Singh', email: 'rahul@milestone.com', spec: 'CrossFit & Strength Coach', exp: 8 },
    { name: 'Priya Sharma', email: 'priya@milestone.com', spec: 'Yoga & Mindfulness', exp: 6 },
    { name: 'Arjun Mehta', email: 'arjun@milestone.com', spec: 'Powerlifting & Bodybuilding', exp: 10 },
    { name: 'Anjali Patel', email: 'anjali@milestone.com', spec: 'Cardio & Weight Loss', exp: 5 }
  ]
  const trainerIds = {}
  for (const t of trainers) {
    const user = await prisma.user.create({
      data: { name: t.name, email: t.email, role: 'TRAINER', trainerProfile: { create: { specialization: t.spec, experienceYears: t.exp } } }
    })
    trainerIds[t.name] = user.id
  }

  // 3. Seed Classes
  console.log('Seeding Classes...')
  await prisma.gymClass.createMany({
    data: [
      { name: 'CrossFit HIIT', time: '06:00 AM', duration: '60 min', day: 'Mon', classType: 'CrossFit', capacity: 5, trainerId: trainerIds['Rahul Singh'] },
      { name: 'Yoga Flow', time: '07:00 AM', duration: '60 min', day: 'Mon', classType: 'Yoga', capacity: 8, trainerId: trainerIds['Priya Sharma'] },
      { name: 'Strength & Power', time: '08:00 AM', duration: '75 min', day: 'Tue', classType: 'Strength', capacity: 10, trainerId: trainerIds['Arjun Mehta'] },
      { name: 'Cardio Blast', time: '06:30 AM', duration: '45 min', day: 'Wed', classType: 'Cardio', capacity: 12, trainerId: trainerIds['Anjali Patel'] }
    ]
  })

  // 4. Seed Testimonials
  console.log('Seeding Testimonials...')
  await prisma.testimonial.createMany({
    data: [
      { name: 'Sanjay Kumar', role: 'Software Engineer', rating: 5, content: 'Milestone Energym completely transformed my life. Lost 18kg in 4 months with the perfect combination of training and diet guidance from their amazing trainers. Best gym in the city!' },
      { name: 'Meera Krishnan', role: 'Marketing Manager', rating: 5, content: 'The CrossFit sessions are incredible! The trainers are certified, the equipment is world-class, and the atmosphere is motivating. I never felt stronger or more confident.' },
      { name: 'Rajesh Verma', role: 'Business Owner', rating: 5, content: 'As someone with a hectic schedule, the flexible membership and 5 AM opening time is a lifesaver. The personal training team built me a custom program that fits my life perfectly.' }
    ]
  })

  // 5. Seed Hero Banners
  console.log('Seeding Hero Banners...')
  await prisma.heroBanner.createMany({
    data: [
      { title: 'Train Hard.', imageUrl: '/about-hero.png', order: 1 },
      { title: 'Stay Strong.', imageUrl: '/class-strength.png', order: 2 },
      { title: 'Transform Now.', imageUrl: '/class-cardio.png', order: 3 }
    ]
  })

  // 6. Seed Blog Posts
  console.log('Seeding Blog Posts...')
  const admin = await prisma.user.create({ data: { name: 'Admin', email: 'admin@milestone.com', role: 'ADMIN' } })
  await prisma.blogPost.createMany({
    data: [
      { title: 'The Ultimate Guide to Pre-Workout Nutrition', slug: 'pre-workout-nutrition', excerpt: 'Discover what you should eat before hitting the gym to maximize your energy, endurance, and muscle growth.', content: '<p>Eat bananas and protein.</p>', isPublished: true, authorId: admin.id, imageUrl: '/class-strength.png' },
      { title: '5 Yoga Poses for Post-Workout Recovery', slug: 'yoga-recovery', excerpt: 'Speed up your muscle recovery and improve flexibility by incorporating these five essential yoga poses into your cool-down routine.', content: '<p>Do downward dog.</p>', isPublished: true, authorId: admin.id, imageUrl: '/class-yoga.png' },
      { title: 'Why HIIT is the Secret to Fat Loss', slug: 'hiit-fat-loss', excerpt: 'High-Intensity Interval Training is proven to burn more calories in less time. Learn how to structure your HIIT workouts effectively.', content: '<p>Go fast then slow.</p>', isPublished: true, authorId: admin.id, imageUrl: '/class-crossfit.png' }
    ]
  })

  console.log('Done seeding!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
