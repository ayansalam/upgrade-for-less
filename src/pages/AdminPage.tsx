
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Users, DollarSign, BarChart2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  subscription: {
    id: string;
    status: string;
    is_yearly: boolean;
    current_period_end: string | null;
    tier: {
      name: string;
    } | null;
  } | null;
}

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }
        
        // Check if user is admin
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();
        
        if (error || !profile || !profile.is_admin) {
          // Not an admin, redirect to homepage
          navigate("/");
          return;
        }
        
        setIsAdmin(true);
        fetchUsers();
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/");
      }
    };
    
    checkAdmin();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users with their profiles and subscription info
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          email,
          first_name,
          last_name,
          created_at,
          subscriptions (
            id,
            status,
            is_yearly,
            current_period_end,
            subscription_tiers (
              name
            )
          )
        `);
      
      if (error) {
        throw error;
      }
      
      const formattedUsers = data.map((user: any) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        profile: {
          first_name: user.first_name,
          last_name: user.last_name
        },
        subscription: user.subscriptions && user.subscriptions[0] ? {
          id: user.subscriptions[0].id,
          status: user.subscriptions[0].status,
          is_yearly: user.subscriptions[0].is_yearly,
          current_period_end: user.subscriptions[0].current_period_end,
          tier: user.subscriptions[0].subscription_tiers
        } : null
      }));
      
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      const results = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.profile?.first_name && user.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.profile?.last_name && user.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(results);
    }
  }, [searchTerm, users]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getDiscountInfo = (subscription: any) => {
    if (!subscription) return "None";
    if (subscription.is_yearly) return "30% for 52 weeks";
    // For demonstration purposes
    return "15% for 8 weeks";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg">Loading admin panel...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This should never render as we redirect non-admins
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <h3 className="text-2xl font-bold">{users.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <CreditCard className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                    <h3 className="text-2xl font-bold">
                      {users.filter(user => user.subscription && user.subscription.status === "active").length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <BarChart2 className="h-6 w-6 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Discount Rate</p>
                    <h3 className="text-2xl font-bold">
                      {Math.round((users.filter(user => 
                        user.subscription && 
                        (user.subscription.is_yearly || true) // For demo purposes, assuming all subs have discount
                      ).length / Math.max(1, users.length)) * 100)}%
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                    <DollarSign className="h-6 w-6 text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Yearly Plans</p>
                    <h3 className="text-2xl font-bold">
                      {users.filter(user => user.subscription && user.subscription.is_yearly).length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Input
                  placeholder="Search users by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Next Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {user.profile?.first_name && user.profile?.last_name
                                  ? `${user.profile.first_name} ${user.profile.last_name}`
                                  : "Unnamed User"}
                              </p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>
                            {user.subscription 
                              ? user.subscription.tier?.name || "Standard" 
                              : "No Subscription"}
                          </TableCell>
                          <TableCell>
                            {user.subscription ? (
                              <Badge className={
                                user.subscription.status === "active" 
                                  ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              }>
                                {user.subscription.status.charAt(0).toUpperCase() + user.subscription.status.slice(1)}
                              </Badge>
                            ) : (
                              <Badge variant="outline">No Subscription</Badge>
                            )}
                          </TableCell>
                          <TableCell>{getDiscountInfo(user.subscription)}</TableCell>
                          <TableCell>
                            {user.subscription?.current_period_end 
                              ? formatDate(user.subscription.current_period_end) 
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
