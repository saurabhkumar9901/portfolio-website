"use client";
import { useSearchParams } from "next/navigation";
import Chat from "./Chat";

export default function ChatLoader() {
  const params = useSearchParams();
  return <Chat initial={params.get("q") ?? ""} />;
}
