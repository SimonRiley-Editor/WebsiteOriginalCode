import { createFileRoute } from "@tanstack/react-router";
import { WeaponsPanel } from "@/components/WeaponsPanel";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Arsenal — Weapons Tier Guide" },
      {
        name: "description",
        content:
          "Ranked weapons guide with stats, passives, and meta analysis for every signature weapon.",
      },
    ],
  }),
});

function Index() {
  return <WeaponsPanel />;
}
