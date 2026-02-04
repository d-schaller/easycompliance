import { PrismaClient } from "@prisma/client";
import iso27001Data from "./iso27001.json";
import nistCsfData from "./nist-csf.json";
import bsiGrundschutzData from "./bsi-grundschutz.json";
import swissIktGrundschutzData from "./swiss-ikt-grundschutz.json";
import soc2Data from "./soc2.json";

const prisma = new PrismaClient();

interface StandardData {
  standard: {
    name: string;
    shortName: string;
    version: string;
    description: string;
  };
  controls: {
    code: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
  }[];
}

async function seedStandard(data: StandardData) {
  console.log(`Seeding ${data.standard.name}...`);

  const standard = await prisma.standard.upsert({
    where: {
      shortName_version: {
        shortName: data.standard.shortName,
        version: data.standard.version,
      },
    },
    update: {
      name: data.standard.name,
      description: data.standard.description,
    },
    create: {
      name: data.standard.name,
      shortName: data.standard.shortName,
      version: data.standard.version,
      description: data.standard.description,
      isGlobal: true,
    },
  });

  console.log(`  Created/updated standard: ${standard.name} (${standard.id})`);

  for (const control of data.controls) {
    await prisma.control.upsert({
      where: {
        standardId_code: {
          standardId: standard.id,
          code: control.code,
        },
      },
      update: {
        name: control.name,
        description: control.description,
        category: control.category,
        subcategory: control.subcategory,
      },
      create: {
        standardId: standard.id,
        code: control.code,
        name: control.name,
        description: control.description,
        category: control.category,
        subcategory: control.subcategory,
      },
    });
  }

  console.log(`  Seeded ${data.controls.length} controls`);
}

async function main() {
  console.log("Starting seed...\n");

  await seedStandard(iso27001Data as StandardData);
  await seedStandard(nistCsfData as StandardData);
  await seedStandard(bsiGrundschutzData as StandardData);
  await seedStandard(swissIktGrundschutzData as StandardData);
  await seedStandard(soc2Data as StandardData);

  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
