import { LetterOfLoveForm } from "@/components/LetterOfLoveForm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";

export default function WriteLetterOfLovePage() {
  return (
    <div data-accent={PAGE_ACCENTS.lettersOfLove} className="mx-auto w-full max-w-lg px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-6 text-3xl">Write a Letter of Love</h1>
        <LetterOfLoveForm />
      </ScrollReveal>
    </div>
  );
}
