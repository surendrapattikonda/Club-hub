import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Edit2, Trash2, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "faculty" | "hod";
  status: "active" | "inactive";
  joinDate: string;
}

export function FacultyManagementPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error,setError]=useState<string | null>(null);
  const { toast } = useToast();

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    phone: "",
    role: "faculty", // default
    password: "",
    confirmPassword: "",
  });

  // ✅ Fetch faculty from DB
 useEffect(() => {
  const fetchFaculty = async () => {
    try {
       const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user?.token;
      
        if (!token) {
          setError("User not logged in or token missing");
          setLoading(false);
          return;
        } // or whatever key you store it in
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/faculty`, { headers: { Authorization: `Bearer ${token}` } });
const formatted = res.data.map((f: any) => ({ ...f, id: f._id }));
setFaculty(formatted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  fetchFaculty();
}, []);


  // ✅ Filtered faculty list
  const filteredFaculty = faculty.filter((f) => {
    return (
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ✅ Create Faculty / HOD
  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newFaculty.password !== newFaculty.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/create-user`,
        newFaculty
      );

      setFaculty((prev) => [...prev, res.data.user]);
      setNewFaculty({
        name: "",
        email: "",
        phone: "",
        role: "faculty",
        password: "",
        confirmPassword: "",
      });
      setIsCreateDialogOpen(false);

      toast({
        title: "Success",
        description: "Faculty/HOD account created successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  // ✅ Toggle Faculty/HOD Status
  const toggleFacultyStatus = async (id: string, currentStatus: string) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/faculty/${id}`,
        { status: currentStatus === "active" ? "inactive" : "active" }
      );
      setFaculty((prev) =>
        prev.map((f) => (f.id === id ? res.data : f))
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  // ✅ Delete Faculty/HOD
  const deleteFaculty = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/delete-user/${id}`);
      setFaculty((prev) => prev.filter((f) => f.id !== id));
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Faculty & HOD Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage Faculty or HOD accounts
          </p>
        </div>

        {/* Create Faculty/HOD Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Faculty/HOD
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateFaculty} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newFaculty.name}
                  onChange={(e) =>
                    setNewFaculty((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newFaculty.email}
                  onChange={(e) =>
                    setNewFaculty((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newFaculty.phone}
                  onChange={(e) =>
                    setNewFaculty((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newFaculty.role}
                  onChange={(e) =>
                    setNewFaculty((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="faculty">Faculty</option>
                  <option value="hod">HOD</option>
                </select>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newFaculty.password}
                  onChange={(e) =>
                    setNewFaculty((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={newFaculty.confirmPassword}
                  onChange={(e) =>
                    setNewFaculty((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search by Name or Email</Label>
              <Input
                id="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Faculty/HOD Table */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts ({filteredFaculty.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculty.map((facultyMember) => (
                  <TableRow key={facultyMember.id}>
                    <TableCell>
                      <div className="font-medium">{facultyMember.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {facultyMember.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {facultyMember.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{facultyMember.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          facultyMember.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {facultyMember.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{facultyMember.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleFacultyStatus(
                              facultyMember.id,
                              facultyMember.status
                            )
                          }
                        >
                          {facultyMember.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFaculty(facultyMember.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}