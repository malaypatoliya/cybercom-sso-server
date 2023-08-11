const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { isProduction, mail } = require("../config/config.json");

const { clientEmail, clientId, clientSecretId, redirectUrl, refreshToken } =
    isProduction ? mail.production : mail.development;

const OAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecretId,
    redirectUrl
);
OAuth2Client.setCredentials({ refresh_token: refreshToken });

module.exports = {
    sendMail: async (props) => {
        try {
            const accessToken = await OAuth2Client.getAccessToken();

            const transport = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: clientEmail,
                    clientId: clientId,
                    clientSecret: clientSecretId,
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                },
            });

            const mailOptions = {
                from: `Cybercom Creation <${clientEmail}>`,
                to: props.to,
                subject: props.subject,
                html: props.body,
            };

            const result = await transport.sendMail(mailOptions);
            return result;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
};
