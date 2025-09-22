import {
  Body,
  Head,
  Button,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import Layout from "./components/layout";
import { style } from "./components/style";

const MointorPausedEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Your monitors have been paused</Preview>
      <Body style={style.main}>
        <Layout>
          <Text>Hello 👋</Text>
          {/* <Heading as="h3">Deactivation of the your monitor(s)</Heading> */}
          <Text>
            To save on cloud resources, your monitor(s) has been paused due to
            inactivity.
          </Text>
          <Text>
            If you would like to unpause your monitor(s), please login to your
            account or upgrade to a paid plan.
          </Text>
          <Text style={{ textAlign: "center" }}>
            <Button
              style={style.button}
              href="https://github.com/Ravichandra89/PulseBit---Monitoring-System"
            >
              Login
            </Button>
          </Text>

          <Text>If you have any questions, please reply to this email.</Text>
          <Text>Thibault</Text>
          <Text>
            Check out our latest update{" "}
            <a href="https://github.com/Ravichandra89/PulseBit---Monitoring-System">
              here
            </a>
          </Text>
        </Layout>
      </Body>
    </Html>
  );
};

export default MointorPausedEmail;
