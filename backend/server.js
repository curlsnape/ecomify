import app from "./app/app.js"
import connectToDB from "./config/db.js"

await connectToDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})