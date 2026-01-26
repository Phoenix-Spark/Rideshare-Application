// prisma/seed.ts
import { randomInt } from 'crypto';
import { prisma } from '../server/db.server';
import bcrypt from 'bcryptjs';

// Base IDs
const BASES = {
  TRAVIS: '8b3084e4-abd4-4b68-90c8-98c603b4a3ed',
  VANDENBERG: 'a1b2c3d4-e5f6-4789-abcd-ef1234567890',
  EGLIN: 'b2c3d4e5-f6a7-4890-bcde-f12345678901',
};

async function createStations(stations: any[]) {
  console.log(`📍 Creating ${stations.length} stations...`);
  for (const station of stations) {
    await prisma.station.upsert({
      where: { name: station.name },
      update: {
        longitude: station.longitude,
        latitude: station.latitude,
        description: station.description,
        baseId: station.baseId,
      },
      create: {
        name: station.name,
        longitude: station.longitude,
        latitude: station.latitude,
        description: station.description,
        baseId: station.baseId,
      },
    });
  }
  console.log('✅ Stations created successfully');
}

async function createUsers(users: any[]) {
  console.log(`👤 Creating ${users.length} users...`);
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        password: user.password,
        emailVerified: true,
        baseId: user.baseId,
        isDriver: user.isDriver,
      },
      create: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
        emailVerified: true,
        baseId: user.baseId,
        isDriver: user.isDriver,
      },
    });
  }
  console.log('✅ Users created successfully');
}

async function createVehicles(vehicles: any[]) {
  console.log(`🚗 Creating ${vehicles.length} vehicles...`);
  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { plate: vehicle.plate },
      update: {
        userId: vehicle.userId,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
      },
      create: {
        userId: vehicle.userId,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        plate: vehicle.plate,
      },
    });
  }
  console.log('✅ Vehicles created successfully');
}

async function createRequests(requests: any[]) {
  console.log(`🚕 Creating ${requests.length} requests...`);
  for (const request of requests) {
    await prisma.request.create({
      data: request,
    });
  }
  console.log('✅ Requests created successfully');
}

// Function to generate random coordinates within radius (in miles)
function generateRandomCoordinates(centerLong: number, centerLat: number, radiusMiles: number) {
  // Convert miles to degrees (approximately)
  // 1 degree latitude ≈ 69 miles
  // 1 degree longitude ≈ 69 miles * cos(latitude)
  const latDegreePerMile = 1 / 69;
  const longDegreePerMile = 1 / (69 * Math.cos(centerLat * Math.PI / 180));

  // Generate random angle and distance
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusMiles;

  // Calculate offset
  const latOffset = distance * Math.sin(angle) * latDegreePerMile;
  const longOffset = distance * Math.cos(angle) * longDegreePerMile;

  return {
    longitude: (centerLong + longOffset).toFixed(8),
    latitude: (centerLat + latOffset).toFixed(8),
  };
}

// Station type prefixes for variety
const stationTypes = [
  'Building', 'Hangar', 'Gate', 'Facility', 'Squadron',
  'Center', 'Office', 'Complex', 'Terminal', 'Wing',
  'Dormitory', 'Shop', 'Unit', 'Warehouse', 'Station'
];

// Generate random stations for a base
function generateStationsForBase(baseId: string, baseLong: number, baseLat: number) {
  const NUM_STATIONS = 20;
  const RADIUS_MILES = 1.5;
  
  return Array.from({ length: NUM_STATIONS }, (_, index) => {
    const coords = generateRandomCoordinates(baseLong, baseLat, RADIUS_MILES);
    const stationType = stationTypes[randomInt(0, stationTypes.length)];
    const buildingNumber = randomInt(100, 2000);
    
    return {
      baseId: baseId,
      name: `${stationType} ${buildingNumber}`,
      longitude: coords.longitude,
      latitude: coords.latitude,
      description: `${stationType} ${buildingNumber}`,
    };
  });
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate random date in the past
function randomPastDate(daysBack: number): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - (Math.random() * daysBack * 24 * 60 * 60 * 1000));
  return pastDate;
}

// Generate random vehicle
function generateVehicle(userId: string): any {
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Jeep', 'RAM', 'GMC', 'Hyundai', 'Kia'];
  const models = {
    Toyota: ['Camry', 'Corolla', 'RAV4', 'Tacoma', '4Runner'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
    Ford: ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge'],
    Chevrolet: ['Silverado', 'Equinox', 'Tahoe', 'Malibu', 'Traverse'],
    Nissan: ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Frontier'],
    Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Gladiator'],
    RAM: ['1500', '2500', '3500', 'ProMaster', 'ProMaster City'],
    GMC: ['Sierra', 'Terrain', 'Acadia', 'Canyon', 'Yukon'],
    Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona'],
    Kia: ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride'],
  };
  const colors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Tan', 'Brown', 'Orange'];
  
  const make = makes[randomInt(0, makes.length)];
  const model = models[make][randomInt(0, models[make].length)];
  const year = String(randomInt(2015, 2025));
  const color = colors[randomInt(0, colors.length)];
  
  // Generate random California license plate (7 characters)
  const digits = String(randomInt(0, 10)).repeat(1) + String(randomInt(0, 10)).repeat(1) + String(randomInt(0, 10)).repeat(1);
  const letters = String.fromCharCode(65 + randomInt(0, 26)) + 
                  String.fromCharCode(65 + randomInt(0, 26)) + 
                  String.fromCharCode(65 + randomInt(0, 26)) +
                  String.fromCharCode(65 + randomInt(0, 26));
  const plate = digits + letters;
  
  return {
    userId,
    year,
    make,
    model,
    color,
    plate,
  };
}

async function main() {
  // Create all Air Force Bases
  console.log('🏛️  Creating Air Force Bases...');
  
  const bases = [
    {
      id: BASES.TRAVIS,
      name: 'Travis Air Force Base',
      abbreviation: 'TAFB',
      state: 'California',
      long: '-121.93912044024607',
      lat: '38.27213331292935',
    },
    {
      id: BASES.VANDENBERG,
      name: 'Vandenberg Air Force Base',
      abbreviation: 'VAFB',
      state: 'California',
      long: '-120.51930818025428',
      lat: '34.74712544604196',
    },
    {
      id: BASES.EGLIN,
      name: 'Eglin Air Force Base',
      abbreviation: 'EAFB',
      state: 'Florida',
      long: '-86.55188610116491',
      lat: '30.458099157824904',
    },
  ];

  for (const base of bases) {
    await prisma.base.upsert({
      where: { id: base.id },
      update: {},
      create: base,
    });
    console.log(`✅ Created ${base.name}`);
  }

  // Generate stations for each base
  const allStations: any[] = [];
  const stationsByBase: Record<string, any[]> = {};

  for (const base of bases) {
    const baseLong = parseFloat(base.long);
    const baseLat = parseFloat(base.lat);

    // Generate random stations for this base
    const stations = generateStationsForBase(base.id, baseLong, baseLat);
    allStations.push(...stations);
    stationsByBase[base.id] = stations;
    console.log(`📍 Generated ${stations.length} stations for ${base.name}`);
  }

  // Create all stations
  await createStations(allStations);

  // Fetch created stations from DB to get their IDs
  const createdStations = await prisma.station.findMany();
  const stationIdsByBase: Record<string, string[]> = {};
  createdStations.forEach(station => {
    if (!stationIdsByBase[station.baseId]) {
      stationIdsByBase[station.baseId] = [];
    }
    stationIdsByBase[station.baseId].push(station.id);
  });

  // Hash password once for all users
  const hashedPassword = await bcrypt.hash('asdasdasdasd', 10);

  // Lists of first and last names
  const firstNames = [
    'James', 'Sarah', 'Michael', 'Emily', 'David',
    'Jennifer', 'Robert', 'Amanda', 'Christopher', 'Jessica',
    'Matthew', 'Ashley', 'Daniel', 'Nicole', 'Joshua',
    'Elizabeth', 'Andrew', 'Samantha', 'Ryan', 'Lauren',
    'Brandon', 'Megan', 'Tyler', 'Brittany', 'Justin',
    'Rachel', 'Kevin', 'Hannah', 'Steven', 'Alexis'
  ];
  const lastNames = [
    'Mitchell', 'Rodriguez', 'Thompson', 'Anderson', 'Martinez',
    'Williams', 'Johnson', 'Brown', 'Davis', 'Garcia',
    'Miller', 'Wilson', 'Moore', 'Taylor', 'Thomas',
    'Jackson', 'White', 'Harris', 'Martin', 'Clark',
    'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
    'King', 'Wright', 'Scott', 'Green', 'Baker'
  ];

  // Generate random phone number (707 area code for Travis AFB region)
  const generatePhoneNumber = () => {
    const areaCode = '707';
    const prefix = randomInt(100, 1000); // 100-999 (upper bound is exclusive)
    const lineNumber = randomInt(1000, 10000); // 1000-9999 (upper bound is exclusive)
    return `${areaCode}-${prefix}-${lineNumber}`;
  };

  // Dynamically create users
  const users = firstNames.map((firstName, index) => ({
    firstName,
    lastName: lastNames[index],
    email: `${firstName.toLowerCase()}.${lastNames[index].toLowerCase()}@us.af.mil`,
    phoneNumber: generatePhoneNumber(),
    password: hashedPassword,
    isDriver: false, // Will be set to true for users with vehicles
  }));

  // Shuffle users and assign them evenly to bases
  const shuffledUsers = shuffleArray(users);
  const usersPerBase = Math.floor(shuffledUsers.length / bases.length);
  const baseIds = [BASES.TRAVIS, BASES.VANDENBERG, BASES.EGLIN];
  
  const usersWithBases = shuffledUsers.map((user, index) => {
    const baseIndex = Math.floor(index / usersPerBase);
    // Handle any remainder users by assigning them to the last base
    const assignedBaseId = baseIndex >= baseIds.length ? baseIds[baseIds.length - 1] : baseIds[baseIndex];
    
    return {
      ...user,
      baseId: assignedBaseId,
    };
  });

  // Create users
  await createUsers(usersWithBases);

  // Fetch created users to get their IDs
  const createdUsers = await prisma.user.findMany();
  
  // Select 10 random users to be drivers with vehicles
  const shuffledCreatedUsers = shuffleArray(createdUsers);
  const driversWithVehicles = shuffledCreatedUsers.slice(0, 10);
  
  // Update these users to be drivers
  for (const driver of driversWithVehicles) {
    await prisma.user.update({
      where: { id: driver.id },
      data: { isDriver: true },
    });
  }

  // Create vehicles for the 10 drivers
  const vehicles = driversWithVehicles.map(driver => generateVehicle(driver.id));
  await createVehicles(vehicles);

  console.log(`✅ Created ${vehicles.length} vehicles for drivers`);

  // Generate requests for all users
  const allRequests: any[] = [];
  
  for (const user of createdUsers) {
    const userBaseId = user.baseId!;
    const availableStations = stationIdsByBase[userBaseId];
    const availableDrivers = driversWithVehicles.filter(d => d.baseId === userBaseId);
    
    if (availableDrivers.length === 0) continue;

    // Generate 3-5 completed rides
    const numCompleted = randomInt(3, 6);
    for (let i = 0; i < numCompleted; i++) {
      const driver = availableDrivers[randomInt(0, availableDrivers.length)];
      const pickupStation = availableStations[randomInt(0, availableStations.length)];
      const dropoffStation = availableStations[randomInt(0, availableStations.length)];
      
      const createdAt = randomPastDate(30);
      const acceptedAt = new Date(createdAt.getTime() + randomInt(1, 10) * 60 * 1000); // 1-10 min later
      const pickedUpAt = new Date(acceptedAt.getTime() + randomInt(5, 20) * 60 * 1000); // 5-20 min later
      const droppedOffAt = new Date(pickedUpAt.getTime() + randomInt(5, 30) * 60 * 1000); // 5-30 min later
      
      allRequests.push({
        userId: user.id,
        baseId: userBaseId,
        driverId: driver.id,
        pickupId: pickupStation,
        dropoffId: dropoffStation,
        status: 'Completed',
        createdAt,
        updatedAt: droppedOffAt,
        acceptedAt,
        pickedUpAt,
        droppedOffAt,
      });
    }

    // Generate 2-6 canceled rides
    const numCanceled = randomInt(2, 7);
    for (let i = 0; i < numCanceled; i++) {
      const pickupStation = availableStations[randomInt(0, availableStations.length)];
      const dropoffStation = availableStations[randomInt(0, availableStations.length)];
      
      const createdAt = randomPastDate(30);
      const updatedAt = new Date(createdAt.getTime() + randomInt(1, 30) * 60 * 1000);
      
      allRequests.push({
        userId: user.id,
        baseId: userBaseId,
        pickupId: pickupStation,
        dropoffId: dropoffStation,
        status: 'Canceled',
        createdAt,
        updatedAt,
      });
    }
  }

  // Add a few pending requests (5 random users)
  const usersForPending = shuffleArray(createdUsers).slice(0, 5);
  for (const user of usersForPending) {
    const userBaseId = user.baseId!;
    const availableStations = stationIdsByBase[userBaseId];
    const pickupStation = availableStations[randomInt(0, availableStations.length)];
    const dropoffStation = availableStations[randomInt(0, availableStations.length)];
    
    allRequests.push({
      userId: user.id,
      baseId: userBaseId,
      pickupId: pickupStation,
      dropoffId: dropoffStation,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Add a few in-progress requests (5 different random users)
  const usersForInProgress = shuffleArray(createdUsers.filter(u => !usersForPending.includes(u))).slice(0, 5);
  for (const user of usersForInProgress) {
    const userBaseId = user.baseId!;
    const availableStations = stationIdsByBase[userBaseId];
    const availableDrivers = driversWithVehicles.filter(d => d.baseId === userBaseId);
    
    if (availableDrivers.length === 0) continue;
    
    const driver = availableDrivers[randomInt(0, availableDrivers.length)];
    const pickupStation = availableStations[randomInt(0, availableStations.length)];
    const dropoffStation = availableStations[randomInt(0, availableStations.length)];
    
    const createdAt = new Date(Date.now() - randomInt(10, 30) * 60 * 1000); // 10-30 min ago
    const acceptedAt = new Date(createdAt.getTime() + randomInt(1, 5) * 60 * 1000);
    const pickedUpAt = new Date(acceptedAt.getTime() + randomInt(5, 15) * 60 * 1000);
    
    allRequests.push({
      userId: user.id,
      baseId: userBaseId,
      driverId: driver.id,
      pickupId: pickupStation,
      dropoffId: dropoffStation,
      status: 'In-Progress',
      createdAt,
      updatedAt: pickedUpAt,
      acceptedAt,
      pickedUpAt,
    });
  }

  // Create all requests
  await createRequests(allRequests);

  // Count requests by status
  const requestsByStatus = allRequests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count users per base for summary
  const usersByBase = usersWithBases.reduce((acc, user) => {
    acc[user.baseId] = (acc[user.baseId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n🎉 Seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${bases.length} Bases`);
  console.log(`   - ${allStations.length} Stations`);
  console.log(`   - ${usersWithBases.length} Users`);
  console.log(`   - ${vehicles.length} Vehicles`);
  console.log(`   - ${allRequests.length} Requests`);
  console.log(`\n👥 Users per base:`);
  bases.forEach(base => {
    console.log(`   - ${base.name}: ${usersByBase[base.id]} users`);
  });
  console.log(`\n🚕 Requests by status:`);
  Object.entries(requestsByStatus).forEach(([status, count]) => {
    console.log(`   - ${status}: ${count}`);
  });
  console.log(`\n🚗 Drivers with vehicles: ${driversWithVehicles.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });