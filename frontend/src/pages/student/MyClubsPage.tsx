import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Activity, MessageSquare, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MyClubsPage() {
  const [myClubs, setMyClubs] = useState<any[]>([]);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ Get token from localStorage's user object
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user?.token;

        if (!token) {
          setError("User not logged in or token missing");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/clubs/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMyClubs(res.data.myClubs || []);
        setPendingApplications(res.data.pendingApplications || []);
      } catch (err: any) {
        console.error("Error fetching clubs:", err.response?.data || err);
        setError(err.response?.data?.message || "Failed to fetch clubs");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) return <p>Loading clubs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Clubs</h1>
        <p className="text-muted-foreground">
          Manage your club memberships and stay updated with activities
        </p>
      </div>

      {pendingApplications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Applications</h2>
          <div className="grid gap-4">
            {pendingApplications.map((app) => (
              <Card key={app.id} className="border-warning/50 bg-warning/5">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Applied on {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">
                    Pending Approval
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Memberships</h2>
        <div className="grid gap-6">
          {myClubs.map((club) => (
            <Card key={club.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {club.name}
                      <Badge variant={club.role === 'Core Member' ? 'default' : 'secondary'}>
                        {club.role}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Joined on {new Date(club.joinedDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{club.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {club.nextEvent && (
                  <div className="bg-accent/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <h4 className="font-medium">Upcoming Event</h4>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{club.nextEvent.title}</p>
                      <p className="text-muted-foreground">
                        {new Date(club.nextEvent.date).toLocaleDateString()} at {club.nextEvent.time}
                      </p>
                    </div>
                  </div>
                )}
                {club.stats && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-2xl font-bold">{club.stats.members}</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                    <div className="text-center">
                      <Activity className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-2xl font-bold">{club.stats.activities}</p>
                      <p className="text-xs text-muted-foreground">Activities</p>
                    </div>
                    <div className="text-center">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-2xl font-bold">{club.stats.attendance}%</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {myClubs.length === 0 && pendingApplications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't joined any clubs yet.</p>
          <Button onClick={() => navigate('/student/clubs')}>Browse Clubs</Button>
        </div>
      )}
    </div>
  );
}
