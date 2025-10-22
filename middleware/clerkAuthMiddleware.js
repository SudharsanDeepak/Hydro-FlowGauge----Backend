import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Middleware to verify Clerk JWT and extract user info
export const clerkAuth = ClerkExpressRequireAuth({
  // This will verify the Clerk session token
});

// Middleware to attach user info from Clerk to req.user
export const attachClerkUser = async (req, res, next) => {
  try {
    // Clerk auth middleware adds req.auth with user info
    if (req.auth && req.auth.userId) {
      // Extract user information from Clerk
      const { userId, sessionClaims } = req.auth;
      
      // Attach user info to req.user for consistency with existing code
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
