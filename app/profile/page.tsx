'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Legal professional with expertise in corporate law and intellectual property.',
    joinDate: 'January 2023',
    avatar: '/avatars/default.png',
  });
  const [editedData, setEditedData] = useState({ ...userData });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsLoggedIn(true);
    
    // In a real app, you would fetch user data from an API here
    // For now, we're using mock data
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...userData });
  };

  const handleSave = () => {
    setUserData({ ...editedData });
    setIsEditing(false);
    // In a real app, you would save the data to an API here
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...userData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  if (!isLoggedIn) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <CardDescription>Member since {userData.joinDate}</CardDescription>
              </div>
              <div className="ml-auto">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    {isEditing ? (
                      <Input 
                        name="name" 
                        value={editedData.name} 
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{userData.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    {isEditing ? (
                      <Input 
                        name="email" 
                        value={editedData.email} 
                        onChange={handleChange}
                        placeholder="Your email"
                        type="email"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{userData.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    {isEditing ? (
                      <Input 
                        name="phone" 
                        value={editedData.phone} 
                        onChange={handleChange}
                        placeholder="Your phone number"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{userData.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    {isEditing ? (
                      <Input 
                        name="location" 
                        value={editedData.location} 
                        onChange={handleChange}
                        placeholder="Your location"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{userData.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  {isEditing ? (
                    <Textarea 
                      name="bio" 
                      value={editedData.bio} 
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  ) : (
                    <div className="p-2 rounded-md bg-muted">
                      <p>{userData.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent interactions with the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Legal Chat Session</h3>
                    <p className="text-sm text-muted-foreground">You had a chat about property law</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Document Created</h3>
                    <p className="text-sm text-muted-foreground">You created a rental agreement document</p>
                    <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Account Updated</h3>
                    <p className="text-sm text-muted-foreground">You updated your profile information</p>
                    <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">Change your password to keep your account secure</p>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manage how you receive notifications</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Privacy</h3>
                  <p className="text-sm text-muted-foreground mb-4">Control who can see your profile information</p>
                  <Button variant="outline">Privacy Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 