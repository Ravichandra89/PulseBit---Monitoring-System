import { Link, Section, Text } from "@react-email/components";
import { styles } from "./style";

const Footer = () => {
  return (
    <Section style={{ textAlign: "center" }}>
      <Text>
        {/* Put Deployed HomePage Link */}
        <Link
          style={styles.link}
          href="https://github.com/Ravichandra89/PulseBit---Monitoring-System"
        >
          Home Page
        </Link>{" "}
        ・{" "}
        <Link style={styles.link} href="mailto:ravi@supportgmail.com">
          Contact Support
        </Link>
      </Text>

      <Text>PulseBit ・ Monitoring System ・ India</Text>
    </Section>
  );
};

export default Footer;
