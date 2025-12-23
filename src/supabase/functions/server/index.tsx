import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Generate unique MRID
function generateMRID(type: 'F' | 'I') {
  return `${type}${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

// Calculate distance between two districts (simplified)
function calculateDistance(district1: string, district2: string): number {
  if (district1.toLowerCase() === district2.toLowerCase()) return 0;
  // Simplified: return random distance for demo, in production use actual coordinates
  return Math.random() * 150;
}

// ===== AUTH ROUTES =====

// Send OTP
app.post('/make-server-cdee3b08/send-otp', async (c) => {
  try {
    const { phone } = await c.req.json();
    
    if (!phone || phone.length !== 10) {
      return c.json({ error: 'Invalid phone number' }, 400);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiry (5 minutes)
    await kv.set(`otp:${phone}`, {
      code: otp,
      expires: Date.now() + 5 * 60 * 1000
    });

    console.log(`OTP for ${phone}: ${otp}`); // In production, send via SMS gateway
    
    return c.json({ success: true, message: 'OTP sent successfully', otp }); // Remove otp in production
  } catch (error) {
    console.log(`Error sending OTP: ${error}`);
    return c.json({ error: 'Failed to send OTP' }, 500);
  }
});

// Verify OTP
app.post('/make-server-cdee3b08/verify-otp', async (c) => {
  try {
    const { phone, otp } = await c.req.json();
    
    const storedData = await kv.get(`otp:${phone}`);
    
    if (!storedData) {
      return c.json({ error: 'OTP expired or not found' }, 400);
    }

    if (storedData.expires < Date.now()) {
      await kv.del(`otp:${phone}`);
      return c.json({ error: 'OTP expired' }, 400);
    }

    if (storedData.code !== otp) {
      return c.json({ error: 'Invalid OTP' }, 400);
    }

    // OTP verified, delete it
    await kv.del(`otp:${phone}`);

    // Create/get user session
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${phone}@manvaasam.app`,
      password: phone
    });

    if (error) {
      // User doesn't exist, create one
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: `${phone}@manvaasam.app`,
        password: phone,
        email_confirm: true,
        user_metadata: { phone }
      });

      if (createError) {
        console.log(`Error creating user: ${createError}`);
        return c.json({ error: 'Failed to create user' }, 500);
      }

      return c.json({
        success: true,
        accessToken: newUser.user.id,
        needsRegistration: true,
        userType: null,
        userData: null
      });
    }

    // Check if user has completed registration
    const userData = await kv.get(`user:${data.user.id}`);
    
    return c.json({
      success: true,
      accessToken: data.user.id,
      needsRegistration: !userData,
      userType: userData?.type || null,
      userData: userData || null
    });
  } catch (error) {
    console.log(`Error verifying OTP: ${error}`);
    return c.json({ error: 'Failed to verify OTP' }, 500);
  }
});

// ===== REGISTRATION ROUTES =====

// Register Farmer
app.post('/make-server-cdee3b08/register-farmer', async (c) => {
  try {
    const { userId, name, aadhaar, address, phone, photo } = await c.req.json();
    
    const mrid = generateMRID('F');
    
    const farmerData = {
      id: userId,
      type: 'farmer',
      mrid,
      name,
      aadhaar,
      address,
      phone,
      photo,
      createdAt: Date.now(),
      harvests: []
    };

    await kv.set(`user:${userId}`, farmerData);
    await kv.set(`farmer:${mrid}`, farmerData);
    
    return c.json({ success: true, mrid, userData: farmerData });
  } catch (error) {
    console.log(`Error registering farmer: ${error}`);
    return c.json({ error: 'Failed to register farmer' }, 500);
  }
});

// Register Industry
app.post('/make-server-cdee3b08/register-industry', async (c) => {
  try {
    const { userId, companyName, type, ownerName, aadhaar, location, phone, photo } = await c.req.json();
    
    const mrid = generateMRID('I');
    
    const industryData = {
      id: userId,
      type: 'industry',
      mrid,
      companyName,
      industryType: type,
      ownerName,
      aadhaar,
      location,
      phone,
      photo,
      createdAt: Date.now(),
      demands: []
    };

    await kv.set(`user:${userId}`, industryData);
    await kv.set(`industry:${mrid}`, industryData);
    
    return c.json({ success: true, mrid, userData: industryData });
  } catch (error) {
    console.log(`Error registering industry: ${error}`);
    return c.json({ error: 'Failed to register industry' }, 500);
  }
});

// ===== POST ROUTES =====

// Create Harvest Post (Farmer)
app.post('/make-server-cdee3b08/create-harvest', async (c) => {
  try {
    const { userId, product, quantity, price, location, image, district } = await c.req.json();
    
    const userData = await kv.get(`user:${userId}`);
    if (!userData || userData.type !== 'farmer') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const harvestId = `H${Date.now()}`;
    const harvest = {
      id: harvestId,
      farmerId: userId,
      farmerName: userData.name,
      farmerMRID: userData.mrid,
      phone: userData.phone,
      product,
      quantity,
      price,
      location,
      district,
      image,
      createdAt: Date.now(),
      status: 'active'
    };

    await kv.set(`harvest:${harvestId}`, harvest);
    
    // Add to farmer's harvests
    userData.harvests.push(harvestId);
    await kv.set(`user:${userId}`, userData);

    return c.json({ success: true, harvest });
  } catch (error) {
    console.log(`Error creating harvest: ${error}`);
    return c.json({ error: 'Failed to create harvest' }, 500);
  }
});

// Create Demand Post (Industry)
app.post('/make-server-cdee3b08/create-demand', async (c) => {
  try {
    const { userId, product, quantity, priceRange, location, district, deadline } = await c.req.json();
    
    const userData = await kv.get(`user:${userId}`);
    if (!userData || userData.type !== 'industry') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const demandId = `D${Date.now()}`;
    const demand = {
      id: demandId,
      industryId: userId,
      companyName: userData.companyName,
      industryMRID: userData.mrid,
      phone: userData.phone,
      product,
      quantity,
      priceRange,
      location,
      district,
      deadline,
      createdAt: Date.now(),
      status: 'active'
    };

    await kv.set(`demand:${demandId}`, demand);
    
    // Add to industry's demands
    userData.demands.push(demandId);
    await kv.set(`user:${userId}`, userData);

    return c.json({ success: true, demand });
  } catch (error) {
    console.log(`Error creating demand: ${error}`);
    return c.json({ error: 'Failed to create demand' }, 500);
  }
});

// Get All Demands
app.get('/make-server-cdee3b08/all-demands', async (c) => {
  try {
    const allDemands = await kv.getByPrefix('demand:');
    
    const activeDemands = allDemands
      .filter(demand => demand.status === 'active')
      .sort((a, b) => b.createdAt - a.createdAt);

    return c.json({ success: true, demands: activeDemands });
  } catch (error) {
    console.log(`Error fetching all demands: ${error}`);
    return c.json({ error: 'Failed to fetch demands' }, 500);
  }
});

// Get All Harvests
app.get('/make-server-cdee3b08/all-harvests', async (c) => {
  try {
    const allHarvests = await kv.getByPrefix('harvest:');
    
    const activeHarvests = allHarvests
      .filter(harvest => harvest.status === 'active')
      .sort((a, b) => b.createdAt - a.createdAt);

    return c.json({ success: true, harvests: activeHarvests });
  } catch (error) {
    console.log(`Error fetching all harvests: ${error}`);
    return c.json({ error: 'Failed to fetch harvests' }, 500);
  }
});

// Get Matching Demands (for Farmer)
app.post('/make-server-cdee3b08/matching-demands', async (c) => {
  try {
    const { userId, products, district } = await c.req.json();
    
    const allDemands = await kv.getByPrefix('demand:');
    
    const matchingDemands = allDemands
      .filter(demand => {
        if (demand.status !== 'active') return false;
        
        // Match by product
        const productMatch = products.some((p: string) => 
          demand.product.toLowerCase().includes(p.toLowerCase()) ||
          p.toLowerCase().includes(demand.product.toLowerCase())
        );
        
        if (!productMatch) return false;
        
        // Match by location (within 100km)
        const distance = calculateDistance(district, demand.district);
        return distance <= 100;
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return c.json({ success: true, demands: matchingDemands });
  } catch (error) {
    console.log(`Error fetching matching demands: ${error}`);
    return c.json({ error: 'Failed to fetch demands' }, 500);
  }
});

// Get Matching Harvests (for Industry)
app.post('/make-server-cdee3b08/matching-harvests', async (c) => {
  try {
    const { userId, products, district } = await c.req.json();
    
    const allHarvests = await kv.getByPrefix('harvest:');
    
    const matchingHarvests = allHarvests
      .filter(harvest => {
        if (harvest.status !== 'active') return false;
        
        // Match by product
        const productMatch = products.some((p: string) => 
          harvest.product.toLowerCase().includes(p.toLowerCase()) ||
          p.toLowerCase().includes(harvest.product.toLowerCase())
        );
        
        if (!productMatch) return false;
        
        // Match by location (within 100km)
        const distance = calculateDistance(district, harvest.district);
        return distance <= 100;
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return c.json({ success: true, harvests: matchingHarvests });
  } catch (error) {
    console.log(`Error fetching matching harvests: ${error}`);
    return c.json({ error: 'Failed to fetch harvests' }, 500);
  }
});

// Get User Data
app.get('/make-server-cdee3b08/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ success: true, user: userData });
  } catch (error) {
    console.log(`Error fetching user: ${error}`);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Get My Harvests
app.get('/make-server-cdee3b08/my-harvests/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData || userData.type !== 'farmer') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const harvests = await Promise.all(
      userData.harvests.map((id: string) => kv.get(`harvest:${id}`))
    );

    return c.json({ success: true, harvests: harvests.filter(Boolean) });
  } catch (error) {
    console.log(`Error fetching harvests: ${error}`);
    return c.json({ error: 'Failed to fetch harvests' }, 500);
  }
});

// Get My Demands
app.get('/make-server-cdee3b08/my-demands/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData || userData.type !== 'industry') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const demands = await Promise.all(
      userData.demands.map((id: string) => kv.get(`demand:${id}`))
    );

    return c.json({ success: true, demands: demands.filter(Boolean) });
  } catch (error) {
    console.log(`Error fetching demands: ${error}`);
    return c.json({ error: 'Failed to fetch demands' }, 500);
  }
});

// Add Record (for profit/loss tracking)
app.post('/make-server-cdee3b08/add-record', async (c) => {
  try {
    const { userId, type, amount, description, date } = await c.req.json();
    
    const recordId = `R${Date.now()}`;
    const record = {
      id: recordId,
      userId,
      type, // 'profit' or 'loss' for farmer, 'purchase' for industry
      amount,
      description,
      date: date || Date.now(),
      createdAt: Date.now()
    };

    await kv.set(`record:${userId}:${recordId}`, record);

    return c.json({ success: true, record });
  } catch (error) {
    console.log(`Error adding record: ${error}`);
    return c.json({ error: 'Failed to add record' }, 500);
  }
});

// Get Records
app.get('/make-server-cdee3b08/records/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const records = await kv.getByPrefix(`record:${userId}:`);
    
    return c.json({ success: true, records: records.sort((a, b) => b.date - a.date) });
  } catch (error) {
    console.log(`Error fetching records: ${error}`);
    return c.json({ error: 'Failed to fetch records' }, 500);
  }
});

Deno.serve(app.fetch);