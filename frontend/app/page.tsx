import Script from "next/script";
import CinematicExperience from "@/components/cinematic/CinematicExperience";

export default function HomePage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shalem",
    jobTitle: "AI Engineer",
    description:
      "AI engineer building full-stack intelligent systems, cinematic interfaces, and interactive products.",
    url: "https://example.com"
  };

  return (
    <>
      <Script id="person-schema" type="application/ld+json">
        {JSON.stringify(personSchema)}
      </Script>
      <CinematicExperience />
    </>
  );
}
