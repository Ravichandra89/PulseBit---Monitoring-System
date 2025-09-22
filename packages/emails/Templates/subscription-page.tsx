import { Body, Head, Html, Link, Preview, Text } from "@react-email/components";
import { z } from "zod";
import Layout from "./components/layout";
import { style } from "./components/style";

// Zod subscription-page schema
export const subscriptionPageSchema = z.object({
  token: z.string(),
  page: z.string(),
  domain: z.string(),
  img: z
    .object({
      src: z.string(),
      alt: z.string(),
      href: z.string(),
    })
    .optional(),
});

// Schema Props
export type subscriptionPageProps = z.infer<typeof subscriptionPageSchema>;

// Main email
const subscriptionPageEmail = ({
  token,
  page,
  domain,
  img,
}: subscriptionPageProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm your subscription to "{page}" Status Page</Preview>
      <Body style={style.main}>
        <Layout img={img}>
          <Heading as="h3">
            Confirm your subscription to "{page}" Status Page
          </Heading>
          <Text>
            You are receiving this email because you subscribed to receive
            updates from "{page}" Status Page.
          </Text>
          <Text>
            To confirm your subscription, please click the link below. The link
            is valid for 7 days. If you believe this is a mistake, please ignore
            this email.
          </Text>
          <Text>
            <Link
              style={style.link}
              href={`https://${domain}.pulsebit.in/verify/${token}`}
            >
              Confirm subscription
            </Link>
          </Text>
        </Layout>
      </Body>
    </Html>
  );
};

// Default Prop data ingestion
subscriptionPageEmail.Preview = {
    token: "token",
    page: "Pulsbit",
    domain: "slug",
} satisfies subscriptionPageProps;

export default subscriptionPageEmail;
