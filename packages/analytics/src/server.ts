import { OpenPanel, type PostEventPayload } from "@openpanel/sdk";
import dotenv from "dotenv";
import type { EventProps } from "./event";

// Config Dotenv
dotenv.config();

// Initilization of OpenPanel
const op = new OpenPanel({
  clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID || "something",
  clientSecret: process.env.OPENPANEL_CLIENT_SECRET,
});

op.setGlobalProperties({
  env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "localhost",
});

export type IdentifyProps = {
  userId: string;
  fullName?: string | null;
  email?: string;
  workspaceId?: string;
  location?: string;
  userAgent?: string;
};

type TrackFn = (
  opts: EventProps & PostEventPayload["properties"]
) => Promise<unknown>;

export const setupAnalytics = async (
  props: IdentifyProps
): Promise<{ track: TrackFn }> => {
  if (process.env.NODE_ENV !== "production") return noop();

  const { location, userAgent, userId, fullName, email, workspaceId } = props;

  if (location) op.api.addHeader("x-client-ip", location);
  if (userAgent) op.api.addHeader("user-agent", userAgent);

  if (userId) {
    const [firstName, lastName] = fullName?.split(" ") ?? [];
    await op.identify({
      profileId: userId,
      email,
      firstName,
      lastName,
      properties: { workspaceId },
    });
  }

  return {
    track: async ({ name, ...rest }) => op.track(name, rest),
  };
};

/**
 * Noop analytics for development & test
 */
const noop = async (): Promise<{ track: TrackFn }> => ({
  track: async ({ name }) => {
    console.log(`>>> Track Noop Event: ${name}`);
    return null;
  },
});
