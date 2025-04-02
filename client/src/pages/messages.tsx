import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow, format } from "date-fns";
import { Loader2, Send, ArrowLeft, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, User } from "@shared/schema";

export default function MessagesPage() {
  const { userId } = useParams();
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: otherUser, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ["/api/messages/conversations"],
    enabled: !!user,
  });

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: [`/api/messages/${userId}`],
    enabled: !!userId && !!user,
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (messages && messages.length > 0 && userId) {
      const unreadMessages = messages.filter(
        msg => msg.receiverId === user?.id && !msg.read
      );
      
      if (unreadMessages.length > 0) {
        // Mark each unread message as read
        unreadMessages.forEach(message => {
          markAsReadMutation.mutate(message.id);
        });
      }
    }
  }, [messages, userId, user]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", {
        receiverId: Number(userId),
        content
      });
      return await res.json();
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${userId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const res = await apiRequest("PUT", `/api/messages/${messageId}/read`);
      return res.status === 204;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${userId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessageMutation.mutate(messageInput.trim());
  };

  const formatMessageTime = (date: Date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(messageDate, "h:mm a");
    } else {
      return format(messageDate, "MMM d, h:mm a");
    }
  };

  if (!user) {
    return null; // Protected route should handle this
  }

  return (
    <>
      <Helmet>
        <title>Messages | TripSync</title>
        <meta name="description" content="Chat with drivers and passengers on TripSync" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="text-lg text-gray-600">Chat with drivers and passengers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Conversations List */}
              <Card className="md:col-span-1 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Conversations</CardTitle>
                  <CardDescription>
                    Your recent message threads
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {isLoadingConversations ? (
                      <div className="p-6 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-sm text-gray-500">Loading conversations...</p>
                      </div>
                    ) : conversations.length === 0 ? (
                      <div className="p-6 text-center">
                        <UserCircle className="h-12 w-12 mx-auto text-gray-300" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No conversations yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Start a conversation by messaging a driver or passenger
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {conversations.map((conversation) => (
                          <li 
                            key={conversation.userId}
                            className={`
                              hover:bg-gray-50 transition-colors
                              ${Number(userId) === conversation.userId ? 'bg-blue-50' : ''}
                            `}
                          >
                            <Link href={`/messages/${conversation.userId}`}>
                              <a className="block px-4 py-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={conversation.user.profileImage || undefined} />
                                    <AvatarFallback>{conversation.user.fullName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {conversation.user.fullName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                      {conversation.lastMessage?.content || "No messages yet"}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    {conversation.lastMessage && (
                                      <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { 
                                          addSuffix: true,
                                          includeSeconds: true 
                                        })}
                                      </span>
                                    )}
                                    {conversation.unreadCount > 0 && (
                                      <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                                        {conversation.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </a>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="md:col-span-2 overflow-hidden">
                {!userId ? (
                  <div className="h-[600px] flex flex-col items-center justify-center p-6 text-center">
                    <UserCircle className="h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Select a conversation</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Choose a conversation from the list or start a new one
                    </p>
                  </div>
                ) : (
                  <>
                    <CardHeader className="pb-3 border-b">
                      {isLoadingUser ? (
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarFallback><Loader2 className="h-5 w-5 animate-spin" /></AvatarFallback>
                          </Avatar>
                          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mr-2 md:hidden"
                            onClick={() => navigate("/messages")}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={otherUser?.profileImage || undefined} />
                            <AvatarFallback>{otherUser?.fullName?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">{otherUser?.fullName}</h3>
                            <p className="text-sm text-gray-500">
                              {otherUser?.isDriver ? "Driver" : "Passenger"}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardHeader>
                    <div className="flex flex-col h-[500px]">
                      <ScrollArea className="flex-1 p-4">
                        {isLoadingMessages ? (
                          <div className="h-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Send className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No messages yet</h3>
                            <p className="mt-2 text-sm text-gray-500">
                              Start the conversation by sending a message below
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((message) => {
                              const isMyMessage = message.senderId === user.id;
                              
                              return (
                                <div
                                  key={message.id}
                                  className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                                >
                                  <div className="flex items-end">
                                    {!isMyMessage && (
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarImage src={otherUser?.profileImage || undefined} />
                                        <AvatarFallback>{otherUser?.fullName?.charAt(0) || "?"}</AvatarFallback>
                                      </Avatar>
                                    )}
                                    <div
                                      className={`px-4 py-2 rounded-lg ${
                                        isMyMessage
                                          ? "bg-primary text-white"
                                          : "bg-gray-100 text-gray-800"
                                      } max-w-xs sm:max-w-md break-words`}
                                    >
                                      <p>{message.content}</p>
                                      <p className={`text-xs mt-1 ${isMyMessage ? "text-primary-50" : "text-gray-500"}`}>
                                        {formatMessageTime(message.createdAt)}
                                        {isMyMessage && message.read && (
                                          <span className="ml-2">• Read</span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div ref={messagesEndRef} />
                          </div>
                        )}
                      </ScrollArea>
                      <form 
                        onSubmit={handleSendMessage} 
                        className="p-4 border-t border-gray-200 flex items-center"
                      >
                        <Input
                          type="text"
                          placeholder="Type your message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          className="flex-1 mr-3"
                          disabled={sendMessageMutation.isPending}
                        />
                        <Button 
                          type="submit"
                          disabled={!messageInput.trim() || sendMessageMutation.isPending}
                        >
                          {sendMessageMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          <span className="ml-2 hidden sm:inline">Send</span>
                        </Button>
                      </form>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}