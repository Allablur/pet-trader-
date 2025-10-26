import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const accessToken = authHeader.split(' ')[1];
  if (!accessToken) return null;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    console.log(`Auth verification error: ${error?.message || 'No user found'}`);
    return null;
  }
  return user;
}

// Health check endpoint
app.get("/make-server-5abd33b1/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed demo data (for development)
app.post("/make-server-5abd33b1/seed", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Create demo admin user
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@pettrader.co.za',
      password: 'admin123',
      user_metadata: { name: 'Admin User', role: 'admin' },
      email_confirm: true
    });

    if (adminData?.user && !adminError) {
      await kv.set(`user:${adminData.user.id}`, {
        id: adminData.user.id,
        email: 'admin@pettrader.co.za',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
    }

    // Create demo regular user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'user@pettrader.co.za',
      password: 'user123',
      user_metadata: { name: 'Regular User', role: 'user' },
      email_confirm: true
    });

    if (userData?.user && !userError) {
      await kv.set(`user:${userData.user.id}`, {
        id: userData.user.id,
        email: 'user@pettrader.co.za',
        name: 'Regular User',
        role: 'user',
        createdAt: new Date().toISOString()
      });
    }

    return c.json({ 
      message: 'Demo accounts created successfully',
      accounts: [
        { email: 'admin@pettrader.co.za', password: 'admin123', role: 'admin' },
        { email: 'user@pettrader.co.za', password: 'user123', role: 'user' }
      ]
    });
  } catch (error) {
    console.log(`Seed error: ${error}`);
    return c.json({ error: 'Failed to seed data', details: error.message }, 500);
  }
});

// ============ AUTH ROUTES ============

// Sign up new user
app.post("/make-server-5abd33b1/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    console.log('Signup request received:', { email: body.email, name: body.name, role: body.role });
    
    const { email, password, name, role = 'user' } = body;

    if (!email || !password || !name) {
      console.log('Signup validation failed - missing fields');
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    if (password.length < 6) {
      console.log('Signup validation failed - password too short');
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    console.log('Creating user in Supabase Auth...');

    // Create user with admin.createUser
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Supabase Auth error during signup: ${error.message}`, error);
      
      // Handle specific error cases
      if (error.message.includes('already registered')) {
        return c.json({ error: 'This email is already registered. Please sign in instead.' }, 400);
      }
      
      return c.json({ error: error.message || 'Failed to create account' }, 400);
    }

    if (!data || !data.user) {
      console.log('No user data returned from Supabase');
      return c.json({ error: 'Failed to create user - no data returned' }, 500);
    }

    console.log(`User created successfully: ${data.user.id}`);

    // Store user profile in KV store
    try {
      await kv.set(`user:${data.user.id}`, {
        id: data.user.id,
        email,
        name,
        role,
        createdAt: new Date().toISOString()
      });
      console.log(`User profile stored in KV: ${data.user.id}`);
    } catch (kvError) {
      console.log(`KV storage error (non-critical): ${kvError}`);
    }

    return c.json({ 
      user: {
        id: data.user.id,
        email,
        name,
        role
      }
    }, 201);
  } catch (error: any) {
    console.log(`Sign up exception: ${error.message}`, error);
    return c.json({ error: `Failed to create user: ${error.message}` }, 500);
  }
});

// Sign in user
app.post("/make-server-5abd33b1/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Sign in error: ${error.message}`);
      return c.json({ error: error.message }, 401);
    }

    // Get user profile
    const userProfile = await kv.get(`user:${data.user.id}`);

    return c.json({
      accessToken: data.session.access_token,
      user: userProfile || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        role: data.user.user_metadata?.role || 'user'
      }
    });
  } catch (error) {
    console.log(`Sign in exception: ${error}`);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// Get current user profile
app.get("/make-server-5abd33b1/auth/me", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const userProfile = await kv.get(`user:${user.id}`);
  return c.json({ user: userProfile || { id: user.id, email: user.email } });
});

// ============ PET LISTING ROUTES ============

// Get all pet listings with filters
app.get("/make-server-5abd33b1/pets", async (c) => {
  try {
    const category = c.req.query('category');
    const status = c.req.query('status');
    const searchQuery = c.req.query('search')?.toLowerCase();

    // Get all pets from KV store
    const allPets = await kv.getByPrefix('pet:');
    let pets = allPets.map((item: any) => item);

    // Apply filters
    if (category && category !== 'all') {
      pets = pets.filter((pet: any) => pet.category?.toLowerCase() === category.toLowerCase());
    }

    if (status) {
      pets = pets.filter((pet: any) => pet.status === status);
    }

    if (searchQuery) {
      pets = pets.filter((pet: any) => 
        pet.name?.toLowerCase().includes(searchQuery) ||
        pet.breed?.toLowerCase().includes(searchQuery) ||
        pet.description?.toLowerCase().includes(searchQuery)
      );
    }

    // Sort by creation date (newest first)
    pets.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ pets });
  } catch (error) {
    console.log(`Get pets error: ${error}`);
    return c.json({ error: 'Failed to fetch pets' }, 500);
  }
});

// Get single pet by ID
app.get("/make-server-5abd33b1/pets/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const pet = await kv.get(`pet:${id}`);

    if (!pet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    // Get owner info
    if (pet.ownerId) {
      const owner = await kv.get(`user:${pet.ownerId}`);
      pet.ownerInfo = owner;
    }

    return c.json({ pet });
  } catch (error) {
    console.log(`Get pet error: ${error}`);
    return c.json({ error: 'Failed to fetch pet' }, 500);
  }
});

// Create new pet listing (protected)
app.post("/make-server-5abd33b1/pets", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized - please sign in to create listings' }, 401);
  }

  try {
    const petData = await c.req.json();
    const petId = crypto.randomUUID();

    const newPet = {
      id: petId,
      ...petData,
      ownerId: user.id,
      ownerEmail: user.email,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`pet:${petId}`, newPet);

    console.log(`Created new pet listing: ${petId} by user ${user.id}`);
    return c.json({ pet: newPet }, 201);
  } catch (error) {
    console.log(`Create pet error: ${error}`);
    return c.json({ error: 'Failed to create pet listing' }, 500);
  }
});

// Update pet listing (protected)
app.put("/make-server-5abd33b1/pets/:id", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const id = c.req.param('id');
    const existingPet = await kv.get(`pet:${id}`);

    if (!existingPet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    // Get user profile to check role
    const userProfile = await kv.get(`user:${user.id}`);
    const isAdmin = userProfile?.role === 'admin';

    // Check if user owns this pet or is admin
    if (existingPet.ownerId !== user.id && !isAdmin) {
      return c.json({ error: 'Forbidden - you can only edit your own listings' }, 403);
    }

    const updates = await c.req.json();
    const updatedPet = {
      ...existingPet,
      ...updates,
      id, // Preserve ID
      ownerId: existingPet.ownerId, // Preserve owner
      updatedAt: new Date().toISOString()
    };

    await kv.set(`pet:${id}`, updatedPet);

    console.log(`Updated pet listing: ${id}`);
    return c.json({ pet: updatedPet });
  } catch (error) {
    console.log(`Update pet error: ${error}`);
    return c.json({ error: 'Failed to update pet listing' }, 500);
  }
});

// Delete pet listing (protected)
app.delete("/make-server-5abd33b1/pets/:id", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const id = c.req.param('id');
    const existingPet = await kv.get(`pet:${id}`);

    if (!existingPet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    // Get user profile to check role
    const userProfile = await kv.get(`user:${user.id}`);
    const isAdmin = userProfile?.role === 'admin';

    // Check if user owns this pet or is admin
    if (existingPet.ownerId !== user.id && !isAdmin) {
      return c.json({ error: 'Forbidden - you can only delete your own listings' }, 403);
    }

    await kv.del(`pet:${id}`);

    console.log(`Deleted pet listing: ${id}`);
    return c.json({ message: 'Pet listing deleted successfully' });
  } catch (error) {
    console.log(`Delete pet error: ${error}`);
    return c.json({ error: 'Failed to delete pet listing' }, 500);
  }
});

// ============ MESSAGING ROUTES ============

// Send a message
app.post("/make-server-5abd33b1/messages", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized - please sign in to send messages' }, 401);
  }

  try {
    const { petId, recipientId, content } = await c.req.json();

    if (!petId || !recipientId || !content) {
      return c.json({ error: 'Pet ID, recipient ID, and message content are required' }, 400);
    }

    const messageId = crypto.randomUUID();
    const message = {
      id: messageId,
      petId,
      senderId: user.id,
      recipientId,
      content,
      read: false,
      createdAt: new Date().toISOString()
    };

    await kv.set(`message:${messageId}`, message);

    // Also store in conversation index for easy retrieval
    const conversationKey = [user.id, recipientId].sort().join(':');
    const conversationMessages = await kv.get(`conversation:${conversationKey}`) || [];
    conversationMessages.push(messageId);
    await kv.set(`conversation:${conversationKey}`, conversationMessages);

    console.log(`Message sent: ${messageId} from ${user.id} to ${recipientId}`);
    return c.json({ message }, 201);
  } catch (error) {
    console.log(`Send message error: ${error}`);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Get conversation between two users
app.get("/make-server-5abd33b1/messages/:otherUserId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const otherUserId = c.req.param('otherUserId');
    const conversationKey = [user.id, otherUserId].sort().join(':');
    
    const messageIds = await kv.get(`conversation:${conversationKey}`) || [];
    const messages = await Promise.all(
      messageIds.map((id: string) => kv.get(`message:${id}`))
    );

    // Filter out null messages and sort by date
    const validMessages = messages.filter(m => m).sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return c.json({ messages: validMessages });
  } catch (error) {
    console.log(`Get messages error: ${error}`);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

// Get all conversations for a user
app.get("/make-server-5abd33b1/conversations", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Get all conversations
    const allConversations = await kv.getByPrefix('conversation:');
    const userConversations = [];

    for (const conv of allConversations) {
      const [user1, user2] = conv.key.split(':').slice(1); // Remove 'conversation:' prefix
      
      if (user1 === user.id || user2 === user.id) {
        const otherUserId = user1 === user.id ? user2 : user1;
        const otherUser = await kv.get(`user:${otherUserId}`);
        
        // Get last message
        const messageIds = conv.value || [];
        const lastMessageId = messageIds[messageIds.length - 1];
        const lastMessage = lastMessageId ? await kv.get(`message:${lastMessageId}`) : null;

        userConversations.push({
          otherUser,
          lastMessage,
          unreadCount: 0 // Could be implemented
        });
      }
    }

    return c.json({ conversations: userConversations });
  } catch (error) {
    console.log(`Get conversations error: ${error}`);
    return c.json({ error: 'Failed to fetch conversations' }, 500);
  }
});

// ============ ADMIN ANALYTICS ROUTES ============

// Get admin analytics dashboard data
app.get("/make-server-5abd33b1/admin/analytics", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Verify user is admin
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Forbidden - admin access required' }, 403);
    }

    // Get all pets
    const allPets = await kv.getByPrefix('pet:');
    const pets = allPets.map((item: any) => item);

    // Get all users
    const allUsers = await kv.getByPrefix('user:');
    const users = allUsers.map((item: any) => item);

    // Calculate stats
    const totalListings = pets.length;
    const activeListings = pets.filter((p: any) => p.status === 'active').length;
    const soldListings = pets.filter((p: any) => p.status === 'sold').length;
    const pendingListings = pets.filter((p: any) => p.status === 'pending').length;
    const totalUsers = users.length;

    // Category breakdown
    const categoryStats: any = {};
    pets.forEach((pet: any) => {
      const category = pet.category || 'Unknown';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    // Monthly trends (last 6 months)
    const now = new Date();
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      
      const monthPets = pets.filter((pet: any) => {
        const petDate = new Date(pet.createdAt);
        return petDate.getMonth() === monthDate.getMonth() && 
               petDate.getFullYear() === monthDate.getFullYear();
      });

      monthlyData.push({
        month: monthName,
        listings: monthPets.length,
        sales: monthPets.filter((p: any) => p.status === 'sold').length,
        revenue: monthPets
          .filter((p: any) => p.status === 'sold' && p.price)
          .reduce((sum: number, p: any) => sum + (parseFloat(p.price) || 0), 0)
      });
    }

    // Recent activity (last 10 pets)
    const recentPets = [...pets]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(async (pet: any) => {
        const owner = await kv.get(`user:${pet.ownerId}`);
        return {
          ...pet,
          ownerName: owner?.name || 'Unknown'
        };
      });

    const recentPetsWithOwners = await Promise.all(recentPets);

    // Calculate revenue
    const totalRevenue = pets
      .filter((p: any) => p.status === 'sold' && p.price)
      .reduce((sum: number, p: any) => sum + (parseFloat(p.price) || 0), 0);

    return c.json({
      stats: {
        totalListings,
        activeListings,
        soldListings,
        pendingListings,
        totalUsers,
        totalRevenue,
        averagePrice: totalListings > 0 ? (totalRevenue / soldListings) || 0 : 0
      },
      categoryStats,
      monthlyData,
      recentPets: recentPetsWithOwners,
      topCategories: Object.entries(categoryStats)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5)
        .map(([category, count]) => ({ category, count }))
    });
  } catch (error) {
    console.log(`Get analytics error: ${error}`);
    return c.json({ error: 'Failed to fetch analytics data' }, 500);
  }
});

// Get all users (admin only)
app.get("/make-server-5abd33b1/admin/users", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Verify user is admin
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Forbidden - admin access required' }, 403);
    }

    const allUsers = await kv.getByPrefix('user:');
    const users = allUsers.map((item: any) => ({
      id: item.id,
      email: item.email,
      name: item.name,
      role: item.role,
      createdAt: item.createdAt
    }));

    return c.json({ users });
  } catch (error) {
    console.log(`Get users error: ${error}`);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

Deno.serve(app.fetch);