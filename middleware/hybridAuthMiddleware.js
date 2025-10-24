import { createClerkClient } from '@clerk/express';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});

const clerkAuth = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    
    try {
      const clerkSession = await clerkClient.verifyToken(token);
      
      if (clerkSession && clerkSession.sub) {
        const userDetails = await clerkClient.users.getUser(clerkSession.sub);
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
