import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Users,
  UserPlus,
  UserX,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

// =====================
// Mock Data (UPDATED)
// =====================

const pendingRequests = [
  {
    id: '1',
    name: 'Venky',
    email: 'venky@example.com',
    phone: '9876543200',
    year: '2nd Year',
    appliedDate: '2024-02-12',
    gender: 'Male'
  },
  {
    id: '2',
    name: 'Charan',
    email: 'charan@example.com',
    phone: '9876543212',
    year: '3rd Year',
    appliedDate: '2024-02-11',
    gender: 'Male'
  },
  {
    id: '3',
    name: 'Uday',
    email: 'uday@example.com',
    phone: '9876543221',
    year: '1st Year',
    appliedDate: '2024-02-10',
    gender: 'Male'
  }
];

const activeMembersDefault = [
  {
    id: '4',
    name: 'Shiva',
    email: 'shiva@example.com',
    phone: '9876543210',
    year: '3rd Year',
    attendance: 92,
    gender: 'Male'
  },
  {
    id: '5',
    name: 'Vijay',
    email: 'vijay@example.com',
    phone: '9876543222',
    year: '2nd Year',
    attendance: 88,
    gender: 'Male'
  }
];

export function ManageMembersPage() {
  const { toast } = useToast();

  const [requests, setRequests] = useState(pendingRequests);
  const [members, setMembers] = useState(activeMembersDefault);

  const [yearFilter, setYearFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const genderOptions = ["Male", "Female", "Other"];

  // =====================
  // Approve Member
  // =====================
  const handleApprove = (requestId: string, name: string) => {
    const approved = requests.find(r => r.id === requestId);

    if (approved) {
      const newMember = {
        id: approved.id,
        name: approved.name,
        email: approved.email,
        phone: approved.phone,
        year: approved.year,
        attendance: 0,
        gender: approved.gender
      };

      setMembers([...members, newMember]);
    }

    setRequests(requests.filter(r => r.id !== requestId));

    toast({
      title: "Member Approved",
      description: `${name} has been added to the club.`,
    });
  };

  // Reject
  const handleReject = (requestId: string, name: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
    toast({
      title: "Request Rejected",
      description: `${name}'s application has been rejected.`,
      variant: "destructive",
    });
  };

  // Remove
  const handleRemoveMember = (memberId: string, name: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    toast({
      title: "Member Removed",
      description: `${name} has been removed from the club.`,
      variant: "destructive",
    });
  };

  // =====================
  // Filters
  // =====================
  const filteredMembers = members.filter(member => {
    const yearMatch = yearFilter ? member.year === yearFilter : true;
    const genderMatch = genderFilter ? member.gender === genderFilter : true;
    return yearMatch && genderMatch;
  });

  return (
    <div className="space-y-6 overflow-visible">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Members</h1>
          <p className="text-muted-foreground">Review applications and manage club members</p>
        </div>

        <Badge variant="secondary" className="text-lg px-4 py-2 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          {members.length} Total Members
        </Badge>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members" className="gap-2">
            <Users className="w-4 h-4" />
            Active Members
          </TabsTrigger>

          <TabsTrigger value="requests" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Pending Requests
            {requests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {requests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ===================== ACTIVE MEMBERS ===================== */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Club Members</CardTitle>
                  <CardDescription>All members currently approved</CardDescription>
                </div>

                <div className="flex gap-3">
                  <select
                    className="border rounded-md px-3 py-2 bg-background text-foreground"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                  >
                    <option value="">Filter by Year</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  <select
                    className="border rounded-md px-3 py-2 bg-background text-foreground"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                  >
                    <option value="">Filter by Gender</option>
                    {genderOptions.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </TableCell>

                      <TableCell>{member.year}</TableCell>
                      <TableCell>{member.gender}</TableCell>
                      <TableCell>{member.phone}</TableCell>

                      <TableCell>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id, member.name)}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== PENDING REQUESTS ===================== */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Pending Membership Requests
              </CardTitle>
              <CardDescription>Review applications and approve members</CardDescription>
            </CardHeader>

            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <Card key={req.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{req.name}</h3>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {req.email}
                              </span>
                              <span>{req.year}</span>
                              <span>{req.gender}</span>
                            </div>
                          </div>

                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1 inline" />
                            {new Date(req.appliedDate).toLocaleDateString()}
                          </Badge>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={() => handleApprove(req.id, req.name)}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(req.id, req.name)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
