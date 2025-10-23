import { verifyToken } from "../Utils/jwt.js";
import User from "../Model/UserModel.js";

const Protected = async (req, res, next) => {
  try {
    // EXTRACT TOKEN FROM REQUEST HEADER
    const authHeader = req.headers.Authorization || req.headers.authorization;

    // Validate Authorization header format
    if (!authHeader) {
      return res.status(401).json({
        status: "fail",
        message: "Access denied. No authorization header provided.",
        code: "NO_AUTH_HEADER"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid authorization format. Expected format: 'Bearer <token>'",
        code: "INVALID_AUTH_FORMAT"
      });
    }

    // Split by space and get the second part (the actual token)
    const token = authHeader.split(" ")[1];

    if (!token || token.trim() === "") {
      return res.status(401).json({
        status: "fail",
        message: "Access denied. Token is missing or empty.",
        code: "EMPTY_TOKEN"
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = await verifyToken(token);
    } catch (verifyError) {
      // Handle specific JWT verification errors
      if (verifyError.name === "JsonWebTokenError") {
        return res.status(401).json({
          status: "fail",
          message: "Invalid token. The token is malformed or has been tampered with.",
          code: "INVALID_TOKEN"
        });
      } else if (verifyError.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "fail",
          message: "Token has expired. Please log in again to get a new token.",
          code: "TOKEN_EXPIRED",
          expiredAt: verifyError.expiredAt
        });
      } else if (verifyError.name === "NotBeforeError") {
        return res.status(401).json({
          status: "fail",
          message: "Token is not yet active. Please try again later.",
          code: "TOKEN_NOT_ACTIVE"
        });
      }
      // Re-throw if it's an unexpected error
      throw verifyError;
    }

    // Validate decoded token structure
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token payload. User ID is missing.",
        code: "INVALID_TOKEN_PAYLOAD"
      });
    }

    // Check if user still exists
    let freshUser;
    try {
      freshUser = await User.findById(decoded.id);
    } catch (dbError) {
      console.error("Database error while fetching user:", dbError);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while verifying user credentials.",
        code: "DB_ERROR"
      });
    }

    if (!freshUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists. Please log in again.",
        code: "USER_NOT_FOUND"
      });
    }

    // // Check if user account is active (if you have an isActive field)
    // if (freshUser.isActive === false) {
    //   return res.status(401).json({
    //     status: "fail",
    //     message: "Your account has been deactivated. Please contact support.",
    //     code: "ACCOUNT_DEACTIVATED"
    //   });
    // }

    // // Check if user changed password after token was issued (if you have passwordChangedAt field)
    // if (freshUser.passwordChangedAt) {
    //   const tokenIssuedAt = new Date(decoded.iat * 1000);
    //   if (freshUser.passwordChangedAt > tokenIssuedAt) {
    //     return res.status(401).json({
    //       status: "fail",
    //       message: "Your password was recently changed. Please log in again.",
    //       code: "PASSWORD_CHANGED"
    //     });
    //   }
    // }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    req.token = token; // Store token if needed for logout/blacklist functionality

    next();
  } catch (error) {
    // Log unexpected errors for debugging
    console.error("Unexpected error in Protected middleware:", error);

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred during authentication. Please try again.",
      code: "INTERNAL_ERROR"
    });
  }
};

// Role-based authorization middleware
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Validate that user exists (should be set by Protected middleware)
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "User not authenticated. Please ensure Protected middleware runs before restrictTo.",
        code: "USER_NOT_AUTHENTICATED"
      });
    }

    // Validate that user has a role
    if (!req.user.role) {
      return res.status(403).json({
        status: "fail",
        message: "User role is not defined. Access denied.",
        code: "ROLE_NOT_DEFINED"
      });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: `Access denied. This action requires one of the following roles: ${roles.join(", ")}. Your role: ${req.user.role}`,
        code: "INSUFFICIENT_PERMISSIONS",
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

export { Protected, restrictTo };