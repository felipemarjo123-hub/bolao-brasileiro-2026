const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('@/app/api/auth/[...nextauth]/route')) {
        content = content.replace(/import\s+\{\s*authOptions\s*\}\s+from\s+['"]@\/app\/api\/auth\/\[\.\.\.nextauth\]\/route['"];?/g, 'import { authOptions } from "@/lib/auth";');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed imports in', fullPath);
      }
    }
  }
}

replaceInDir(srcDir);

// Now fix the original route.ts to not export authOptions, but import it from lib/auth
const routeTsPath = path.join(srcDir, 'app', 'api', 'auth', '[...nextauth]', 'route.ts');
let routeContent = fs.readFileSync(routeTsPath, 'utf8');
if (routeContent.includes('export const authOptions: AuthOptions = {')) {
  // Extract authOptions
  const authOptionsMatch = routeContent.match(/export const authOptions: AuthOptions = (\{[\s\S]*?\n\});\n\nconst handler/);
  if (authOptionsMatch) {
    const authOptionsObject = authOptionsMatch[1];
    
    // Create src/lib/auth.ts
    const authTsContent = `import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = ${authOptionsObject};
`;
    fs.writeFileSync(path.join(srcDir, 'lib', 'auth.ts'), authTsContent, 'utf8');
    
    // Clean route.ts
    routeContent = routeContent.replace(/export const authOptions: AuthOptions = \{[\s\S]*?\n\};\n\n/, 'import { authOptions } from "@/lib/auth";\n\n');
    routeContent = routeContent.replace(/import \{ AuthOptions \} from "next-auth";\n/, '');
    routeContent = routeContent.replace(/import CredentialsProvider from "next-auth\/providers\/credentials";\n/, '');
    routeContent = routeContent.replace(/import \{ PrismaAdapter \} from "@next-auth\/prisma-adapter";\n/, '');
    routeContent = routeContent.replace(/import bcrypt from "bcrypt";\n/, '');
    
    fs.writeFileSync(routeTsPath, routeContent, 'utf8');
    console.log('Moved authOptions to src/lib/auth.ts and cleaned route.ts');
  }
}
