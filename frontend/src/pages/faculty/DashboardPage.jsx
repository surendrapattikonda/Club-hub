import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const clubMemberDistribution = [
  { club: 'The Codes', members: 69 },
  { club: 'Hydra', members: 74 },
  { club: 'Shield Prep', members: 61 },
  { club: 'Jignasa', members: 70 },
  { club: 'Arts House', members: 87 },
  { club: 'Vedic Vox', members: 70 },
  { club: 'Yuga Spark', members: 44 },
];

const clubActivityData = [
  { club: 'The Codes', events: 12 },
  { club: 'Hydra', events: 10 },
  { club: 'Shield Prep', events: 8 },
  { club: 'Jignasa', events: 6 },
  { club: 'Arts House', events: 5 },
  { club: 'Vedic Vox', events: 4 },
  { club: 'Yuga Spark', events: 3 },
];


const recentActivities = [
  { id: 1, club: 'The Hydra - The Bootcamp Club', activity: 'Bootcamp workshop scheduled', time: '2 hours ago', type: 'event' },
  { id: 2, club: 'Arts House Club', activity: 'New member joined', time: '5 hours ago', type: 'member' },
  { id: 3, club: 'YUGA SPARK - THE HACKATHON CLUB', activity: 'Hackathon announced', time: '1 day ago', type: 'event' },
  { id: 4, club: 'SHIELD PREP - THE INTERVIEW PREPARATION CLUB', activity: 'Mock interview session conducted', time: '2 days ago', type: 'status' },
  { id: 5, club: 'Vedic Vox - Ideas Presentation Club', activity: 'Presentation session scheduled', time: '3 days ago', type: 'event' },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
        <p className="text-muted-foreground">Department overview and club management</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1</span> from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">481</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+35</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Club-wise Members */}
        <Card>
          <CardHeader>
            <CardTitle>Club-wise Member Distribution</CardTitle>
            <CardDescription>Number of members in each club</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={clubMemberDistribution}
                margin={{ top: 5, right: 20, left: 10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="club" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="members"
                  fill="hsl(var(--primary))"
                  name="Members"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Club Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Top Active Clubs</CardTitle>
            <CardDescription>Number of events conducted this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={clubActivityData}
                margin={{ top: 5, right: 20, left: 10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="club" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="events"
                  fill="hsl(var(--chart-2))"
                  name="Events"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates from clubs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.club}</p>
                  <p className="text-sm text-muted-foreground">{activity.activity}</p>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}