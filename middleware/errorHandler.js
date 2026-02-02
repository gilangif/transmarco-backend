export default function errorHandler(err, req, res, next) {
  try {
    console.log("📢[:12]: ", err)
    let status = 500
    let message = "Internal Server Error"

    if (err.code) status = 400

    if (err.status && typeof err.status === "number") status = err.status
    if (err.response && err.response.status) status = err.response.status

    if (err.msg) message = err.msg
    if (err.message) message = err.message
    if (err.user_message) message = err.user_message

    if (err.response && err.response.data.message) message = err.response.data.message

    res.status(status).json({ message })
  } catch (error) {
    console.log("📢[:68]: ", error)

    return res.send("error")
  }
}
