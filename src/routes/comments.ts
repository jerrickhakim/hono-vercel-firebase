import { Hono } from "hono";
import { db } from "@/src/integrations/firebase.server";
import APIError from "@/src/errors/APIError";
import { commentSchema, type Comment } from "@/src/schemas/index";

const app = new Hono();

// GET /comments - List all comments
app.get("/", async (c) => {
  try {
    const commentsRef = db.collection("comments");
    const snapshot = await commentsRef.get();
    
    if (snapshot.empty) {
      return c.json({ 
        success: true, 
        data: [],
        message: "No comments found" 
      });
    }

    const comments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Add the document ID to the data
      const commentData = {
        id: doc.id,
        ...data,
      };
      
      // Validate the data against our schema
      try {
        const validatedComment = commentSchema.parse(commentData);
        comments.push(validatedComment);
      } catch (validationError) {
        console.warn(`Invalid comment data for document ${doc.id}:`, validationError);
        // Skip invalid documents but continue processing others
      }
    });

    return c.json({
      success: true,
      data: comments,
      count: comments.length,
    });
    
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new APIError("Failed to fetch comments", 500);
  }
});

export default app;