/**
 * Build and Package Script for TMSE Pizza
 * Creates both an executable and a zipped project folder
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const outputDir = path.join(projectRoot, 'output');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  try {
    log('\n🍕 TMSE Pizza Build Script\n', 'yellow');

    // Step 1: Clean output directories
    log('📁 Cleaning output directories...', 'blue');
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true });
    }
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    // Step 2: Build Next.js
    log('🔨 Building Next.js application...', 'blue');
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });

    // Step 3: Build Electron
    log('⚡ Building Electron application...', 'blue');
    execSync('npm run electron-build', { cwd: projectRoot, stdio: 'inherit' });

    // Step 4: Create project zip
    log('📦 Creating project archive...', 'blue');
    await createProjectZip();

    log('\n✅ Build complete!', 'green');
    log(`\nOutput files:`, 'yellow');
    log(`  - Executable: ${distDir}`, 'reset');
    log(`  - Project ZIP: ${path.join(outputDir, 'TMSE-Pizza-Project.zip')}`, 'reset');
    log('\n🍕 Cowabunga!\n', 'green');

  } catch (error) {
    log(`\n❌ Build failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

function createProjectZip() {
  return new Promise((resolve, reject) => {
    const zipPath = path.join(outputDir, 'TMSE-Pizza-Project.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      log(`  Archive created: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`, 'reset');
      resolve();
    });

    archive.on('error', reject);
    archive.pipe(output);

    // Add source files (excluding node_modules, dist, .next, etc.)
    archive.glob('**/*', {
      cwd: projectRoot,
      ignore: [
        'node_modules/**',
        '.next/**',
        'dist/**',
        'output/**',
        '.git/**',
        '*.log',
      ],
    });

    archive.finalize();
  });
}

main();

