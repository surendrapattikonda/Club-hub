{/*import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, Filter } from 'lucide-react';

const activities = [
  {
    id: '1',
    title: 'React Workshop',
    club: 'Coding Club',
    date: '2024-02-20',
    time: '2:00 PM - 5:00 PM',
    location: 'Computer Lab 1',
    description: 'Learn the fundamentals of React.js and build your first component.',
    status: 'upcoming',
    attendees: 45,
    maxAttendees: 50,
    type: 'workshop'
  },
  {
    id: '2',
    title: 'Nature Photography Trip',
    club: 'Photography Club',
    date: '2024-02-18',
    time: '8:00 AM - 6:00 PM',
    location: 'Botanical Garden',
    description: 'Capture the beauty of nature with fellow photography enthusiasts.',
    status: 'upcoming',
    attendees: 20,
    maxAttendees: 25,
    type: 'trip'
  },
  {
    id: '3',
    title: 'Web Development Bootcamp',
    club: 'Coding Club',
    date: '2024-02-15',
    time: '9:00 AM - 4:00 PM',
    location: 'Main Auditorium',
    description: 'Intensive bootcamp covering HTML, CSS, and JavaScript fundamentals.',
    status: 'completed',
    attendees: 80,
    maxAttendees: 80,
    type: 'workshop'
  },
  {
    id: '4',
    title: 'Portrait Photography Masterclass',
    club: 'Photography Club',
    date: '2024-02-12',
    time: '3:00 PM - 6:00 PM',
    location: 'Studio Room',
    description: 'Learn professional portrait photography techniques.',
    status: 'completed',
    attendees: 15,
    maxAttendees: 20,
    type: 'workshop'
  }
];

export function ActivitiesPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [clubFilter, setClubFilter] = useState('all');

  const filteredActivities = activities.filter(activity => {
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesClub = clubFilter === 'all' || activity.club === clubFilter;
    return matchesStatus && matchesClub;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return '🛠️';
      case 'trip': return '🚌';
      case 'meeting': return '💼';
      case 'competition': return '🏆';
      default: return '📅';
    }
  };

  const clubs = ['all', ...Array.from(new Set(activities.map(activity => activity.club)))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Club Activities</h1>
        <p className="text-muted-foreground">
          Stay updated with all your club activities and events
        </p>
      </div>

      {/* Filters */}{/*}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={clubFilter} onValueChange={setClubFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Club" />
          </SelectTrigger>
          <SelectContent>
            {clubs.map(club => (
              <SelectItem key={club} value={club}>
                {club === 'all' ? 'All Clubs' : club}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Activities Timeline */}{/*}
      <div className="space-y-4">
        {filteredActivities.map((activity, index) => (
          <Card key={activity.id} className={`overflow-hidden ${activity.status === 'upcoming' ? 'border-primary/50' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getTypeIcon(activity.type)}</div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {activity.title}
                      <Badge variant={getStatusVariant(activity.status)}>
                        {activity.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{activity.club}</p>
                  </div>
                </div>
                {activity.status === 'upcoming' && (
                  <Button size="sm">
                    {activity.attendees >= activity.maxAttendees ? 'Join Waitlist' : 'Register'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{activity.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{new Date(activity.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{activity.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{activity.attendees}/{activity.maxAttendees} attendees</span>
                </div>
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(activity.attendees / activity.maxAttendees) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No activities found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}*/}
import React from 'react'

export function ActivitiesPage () {
  return (
    <div className='text-center py-12'>
      <p className='text-muted-foreground'>Activities Page Under Construction</p>
      <p className='text-muted-foreground'>Coming soon</p>
    </div>
  )
}

