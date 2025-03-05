
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { toast } from "sonner";

// Mock forum topics data
const forumTopics = [
  {
    id: 1,
    title: "Transitioning from Military to Tech Careers",
    author: "JohnDoe",
    lastPostDate: "2023-06-15T10:30:00",
    replies: 24,
    views: 342,
    category: "career-transition"
  },
  {
    id: 2,
    title: "Resume Writing Tips for Veterans",
    author: "SarahMiller",
    lastPostDate: "2023-06-12T14:20:00",
    replies: 18,
    views: 278,
    category: "resume-help"
  },
  {
    id: 3,
    title: "Using Your GI Bill for Education",
    author: "MikeJohnson",
    lastPostDate: "2023-06-10T09:45:00",
    replies: 32,
    views: 415,
    category: "education"
  },
  {
    id: 4,
    title: "Interview Strategies for Veterans",
    author: "EmilyWilliams",
    lastPostDate: "2023-06-08T16:15:00",
    replies: 15,
    views: 230,
    category: "interviews"
  },
  {
    id: 5,
    title: "Networking for Military Professionals",
    author: "DavidClark",
    lastPostDate: "2023-06-05T11:50:00",
    replies: 21,
    views: 310,
    category: "networking"
  },
  {
    id: 6,
    title: "Mental Health Resources for Veterans",
    author: "AmandaWilson",
    lastPostDate: "2023-06-03T13:25:00",
    replies: 29,
    views: 385,
    category: "health"
  }
];

// Forum categories
const categories = [
  { name: "All Topics", value: "all" },
  { name: "Career Transition", value: "career-transition" },
  { name: "Resume Help", value: "resume-help" },
  { name: "Education", value: "education" },
  { name: "Interviews", value: "interviews" },
  { name: "Networking", value: "networking" },
  { name: "Health & Wellness", value: "health" }
];

const CommunityForums = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter topics based on active category and search query
  const filteredTopics = forumTopics.filter(topic => {
    const matchesCategory = activeCategory === "all" || topic.category === activeCategory;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleCreateTopic = () => {
    toast.info("Create New Topic feature coming soon", {
      description: "This functionality will be implemented in a future update."
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Community Forums</h1>
          <p className="text-muted-foreground">
            Connect with fellow veterans and share your experiences
          </p>
        </div>
        <Button 
          onClick={handleCreateTopic}
          className="mt-4 md:mt-0"
        >
          Create New Topic
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Sidebar with categories */}
        <aside className="lg:col-span-1" aria-labelledby="categories-heading">
          <Card>
            <CardHeader className="pb-3">
              <h2 id="categories-heading" className="text-lg font-semibold">Categories</h2>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              <nav aria-label="Forum Categories">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setActiveCategory(category.value)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeCategory === category.value
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                    aria-pressed={activeCategory === category.value}
                    aria-label={`${category.name} category${activeCategory === category.value ? ', selected' : ''}`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Forums main content */}
        <main className="lg:col-span-3">
          {/* Search bar */}
          <div className="relative mb-6">
            <label htmlFor="search-topics" className="sr-only">Search topics</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
            <Input
              id="search-topics"
              placeholder="Search topics or authors..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search topics or authors"
            />
          </div>

          {/* Topics list */}
          <section aria-label="Forum topics" aria-live="polite">
            <h2 id="topics-heading" className="sr-only">Forum Topics</h2>
            <div className="space-y-4">
              {filteredTopics.length > 0 ? (
                filteredTopics.map(topic => (
                  <article 
                    key={topic.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Card>
                      <div className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                            <a href={`/topic/${topic.id}`} className="focus:outline-none focus:ring-2 focus:ring-primary focus:rounded-sm">
                              {topic.title}
                            </a>
                          </h3>
                          <Badge variant="outline" className="mt-2 sm:mt-0 w-fit">
                            {categories.find(c => c.value === topic.category)?.name || topic.category}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-6 gap-y-2">
                          <span>Posted by <span className="font-medium">{topic.author}</span></span>
                          <span>Last post: <time dateTime={topic.lastPostDate}>{formatDate(topic.lastPostDate)}</time></span>
                          <span>{topic.replies} replies</span>
                          <span>{topic.views} views</span>
                        </div>
                      </div>
                    </Card>
                  </article>
                ))
              ) : (
                <div className="text-center py-8" role="status">
                  <p className="text-muted-foreground">No topics found matching your criteria</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CommunityForums;
