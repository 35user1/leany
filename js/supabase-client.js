// Supabaseへの接続（全ページ共通）
// ※ supabase-js のCDN読み込みより「後」に読み込むこと
const { createClient } = supabase;
const db = createClient(
  "https://ytypzmmspqcpsedduhli.supabase.co",
  "sb_publishable_6-ssT_OObqs1Ng9KOkEzcw_R8n1M2Tk"
);
