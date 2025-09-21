import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, Calendar, Trophy, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import codes from '@/assets/codes.jpg';
import shield from '../../assets/shield1.png';
import hydra from '../../assets/hydra1.png';
import vedic from '../../assets/vedic1.png';
import yuga from '../../assets/yuga1.png';
import arts from '../../assets/arts1.png';
const mockClubs = [
  {
    id: '1',
    name: 'The Codes',
    description: `The Codes Club motivate students to strengthen their problem-solving and coding skills. 
    It provides a platform to learn, practice, and collaborate on real coding challenges. 
    Beyond just programming, The Codes encourages logical thinking and practical application of concepts to solve real-world problems. 
    The Codes – where learning meets problem-solving, and every challenge is an opportunity.`,
    category: 'Technical',
    members: 69,
    activities: 0,
    status: 'active',
    image: codes
  },
  {
    id: '2',
    name: 'The Hydra - The Bootcamp Club',
    description: `Hydra Club is where curious people team up to learn and grow. 
    We share skills, exchange ideas, and push each other to improve. 
    Everyone puts in effort and energy to keep things moving forward. 
    It's all about real learning, growing as a group, and pushing limits together. 
    Hydra club - where curiosity meets innovation!`,
    category: 'Bootcamp',
    members: 74,
    activities: 0,
    status: 'active',
    image: hydra }
    ,

  {
    id: '3',
    name: 'YUGA SPARK - THE HACKATHON CLUB',
    description: `At Yuga Spark, ideas ignite, Coding dreams take fearless flight. 
    With passion and teamwork, we collaborate, Together we build, break, and create. 
    Challenges we face, with minds so great, Shaping the future, we innovate. 
    From sparks to flames, our vision grows, The spirit of innovation forever glows.`,
    category: 'Hackathon',
    members: 44,
    activities: 0,
    status: 'active',
    image: yuga
  },
    {
    id: '4',
    name: 'SHIELD PREP - THE INTERVIEW PREPARATION CLUBs',
    description: `SHIELD PREP Club empowers students to bridge the gap between academics and industry needs through strategic learning and practical exposure. 
    It focuses on enhancing skills like interviews, public speaking, resume building, and group discussions. 
    By fostering collaboration and leadership, it builds confidence and competence among students. 
    The club prepares young minds to thrive as professionals in today's competitive world.`,
    category: 'Career Development',
    members: 61,
    activities: 0,
    status: 'active',
    image: shield
   },
  
  {
    id: '5',
    name: 'Vedic Vox - Ideas Presentation Club',
    description: `An ideas presentation club is the place where ideas find their voice, helping students share their creativity with confidence. 
    It focuses on turning thoughts into impact by building strong communication and presentation skills. 
    The club acts as a bridge from imagination to presentation, giving students the platform they need to shine. 
    It believes in nurturing ideas that speak, voices that inspire, encouraging every student to express their vision.`,
    category: 'Communication',
    members: 70,
    activities: 0,
    status: 'active',
    image: vedic
  },
  {
    id: '6',
    name: 'Arts House Club',
    description: `Arts House is a creative space where students explore talents beyond academics. 
    It is about celebrating expression through dance, music, and crafts while also stepping into modern creative fields like UI/UX design. 
    The club gives students a chance to relax, learn, and express themselves, building confidence, creativity, and teamwork. 
    Arts House believes that true learning goes beyond textbooks, embracing skills that inspire both heart and mind.`,
    category: 'Arts',
    members: 87,
    activities: 0,
    status: 'active',
    image: arts
  },
  {
    id: '7',
    name: 'JIGNASA - THE LEARNING CLUB',
    description: `Jignasa - The Learning Club motivates students to acquire a diverse range of skills, both academic and non-academic. 
    It provides a platform where students can learn, teach, and collaborate with their peers. 
    Beyond formal education, Jignasa encourages students to develop practical skills that enhance their daily productivity and personal growth. 
    Jignasa - Where learning never stops; it only pauses with a comma, not a full stop.`,
    category: 'Learning',
    members: 70,
    activities: 0,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop'
  }
];

export function BrowseClubsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);
  const [expandedClubs, setExpandedClubs] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredClubs = mockClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || club.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleJoinClub = (clubId: string, clubName: string) => {
    setJoinedClubs(prev => [...prev, clubId]);
    toast({
      title: 'Join request sent',
      description: `Your request to join ${clubName} has been submitted for approval.`,
    });
  };

  const toggleExpanded = (clubId: string) => {
    setExpandedClubs(prev => 
      prev.includes(clubId) 
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    );
  };

  const categories = ['all', ...Array.from(new Set(mockClubs.map(club => club.category)))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Clubs</h1>
        <p className="text-muted-foreground">
          Discover and join clubs that match your interests
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockClubs.length}</p>
                <p className="text-sm text-muted-foreground">Total Clubs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{mockClubs.reduce((sum, club) => sum + club.members, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{mockClubs.reduce((sum, club) => sum + club.activities, 0)}</p>
                <p className="text-sm text-muted-foreground">Activities This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => {
          const isExpanded = expandedClubs.includes(club.id);
          const shouldShowToggle = club.description.length > 150;
          
          return (
            <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${club.image})` }} />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{club.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {club.category}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <CardDescription className={isExpanded ? "" : "line-clamp-3"}>
                    {club.description}
                  </CardDescription>
                  {shouldShowToggle && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(club.id)}
                      className="h-6 p-0 text-xs text-primary hover:text-primary/80"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 mr-1" />
                          Read more
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{club.members} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{club.activities} activities</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleJoinClub(club.id, club.name)}
                  disabled={joinedClubs.includes(club.id)}
                  variant={joinedClubs.includes(club.id) ? "secondary" : "default"}
                >
                  {joinedClubs.includes(club.id) ? (
                    'Request Sent'
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Join Club
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No clubs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}