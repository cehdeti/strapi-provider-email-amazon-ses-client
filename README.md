# strapi-provider-email-amazon-ses-client

This is a fork of code from @med8bra's pull request to the official Strapi
Amazon SES provider (@strapi/provider-email-amazon-ses).

See: https://github.com/strapi/strapi/pull/23040

This version of the Amazon SES email provider uses the @aws-sdk/client-ses
integration client (instead of the deprecated node-ses package), which adds
support for obtaining AWS credentials from the environment (such as an ECS
service's task execution role).

Hopefully the PR above will be merged into @strapi/provider-email-amazon-ses
so that this repository will no longer be needed. For this reason, it will
not be published to NPM at this time.

## Installation

```bash
npm install git+https://github.com/cehdeti/strapi-provider-email-amazon-ses-client.git
```

## Configuration

| Variable                | Type                    | Description                                                                                                                                                                                                              | Required | Default   |
| ----------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------- |
| provider                | string                  | The name of the provider you use                                                                                                                                                                                         | yes      |           |
| providerOptions         | object                  | Configuration options for the AWS SES client. See [AWS SDK v3 SESClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-ses/Interface/SESClientConfig/) for all available options. | yes      |           |
| settings                | object                  | Settings                                                                                                                                                                                                                 | no       | {}        |
| settings.defaultFrom    | string                  | Default sender mail address                                                                                                                                                                                              | no       | undefined |
| settings.defaultReplyTo | string \| array<string> | Default address or addresses the receiver is asked to reply to                                                                                                                                                           | no       | undefined |

> :warning: The Shipper Email (or defaultfrom) may also need to be changed in the `Email Templates` tab on the admin panel for emails to send properly

### Recommended Configuration

This configuration should be incorporated into `config/plugins.js`.

This is an example if you want to set your AWS region, access key, and secret
access key:

```js
module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'strapi-provider-email-amazon-ses-client',
      providerOptions: {
        region: env('AWS_SES_REGION', 'us-east-1'),
        credentials: {
          accessKeyId: env('AWS_SES_KEY'),
          secretAccessKey: env('AWS_SES_SECRET'),
        },
      },
      settings: {
        defaultFrom: 'myemail@protonmail.com',
        defaultReplyTo: 'myemail@protonmail.com',
      },
    },
  },
  // ...
});
```

To inherit the AWS region, access key, and secret access key from the
environment, do not set the `providerOptions`:

```js
module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'strapi-provider-email-amazon-ses-client',
      settings: {
        defaultFrom: 'myemail@protonmail.com',
        defaultReplyTo: 'myemail@protonmail.com',
      },
    },
  },
  // ...
});
```

### Legacy Configuration (Deprecated)

For backward compatibility, the provider still supports the legacy configuration format:

```js
providerOptions: {
  key: env('AWS_SES_KEY'),
  secret: env('AWS_SES_SECRET'),
  amazon: 'https://email.us-east-1.amazonaws.com',
}
```
