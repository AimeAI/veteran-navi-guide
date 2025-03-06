
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import FormErrorMessage from "@/components/ui/form-error-message";
import { ArrowLeft, Send, User } from "lucide-react";
import { toast } from "sonner";
import { isEmptyOrWhitespace } from "@/utils/validation";

// Mock forum topics data - this would come from your database
const forumTopics = [
  {
    id: 1,
    title: "Transitioning from Military to Tech Careers",
    author: "JohnDoe",
    lastPostDate: "2023-06-15T10:30:00",
    replies: 24,
    views: 342,
    category: "career-transition",
    content: "I'm looking for advice on how to transition from a military career to the tech industry. What skills should I focus on developing? Which programs or certifications would be most valuable? Any tips from veterans who have made this transition successfully would be greatly appreciated."
  },
  {
    id: 2,
    title: "Resume Writing Tips for Veterans",
    author: "SarahMiller",
    lastPostDate: "2023-06-12T14:20:00",
    replies: 18,
    views: 278,
    category: "resume-help",
    content: "I'm struggling with translating my military experience to my resume for civilian jobs. How do I convey my skills and experiences in a way that civilian employers can understand and value? Any specific examples or templates would be helpful."
  },
  {
    id: 3,
    title: "Using Your GI Bill for Education",
    author: "MikeJohnson",
    lastPostDate: "2023-06-10T09:45:00",
    replies: 32,
    views: 415,
    category: "education",
    content: "I'm looking to use my GI Bill benefits to further my education but I'm not sure where to start. What schools have good veteran support programs? Any advice on maximizing these benefits?"
  }
];

// Mock posts within a topic
const mockPosts = [
  {
    id: 1,
    topicId: 1,
    author: "VeteranSupport",
    content: "I transitioned from the military to tech about 5 years ago. My advice would be to focus on certifications like CompTIA A+, Network+, and Security+ as they're widely recognized in the industry. Many companies also have veteran hiring programs you can look into. Feel free to message me if you have specific questions!",
    createdAt: "2023-06-15T14:30:00"
  },
  {
    id: 2,
    topicId: 1,
    author: "TechRecruiter",
    content: "As a recruiter in the tech industry, I've worked with many veterans. Your leadership and teamwork skills are highly valued! Consider looking into programs like 'Hiring Our Heroes' or 'Microsoft Software & Systems Academy' which are specifically designed to help veterans transition to tech roles.",
    createdAt: "2023-06-16T09:15:00"
  },
  {
    id: 3,
    topicId: 2,
    author: "ResumeExpert",
    content: "When translating military experience to a civilian resume, focus on transferable skills like leadership, project management, problem-solving, and adaptability. Use civilian terms rather than military jargon, and quantify your achievements whenever possible. I'd be happy to review your resume if you'd like to share it.",
    createdAt: "2023-06-13T11:20:00"
  }
];

// Forum categories for reference
const categories = [
  { name: "All Topics", value: "all" },
  { name: "Career Transition", value: "career-transition" },
  { name: "Resume Help", value: "resume-help" },
  { name: "Education", value: "education" },
  { name: "Interviews", value: "interviews" },
  { name: "Networking", value: "networking" },
  { name: "Health & Wellness", value: "health" }
];

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const id = parseInt(topicId || "0");
  
  const [replyContent, setReplyContent] = useState("");
  const [posts, setPosts] = useState(mockPosts.filter(post => post.topicId === id));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the current topic
  const topic = forumTopics.find(topic => topic.id === id);
  
  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
        <p className="mb-6">The topic you're looking for doesn't exist or has been removed.</p>
        <Link to="/community-forums">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forums
          </Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (isEmptyOrWhitespace(replyContent)) {
      setError("Reply content is required");
      return;
    }
    
    if (replyContent.length < 5) {
      setError("Reply must be at least 5 characters");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This is where Supabase integration would go
      console.log("New reply data to be sent to Supabase:", {
        topicId: id,
        content: replyContent
      });
      
      // Simulate a delay for the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll just add the reply to our local state
      const currentDate = new Date().toISOString();
      const newPost = {
        id: Math.max(...posts.map(post => post.id), 0) + 1,
        topicId: id,
        author: "CurrentUser", // This would be the authenticated user
        content: replyContent,
        createdAt: currentDate
      };
      
      setPosts([...posts, newPost]);
      setReplyContent("");
      setError("");
      
      toast.success("Reply posted successfully", {
        description: "Your reply has been added to the discussion",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryName = categories.find(cat => cat.value === topic.category)?.name || topic.category;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/community-forums" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forums
      </Link>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">{topic.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2 mt-2">
                <span>Posted by <span className="font-medium">{topic.author}</span></span>
                <span>Last activity: <time dateTime={topic.lastPostDate}>{formatDate(topic.lastPostDate)}</time></span>
                <Badge variant="outline" className="ml-0">{categoryName}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>{topic.content}</p>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mb-6">Replies ({posts.length})</h2>
      
      {posts.length > 0 ? (
        <div className="space-y-6 mb-8" aria-live="polite">
          {posts.map(post => (
            <Card key={post.id} id={`post-${post.id}`} className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-full p-2 flex-shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="font-medium">{post.author}</h3>
                      <span className="text-sm text-muted-foreground">
                        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                      </span>
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{post.content}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg mb-8">
          <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
        </div>
      )}
      
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <h2 className="text-xl font-semibold">Post a Reply</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitReply}>
            <div className="space-y-2">
              <Textarea
                id="reply-content"
                placeholder="Share your thoughts or expertise..."
                rows={5}
                value={replyContent}
                onChange={(e) => {
                  setReplyContent(e.target.value);
                  if (error) setError("");
                }}
                aria-invalid={!!error}
                aria-describedby={error ? "reply-error" : undefined}
                className="resize-y"
              />
              <FormErrorMessage message={error} />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button 
            onClick={handleSubmitReply}
            type="submit"
            disabled={isSubmitting}
            className="flex items-center"
          >
            <Send className="mr-2 h-4 w-4" /> 
            {isSubmitting ? "Posting..." : "Post Reply"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TopicDetail;
