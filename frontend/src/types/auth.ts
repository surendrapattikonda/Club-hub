export type UserRole = "student" | "club-lead" | "faculty" | "admin";


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  club?: string;
  regNo?: string;   // ← Add this
  year?: string;    // ← And this
}


export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  regNo: string;     
  password: string;
  year: string;

}