const fs = require('fs');
const path = require('path');

const envContent = `# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file in frontend directory');
} else {
  console.log('⚠️  .env file already exists in frontend directory');
}











