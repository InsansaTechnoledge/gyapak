// config/indexingClient.js
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/indexing"]; 

function getPrivateKey() {
  if (!process.env.GSC_PRIVATE_KEY) {
    throw new Error("GSC_PRIVATE_KEY env not set");
  }
  return process.env.GSC_PRIVATE_KEY.replace(/\\n/g, "\n");
}

export function getIndexingClient() {
  if (!process.env.GSC_CLIENT_EMAIL) {
    throw new Error("GSC_CLIENT_EMAIL env not set");
  }

  const jwt = new google.auth.JWT({
    email: process.env.GSC_CLIENT_EMAIL,
    key: getPrivateKey(),
    scopes: SCOPES,
  });

  // The indexing “client” is basically raw HTTP using this auth,
  // but we can also use google.options to set default auth.
  return jwt;
}
