// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      text: 'Tarea de ejemplo para pruebas',
      completed: false,
    },
  })

  // Sincroniza la secuencia de auto-incremento con el id más alto real,
  // para que Postgres no vuelva a intentar generar un id ya usado.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Task"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Task"));`
  )
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })