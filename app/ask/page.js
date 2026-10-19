import AskSurface from "../../components/AskSurface";

// Availability is known at render time, so the first auto-asked question can
// already decide whether to speak — no race with a client-side probe.
export const dynamic = "force-dynamic";

export default function AskPage() {
  return <AskSurface voiceEnabled={Boolean(process.env.DEEPGRAM_API_KEY)} />;
}
