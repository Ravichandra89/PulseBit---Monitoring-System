import {
  Body,
  Html,
  Column,
  CodeInline,
  Head,
  Heading,
  Preview,
  Link,
  Row,
  Text,
} from "@react-email/components";
import Layout from "./layout";
import Footer from "./footer";
import { style, colors } from "../components/style";
import { z } from "zod";
import { timeStamp } from "console";

// Zod monitor schema
const monitorAlertSchema = z.object({
  type: z.enum(["alert", "degarded", "recovery"]),
  name: z.string().optional(),
  url: z.string().optional(),
  method: z.string().optional(),
  status: z.string().optional(),
  latency: z.string().optional(),
  region: z.string().optional(),
  timestamp: z.string().optional(),
  message: z.string().optional(),
});

export type monitorAlertProps = z.infer<typeof monitorAlertSchema>;

// Based on alert showig Icons
// Based on alert showig Icons
const getIcon = (props: monitorAlertProps) => {
  switch (props.type) {
    case "recovery":
      return {
        src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZWNrIj48cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiLz48L3N2Zz4=",
        color: colors.success,
      };

    case "alert":
      return {
        src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXgiPjxwYXRoIGQ9Ik0xOCA2IDYgMTgiLz48cGF0aCBkPSJtNiA2IDEyIDEyIi8+PC9zdmc+",
        color: colors.danger,
      };

    case "degarded":
      return {
        src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRyaWFuZ2xlLWFsZXJ0Ij48cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTMiLz48cGF0aCBkPSJNMTIgOXY0Ii8+PHBhdGggZD0iTTEyIDE3aC4wMSIvPjwvc3ZnPg==",
        color: colors.warning,
      };

    default:
      return {
        src: "",
        color: colors.info, // fallback color
      };
  }
};

const monitorAlertEmail = (props: monitorAlertProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your monitor's status is: {props.type}</Preview>
      <Body style={style.main}>
        <Layout>
          <Row>
            <Column>
              <Heading as="h4">{props.name}</Heading>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text
                style={{
                  color: getIcon(props.type).color,
                  textTransform: "uppercase",
                }}
              >
                {props.type}
              </Text>
            </Column>
          </Row>
          <Row style={style.row}>
            <Column>
              <Text style={style.bold}>Request</Text>
            </Column>
            <Column
              style={{
                textAlign: "right",
                flexWrap: "wrap",
                wordWrap: "break-word",
                maxWidth: "300px",
              }}
            >
              <Text>
                <CodeInline>{props.method}</CodeInline> {props.url}
              </Text>
            </Column>
          </Row>
          {/* REMINDER: no status code for TCP monitors */}
          {props.status ? (
            <Row style={style.row}>
              <Column>
                <Text style={style.bold}>Status</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text>{props.status}</Text>
              </Column>
            </Row>
          ) : null}
          <Row style={style.row}>
            <Column>
              <Text style={style.bold}>Region</Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text>{props.region}</Text>
            </Column>
          </Row>
          {props.latency ? (
            <Row style={style.row}>
              <Column>
                <Text style={style.bold}>Latency</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text>{props.latency}</Text>
              </Column>
            </Row>
          ) : null}
          <Row style={style.row}>
            <Column>
              <Text style={.bold}>Timestamp</Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text>{props.timestamp}</Text>
            </Column>
          </Row>
          {props.message ? (
            <Row style={style.row}>
              <Column>
                <Text>
                  {props.message?.slice(0, 200)}
                  {props.message?.length > 200 ? "..." : ""}
                </Text>
              </Column>
            </Row>
          ) : null}
          <Row style={style.row}>
            <Column>
              <Text style={{ textAlign: "center" }}>
                <Link style={.link} href="https://openstatus.dev/app">
                  View details
                </Link>
              </Text>
            </Column>
          </Row>
        </Layout>
      </Body>
    </Html>
  );
};



monitorAlertEmail.PreviewProps = {
    type: "alert",
    name: "Ping pong",
    url: "",
    method: "GET",
    status: "200",
    latency: "300ms",
    region: "Asia Pecific",
    timestamp: "2025-10-12",
    message: "This is a very long test message that will be truncated. Just testing it for the preview. Veryy veryy long message."
} satisfies monitorAlertProps;

export default monitorAlertEmail;