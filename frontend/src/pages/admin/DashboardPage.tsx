import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

/* ---------- Stats ---------- */
const dashboardStats = [
  { title: 'Total Clubs', value: '7', change: '+1', icon: Users },
  { title: 'Total Club Leads', value: '28', change: '+4', icon: UserCheck },
  { title: 'Active Students', value: '247', change: '+45', icon: Users },
  { title: 'Monthly Events', value: '67', change: '+12', icon: Calendar },
];

/* ---------- Club Capacity Data (Semester-based) ---------- */
const clubCapacityData = [
  { club: 'The Codes', members: 69, capacity: 80 },
  { club: 'Hydra', members: 74, capacity: 90 },
  { club: 'Shield Prep', members: 61, capacity: 75 },
  { club: 'Jignasa', members: 70, capacity: 85 },
  { club: 'Arts House', members: 87, capacity: 100 },
  { club: 'Vedic Vox', members: 70, capacity: 80 },
  { club: 'Yuga Spark', members: 44, capacity: 60 },
];

/* ---------- Club-wise Members ---------- */
const clubMemberDistribution = [
  { club: 'The Codes', members: 69 },
  { club: 'Hydra', members: 74 },
  { club: 'Shield Prep', members: 61 },
  { club: 'Jignasa', members: 70 },
  { club: 'Arts House', members: 87 },
  { club: 'Vedic Vox', members: 70 },
  { club: 'Yuga Spark', members: 44 },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge variant="secondary" className="text-xs">
                {stat.change} from last update
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* LEFT: Club Capacity Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Club Capacity Utilization (Current Semester)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={clubCapacityData}
                margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="club"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={90}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="members"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                  name="Current Members"
                />
                <Line
                  type="monotone"
                  dataKey="capacity"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Max Capacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RIGHT: Club-wise Member Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Club-wise Member Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={clubMemberDistribution}
                margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="club"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={90}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="members"
                  fill="hsl(var(--chart-2))"
                  radius={[6, 6, 0, 0]}
                  name="Members"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { action: 'New faculty registered', user: 'Dr. Sarah Wilson', time: '2 hours ago' },
            { action: 'Club created', user: 'Codes  Club', time: '4 hours ago' },
            { action: 'Faculty credentials updated', user: 'Dr. John Doe', time: '6 hours ago' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.user}</p>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
