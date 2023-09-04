import * as authService from '../services/authService.js'

export const register = async (req, res) => {
   const { name, phone, password } = req.body;
   try {
      if (!name || !phone || !password) return res.status(400).json({ err: true, msg: 'Missing input!' })
      const response = await authService.registerService(req.body)
      return res.status(200).json(response)
   } catch (err) {
      return res.status(500).json({
         err: true,
         msg: 'Fail at auth controller' + err
      })
   }
}

export const login = async (req, res) => {
   const { phone, password } = req.body;
   try {
      if (!phone || !password) return res.status(400).json({ msg: 'Missing input!' })
      const response = await authService.loginService(req.body)
      return res.status(200).json(response)
   } catch (err) {
      return res.status(500).json({
         err: true,
         msg: 'Fail at auth controller' + err
      })
   }
}

export const refreshToken = async (req, res) => {
   const { refreshToken } = req.body;
   if (!refreshToken) {
      return res.status(400).json({
         err: true,
         msg: 'token not provided '
      })
   }
   try {
      const response = await authService.refreshTokenService(refreshToken)
      return res.status(200).json(response)
   } catch (err) {
      return res.status(500).json({
         err: true,
         msg: 'Fail at refresh token: ' + err
      })
   }

}