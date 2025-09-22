/**
 * Email Regarding the Status Report
 */
import {
  Body,
  Html,
  Preview,
  Column,
  Heading,
  Markdown,
  Row,
  Text,
  Head,
} from "@react-email/components";
import { z } from "zod";
import Layout from "./components/layout";
import { style, colors } from "./components/style";
import Footer from "./components/footer";

// Zod StatusReport Object
const statusReportSchema = z.object({
  pageTitle: z.string(),
  status: z.enum(["investigating", "monitored", "identified", "resolved"]),
  date: z.string(),
  message: z.string(),
  reportTitle: z.string(),
  monitors: z.array(z.string()),
});

export type statusReportProps = z.infer<typeof statusReportSchema>;

const getStatusColor = (status: string) => {
  switch (status) {
    case "investigating":
      return colors.danger;
    case "identified":
      return colors.warning;
    case "resolved":
      return colors.success;
    case "monitoring":
      return colors.info;
    default:
      return colors.success;
  }
};

const statusReportEmail = ({
  status,
  date,
  message,
  reportTitle,
  pageTitle,
  monitors,
}: statusReportProps) => {
  return (
    <Html>
      <Head />
      <Preview>There are new updates on "{pageTitle}" page</Preview>
      <Body style={style.main}>
        <Layout>
          <Row>
            <Column>
              <Heading as="h3">{pageTitle}</Heading>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text
                style={{
                  color: getStatusColor(status),
                  textTransform: "uppercase",
                }}
              >
                {status}
              </Text>
            </Column>
          </Row>
          <Row style={style.row}>
            <Column>
              <Text style={style.bold}>Title</Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text>{reportTitle}</Text>
            </Column>
          </Row>
          <Row style={style.row}>
            <Column>
              <Text style={style.bold}>Date</Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text>{date}</Text>
            </Column>
          </Row>
          <Row style={style.row}>
            <Column>
              <Text style={style.bold}>Affected</Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text style={{ flexWrap: "wrap", wordWrap: "break-word" }}>
                {monitors.length > 0 ? monitors.join(", ") : "N/A"}
              </Text>
            </Column>
          </Row>
          <Row style={style.row}>
            <Column>
              <Markdown
                markdownCustomStyles={{
                  p: { fontSize: 14, lineHeight: 24 },
                  h1: { fontSize: 24, lineHeight: 32 },
                  h2: { fontSize: 20, lineHeight: 28 },
                  h3: { fontSize: 16, lineHeight: 24 },
                  h4: { fontSize: 14, lineHeight: 24 },
                  h5: { fontSize: 12, lineHeight: 20 },
                  h6: { fontSize: 10, lineHeight: 16 },
                  li: { fontSize: 14, lineHeight: 24 },
                  hr: { borderColor: colors.border },
                }}
              >
                {message}
              </Markdown>
            </Column>
          </Row>
        </Layout>
      </Body>
    </Html>
  );
};

// Default Sample Prop for statusReport
statusReportEmail.PreviewProps = {
  pageTitle: "PulseBit Status",
  reportTitle: "API Unavaible",
  status: "investigating",
  date: new Date().toISOString(),
  message: `
**Status**: Partial Service Restored
**GitHub Runners**: Operational
**Cache Action**: Degraded 

--- 

### What’s Changed 

- All queued workflows are now being picked up and completed successfully. 
- Jobs are running normally on our GitHub App. ### Current Issue: Cache Action Unavailable Attempts to re-publish our action to GitHub Marketplace are returning 500 Internal Server Errors. This prevents the updated versions from going live. 

### Mitigation In Progress 

- Collaborating with GitHub Support to resolve any upstream issues. 

### Next Update 

We’ll post another update by **19:00 UTC** today or sooner if critical developments occur. We apologize for the inconvenience and appreciate your patience as we restore full cache functionality.
  `,
  monitors: ["PulseBit API", "PulseBit Webhook"],
};
