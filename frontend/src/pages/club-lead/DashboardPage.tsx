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
  Mail
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '@/context/AuthContext';

const handleNewActivity = () => {
  alert('Activity page coming soon!');
};

// ================= CLUB DATA =================
const clubData = {
  id: '1',
  name: 'Coding Club',
  logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=codingclub',
  description: 'A community for coding enthusiasts',
  totalMembers: 76,
  leads: [
    {
      id: '6',
      name: 'arshiya',
      email: 'clublead4@example.com',
      department: 'Data Science',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily'
    },
    {
      id: '3',
      name: 'srikanth',
      email: 'clublead2@example.com',
      department: 'Data Science',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    {
      id: '5',
      name: 'Surendra',
      email: 'clublead3@example.com',
      department: 'Data Science',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
    }
  ]
};

// ================= CHART DATA =================
const monthlyData = [
  { month: 'Jan', activities: 4, attendance: 85 },
  { month: 'Feb', activities: 6, attendance: 92 },
  { month: 'Mar', activities: 5, attendance: 88 },
  { month: 'Apr', activities: 7, attendance: 95 },
  { month: 'May', activities: 8, attendance: 89 },
  { month: 'Jun', activities: 6, attendance: 93 }
];

// ================= ACTIVITIES =================
const recentActivities = [
  { id: '1', title: 'Sliding Window Technique', date: '2024-02-20', status: 'scheduled', attendees: 45 },
  { id: '2', title: 'Array manipulation', date: '2024-02-15', status: 'completed', attendees: 38 },
  { id: '3', title: 'Intro to DSA ', date: '2024-02-10', status: 'completed', attendees: 52 }
];

// ================= PENDING REQUESTS =================
const pendingRequests = [
  { id: '1', name: 'Charan', date: '2024-02-12' },
  { id: '2', name: 'Uday', date: '2024-02-11' },
  { id: '3', name: 'Shiva', date: '2024-02-10' },
  { id: '4', name: 'Vijay', date: '2024-02-09' }
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* ================= CLUB HEADER ================= */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={clubData.logo} />
              <AvatarFallback>
                {clubData.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{clubData.name}</h1>
              <p className="text-muted-foreground mb-3">
                {clubData.description}
              </p>

              <div className="flex gap-4 text-sm">
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

      {/* ================= CLUB LEADS ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Club Leadership Team
          </CardTitle>
          <CardDescription>
            All club leads managing {clubData.name}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubData.leads.map((lead) => (
              <div
                key={lead.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  user?.id === lead.id
                    ? 'bg-primary/5 border-primary'
                    : 'bg-card'
                }`}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={lead.avatar} />
                  <AvatarFallback>{lead.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{lead.name}</p>
                    {user?.id === lead.id && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span>{lead.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ================= METRICS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Members" value="156" icon={<Users />} />
        <MetricCard title="This Month's Activities" value="8" icon={<Calendar />} />
        <MetricCard title="Average Attendance" value="89%" icon={<UserCheck />} />
        <MetricCard title="Pending Requests" value={pendingRequests.length} icon={<AlertCircle />} />
      </div>

      {/* ================= CHART + ACTIVITIES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activities" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge>{activity.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ================= PENDING REQUESTS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Member Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{req.name}</p>
                <p className="text-xs text-muted-foreground">
                  Applied on {new Date(req.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm">Approve</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ================= METRIC CARD =================
function MetricCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
