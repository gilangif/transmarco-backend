import { JWT_SECRET } from "../config/index.js"

import jwt from "jsonwebtoken"


const db = [
  {
    username: "hpal",
    password: "hpal",
  },
  {
    username: "hpam",
    password: "hpam",
  },
  {
    username: "hpbl",
    password: "hpbl",
  },
  {
    username: "hpm",
    password: "hpm",
  },
  {
    username: "app",
    password: "app",
  },
]

class AuthController {
  static async auth(req, res, next) {
    try {
      const { username, password } = req.body || {}

      const message = { status: 400, message: "invalid username or password" }
      if (!username || !password) throw message

      const user = db.find((x) => x.username === username && x.password === password)
      if (!user) throw message

      res.json({ username, accessToken: jwt.sign({ username }, JWT_SECRET, { expiresIn: "31d" }) })
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController
