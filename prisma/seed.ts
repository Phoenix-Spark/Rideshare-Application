// prisma/seed.ts
import { prisma } from '../server/db.server';
import bcrypt from 'bcryptjs';

const BASE_ID = '8b3084e4-abd4-4b68-90c8-98c603b4a3ed';

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
      },
      create: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
      },
    });
  }
  console.log('✅ Users created successfully');
}

async function main() {
  // Create Travis Air Force Base
  console.log('🏛️  Creating Travis Air Force Base...');
  await prisma.base.upsert({
    where: { id: BASE_ID },
    update: {},
    create: {
      id: BASE_ID,
      name: 'Travis Air Force Base',
      abbreviation: null,
      state: 'California',
      long: '-121.93912044024607',
      lat: '38.27213331292935',
    },
  });
  console.log('✅ Base created successfully');

  // Define all stations
  const stations = [
    // Original stations
    {
      baseId: BASE_ID,
      name: 'North Gate',
      longitude: '-121.93317727310736',
      latitude: '38.284030251135036',
      description: 'North Gate',
    },
    {
      baseId: BASE_ID,
      name: 'DFAC',
      longitude: '-121.931778',
      latitude: '38.276338',
      description: 'Monarch Dining Facility',
    },
    {
      baseId: BASE_ID,
      name: 'Visitors Center',
      longitude: '-121.95711510910652',
      latitude: '38.27193795674447',
      description: 'Visitors Center',
    },
    {
      baseId: BASE_ID,
      name: 'Commissary',
      longitude: '-121.946734',
      latitude: '38.270440',
      description: 'Travis Commissary (Groceries)',
    },
    // Base Bound Locations
    {
      baseId: BASE_ID,
      name: 'MPF (Bldg 381)',
      longitude: '-121.929651',
      latitude: '38.274192',
      description: 'Military Personnel Flight',
    },
    {
      baseId: BASE_ID,
      name: 'Dormitory 1354',
      longitude: '-121.928293',
      latitude: '38.276620',
      description: 'Dormitory 1354',
    },
    {
      baseId: BASE_ID,
      name: 'Dormitory 1353',
      longitude: '-121.926596',
      latitude: '38.276714',
      description: 'Dormitory 1353',
    },
    {
      baseId: BASE_ID,
      name: 'Dormitory 1308',
      longitude: '-121.931978',
      latitude: '38.278446',
      description: 'Dormitory 1308',
    },
    {
      baseId: BASE_ID,
      name: 'Dormitory 1314',
      longitude: '-121.931108',
      latitude: '38.278772',
      description: 'Dormitory 1314',
    },
    {
      baseId: BASE_ID,
      name: 'Delta Breeze Community Center',
      longitude: '-121.936098',
      latitude: '38.275199',
      description: 'Delta Breeze Community Center',
    },
    {
      baseId: BASE_ID,
      name: 'Physical Fitness Center',
      longitude: '-121.936967',
      latitude: '38.273035',
      description: 'Physical Fitness Center',
    },
    {
      baseId: BASE_ID,
      name: 'Travis Main Exchange',
      longitude: '-121.950249',
      latitude: '38.269477',
      description: 'Travis Main Exchange',
    },
    {
      baseId: BASE_ID,
      name: 'MFRC',
      longitude: '-121.946606',
      latitude: '38.271887',
      description: 'Military & Family Readiness Center',
    },
    {
      baseId: BASE_ID,
      name: 'DGMC',
      longitude: '-121.963761',
      latitude: '38.270394',
      description: 'David Grant Medical Center',
    },
    {
      baseId: BASE_ID,
      name: "Airmen's Attic",
      longitude: '-121.935717',
      latitude: '38.268574',
      description: "Airmen's Attic",
    },
    {
      baseId: BASE_ID,
      name: 'Honor Guard',
      longitude: '-121.933648',
      latitude: '38.270235',
      description: 'Honor Guard',
    },
    {
      baseId: BASE_ID,
      name: 'Passenger Terminal',
      longitude: '-121.93099',
      latitude: '38.267084',
      description: 'Passenger Terminal',
    },
    {
      baseId: BASE_ID,
      name: '660th AMXS',
      longitude: '-121.936357',
      latitude: '38.266851',
      description: '660th Aircraft Maintenance Squadron',
    },
    {
      baseId: BASE_ID,
      name: '9th ARS',
      longitude: '-121.934889',
      latitude: '38.267425',
      description: '9th Air Refueling Squadron',
    },
    {
      baseId: BASE_ID,
      name: '6th ARS',
      longitude: '-121.937421',
      latitude: '38.267600',
      description: '6th Air Refueling Squadron',
    },
    {
      baseId: BASE_ID,
      name: 'Education Center',
      longitude: '-121.937364',
      latitude: '38.268494',
      description: 'Education Center',
    },
    {
      baseId: BASE_ID,
      name: '60 MXG',
      longitude: '-121.93886',
      latitude: '38.265725',
      description: '60th Maintenance Group',
    },
    {
      baseId: BASE_ID,
      name: 'Aerospace Ground Equipment',
      longitude: '-121.946243',
      latitude: '38.266457',
      description: 'Aerospace Ground Equipment',
    },
    {
      baseId: BASE_ID,
      name: 'P1 (IPE Pick-up)',
      longitude: '-121.930392',
      latitude: '38.268048',
      description: 'P1 IPE Pick-up',
    },
    {
      baseId: BASE_ID,
      name: '60 AMW Headquarters',
      longitude: '-121.932147',
      latitude: '38.268533',
      description: '60th Air Mobility Wing Headquarters',
    },
    {
      baseId: BASE_ID,
      name: 'Aviation Museum',
      longitude: '-121.932206',
      latitude: '38.270197',
      description: 'Aviation Museum',
    },
    {
      baseId: BASE_ID,
      name: 'PMEL',
      longitude: '-121.953263',
      latitude: '38.264557',
      description: 'Precision Measurement Equipment Laboratory',
    },
    {
      baseId: BASE_ID,
      name: 'All Night Café',
      longitude: '-121.950581',
      latitude: '38.263542',
      description: 'All Night Café',
    },
    {
      baseId: BASE_ID,
      name: 'Hangar 811',
      longitude: '-121.951513',
      latitude: '38.262565',
      description: 'Hangar 811',
    },
    {
      baseId: BASE_ID,
      name: 'Hangar 818',
      longitude: '-121.949925',
      latitude: '38.261423',
      description: 'Hangar 818',
    },
    {
      baseId: BASE_ID,
      name: '860th AMXS',
      longitude: '-121.950874',
      latitude: '38.258909',
      description: '860th Aircraft Maintenance Squadron',
    },
    {
      baseId: BASE_ID,
      name: '22nd Airlift Squadron',
      longitude: '-121.950889',
      latitude: '38.257451',
      description: '22nd Airlift Squadron',
    },
    {
      baseId: BASE_ID,
      name: 'Nosedock Gym',
      longitude: '-121.950691',
      latitude: '38.255772',
      description: 'Nosedock Gym',
    },
    {
      baseId: BASE_ID,
      name: '21st Airlift Squadron',
      longitude: '-121.954045',
      latitude: '38.259288',
      description: '21st Airlift Squadron',
    },
    {
      baseId: BASE_ID,
      name: 'Outdoor Recreation',
      longitude: '-121.956135',
      latitude: '38.261283',
      description: 'Outdoor Recreation',
    },
    {
      baseId: BASE_ID,
      name: 'CBRN',
      longitude: '-121.958722',
      latitude: '38.256016',
      description: 'Chemical, Biological, Radiological, Nuclear',
    },
    {
      baseId: BASE_ID,
      name: 'Airman Leadership School',
      longitude: '-121.939067',
      latitude: '38.271963',
      description: 'Airman Leadership School',
    },
    {
      baseId: BASE_ID,
      name: '60th AES',
      longitude: '-121.935636',
      latitude: '38.270042',
      description: '60th Aeromedical Evacuation Squadron',
    },
    {
      baseId: BASE_ID,
      name: '60th LRS Ground Transportation',
      longitude: '-121.939519',
      latitude: '38.266897',
      description: '60th Logistics Readiness Squadron Ground Transportation',
    },
    {
      baseId: BASE_ID,
      name: 'C-5 Aircrew & MX Training',
      longitude: '-121.941118',
      latitude: '38.268705',
      description: 'C-5 Aircrew & Maintenance Training',
    },
    {
      baseId: BASE_ID,
      name: 'Hangar 14',
      longitude: '-121.936756',
      latitude: '38.266010',
      description: 'Hangar 14',
    },
    {
      baseId: BASE_ID,
      name: '60th CS',
      longitude: '-121.933833',
      latitude: '38.269671',
      description: '60th Communications Squadron',
    },
    {
      baseId: BASE_ID,
      name: '60th MXS (Bldg 803)',
      longitude: '-121.952918',
      latitude: '38.263556',
      description: '60th Maintenance Squadron',
    },
    {
      baseId: BASE_ID,
      name: 'Ammo',
      longitude: '-121.963026',
      latitude: '38.262868',
      description: 'Ammunition Storage',
    },
    {
      baseId: BASE_ID,
      name: '349th AMW',
      longitude: '-121.938211',
      latitude: '38.27062',
      description: '349th Air Mobility Wing',
    },
  ];

  // Create stations
  await createStations(stations);

  // Hash password once for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

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
    const prefix = Math.floor(Math.random() * 900) + 100; // 100-999
    const lineNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
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

  // Create users
  await createUsers(users);

  console.log('\n🎉 Seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - 1 Base`);
  console.log(`   - ${stations.length} Stations`);
  console.log(`   - ${users.length} Users`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });