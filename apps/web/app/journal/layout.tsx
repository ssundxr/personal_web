import { JourneyCompass } from "../../components/JourneyCompass";

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full">
      <JourneyCompass />
      {children}
    </div>
  );
}
