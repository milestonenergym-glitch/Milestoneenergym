const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

// 1. Change provider
content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "mongodb"');

// 2. Change IDs
content = content.replace(/id\s+String\s+@id\s+@default\(cuid\(\)\)/g, 'id String @id @default(auto()) @map("_id") @db.ObjectId');

// 3. Change foreign keys
content = content.replace(/userId\s+String(\s*@unique)?/g, 'userId String $1 @db.ObjectId');
content = content.replace(/assignedToId\s+String\?/g, 'assignedToId String? @db.ObjectId');
content = content.replace(/planId\s+String/g, 'planId String @db.ObjectId');
content = content.replace(/trainerId\s+String\?/g, 'trainerId String? @db.ObjectId');

// Clean up any double @db.ObjectId in case of repeated runs
content = content.replace(/@db\.ObjectId\s+@db\.ObjectId/g, '@db.ObjectId');

fs.writeFileSync(schemaPath, content);
console.log('Migration of schema.prisma complete!');
