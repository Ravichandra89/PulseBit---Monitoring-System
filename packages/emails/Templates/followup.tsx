/** @jsxImportSource react */
import { Body, Head, Html, Preview } from "@react-email/components";

const FollowupEmail = () => {
  return (
    <Html>
      <Head>
        <title>How's it going with PulseBit?</title>
      </Head>
      <Preview>How's it going with PulseBit?</Preview>
      <Body>
        Hey,
        <br />
        <br />
        How’s everything going with PulseBit so far? Let me know if you run into
        any issues, or have any feedback, good or bad!
        <br />
        <br />
        Thank you,
        <br />
        Thibault Le Ouay Ducasse
      </Body>
    </Html>
  );
};

export default FollowupEmail;
