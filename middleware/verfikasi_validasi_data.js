const { validationResult } = require("express-validator")

module.exports = async(req, res, next) => {
   const errors = await validationResult(req)
   if(!errors.isEmpty()) {
       return res.status(400).json({
           error:errors.mapped()
       })
   }
   next()
}