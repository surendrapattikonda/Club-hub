/*import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Filter, Clock, MapPin } from 'lucide-react';

const events = [
  {
    id: '1',
    title: 'React Workshop',
    club: 'Coding Club',
    date: '2024-02-20',
    time: '2:00 PM - 5:00 PM',
    location: 'Computer Lab 1',
    type: 'workshop',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Photography Trip',
    club: 'Photography Club',
    date: '2024-02-18',
    time: '8:00 AM - 6:00 PM',
    location: 'Botanical Garden',
    type: 'trip',
    color: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Drama Rehearsal',
    club: 'Drama Society',
    date: '2024-02-22',
    time: '4:00 PM - 7:00 PM',
    location: 'Main Auditorium',
    type: 'rehearsal',
    color: 'bg-purple-500'
  },
  {
    id: '4',
    title: 'Music Practice',
    club: 'Music Club',
    date: '2024-02-19',
    time: '3:00 PM - 5:00 PM',
    location: 'Music Room',
    type: 'practice',
    color: 'bg-orange-500'
  },
  {
    id: '5',
    title: 'Robotics Competition',
    club: 'Robotics Club',
    date: '2024-02-25',
    time: '10:00 AM - 4:00 PM',
    location: 'Engineering Lab',
    type: 'competition',
    color: 'bg-red-500'
  }
];

const clubs = ['All Clubs', 'Coding Club', 'Photography Club', 'Drama Society', 'Music Club', 'Robotics Club'];

export function CalendarPage() {
  const [selectedClub, setSelectedClub] = useState('All Clubs');
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredEvents = selectedClub === 'All Clubs' 
    ? events 
    : events.filter(event => event.club === selectedClub);

  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get days in current month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getEventsForDay = (day: number) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Calendar</h1>
          <p className="text-muted-foreground">
            View all club activities and events in one place
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by club" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map(club => (
                  <SelectItem key={club} value={club}>{club}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar *//*
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {currentMonth}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-border rounded-lg ${
                      day ? 'cursor-pointer hover:bg-accent/50' : ''
                    } ${isToday(day || 0) ? 'bg-primary/10 border-primary' : ''}`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary' : ''}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded text-white ${event.color} truncate`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events *//*
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredEvents
              .filter(event => new Date(event.date) >= today)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="space-y-2 pb-4 border-b border-border last:border-0">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {event.club}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            {filteredEvents.filter(event => new Date(event.date) >= today).length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No upcoming events found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}*/
import React from 'react'

export function  CalendarPage () {
  return (
    <div className='text-center py-12'>
      <p className='text-muted-foreground'>Calendar page is Coming soon </p>
    </div>
  )
}
