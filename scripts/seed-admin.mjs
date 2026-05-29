const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';
const email = process.env.PAYLOAD_ADMIN_EMAIL ?? 'admin@dinoisland.com';
const password = process.env.PAYLOAD_ADMIN_PASSWORD ?? 'Admin@123';

async function readJson(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function main() {
  const initResponse = await fetch(`${baseUrl}/api/users/init`, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!initResponse.ok) {
    const body = await readJson(initResponse);
    throw new Error(`Could not check users init status: ${initResponse.status} ${JSON.stringify(body)}`);
  }

  const init = await readJson(initResponse);

  if (init?.initialized) {
    console.log('Admin user already exists, skipping seed.');
    return;
  }

  const registerResponse = await fetch(`${baseUrl}/api/users/first-register`, {
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
  });

  const body = await readJson(registerResponse);

  if (!registerResponse.ok) {
    throw new Error(`Could not create admin user: ${registerResponse.status} ${JSON.stringify(body)}`);
  }

  console.log(`Created first admin user: ${email}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
