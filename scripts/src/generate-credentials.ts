import fs from 'fs/promises';
import path from 'path';
import QRCode from 'qrcode';

const CONFERENCE_NAME = 'STEM MUN International Online Conference 2026';
const ISSUED_DATE = 'August 23, 2026';
const HOLDING_DATE = 'August 23, 2026';
const BASE_URL = 'https://stem-mun-certificates.replit.dev';

interface Credential {
  id: string;
  recipient: string;
  certificateName: string;
  committee: string;
  conference: string;
  date: string;
  issued: string;
  email: string;
  code: string;
  role: string;
}

// Generate unique codes
let codeCounter = 310463;
const generateCode = (): string => `STEM-${codeCounter++}`;

const CREDENTIALS: Credential[] = [
  {
    id: 'adam-hussein-chair-fao',
    recipient: 'Adam Hussein',
    certificateName: 'Chair Certificate',
    committee: 'Food and Agriculture Organization (FAO)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Chair',
  },
  {
    id: 'stephanie-nehema-chair-unep',
    recipient: 'Stephanie Nehema',
    certificateName: 'Chair Certificate',
    committee: 'United Nations Environment Programme (UNEP)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Chair',
  },
  {
    id: 'sondos-madhi-chair-ecosoc',
    recipient: 'Sondos Madhi',
    certificateName: 'Chair Certificate',
    committee: 'Economic and Social Council (ECOSOC)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Chair',
  },
  {
    id: 'ammar-kablan-un-women-trainer',
    recipient: 'Ammar Kablan',
    certificateName: 'Committee Trainer Certificate',
    committee: 'UN Women',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Committee Trainer',
  },
  {
    id: 'salma-ali-attendance',
    recipient: 'Salma Ali',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Delegate',
  },
  {
    id: 'yassin-kamal-attendance',
    recipient: 'Yassin Kamal',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Delegate',
  },
  {
    id: 'nur-saidatul-attendance',
    recipient: 'Nur Saidatul',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Delegate',
  },
  {
    id: 'rokaia-ismail-attendance',
    recipient: 'Rokaia Ismail',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Delegate',
  },
  {
    id: 'ashrakat-mohammed-best-position-paper-unhrc',
    recipient: 'Ashrakat Mohammed',
    certificateName: 'Best Position Paper',
    committee: 'United Nations Human Rights Council (UNHRC)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Best Position Paper',
  },
  {
    id: 'mostafa-ashraf-best-position-paper-wto',
    recipient: 'Mostafa Ashraf',
    certificateName: 'Best Position Paper',
    committee: 'World Trade Organization (WTO)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Best Position Paper',
  },
  {
    id: 'noreen-sallam-organiser',
    recipient: 'Noreen Sallam',
    certificateName: 'STEM MUN Team Member Certificate',
    committee: 'Conference Office',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Organiser',
  },
  {
    id: 'abdelrahman-shosha-organiser',
    recipient: 'Abdelrahman Shosha',
    certificateName: 'STEM MUN Team Member Certificate',
    committee: 'Conference Office',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Organiser',
  },
  {
    id: 'mohammed-khaled-organiser',
    recipient: 'Mohammed Khaled',
    certificateName: 'STEM MUN Team Member Certificate',
    committee: 'Conference Office',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Organiser',
  },
  {
    id: 'nour-hassanen-outstanding-delegate-fao',
    recipient: 'Nour Hassanen',
    certificateName: 'Outstanding Delegate',
    committee: 'Food and Agriculture Organization (FAO)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Outstanding Delegate',
  },
  {
    id: 'layal-elzeiny-best-position-paper-unep',
    recipient: 'Layal Elzeiny',
    certificateName: 'Best Position Paper',
    committee: 'United Nations Environment Programme (UNEP)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: generateCode(),
    role: 'Best Position Paper',
  },
];

async function generateQRCode(credential: Credential): Promise<Buffer> {
  const verificationUrl = `${BASE_URL}/verify/${credential.code}`;
  return QRCode.toBuffer(verificationUrl, {
    width: 200,
    margin: 2,
    color: { dark: '#d1af6e', light: '#580d00' },
    errorCorrectionLevel: 'H',
  });
}

function generateVerificationHTML(credential: Credential, qrCodeBase64: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate Verification - ${credential.recipient}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #580d00 0%, #6f1a0e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      background: #f8f4eb;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 600px;
      width: 100%;
      overflow: hidden;
    }
    
    .header {
      background: #580d00;
      color: #f8f4eb;
      padding: 30px 20px;
      text-align: center;
      border-bottom: 3px solid #d1af6e;
    }
    
    .header h1 {
      font-size: 24px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    
    .qr-container {
      margin: 30px 0;
      display: flex;
      justify-content: center;
    }
    
    .qr-container img {
      border: 2px solid #d1af6e;
      padding: 8px;
      background: white;
      border-radius: 8px;
      max-width: 200px;
      height: auto;
    }
    
    .credential-info {
      text-align: left;
      background: #fffdf8;
      border: 1px solid #d1af6e;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #d1af6e/20;
    }
    
    .info-row:last-child {
      border-bottom: none;
    }
    
    .info-label {
      font-weight: 600;
      color: #580d00;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .info-value {
      color: #333;
      font-size: 14px;
      text-align: right;
      max-width: 60%;
    }
    
    .code-display {
      background: #f0e8d8;
      border: 2px solid #d1af6e;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: bold;
      color: #580d00;
      letter-spacing: 2px;
    }
    
    .verify-link {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 30px;
      background: #d1af6e;
      color: #580d00;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
      border: 2px solid #d1af6e;
    }
    
    .verify-link:hover {
      background: transparent;
      color: #d1af6e;
    }
    
    .footer {
      background: #f0e8d8;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #580d00;
      border-top: 1px solid #d1af6e;
    }
    
    .verification-badge {
      display: inline-block;
      background: #d1af6e;
      color: #580d00;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin: 15px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Certificate Verification</h1>
      <p>STEM MUN International Online Conference 2026</p>
    </div>
    
    <div class="content">
      <div class="verification-badge">✓ Verified Credential</div>
      
      <h2 style="color: #580d00; margin: 20px 0; font-size: 20px;">${credential.certificateName}</h2>
      
      <div class="qr-container">
        <img src="${qrCodeBase64}" alt="Verification QR Code" />
      </div>
      
      <div class="credential-info">
        <div class="info-row">
          <span class="info-label">Recipient</span>
          <span class="info-value">${credential.recipient}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Role</span>
          <span class="info-value">${credential.role}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Committee</span>
          <span class="info-value">${credential.committee}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Certificate Type</span>
          <span class="info-value">${credential.certificateName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date</span>
          <span class="info-value">${credential.date}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Issued</span>
          <span class="info-value">${credential.issued}</span>
        </div>
      </div>
      
      <div class="code-display">
        ${credential.code}
      </div>
      
      <a href="${BASE_URL}/verify/${credential.code}" class="verify-link">View Full Certificate</a>
    </div>
    
    <div class="footer">
      <p>This credential can be verified at: ${BASE_URL}/verify/${credential.code}</p>
      <p>Certificate Code: ${credential.code}</p>
      <p>Generated: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>`;
}

async function generateCredentials() {
  console.log('🎓 Generating credentials and QR codes for STEM MUN participants...\n');

  const outputDir = path.join(process.cwd(), 'artifacts', 'stem-mun-certificates', 'public', 'generated');

  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error('Error creating output directory:', error);
    return;
  }

  // Generate credentials data file
  const credentialsData = {
    conference: CONFERENCE_NAME,
    generatedAt: new Date().toISOString(),
    credentials: CREDENTIALS.map((cred) => ({
      ...cred,
      verificationUrl: `${BASE_URL}/verify/${cred.code}`,
      certificateUrl: `${BASE_URL}/certificate/${cred.id}`,
    })),
  };

  await fs.writeFile(
    path.join(outputDir, 'credentials.json'),
    JSON.stringify(credentialsData, null, 2)
  );

  console.log('✅ Generated credentials.json');

  // Generate QR codes and verification pages
  for (const credential of CREDENTIALS) {
    try {
      // Generate QR code
      const qrBuffer = await generateQRCode(credential);
      const qrBase64 = `data:image/png;base64,${qrBuffer.toString('base64')}`;

      // Save QR code
      await fs.writeFile(path.join(outputDir, `qr-${credential.code}.png`), qrBuffer);

      // Generate and save verification page
      const verificationHTML = generateVerificationHTML(credential, qrBase64);
      await fs.writeFile(
        path.join(outputDir, `verify-${credential.code}.html`),
        verificationHTML
      );

      console.log(`✅ ${credential.recipient} (${credential.code})`);
    } catch (error) {
      console.error(`❌ Error generating for ${credential.recipient}:`, error);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`Total credentials: ${CREDENTIALS.length}`);
  console.log(`Output directory: ${outputDir}`);
  console.log('\n📋 Credential Codes:');
  CREDENTIALS.forEach((cred) => {
    console.log(`  ${cred.code}: ${cred.recipient} - ${cred.role}`);
  });
}

generateCredentials().catch(console.error);
