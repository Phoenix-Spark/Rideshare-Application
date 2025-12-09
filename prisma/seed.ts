// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Travis Air Force Base
  const travisBase = await prisma.base.upsert({
    where: { id: '8b3084e4-abd4-4b68-90c8-98c603b4a3ed' },
    update: {},
    create: {
      id: '8b3084e4-abd4-4b68-90c8-98c603b4a3ed',
      name: 'Travis Air Force Base',
      abbreviation: null,
      state: 'California',
      long: '-121.93912044024607',
      lat: '38.27213331292935',
    },
  });

  console.log('✅ Created base:', travisBase.name);

  // Create Stations
  const stations = [
    {
      id: '832958d7-a302-455b-b278-9756de19d7b2',
      baseId: '8b3084e4-abd4-4b68-90c8-98c603b4a3ed',
      name: 'North Gate',
      longitude: '-121.93317727310736',
      latitude: '38.284030251135036',
      description: 'North Gate',
    },
    {
      id: '96a9f847-8f4e-4925-92e7-c2e6c12c054b',
      baseId: '8b3084e4-abd4-4b68-90c8-98c603b4a3ed',
      name: 'DFAC',
      longitude: '-121.93124574378724',
      latitude: '38.27674069185007',
      description: 'Monarch Dining Facility',
    },
    {
      id: '34798abf-9568-478f-aea2-fd93d3066a8b',
      baseId: '8b3084e4-abd4-4b68-90c8-98c603b4a3ed',
      name: 'Visitors Center',
      longitude: '-121.95711510910652',
      latitude: '38.27193795674447',
      description: 'Visitors Center',
    },
    {
      id: '2f48cb5f-e17a-4a18-81ba-afe637391aaa',
      baseId: '8b3084e4-abd4-4b68-90c8-98c603b4a3ed',
      name: 'Commissary',
      longitude: '-121.94664041583147',
      latitude: '38.27035935215939',
      description: 'Travis Commissary (Groceries)',
    },
    {
      id: '583020e0-3850-4b4e-96a7-f42bbacef3e2',
      baseId: '8b3084e4-abd4-4b68-90c8-98c603b4a3ed',
      name: 'BX',
      longitude: '-121.94980817548635',
      latitude: '38.2691626414959',
      description: 'Base Exchange',
    },
  ];

  for (const station of stations) {
    const createdStation = await prisma.station.upsert({
      where: { id: station.id },
      update: {},
      create: station,
    });
    console.log('✅ Created station:', createdStation.name);
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });