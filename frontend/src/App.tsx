import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Auth Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";

// Student Pages
import { BrowseClubsPage } from "@/pages/student/BrowseClubsPage";
import { MyClubsPage } from "@/pages/student/MyClubsPage";
import { ActivitiesPage } from "@/pages/student/ActivitiesPage";

// Club Lead Pages
import { DashboardPage } from "@/pages/club-lead/DashboardPage";
import { ManageMembersPage } from "./pages/club-lead/ManageMembersPage";

// Faculty Pages
import { DashboardPage as FacultyDashboardPage } from "@/pages/faculty/DashboardPage";
import { ClubManagementPage as FacultyClubManagementPage } from "@/pages/faculty/ClubManagementPage";

// Admin Pages
import { DashboardPage as AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { FacultyManagementPage } from "@/pages/admin/FacultyManagementPage";

// Shared
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>

              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Redirect root */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* ---------------------- Student Routes ---------------------- */}
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="clubs" element={<BrowseClubsPage />} />
                <Route path="my-clubs" element={<MyClubsPage />} />
                <Route path="activities" element={<ActivitiesPage />} />
              </Route>

              {/* ---------------------- Club Lead Routes ---------------------- */}
              <Route
                path="/club-lead/*"
                element={
                  <ProtectedRoute allowedRoles={["clublead"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="members" element={<ManageMembersPage/>} />
                <Route path="activities" element={<div>Activities Management (Coming Soon)</div>} />
                <Route path="attendance" element={<div>Attendance Tracking (Coming Soon)</div>} />
                <Route path="reports" element={<div>Reports (Coming Soon)</div>} />
              </Route>

              {/* ---------------------- Faculty Routes ---------------------- */}
              <Route
                path="/faculty/*"
                element={
                  <ProtectedRoute allowedRoles={["faculty"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<FacultyDashboardPage />} />
                <Route path="clubs" element={<FacultyClubManagementPage />} />
                <Route path="analytics" element={<div>coming soon</div>} />
              </Route>

              {/* ---------------------- Admin Routes ---------------------- */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="faculty" element={<FacultyManagementPage />} />
                <Route path="clubs" element={<div>coming soon</div>} />
                <Route path="analytics" element={<div>coming soon</div>} />
              </Route>

              {/* ---------------------- Not Found ---------------------- */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
