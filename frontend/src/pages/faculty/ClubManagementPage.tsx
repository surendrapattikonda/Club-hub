import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  CheckCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  status?: 'active' | 'inactive';
  createdAt: string;
}

export function ClubManagementPage() {
  const { toast } = useToast();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newClub, setNewClub] = useState({
    name: '',
    description: '',
    category: '',
    leadName: '',
    leadEmail: '',
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role;
  const isFacultyOrHOD = userRole === 'faculty' || userRole === 'hod';

  const getAuthHeaders = () => {
    if (!user?.token) throw new Error('No token found');
    return { Authorization: `Bearer ${user.token}` };
  };

  // ================= FETCH CLUBS =================
  const fetchAllClubs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/clubs/all/details`,
        { headers: getAuthHeaders() }
      );
      setClubs(res.data.clubs || []);
    } catch (err: any) {
      toast({
        title: 'Error fetching clubs',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClubs();
  }, []);

  // ================= CREATE CLUB =================
  const handleCreateClub = async () => {
    if (!newClub.name || !newClub.category || !newClub.leadEmail) {
      toast({
        title: 'Missing Information',
        description: 'Club name, category and lead email are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/clubs`,
        newClub,
        { headers: getAuthHeaders() }
      );

      toast({
        title: 'Club Created',
        description: `${newClub.name} created successfully.`,
      });

      setIsCreateDialogOpen(false);
      setNewClub({
        name: '',
        description: '',
        category: '',
        leadName: '',
        leadEmail: '',
      });

      fetchAllClubs();
    } catch (err: any) {
      toast({
        title: 'Error creating club',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  // ================= DELETE CLUB =================
  const deleteClub = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/clubs/${id}`,
        { headers: getAuthHeaders() }
      );
      toast({ title: 'Club Deleted' });
      fetchAllClubs();
    } catch (err: any) {
      toast({
        title: 'Error deleting club',
        description: err.response?.data?.message,
        variant: 'destructive',
      });
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || club.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Club Management</h1>
          <p className="text-muted-foreground">
            Manage all departmental clubs
          </p>
        </div>

        {isFacultyOrHOD && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Club
          </Button>
        )}
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="pt-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Cultural">Cultural</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Social">Social</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* CLUB GRID */}
      {loading ? (
        <p className="text-center text-muted-foreground">Loading clubs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <Card key={club._id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{club.name}</CardTitle>
                  <Badge>{club.status || 'Active'}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {club.description}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  {club.members.length} members
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  Leads: {club.leads.map(l => l.name).join(', ') || 'N/A'}
                </div>

                <Badge variant="outline">{club.category}</Badge>

                {isFacultyOrHOD && (
                  <div className="flex gap-2 pt-3">
                    <Button size="sm" variant="destructive" onClick={() => deleteClub(club._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE CLUB DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Club</DialogTitle>
            <DialogDescription>Fill club details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Club Name *</Label>
              <Input value={newClub.name} onChange={(e) => setNewClub({ ...newClub, name: e.target.value })} />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={newClub.description} onChange={(e) => setNewClub({ ...newClub, description: e.target.value })} />
            </div>

            <div>
              <Label>Category *</Label>
              <Select value={newClub.category} onValueChange={(v) => setNewClub({ ...newClub, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lead Name</Label>
              <Input value={newClub.leadName} onChange={(e) => setNewClub({ ...newClub, leadName: e.target.value })} />
            </div>

            <div>
              <Label>Lead Email *</Label>
              <Input type="email" value={newClub.leadEmail} onChange={(e) => setNewClub({ ...newClub, leadEmail: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateClub}>Create Club</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
