import { clerkMiddleware, requireAuth } from '@clerk/express';

export const clerkAuth = requireAuth();

export const attachClerkUser = async (req, res, next) => {
  try {
    if (req.auth && req.auth.userId) {
      const { userId, sessionClaims } = req.auth;
      req.user = {
        _id: userId,
        email: sessionClaims?.email || sessionClaims?.primaryEmailAddress?.emailAddress,
        name: sessionClaims?.firstName 
          ? `${sessionClaims.firstName} ${sessionClaims.lastName || ''}`.trim()
          : sessionClaims?.username || 'User',
        clerkId: userId
      };
      
      next();
    } else {
      res.status(401).json({ message: "Not authorized - No Clerk session" });
    }
  } catch (error) {
    console.error("Clerk auth error:", error);
    res.status(401).json({ message: "Not authorized - Invalid Clerk session" });
  }
};
