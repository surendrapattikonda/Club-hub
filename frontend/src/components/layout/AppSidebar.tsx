import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  BookOpen,
  UserCheck,
  ClipboardList,
  TrendingUp,
  School,
  Shield,
  Trophy
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const studentNavItems = [
  { title: 'Browse Clubs', url: '/student/clubs', icon: BookOpen },
  { title: 'My Clubs', url: '/student/my-clubs', icon: Users },
  { title: 'Activities', url: '/student/activities', icon: Calendar },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
];

const clubLeadNavItems = [
  { title: 'Dashboard', url: '/club-lead/dashboard', icon: BarChart3 },
  { title: 'Manage Members', url: '/club-lead/members', icon: Users },
  { title: 'Activities', url: '/club-lead/activities', icon: ClipboardList },
  { title: 'Attendance', url: '/club-lead/attendance', icon: UserCheck },
  { title: 'Reports', url: '/club-lead/reports', icon: TrendingUp },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
];

const facultyNavItems = [
  { title: 'Dashboard', url: '/faculty/dashboard', icon: BarChart3 },
  { title: 'Club Management', url: '/faculty/clubs', icon: Shield },
  { title: 'Analytics', url: '/faculty/analytics', icon: TrendingUp },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
];

const adminNavItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: BarChart3 },
  { title: 'Faculty Management', url: '/admin/faculty', icon: Users },
  { title: 'Club Management', url: '/admin/clubs', icon: Shield },
  { title: 'Analytics', url: '/admin/analytics', icon: TrendingUp },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
];

export function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();

  const getNavItems = () => {
    switch (user?.role) {
      case 'student': return studentNavItems;
      case 'club-lead': return clubLeadNavItems;
      case 'faculty': return facultyNavItems;
      case 'admin': return adminNavItems;
      default: return [];
    }
  };

  const navItems = getNavItems();
  const isActive = (path: string) => location.pathname === path;

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-sidebar-foreground">ClubHub</h2>
                <p className="text-xs text-sidebar-foreground/60">Management System</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === 'club-lead' && (
          <SidebarGroup className="px-2">
            <SidebarGroupLabel>Club: {user.club}</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 text-sm text-sidebar-foreground/60">
                <Trophy className="w-4 h-4 inline mr-2" />
                {!isCollapsed && <span>Leading {user.club}</span>}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}