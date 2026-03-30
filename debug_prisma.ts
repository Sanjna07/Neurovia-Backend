import { PrismaClient } from "@prisma/client"
import "dotenv/config"
const prisma = new PrismaClient()

async function test() {
  try {
    const r = await prisma.roadmap.findFirst()
    console.log("Success:", r)
  } catch (err) {
    console.log("Error:", err)
  }
}
test()
