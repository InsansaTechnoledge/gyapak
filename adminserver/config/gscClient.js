// config/gscClient.js
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/webmasters"]; 

function getPrivateKey() {
  if (!process.env.GSC_PRIVATE_KEY) {
    throw new Error("GSC_PRIVATE_KEY env not set");
  }

  // Convert escaped \n to real newlines (needed when storing key in .env)
  return process.env.GSC_PRIVATE_KEY.replace(/\\n/g, "\n");
}

export function getGscClient() {
  if (!process.env.GSC_CLIENT_EMAIL) {
    throw new Error("GSC_CLIENT_EMAIL env not set");
  }

  const jwt = new google.auth.JWT({
    email: process.env.GSC_CLIENT_EMAIL,
    key: getPrivateKey(),
    scopes: SCOPES,
  });

  const webmasters = google.webmasters({
    version: "v3",
    auth: jwt,
  });

  return { jwt, webmasters };
}
