
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, RefreshCcw, Search, User, Users } from "lucide-react";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - in a real app, this would come from a backend
  const users = [
    { id: 1, name: "Jane Cooper", email: "jane@example.com", plan: "Premium", discount: "30% off for 52 weeks", joined: "Jan 12, 2025", status: "Active" },
    { id: 2, name: "Robert Fox", email: "robert@example.com", plan: "Premium", discount: "15% off for 8 weeks", joined: "Feb 4, 2025", status: "Active" },
    { id: 3, name: "Emily Wilson", email: "emily@example.com", plan: "Premium", discount: "None", joined: "Mar 8, 2025", status: "Active" },
    { id: 4, name: "Michael Brown", email: "michael@example.com", plan: "Premium", discount: "30% off for 52 weeks", joined: "Jan 24, 2025", status: "Active" },
    { id: 5, name: "Sarah Miller", email: "sarah@example.com", plan: "Premium", discount: "15% off for 8 weeks", joined: "Feb 18, 2025", status: "Active" },
    { id: 6, name: "David Johnson", email: "david@example.com", plan: "Premium", discount: "None", joined: "Mar 3, 2025", status: "Inactive" },
    { id: 7, name: "Jennifer Taylor", email: "jennifer@example.com", plan: "Premium", discount: "30% off for 52 weeks", joined: "Jan 30, 2025", status: "Active" },
    { id: 8, name: "Thomas Anderson", email: "thomas@example.com", plan: "Premium", discount: "15% off for 8 weeks", joined: "Feb 22, 2025", status: "Active" },
  ];
  
  const payments = [
    { id: 1, userId: 1, amount: 34.30, date: "Apr 12, 2025", status: "Completed" },
    { id: 2, userId: 2, amount: 41.65, date: "Apr 04, 2025", status: "Completed" },
    { id: 3, userId: 3, amount: 49.00, date: "Apr 08, 2025", status: "Completed" },
    { id: 4, userId: 4, amount: 34.30, date: "Apr 24, 2025", status: "Pending" },
    { id: 5, userId: 5, amount: 41.65, date: "Apr 18, 2025", status: "Completed" },
    { id: 6, userId: 7, amount: 34.30, date: "Apr 30, 2025", status: "Completed" },
    { id: 7, userId: 8, amount: 41.65, date: "Apr 22, 2025", status: "Completed" },
    { id: 8, userId: 1, amount: 34.30, date: "Mar 12, 2025", status: "Completed" },
    { id: 9, userId: 2, amount: 41.65, date: "Mar 04, 2025", status: "Completed" },
    { id: 10, userId: 4, amount: 34.30, date: "Mar 24, 2025", status: "Completed" },
  ];
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Stats summary
  const stats = [
    { title: "Total Users", value: users.length, icon: <Users className="h-8 w-8 text-primary" /> },
    { title: "Active Users", value: users.filter(u => u.status === "Active").length, icon: <User className="h-8 w-8 text-primary" /> },
    { title: "30% Discount Users", value: users.filter(u => u.discount.includes("30%")).length, icon: <User className="h-8 w-8 text-primary" /> },
    { title: "15% Discount Users", value: users.filter(u => u.discount.includes("15%")).length, icon: <User className="h-8 w-8 text-primary" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Manage users and view payment history</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" /> Refresh Data
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
                
                <div className="relative mt-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search users by name or email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.plan}</TableCell>
                          <TableCell>{user.discount}</TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.status === "Active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => {
                        const user = users.find(u => u.id === payment.userId);
                        return (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">#{payment.id}</TableCell>
                            <TableCell>{user?.name}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                payment.status === "Completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {payment.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">Details</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
