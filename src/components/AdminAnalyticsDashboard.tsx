import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  PawPrint, 
  Users, 
  TrendingUp, 
  LogOut, 
  DollarSign,
  Activity,
  Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Badge } from "./ui/badge";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface AdminAnalyticsDashboardProps {
  onNavigate: (page: string) => void;
  accessToken: string | null;
  onLogout: () => void;
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

export function AdminAnalyticsDashboard({ 
  onNavigate, 
  accessToken,
  onLogout 
}: AdminAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    if (!accessToken) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/admin/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err: any) {
      console.error('Analytics fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => onNavigate("landing")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = analyticsData?.stats || {};
  const monthlyData = analyticsData?.monthlyData || [];
  const categoryStats = analyticsData?.categoryStats || {};
  const recentPets = analyticsData?.recentPets || [];

  // Prepare category data for pie chart
  const categoryChartData = Object.entries(categoryStats).map(([name, value]) => ({
    name,
    value
  }));

  // Calculate trends
  const listingsTrend = monthlyData.length >= 2 
    ? ((monthlyData[monthlyData.length - 1].listings - monthlyData[monthlyData.length - 2].listings) / monthlyData[monthlyData.length - 2].listings * 100).toFixed(1)
    : 0;

  const salesTrend = monthlyData.length >= 2
    ? ((monthlyData[monthlyData.length - 1].sales - monthlyData[monthlyData.length - 2].sales) / (monthlyData[monthlyData.length - 2].sales || 1) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen sticky top-0">
          <div className="p-6">
            <h3 className="mb-6 text-primary">Admin Panel</h3>
            <nav className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-3" />
                Analytics
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => onNavigate("dashboard")}
              >
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Manage Pets
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
            <h1 className="mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track marketplace performance, listings, sales, and user activity.
            </p>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3">
                    <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {listingsTrend > 0 ? '+' : ''}{listingsTrend}%
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-1">Total Listings</p>
                <p className="text-2xl">{stats.totalListings || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-1">Active Listings</p>
                <p className="text-2xl">{stats.activeListings || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {salesTrend > 0 ? '+' : ''}{salesTrend}%
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-1">Total Sales</p>
                <p className="text-2xl">{stats.soldListings || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-amber-100 dark:bg-amber-900/20 rounded-full p-3">
                    <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Revenue
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl">R {stats.totalRevenue?.toLocaleString() || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Listings & Sales Trends</CardTitle>
                <CardDescription>Monthly performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="listings" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Listings"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Sales"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trends over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#f59e0b" name="Revenue (R)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Distribution and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Breakdown of listings by pet category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Listings</CardTitle>
                <CardDescription>Latest pet listings on the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {recentPets.map((pet: any) => (
                    <div key={pet.id} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                      {pet.image && (
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{pet.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {pet.breed} • {pet.ownerName}
                        </p>
                      </div>
                      <Badge variant={
                        pet.status === 'active' ? 'secondary' :
                        pet.status === 'sold' ? 'default' : 'outline'
                      }>
                        {pet.status}
                      </Badge>
                    </div>
                  ))}
                  {recentPets.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No listings yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-2">Total Users</p>
                <p className="text-3xl mb-1">{stats.totalUsers || 0}</p>
                <p className="text-sm text-muted-foreground">Registered accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-2">Pending Listings</p>
                <p className="text-3xl mb-1">{stats.pendingListings || 0}</p>
                <p className="text-sm text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-2">Average Price</p>
                <p className="text-3xl mb-1">R {stats.averagePrice?.toFixed(0) || 0}</p>
                <p className="text-sm text-muted-foreground">Per sold pet</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
