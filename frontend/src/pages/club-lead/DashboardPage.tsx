import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  UserCheck,
  AlertCircle,
  Plus,
  Activity,
  Mail,
  Building2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
const handleNewActivity = () => {
  alert('Activity page coming soon!');
}

// Mock club data
const clubData = {
  id: '1',
  name: 'Coding Club',
  logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=codingclub',
  description: 'A community for coding enthusiasts',
  department: 'Computer Science',
  totalMembers: 156,
  leads: [
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      department: 'Computer Science',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    {
      id: '5',
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      department: 'Computer Science',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
    },
    {
      id: '6',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      department: 'Information Technology',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily'
    }
  ]
};

const monthlyData = [
  { month: 'Jan', activities: 4, attendance: 85 },
  { month: 'Feb', activities: 6, attendance: 92 },
  { month: 'Mar', activities: 5, attendance: 88 },
  { month: 'Apr', activities: 7, attendance: 95 },
  { month: 'May', activities: 8, attendance: 89 },
  { month: 'Jun', activities: 6, attendance: 93 },
];

const recentActivities = [
  {
    id: '1',
    title: 'React Workshop',
    date: '2024-02-20',
    status: 'scheduled',
    attendees: 45
  },
  {
    id: '2',
    title: 'Team Building',
    date: '2024-02-15',
    status: 'completed',
    attendees: 38
  },
  {
    id: '3',
    title: 'Hackathon Prep',
    date: '2024-02-10',
    status: 'completed',
    attendees: 52
  }
];

const pendingRequests = [
  { id: '1', name: 'Alice Johnson', department: 'Computer Science', date: '2024-02-12' },
  { id: '2', name: 'Bob Smith', department: 'Information Technology', date: '2024-02-11' },
  { id: '3', name: 'Carol Davis', department: 'Computer Science', date: '2024-02-10' }
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Club Header with Logo and Info */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={clubData.logo} alt={clubData.name} />
              <AvatarFallback>{clubData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{clubData.name}</h1>
              <p className="text-muted-foreground mb-3">{clubData.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{clubData.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{clubData.totalMembers} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-muted-foreground" />
                  <span>{clubData.leads.length} Club Leads</span>
                </div>
              </div>
            </div>
            <Button onClick={handleNewActivity}>
              <Plus className="w-4 h-4 mr-2" />
              New Activity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Club Leads Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Club Leadership Team
          </CardTitle>
          <CardDescription>All club leads managing {clubData.name} (Max 4 leads)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubData.leads.map((lead) => (
              <div key={lead.id} className={`flex items-center gap-4 p-4 rounded-lg border ${user?.id === lead.id ? 'bg-primary/5 border-primary' : 'bg-card'}`}>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={lead.avatar} alt={lead.name} />
                  <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{lead.name}</p>
                    {user?.id === lead.id && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span>{lead.email}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.department}</p>
                </div>
              </div>
            ))}
            {clubData.leads.length < 4 && (
              <div className="flex items-center justify-center p-4 rounded-lg border border-dashed border-muted-foreground/50 text-muted-foreground">
                <div className="text-center">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Available Lead Position</p>
                  <p className="text-xs">Contact faculty to assign</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month's Activities</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-success">+2 more than planned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <UserCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-success">+3% improvement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Need your review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activities & Attendance</CardTitle>
            <CardDescription>Track your club's activity levels and member engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activities" fill="hsl(var(--primary))" name="Activities" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest club events and their status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={activity.status === 'completed' ? 'secondary' : 'default'}>
                    {activity.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.attendees} attendees
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Member Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Pending Member Requests
          </CardTitle>
          <CardDescription>Review and approve new member applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{request.name}</p>
                  <p className="text-sm text-muted-foreground">{request.department}</p>
                  <p className="text-xs text-muted-foreground">
                    Applied on {new Date(request.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Reject</Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">Schedule Activity</h3>
            <p className="text-sm text-muted-foreground">Plan new events and workshops</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">Manage Members</h3>
            <p className="text-sm text-muted-foreground">Review requests and member list</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">View Reports</h3>
            <p className="text-sm text-muted-foreground">Analytics and performance metrics</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}