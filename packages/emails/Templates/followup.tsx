import { Body, Head, Html, Preview } from "@react-email/components";

const FollowupEmail = () => {
  return (
    <Html>
      <Head>
        <title>How's it going with openstatus?</title>
      </Head>
      <Preview>How's it going with openstatus?</Preview>
      <Body>
        Hey
        <br />
        <br />
        How’sH everything going with openstatus so far? Let me know if you run
        into any issues, or have any feedback, good or bad!
        <br />
        <br />
        Thank you,
        <br />
        <br />
        Thibault Le Ouay Ducasse
        <br />
      </Body>
    </Html>
  );
};

export default FollowupEmail;
