import { redirect } from "next/navigation";

// /brokers/all redirects to the main broker hub
export default function BrokersAllPage() {
  redirect("/brokers");
}
