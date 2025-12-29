import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  UserPlus, 
  UserMinus,
  CheckCircle,
  XCircle,
  Mail
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Club {
  _id: string;
  name: string;
  description: string;
  category: string;
  leads: User[];
  members: User[];
  pendingMembers: User[];
  facultyAdvisor?: User;
  createdAt: string;
  updatedAt: string;
  status?: 'active' | 'inactive';
}

interface PendingApplication {
  _id: string;
  name: string;
  createdAt: string;
}

export function ClubManagementPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignLeadDialogOpen, setIsAssignLeadDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [assignLeadEmail, setAssignLeadEmail] = useState('');
  const { toast } = useToast();

  const [newClub, setNewClub] = useState({
    name: '',
    description: '',
    category: '',
    leadName: '',
    leadEmail: ''
  });

  const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;
    if (!token) throw new Error("No token found");
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch all clubs (for Faculty/HOD)
  const fetchAllClubs = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const res = await axios.get("http://localhost:5000/api/clubs/all/details", { headers });
      setClubs(res.data.clubs || []);
    } catch (error: any) {
      toast({
        title: "Error fetching clubs",
        description: error.response?.data?.message || error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's clubs and pending applications
  // const fetchMyClubs = async () => {
  //   try {
  //     const headers = getAuthHeaders();
  //     const res = await axios.get("http://localhost:5000/api/clubs/my", { headers });
  //     setMyClubs(res.data.myClubs || []);
  //     setPendingApplications(res.data.pendingApplications || []);
  //   } catch (error: any) {
  //     toast({
  //       title: "Error fetching your clubs",
  //       description: error.response?.data?.message || "Something went wrong.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role;
    
    if (role === 'faculty' || role === 'hod') {
      fetchAllClubs();
    } else {
      fetchMyClubs();
      setLoading(false);
    }
  }, []);

  const filteredClubs = (activeTab === 'all' ? clubs : myClubs).filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Create Club
  const handleCreateClub = async () => {
    if (!newClub.name || !newClub.category || !newClub.leadEmail) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields including lead email.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const headers = getAuthHeaders();
      const clubData = {
        name: newClub.name,
        description: newClub.description,
        category: newClub.category,
        leadEmail: newClub.leadEmail,
        leadName: newClub.leadName
      };

      await axios.post('http://localhost:5000/api/clubs', clubData, { headers });

      toast({
        title: 'Club Created',
        description: `${newClub.name} has been successfully created.`,
      });

      setIsCreateDialogOpen(false);
      setNewClub({ name: '', description: '', category: '', leadName: '', leadEmail: '' });
      fetchAllClubs();
    } catch (error: any) {
      toast({
        title: 'Error creating club',
        description: error.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  // Delete Club
  const deleteClub = async (id: string) => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`http://localhost:5000/api/clubs/${id}`, { headers });
      toast({ title: 'Club Deleted', description: 'The club has been removed.' });
      fetchAllClubs();
    } catch (error: any) {
      toast({
        title: 'Error deleting club',
        description: error.response?.data?.message || 'Failed to delete club.',
        variant: 'destructive',
      });
    }
  };

  // Update Club
  const handleEditClub = (club: Club) => {
    setEditingClub(club);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClub = async () => {
    if (!editingClub) return;

    try {
      const headers = getAuthHeaders();
      await axios.put(
        `http://localhost:5000/api/clubs/${editingClub._id}`,
        editingClub,
        { headers }
      );

      toast({
        title: 'Club Updated',
        description: `${editingClub.name} has been successfully updated.`,
      });

      setIsEditDialogOpen(false);
      setEditingClub(null);
      fetchAllClubs();
    } catch (error: any) {
      toast({
        title: 'Error updating club',
        description: error.response?.data?.message || 'Failed to update club.',
        variant: 'destructive',
      });
    }
  };

  // Join Club
  const handleJoinClub = async (clubId: string) => {
    try {
      const headers = getAuthHeaders();
      await axios.post(`http://localhost:5000/api/clubs/${clubId}/join`, {}, { headers });
      toast({
        title: 'Join Request Sent',
        description: 'Your request to join the club has been submitted.',
      });
      fetchMyClubs();
    } catch (error: any) {
      toast({
        title: 'Error joining club',
        description: error.response?.data?.message || 'Failed to send join request.',
        variant: 'destructive',
      });
    }
  };

  // Approve Member
  const handleApproveMember = async (clubId: string, userId: string) => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`http://localhost:5000/api/clubs/${clubId}/approve/${userId}`, {}, { headers });
      toast({
        title: 'Member Approved',
        description: 'The user has been added to the club.',
      });
      fetchAllClubs();
    } catch (error: any) {
      toast({
        title: 'Error approving member',
        description: error.response?.data?.message || 'Failed to approve member.',
        variant: 'destructive',
      });
    }
  };

  // Assign Lead
  const handleAssignLead = async (clubId: string) => {
    if (!assignLeadEmail.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter the email of the user to assign as lead.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const headers = getAuthHeaders();
      
      // First, find user by email
    // Change this line in handleAssignLead function:
const userRes = await axios.get(`http://localhost:5000/api/clubs/user/email/${assignLeadEmail}`, { headers });
      const userId = userRes.data.user._id;

      // Then assign as lead
      const res = await axios.put(
        `http://localhost:5000/api/clubs/${clubId}/assign-lead/${userId}`,
        {},
        { headers }
      );

      // Update token if current user is being assigned as lead
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (res.data.token && currentUser._id === userId) {
        localStorage.setItem("user", JSON.stringify({ ...currentUser, token: res.data.token }));
      }

      toast({
        title: 'Lead Assigned',
        description: `${userRes.data.user.name} has been assigned as lead.`,
      });

      setIsAssignLeadDialogOpen(false);
      setAssignLeadEmail('');
      setSelectedClub(null);
      fetchAllClubs();
    } catch (error: any) {
      toast({
        title: 'Error assigning lead',
        description: error.response?.data?.message || 'Failed to assign lead.',
        variant: 'destructive',
      });
    }
  };

  // Remove Lead
  const handleRemoveLead = async (clubId: string, userId: string) => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`http://localhost:5000/api/clubs/${clubId}/remove-lead/${userId}`, {}, { headers });
      toast({
        title: 'Lead Removed',
        description: 'The user has been removed as lead.',
      });
      fetchAllClubs();
    } catch (error: any) {
      toast({
        title: 'Error removing lead',
        description: error.response?.data?.message || 'Failed to remove lead.',
        variant: 'destructive',
      });
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role;
  const isFacultyOrHOD = userRole === 'faculty' || userRole === 'hod';
  const isLead = userRole === 'clublead';
  const isStudent = userRole === 'student';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Club Management</h1>
          <p className="text-muted-foreground">
            {isFacultyOrHOD ? 'Manage all departmental clubs and activities' : 
             isLead ? 'Manage your club and members' : 
             'Browse and join clubs'}
          </p>
        </div>
        {isFacultyOrHOD && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Club
          </Button>
        )}
      </div>

      {/* Tabs for different views */}
      {isFacultyOrHOD && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Clubs</TabsTrigger>
            <TabsTrigger value="my">My Clubs</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pending Applications Section for Students */}
      {isStudent && pendingApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Pending Applications
            </CardTitle>
            <CardDescription>Your club join requests awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingApplications.map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Requested on {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">Pending Approval</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clubs Grid */}
      {loading ? (
        <p className="text-center text-muted-foreground mt-10">Loading clubs...</p>
      ) : filteredClubs.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">No clubs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => {
            const isUserLead = club.leads.some(lead => lead._id === user._id);
            const isUserMember = club.members.some(member => member._id === user._id);
            const hasPendingRequest = pendingApplications.some(app => app._id === club._id);

            return (
              <Card key={club._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{club.name}</CardTitle>
                    </div>
                    <Badge variant={club.status === 'inactive' ? 'secondary' : 'default'}>
                      {club.status === 'inactive' ? 'Inactive' : 'Active'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{club.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{club.members?.length || 0} members</span>
                      {club.pendingMembers?.length > 0 && (
                        <Badge variant="outline" className="ml-2">
                          {club.pendingMembers.length} pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Leads: {club.leads?.map(lead => lead.name).join(', ') || 'N/A'}</span>
                    </div>
                    <div className="pt-2">
                      <Badge variant="outline">{club.category}</Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 flex-wrap">
                    {/* Faculty/HOD Actions */}
                    {isFacultyOrHOD && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEditClub(club)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setSelectedClub(club);
                            setIsAssignLeadDialogOpen(true);
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign Lead
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteClub(club._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    {/* Lead Actions */}
                    {isUserLead && club.pendingMembers?.length > 0 && (
                      <div className="w-full">
                        <p className="text-sm font-medium mb-2">Pending Approvals:</p>
                        <div className="space-y-2">
                          {club.pendingMembers.map((pendingUser) => (
                            <div key={pendingUser._id} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{pendingUser.name}</span>
                              <Button
                                size="sm"
                                onClick={() => handleApproveMember(club._id, pendingUser._id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Student Actions */}
                    {isStudent && !isUserMember && !hasPendingRequest && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleJoinClub(club._id)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Join Club
                      </Button>
                    )}

                    {isStudent && hasPendingRequest && (
                      <Button size="sm" variant="secondary" className="flex-1" disabled>
                        <Mail className="w-4 h-4 mr-1" />
                        Request Pending
                      </Button>
                    )}

                    {/* Remove Lead Action (for Faculty/HOD) */}
                    {isFacultyOrHOD && club.leads?.length > 0 && (
                      <div className="w-full">
                        <p className="text-sm font-medium mb-2">Current Leads:</p>
                        <div className="space-y-1">
                          {club.leads.map((lead) => (
                            <div key={lead._id} className="flex items-center justify-between">
                              <span className="text-sm">{lead.name}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveLead(club._id, lead._id)}
                              >
                                <UserMinus className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Club Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Club</DialogTitle>
            <DialogDescription>
              Add a new club to the system. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Club Name *</Label>
              <Input
                id="name"
                value={newClub.name}
                onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                placeholder="Enter club name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newClub.description}
                onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                placeholder="Enter club description"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={newClub.category} onValueChange={(value) => setNewClub({ ...newClub, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="leadName">Club Lead Name</Label>
              <Input
                id="leadName"
                value={newClub.leadName}
                onChange={(e) => setNewClub({ ...newClub, leadName: e.target.value })}
                placeholder="Enter club lead name"
              />
            </div>
            <div>
              <Label htmlFor="leadEmail">Club Lead Email *</Label>
              <Input
                id="leadEmail"
                type="email"
                value={newClub.leadEmail}
                onChange={(e) => setNewClub({ ...newClub, leadEmail: e.target.value })}
                placeholder="Enter club lead email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClub}>Create Club</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Club Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Club</DialogTitle>
            <DialogDescription>Update the club information.</DialogDescription>
          </DialogHeader>
          {editingClub && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Club Name</Label>
                <Input
                  id="edit-name"
                  value={editingClub.name}
                  onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingClub.description}
                  onChange={(e) => setEditingClub({ ...editingClub, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editingClub.category} onValueChange={(value) => setEditingClub({ ...editingClub, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateClub}>Update Club</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Lead Dialog */}
      <Dialog open={isAssignLeadDialogOpen} onOpenChange={setIsAssignLeadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Club Lead</DialogTitle>
            <DialogDescription>
              Assign a lead to {selectedClub?.name}. Enter the email of the user you want to assign as lead.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lead-email">User Email *</Label>
              <Input
                id="lead-email"
                type="email"
                value={assignLeadEmail}
                onChange={(e) => setAssignLeadEmail(e.target.value)}
                placeholder="Enter user email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignLeadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedClub && handleAssignLead(selectedClub._id)}>
              Assign Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}