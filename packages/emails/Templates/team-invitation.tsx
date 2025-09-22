import {
  Body,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import { z } from "zod";
import Footer from "./components/footer";
import Layout from "./components/layout";
import { style } from "./components/style";

const BASE_URL =
  "https://github.com/Ravichandra89/PulseBit---Monitoring-System";

// Zod Validation
export const TeamInvitationSchema = z.object({
  invitedBy: z.string(),
  workspaceName: z.string().optional().nullable(),
  token: z.string(),
  baseUrl: z.string().optional(),
});

// Sample props for TeamInvitationSchema
export type TeamInvitationProps = z.infer<typeof TeamInvitationSchema>;

const TeamInvitationEmail = ({
  token,
  workspaceName,
  invitedBy,
  baseUrl,
}: TeamInvitationProps) => {
  const finalBaseUrl = baseUrl || BASE_URL;

  return (
    <Html>
      <Head />
      <Preview>You have been invited to join PulseBit</Preview>
      <Body style={style.main}>
        <Layout>
          <Heading as="h3">
            You have been invited to join{" "}
            {workspaceName ? `"${workspaceName}" workspace` : "OpenStatus.dev"}{" "}
            by {invitedBy}
          </Heading>
          <Text>
            Click here to access the workspace:{" "}
            <Link style={style.link} href={`${finalBaseUrl}?token=${token}`}>
              accept invitation
            </Link>
          </Text>
          <Text>
            If you don't have an account yet, it will require you to create one.
          </Text>
          <Footer />
        </Layout>
      </Body>
    </Html>
  );
};

TeamInvitationEmail.PreviewProps = {
  token: "token",
  workspaceName: "OpenStatus",
  invitedBy: "max@openstatus.dev",
} satisfies TeamInvitationProps;

export default TeamInvitationEmail;
