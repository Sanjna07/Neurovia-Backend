import axios from "axios"

export const searchLearningResources = async (
  skill: string,
  level: string
) => {

  const query = `${skill} ${level} tutorial course`

  try {

    const response = await axios.post(
      "https://google.serper.dev/search",
      { q: query },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY!,
          "Content-Type": "application/json"
        }
      }
    )

    const results = response.data.organic || []

    const free: any[] = []
    const paid: any[] = []

    results.slice(0, 10).forEach((r: any) => {

      const link = r.link
      const title = r.title

      if (!link) return

      if (link.includes("youtube.com")) {
        free.push({ title, platform: "YouTube", link })
      }

      else if (link.includes("github.com")) {
        free.push({ title, platform: "GitHub", link })
      }

      else if (
        link.includes("freecodecamp") ||
        link.includes("geeksforgeeks") ||
        link.includes("developer.mozilla") ||
        link.includes("w3schools")
      ) {
        free.push({ title, platform: "Tutorial Site", link })
      }

      else if (
        link.includes("coursera") ||
        link.includes("udemy") ||
        link.includes("edx")
      ) {
        paid.push({ title, platform: "Course Platform", link })
      }

    })

    return { free, paid }

  } catch (error) {

    console.error("Serper search failed:", error)

    return { free: [], paid: [] }

  }

}