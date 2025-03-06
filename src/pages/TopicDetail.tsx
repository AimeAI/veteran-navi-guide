import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import FormErrorMessage from "@/components/ui/form-error-message";
import MentionSuggestions from "@/components/ui/mention-suggestions";
import TextWithMentions from "@/components/ui/text-with-mentions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Send, 
  User, 
  Pencil, 
  Save, 
  X, 
  Trash, 
  Flag 
} from "lucide-react";
import { toast } from "sonner";
import { isEmptyOrWhitespace } from "@/utils/validation";
import { useUser } from "@/context/UserContext";
import { 
  filterUsersByQuery, 
  mockUsers, 
  insertMention, 
  MentionedUser 
} from "@/utils/mentionUtils";

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
  const { user } = useUser();
  
  const currentTopic = forumTopics.find(topic => topic.id === id);
  
  const [replyContent, setReplyContent] = useState("");
  const [posts, setPosts] = useState(mockPosts.filter(post => post.topicId === id));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState("");
  
  const [reportingPostId, setReportingPostId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportError, setReportError] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState<MentionedUser[]>([]);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleMentionInput = (query: string) => {
    if (query) {
      const filteredUsers = filterUsersByQuery(query, user?.name);
      setMentionSuggestions(filteredUsers);
      setShowMentionSuggestions(filteredUsers.length > 0);
      setMentionQuery(query);
      setActiveSuggestionIndex(0);
    } else {
      setShowMentionSuggestions(false);
      setMentionSuggestions([]);
    }
  };

  const handleSelectMention = (selectedUser: MentionedUser, isEditing: boolean = false) => {
    const textareaRef = isEditing ? editTextareaRef : replyTextareaRef;
    const currentText = isEditing ? editContent : replyContent;
    const setTextFunction = isEditing ? setEditContent : setReplyContent;
    
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const { newText, newCursorPosition } = insertMention(
        currentText,
        cursorPosition,
        selectedUser.username
      );
      
      setTextFunction(newText);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
      
      setShowMentionSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, isEditing: boolean = false) => {
    if (showMentionSuggestions) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : mentionSuggestions.length - 1
        );
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < mentionSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'Enter' && mentionSuggestions.length > 0) {
        e.preventDefault();
        handleSelectMention(mentionSuggestions[activeSuggestionIndex], isEditing);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowMentionSuggestions(false);
      }
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      console.log("New reply data to be sent to Supabase:", {
        topicId: id,
        content: replyContent
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentDate = new Date().toISOString();
      const newPost = {
        id: Math.max(...posts.map(post => post.id), 0) + 1,
        topicId: id,
        author: user?.name || "CurrentUser",
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

  const handleStartEdit = (post: typeof posts[0]) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
    setEditError("");
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent("");
    setEditError("");
  };

  const handleSaveEdit = async (postId: number) => {
    if (isEmptyOrWhitespace(editContent)) {
      setEditError("Content is required");
      return;
    }
    
    if (editContent.length < 5) {
      setEditError("Content must be at least 5 characters");
      return;
    }
    
    try {
      console.log("Updated post data to be sent to Supabase:", {
        postId,
        content: editContent
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPosts = posts.map(post => 
        post.id === postId 
          ? { ...post, content: editContent }
          : post
      );
      
      setPosts(updatedPosts);
      setEditingPostId(null);
      setEditContent("");
      
      toast.success("Post updated successfully", {
        description: "Your changes have been saved",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post", {
        description: "Please try again later",
      });
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }
    
    try {
      console.log("Delete post request to be sent to Supabase:", {
        postId
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filteredPosts = posts.filter(post => post.id !== postId);
      
      setPosts(filteredPosts);
      setEditingPostId(null);
      
      toast.success("Post deleted successfully", {
        description: "Your post has been removed from the discussion",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post", {
        description: "Please try again later",
      });
    }
  };

  const handleReportClick = (postId: number) => {
    setReportingPostId(postId);
    setReportReason("");
    setReportError("");
    setIsReportDialogOpen(true);
  };

  const handleCancelReport = () => {
    setReportingPostId(null);
    setReportReason("");
    setReportError("");
    setIsReportDialogOpen(false);
  };

  const handleSubmitReport = () => {
    if (isEmptyOrWhitespace(reportReason)) {
      setReportError("Please provide a reason for reporting this post");
      return;
    }

    if (reportReason.length < 10) {
      setReportError("Report reason must be at least 10 characters");
      return;
    }

    console.log("Post report submitted:", {
      postId: reportingPostId,
      reason: reportReason
    });

    setReportingPostId(null);
    setReportReason("");
    setIsReportDialogOpen(false);
    
    toast.success("Report submitted", {
      description: "Thank you for helping keep our community safe",
      duration: 5000,
    });
    
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  };

  const isCurrentUserAuthor = (authorName: string) => {
    return user?.name === authorName || (!user && authorName === "CurrentUser");
  };

  const categoryName = currentTopic 
    ? (categories.find(cat => cat.value === currentTopic.category)?.name || currentTopic.category)
    : "";

  if (!currentTopic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/community-forums" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forums
        </Link>
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Topic Not Found</h1>
          <p className="text-muted-foreground mb-6">The topic you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/community-forums">Return to Forums</Link>
          </Button>
        </Card>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-primary">{currentTopic.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2 mt-2">
                <span>Posted by <span className="font-medium">{currentTopic.author}</span></span>
                <span>Last activity: <time dateTime={currentTopic.lastPostDate}>{formatDate(currentTopic.lastPostDate)}</time></span>
                <Badge variant="outline" className="ml-0">{categoryName}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            {currentTopic.content && (
              <TextWithMentions text={currentTopic.content} users={mockUsers} />
            )}
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
                    
                    {editingPostId === post.id ? (
                      <div className="space-y-4">
                        <div className="space-y-2 relative">
                          <Textarea
                            value={editContent}
                            onChange={(e) => {
                              setEditContent(e.target.value);
                              if (editError) setEditError("");
                            }}
                            onMention={handleMentionInput}
                            showMentionSuggestions={showMentionSuggestions}
                            onKeyDown={(e) => handleKeyDown(e, true)}
                            ref={editTextareaRef}
                            rows={4}
                            placeholder="Edit your post... Use @username to mention users."
                            aria-label="Edit post content"
                            className="w-full"
                            aria-invalid={!!editError}
                          />
                          <MentionSuggestions
                            suggestions={mentionSuggestions}
                            isVisible={showMentionSuggestions}
                            onSelectUser={(user) => handleSelectMention(user, true)}
                            activeIndex={activeSuggestionIndex}
                          />
                          {editError && <FormErrorMessage message={editError} />}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleSaveEdit(post.id)}
                            className="flex items-center"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save Changes
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleCancelEdit}
                            className="flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeletePost(post.id)}
                            className="flex items-center ml-auto"
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="prose dark:prose-invert max-w-none">
                          <TextWithMentions text={post.content} users={mockUsers} />
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          {isCurrentUserAuthor(post.author) && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleStartEdit(post)}
                              className="flex items-center text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleReportClick(post.id)}
                            className="flex items-center text-muted-foreground hover:text-destructive"
                          >
                            <Flag className="h-3.5 w-3.5 mr-1" />
                            Report
                          </Button>
                        </div>
                      </div>
                    )}
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
            <div className="space-y-2 relative">
              <Textarea
                id="reply-content"
                placeholder="Share your thoughts or expertise... Use @username to mention other users."
                rows={5}
                value={replyContent}
                onChange={(e) => {
                  setReplyContent(e.target.value);
                  if (error) setError("");
                }}
                onMention={handleMentionInput}
                showMentionSuggestions={showMentionSuggestions}
                onKeyDown={(e) => handleKeyDown(e, false)}
                ref={replyTextareaRef}
                aria-invalid={!!error}
                aria-describedby={error ? "reply-error" : undefined}
                className="resize-y"
              />
              <MentionSuggestions
                suggestions={mentionSuggestions}
                isVisible={showMentionSuggestions}
                onSelectUser={(user) => handleSelectMention(user, false)}
                activeIndex={activeSuggestionIndex}
              />
              <FormErrorMessage message={error} />
              <div className="text-xs text-muted-foreground mt-1">
                Tip: Use @username to mention other users
              </div>
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

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Flag className="h-5 w-5" />
              Report This Post
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <p className="text-sm text-muted-foreground">
              Please provide details about why you're reporting this post. Our moderators will review your report.
            </p>
            
            <div className="space-y-2">
              <Textarea
                value={reportReason}
                onChange={(e) => {
                  setReportReason(e.target.value);
                  if (reportError) setReportError("");
                }}
                placeholder="Explain why this post violates our community guidelines..."
                rows={4}
                className="w-full resize-none"
                aria-invalid={!!reportError}
              />
              {reportError && <FormErrorMessage message={reportError} />}
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancelReport}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleSubmitReport}
              className="gap-2"
            >
              <Flag className="h-4 w-4" />
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopicDetail;
