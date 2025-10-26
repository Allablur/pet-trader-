import { useState, useEffect } from "react";
import { LayoutDashboard, PawPrint, Users, BarChart3, LogOut, Plus, MoreVertical, Edit, Trash2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { projectId } from "../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  accessToken: string | null;
  onLogout: () => void;
}

export function AdminDashboard({ onNavigate, accessToken, onLogout }: AdminDashboardProps) {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchPets();
    fetchAnalytics();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/pets`
      );
      
      if (response.ok) {
        const data = await response.json();
        setPets(data.pets || []);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/admin/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.stats);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!accessToken) {
      toast.error("Please sign in to delete listings");
      return;
    }

    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/pets/${petId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Listing deleted successfully");
        fetchPets();
        fetchAnalytics();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete listing");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete listing");
    }
  };

  const handleUpdateStatus = async (petId: string, newStatus: string) => {
    if (!accessToken) {
      toast.error("Please sign in to update listings");
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/pets/${petId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast.success("Status updated successfully");
        fetchPets();
        fetchAnalytics();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update status");
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Failed to update status");
    }
  };

  const stats = [
    {
      title: "Active Listings",
      value: analytics?.activeListings?.toString() || "0",
      change: "+12%",
      icon: PawPrint,
    },
    {
      title: "Total Users",
      value: analytics?.totalUsers?.toString() || "0",
      change: "+8%",
      icon: Users,
    },
    {
      title: "Pending Listings",
      value: analytics?.pendingListings?.toString() || "0",
      change: "+23%",
      icon: BarChart3,
    },
    {
      title: "Total Sales",
      value: analytics?.soldListings?.toString() || "0",
      change: "+15%",
      icon: BarChart3,
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen sticky top-0">
          <div className="p-6">
            <h3 className="mb-6 text-primary">Admin Panel</h3>
            <nav className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Manage Pets
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => onNavigate("analytics")}
              >
                <TrendingUp className="w-4 h-4 mr-3" />
                Analytics
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <PawPrint className="w-4 h-4 mr-3" />
                All Listings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="w-4 h-4 mr-3" />
                Users
              </Button>
            </nav>

            <div className="mt-auto pt-8">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your pet marketplace.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-secondary/50 rounded-full p-3">
                        <Icon className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pet Listings Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pet Listings</CardTitle>
                <Button 
                  className="rounded-full"
                  onClick={() => onNavigate("listing-form")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Pet
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pet</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="text-muted-foreground">Loading pets...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : pets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No pet listings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pets.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {pet.image && (
                              <img
                                src={pet.image}
                                alt={pet.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <span>{pet.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{pet.breed}</TableCell>
                        <TableCell>{pet.ownerInfo?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          {pet.price ? `R ${parseFloat(pet.price).toLocaleString()}` : 'Free Adoption'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              pet.status === "active"
                                ? "secondary"
                                : pet.status === "sold"
                                ? "default"
                                : "outline"
                            }
                          >
                            {pet.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(pet.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdateStatus(pet.id, 'active')}>
                                Mark as Active
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(pet.id, 'pending')}>
                                Mark as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(pet.id, 'sold')}>
                                Mark as Sold
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeletePet(pet.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
