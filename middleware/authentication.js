import { JWT_SECRET } from "../config/index.js"

import jwt from "jsonwebtoken"

export const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers || {}
    if (!authorization || !authorization.startsWith("Bearer ")) throw { status: 401, message: "Unauthorized" }

    const accessToken = authorization.split(" ")[1]
    const payload = jwt.verify(accessToken, JWT_SECRET)

    req.user = payload

    next()
  } catch (err) {
    res.status(401).json({ status: 401, message: "Unauthorized" })
  }
}
