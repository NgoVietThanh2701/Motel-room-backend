import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
   let accessToken = req.headers.authorization?.split(' ')[1]
   if (!accessToken) return res.status(401).json({
      err: true,
      msg: "No token provided."
   })
   jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.status(401).json({
         err: true,
         msg: "Unauthorized access."
      })
      req.user = user
      next()
   })
}

export default verifyToken