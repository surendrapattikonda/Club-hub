import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Activity, MessageSquare, ExternalLink } from 'lucide-react';
import {useNavigate } from 'react-router-dom';
export function MyClubsPage() {
  const [myClubs, setMyClubs] = useState<any[]>([]);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/clubs/my-clubs", {
          credentials: "include", // if using cookies/JWT
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT in localStorage
          },
        });

        const data = await res.json();

        // Assuming your API returns something like:
        // { myClubs: [...], pendingApplications: [...] }
        setMyClubs(data.myClubs || []);
        setPendingApplications(data.pendingApplications || []);
      } catch (err) {
        console.error("Error fetching clubs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return <p>Loading clubs...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Clubs</h1>
        <p className="text-muted-foreground">
          Manage your club memberships and stay updated with activities
        </p>
      </div>

      {/* Pending Applications */}
      {pendingApplications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Applications</h2>
          <div className="grid gap-4">
            {pendingApplications.map((app) => (
              <Card key={app.id} className="border-warning/50 bg-warning/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Applied on {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">
                      Pending Approval
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Clubs */}
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
                {/* Next Event */}
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

                {/* Stats */}
                {club.stats && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Users className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-bold">{club.stats.members}</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Activity className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-bold">{club.stats.activities}</p>
                      <p className="text-xs text-muted-foreground">Activities</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-bold">{club.stats.attendance}%</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Club Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {myClubs.length === 0 && pendingApplications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't joined any clubs yet.</p>
          <Button onClick={()=>{navigate(
'/student/clubs'
          )}}>Browse Clubs</Button>
        </div>
      )}
    </div>
  );
}
