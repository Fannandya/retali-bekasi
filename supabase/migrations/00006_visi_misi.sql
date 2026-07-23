insert into public.site_settings (key, value) values
  ('visi_misi', '{
    "visi": {
      "id": "Menjadi biro perjalanan umroh & haji terpercaya yang memberikan pelayanan terbaik dan bimbingan ibadah yang khusyuk sesuai syariah.",
      "en": "To become a trusted umroh & hajj travel agency that provides the best service and solemn worship guidance according to sharia."
    },
    "misi": {
      "id": "Memberikan pelayanan profesional dan ramah sejak pendaftaran hingga kepulangan.\nMenyediakan paket perjalanan dengan harga terjangkau dan fasilitas terbaik.\nMembimbing jamaah dengan pembimbing berpengalaman dan bersertifikat.\nMenjaga komunikasi dan transparansi informasi kepada jamaah.",
      "en": "Providing professional and friendly service from registration to return.\nOffering travel packages at affordable prices with the best facilities.\nGuiding pilgrims with experienced and certified guides.\nMaintaining communication and information transparency with pilgrims."
    }
  }')
on conflict (key) do nothing;
