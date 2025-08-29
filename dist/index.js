"use strict";
const client_ses_1 = require("@aws-sdk/client-ses");
const asArray = (value) => (Array.isArray(value) ? value : [value]);
const getConfig = (config) => {
    const isLegacyConfig = (config) => 'secret' in config;
    if (!isLegacyConfig(config)) {
        return config;
    }
    return {
        credentials: {
            accessKeyId: config.key,
            secretAccessKey: config.secret,
        },
        region: config.amazon?.split('.')[1] ?? 'us-east-1',
    };
};
const provider = {
    init(providerOptions, settings) {
        const client = new client_ses_1.SESClient(getConfig(providerOptions));
        return {
            async send(options) {
                try {
                    const { from = settings.defaultFrom, to, cc, bcc, replyTo = settings.defaultReplyTo, subject, text, html, } = options;
                    const emailCommand = new client_ses_1.SendEmailCommand({
                        Source: from,
                        Destination: {
                            ToAddresses: asArray(to),
                            CcAddresses: cc ? asArray(cc) : undefined,
                            BccAddresses: bcc ? asArray(bcc) : undefined,
                        },
                        Message: {
                            Subject: { Data: subject },
                            Body: {
                                Text: { Data: text },
                                Html: { Data: html },
                            },
                        },
                        ReplyToAddresses: replyTo ? [replyTo || from] : undefined,
                    });
                    await client.send(emailCommand);
                }
                catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`AWS SES Error: ${error.message}`);
                    }
                    throw error;
                }
            },
        };
    },
};
module.exports = provider;
//# sourceMappingURL=index.js.map