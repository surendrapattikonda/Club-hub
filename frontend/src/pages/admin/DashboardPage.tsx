import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, GraduationCap, Calendar, TrendingUp } from 'lucide-react';

const dashboardStats = [
  { title: 'Total Clubs', value: '24', change: '+3', icon: Users },
  { title: 'Total Faculty', value: '18', change: '+2', icon: GraduationCap },
  { title: 'Active Students', value: '1,247', change: '+45', icon: Users },
  { title: 'Monthly Events', value: '67', change: '+12', icon: Calendar },
];

const clubGrowthData = [
  { month: 'Jan', clubs: 18, members: 890 },
  { month: 'Feb', clubs: 19, members: 945 },
  { month: 'Mar', clubs: 21, members: 1023 },
  { month: 'Apr', clubs: 22, members: 1156 },
  { month: 'May', clubs: 24, members: 1247 },
];

const departmentData = [
  { name: 'Computer Science', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Electronics', value: 25, color: 'hsl(var(--secondary))' },
  { name: 'Mechanical', value: 20, color: 'hsl(var(--accent))' },
  { name: 'Civil', value: 15, color: 'hsl(var(--muted))' },
  { name: 'Others', value: 5, color: 'hsl(var(--border))' },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Complete system overview and management controls
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge variant="secondary" className="text-xs">
                {stat.change} from last month
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Club Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Club & Membership Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clubGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="clubs" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Clubs"
                />
                <Line 
                  type="monotone" 
                  dataKey="members" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Members"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Club Distribution by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New faculty registered', user: 'Dr. Sarah Wilson', time: '2 hours ago', type: 'faculty' },
              { action: 'Club created', user: 'Photography Club', time: '4 hours ago', type: 'club' },
              { action: 'Faculty credentials updated', user: 'Dr. John Doe', time: '6 hours ago', type: 'faculty' },
              { action: 'System backup completed', user: 'System', time: '8 hours ago', type: 'system' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}