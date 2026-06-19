import { sanityFetch } from "../../sanity/lib/client";
import { JOURNAL_ENTRIES_QUERY } from "../../sanity/lib/queries";
import { JournalView } from "./JournalView";

export default async function JournalIndex() {
  const journalEntries = await sanityFetch<any[]>({ 
    query: JOURNAL_ENTRIES_QUERY, 
    tags: ['journal'] 
  });

  return <JournalView journalEntries={journalEntries || []} />;
}
