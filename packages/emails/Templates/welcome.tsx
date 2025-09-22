/**
 * Welcome Email Template Creation
 */ /** @jsxImportSource react 

 */
import { Body, Head, Html, Preview } from "@react-email/components";

const WelcomeEmail = () => {
  return (
    <Html>
      <Head>
        <title>Welcome to PulseBit</title>
      </Head>
      <Preview>Few tips to get started with your uptime monitoring</Preview>

      {/* Define main body */}
      <body>
        Hey
        <br />
        <br />
        Welcome to PulseBit <br />
        <br />
        <br />
        PulseBit is uptime monitoring service with status page.
        <br />
        Here are a few things you can do with PulseBit:
        <br /> - Getting Started Documentation{" "}
        <a href="https://github.com/Ravichandra89/PulseBit---Monitoring-System/blob/main/README.md">
          Documentation
        </a>{" "}
        to create, update and trigger your monitors.
        <br />- Learn how to monitor a{" "}
        <a href="https://github.com/Ravichandra89/PulseBit---Monitoring-System/blob/main/README.md">
          MCP server
        </a>
        .
        <br />- Explore our uptime monitoring as code{" "}
        <a href="https://github.com/Ravichandra89/PulseBit---Monitoring-System">
          template directory
        </a>
        .
        <br />- Build your own status page with our{" "}
        <a href="https://github.com/Ravichandra89/PulseBit---Monitoring-System/blob/main/README.m">
          API
        </a>{" "}
        and host it where you want. Here's our that you can easily host on
        CloudFlare.
        <br />
        <br />
        Quick question: How did you learn about us? and why did you sign up?
        <br />
        Thank y ou,
        <br />
        <br />
        Thibault Le Ouay Ducasse, co-founder of openstatus
        <br />
      </body>
    </Html>
  );
};
