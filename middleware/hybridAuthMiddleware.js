import { clerkClient } from '@clerk/clerk-sdk-node';

/**
 * Clerk authentication middleware with proper verification
 * Uses Clerk Secret Key to verify tokens securely
 */
const clerkAuth = async (req, res, next) => {
  let token;
  
  // Check for authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    
    try {
      // Verify Clerk token with secret key
      const clerkSession = await clerkClient.verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY
      });
      
      if (clerkSession && clerkSession.sub) {
        // Get full user details from Clerk
        const userDetails = await clerkClient.users.getUser(clerkSession.sub);
        
        // Attach user info to request
        req.user = {
          _id: userDetails.id,
          email: userDetails.emailAddresses[0]?.emailAddress || userDetails.primaryEmailAddress?.emailAddress,
          name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || userDetails.username || 'User',
          clerkId: userDetails.id,
          isClerkUser: true
        };
        
        console.log(`✅ Clerk user authenticated: ${req.user.email}`);
        return next();
      }
      
      return res.status(401).json({ message: "Invalid Clerk token" });
      
    } catch (error) {
      console.error("Clerk authentication error:", error.message);
      return res.status(401).json({ message: "Not authorized - Clerk authentication failed" });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
};

export default clerkAuth;
