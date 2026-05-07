import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Guide } from "@/types/guide";
import GuideClient from "./GuideClient";

export default async function DynamicGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Supabase Not Connected</h1>
          <p className="text-slate-400">Please add your Supabase URL and Anon Key to your environment variables.</p>
        </div>
      </div>
    );
  }

  // Fetch the guide data from Supabase
  const { data: guide, error } = await supabase
    .from("guides")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (error || !guide) {
    notFound();
  }

  return <GuideClient guide={guide} />;
}
