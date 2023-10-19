import axios from "axios";
const { OAuth2Client } = require("google-auth-library");

export default async function handler(request, response) {
  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
  );

  try {
    const { tokens } = await oAuth2Client.getToken(request.body.code);

    const res = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    return response.status(200).json({
      user: {
        ...res.data,
      },
      ...tokens,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
