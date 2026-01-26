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
      },
      create: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
        emailVerified: true,
        baseId: user.baseId,
      },
    });
  }
  console.log('✅ Users created successfully');
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

  for (const base of bases) {
    const baseLong = parseFloat(base.long);
    const baseLat = parseFloat(base.lat);

    // Generate random stations for this base
    const stations = generateStationsForBase(base.id, baseLong, baseLat);
    allStations.push(...stations);
    console.log(`📍 Generated ${stations.length} stations for ${base.name}`);
  }

  // Create all stations
  await createStations(allStations);

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
  console.log(`\n👥 Users per base:`);
  bases.forEach(base => {
    console.log(`   - ${base.name}: ${usersByBase[base.id]} users`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });