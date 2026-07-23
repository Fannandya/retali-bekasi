import { SettingsForm } from "./SettingsForm";
import { createClient } from "@/lib/supabase/server";
import { parseSettings } from "@/lib/site-settings";

export const dynamic = 'force-dynamic';

export default async function AdminPengaturanPage() {
  const supabase = await createClient();
  const { data: settings } = await (supabase.from("site_settings").select("key, value")) as unknown as { data: { key: string; value: any }[] | null };

  const settingsMap = parseSettings(settings || []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Pengaturan Situs</h1>
      <SettingsForm initialData={settingsMap} />
    </>
  );
}
