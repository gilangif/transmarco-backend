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
    username: "hpbm",
    password: "hpbm",
    brand: "HPBM",
  },
  {
    username: "hpm",
    password: "hpm",
    brand: "HPM",
  },
  {
    username: "hpl",
    password: "hpl",
    brand: "HPL",
  },
  {
    username: "hpso",
    password: "hpso",
    brand: "HPSO",
  },
  {
    username: "obam",
    password: "obam",
    brand: "OBAM",
  },
  {
    username: "obbl",
    password: "obbl",
    brand: "OBBL",
  },
  {
    username: "obl",
    password: "obl",
    brand: "OBL",
  },
  {
    username: "obm",
    password: "obm",
    brand: "OBM",
  },
  {
    username: "obbm",
    password: "obbm",
    brand: "OBBM",
  },
  {
    username: "pll",
    password: "pll",
    brand: "PLL",
  },
  {
    username: "plm",
    password: "plm",
    brand: "PLM",
  },
  {
    username: "cat",
    password: "cat",
    brand: "CAT",
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
