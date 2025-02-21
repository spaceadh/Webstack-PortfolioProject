const credential = {
  type: "service_account",
  project_id: "e-rayon-cmmerce",
  private_key_id: process.env.REACT_APP_PRIVATE_KEY_ID,
  private_key: process.env.REACT_APP_GCLOUD_CREDENTIALS,
  client_email: process.env.REACT_APP_CLIENT_EMAIL,
  client_id: process.env.REACT_APP_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
};

export default { credential };
