import { JWT_SECRET } from "../config/index.js"

import jwt from "jsonwebtoken"

const db = [
  {
    username: "hpal",
    password: "hpal",
    brand: "HPAL",
  },
  {
    username: "hpam",
    password: "hpam",
    brand: "HPAM",
  },
  {
    username: "hpbl",
    password: "hpbl",
    brand: "HPBL",
  },
  {
    username: "hpm",
    password: "hpm",
    brand: "HPM",
  },
  {
    username: "app",
    password: "app",
    brand: "APP",
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

      res.json({ username, brand: user.brand, accessToken: jwt.sign({ username, brand: user.brand }, JWT_SECRET, { expiresIn: "31d" }) })
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController
