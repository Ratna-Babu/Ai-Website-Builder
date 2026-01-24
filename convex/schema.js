import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspace: defineTable({
    messages: v.any(), // Array of chat messages
    fileData: v.optional(v.any()), // Generated project files
        
    // to prevent preview crashes in CodeView
    entryPoint: v.optional(v.string()), 
    
    // allowing the builder to be more versatile
    template: v.optional(v.string()),
    
    // --------------------------------------------------
    
    userEmail: v.optional(v.string()), // Optional user tracking
    userName: v.optional(v.string()),
  }),
});