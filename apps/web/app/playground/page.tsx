import { redirect } from "next/navigation";

export default function PlaygroundRoot() {
  redirect("/playground/hello-anchor");
}
