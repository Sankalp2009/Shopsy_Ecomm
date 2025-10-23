import jwt from "jsonwebtoken"


const GenerateToken = async(id) => {
 return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
}

export const createSendToken = async(user,code,res,message) => {
   let id = user._id;
   
   const Token = await GenerateToken(id)

    // To save the data in cookie instead of sending as JSON string
  // syntax: res.cookie("token_name", payload/Token, option's)

const cookieOption = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  res.cookie("jwt",Token,cookieOption);


   user.password = undefined;
   
   return res.status(code).json({
    status: "success",
    message,
    Token,
    User: user,
  });
}

// Verify JWT Token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
