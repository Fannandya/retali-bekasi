import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { pickLocale } from "@/lib/pickLocale";
import { createPublicClient } from "@/lib/supabase/public";
import { TestimonialEmbed } from "@/components/TestimonialEmbed";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings();
  return {
    title: "Testimoni",
    description: pickLocale(settings.section_headings.testimoni?.subtitle, locale),
  };
}

export default async function TestimoniPage({ params }: Props) {
  const { locale } = await params;
  const supabase = createPublicClient();
  const t = (field: any) => pickLocale(field, locale);
  const desc = (item: any) => pickLocale(item.description, locale);

  const testimonialRes = await supabase
    .from("testimonials")
    .select("*")
    .order("order_index") as unknown as { data: any[] | null };
  const testimonials = testimonialRes.data;

  return (
    <section className="testi" style={{ paddingTop: "80px" }}>
      <div className="wrap">
        <div className="sec-head">
          <h2>Testimoni</h2>
          <p>Pengalaman nyata jamaah dalam bentuk video.</p>
        </div>

        {testimonials && testimonials.length > 0 ? (
          <div className="grid grid-3">
            {testimonials.map((item) => (
              <div key={item.id}>
                <TestimonialEmbed
                  type={item.type}
                  platform={item.platform || "youtube"}
                  videoUrl={item.youtube_url}
                  youtubeId={item.youtube_id}
                  imageUrl={item.image_url}
                  title={t(item.title) || item.jamaah_name || ""}
                  description={desc(item.description)}
                />
                <p className="testi-desc">{desc(item.description)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No testimonials yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
