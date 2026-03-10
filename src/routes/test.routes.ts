import express from "express"
import axios from "axios"

const router = express.Router()

router.get("/ddg", async (req, res) => {
  try {

    const query = "react tutorial"

    const response = await axios.get(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
    )

    res.json(response.data)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: "DuckDuckGo API failed"
    })

  }
})

export default router