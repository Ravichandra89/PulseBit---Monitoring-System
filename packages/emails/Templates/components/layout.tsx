import Footer from "./footer";
import { Img, Container, Link, Section } from "@react-email/components";
import { styles } from "./style";
import type { ReactNode } from "react";

interface props {
  children?: ReactNode;
  img?: {
    src: string;
    alt: string;
    href: string;
  };
}

const defaultImg = {
  src: "https://github.com/Ravichandra89/PulseBit---Monitoring-System",
  alt: "PulseBit",
  href: "https://github.com/Ravichandra89/PulseBit---Monitoring-System",
};

const Layout = ({ children, img = defaultImg }: props) => {
  return (
    <Container style={styles.container}>
      <Link href={img.href}>
        <Img src={img.src} width="36" height="36" alt={img.alt} />
      </Link>
      <Section style={styles.section}>{children}</Section>
      <Footer />
    </Container>
  );
};

export default Layout;
