/**
 * Eurovision 2026 — country → song mapping
 * Source: Spotify playlist 0LDPlemKV95Kyeu8W3UhRX (Martin Fjellanger, 35 tracks)
 *
 * Keys = team IDs from the teams table (tournament_id = 2)
 * Update this file as entries are confirmed / corrected.
 */

export interface EurovisionSong {
  title: string
  artist: string
  spotifyUrl: string
  spotifyTrackId: string
}

// team_id → song
export const EUROVISION_SONGS: Record<number, EurovisionSong> = {
  101: { title: 'TANZSCHEIN',           artist: 'COSMÓ',                   spotifyUrl: 'https://open.spotify.com/track/6P4wvzxJJZR7cVs1kFXL3q', spotifyTrackId: '6P4wvzxJJZR7cVs1kFXL3q' }, // Austria 🇦🇹
  102: { title: 'Eins, Zwei, Drei',     artist: 'LOOK MUM NO COMPUTER',    spotifyUrl: 'https://open.spotify.com/track/26xlJAlQoCMbnAWd0sGCQf', spotifyTrackId: '26xlJAlQoCMbnAWd0sGCQf' }, // United Kingdom 🇬🇧
  103: { title: 'REGARDE !',            artist: 'Monroe',                  spotifyUrl: 'https://open.spotify.com/track/6cjjQg0SAlX7ahvYWuRPXz', spotifyTrackId: '6cjjQg0SAlX7ahvYWuRPXz' }, // France 🇫🇷
  104: { title: 'Fire',                 artist: 'Sarah Engels',            spotifyUrl: 'https://open.spotify.com/track/2j5D20BxsN7xl11KcnLyHP', spotifyTrackId: '2j5D20BxsN7xl11KcnLyHP' }, // Germany 🇩🇪
  105: { title: 'Sólo Quiero Más',      artist: 'Lion Ceccah',             spotifyUrl: 'https://open.spotify.com/track/1av4wp2KoCwn9P151n45WV', spotifyTrackId: '1av4wp2KoCwn9P151n45WV' }, // Spain 🇪🇸
  106: { title: 'Per sempre sì',        artist: 'Sal Da Vinci',            spotifyUrl: 'https://open.spotify.com/track/5W1mx7Oeg2HxmASrth1nTt', spotifyTrackId: '5W1mx7Oeg2HxmASrth1nTt' }, // Italy 🇮🇹
  107: { title: 'Nân',                  artist: 'Alis',                    spotifyUrl: 'https://open.spotify.com/track/40vsOMljwhHCibpToRULGo', spotifyTrackId: '40vsOMljwhHCibpToRULGo' }, // Albania 🇦🇱
  108: { title: 'Superstar',            artist: 'Senhit',                  spotifyUrl: 'https://open.spotify.com/track/5fYAsg12ms7UkZLtEmS4J6', spotifyTrackId: '5fYAsg12ms7UkZLtEmS4J6' }, // Armenia 🇦🇲
  109: { title: 'Eclipse',              artist: 'Delta Goodrem',           spotifyUrl: 'https://open.spotify.com/track/2pJ0Ji9nkohwuKMuyNhiwo', spotifyTrackId: '2pJ0Ji9nkohwuKMuyNhiwo' }, // Australia 🇦🇺
  110: { title: 'Choke Me',             artist: 'Alexandra Căpitănescu',   spotifyUrl: 'https://open.spotify.com/track/0itI8ykSUDp4dfwiHY6fnw', spotifyTrackId: '0itI8ykSUDp4dfwiHY6fnw' }, // Azerbaijan 🇦🇿
  111: { title: 'Kraj mene',            artist: 'Lavina',                  spotifyUrl: 'https://open.spotify.com/track/3cnVAUGWZcXNqojO8PfYOu', spotifyTrackId: '3cnVAUGWZcXNqojO8PfYOu' }, // Croatia 🇭🇷
  112: { title: 'JALLA',               artist: 'Antigoni',                spotifyUrl: 'https://open.spotify.com/track/1h2xmg6pH7r5pr2prKmWGc', spotifyTrackId: '1h2xmg6pH7r5pr2prKmWGc' }, // Cyprus 🇨🇾
  113: { title: 'Too Epic To Be True',  artist: 'Vanilla Ninja',           spotifyUrl: 'https://open.spotify.com/track/3Js1kS52KXZsmRU6qFLH60', spotifyTrackId: '3Js1kS52KXZsmRU6qFLH60' }, // Estonia 🇪🇪
  114: { title: 'Ferto',               artist: 'Akylas',                  spotifyUrl: 'https://open.spotify.com/track/0LStLUCQgbv6WIEO2fFAO5', spotifyTrackId: '0LStLUCQgbv6WIEO2fFAO5' }, // Greece 🇬🇷
  115: { title: 'Dancing on the ice',   artist: 'Essyla',                  spotifyUrl: 'https://open.spotify.com/track/1u0WYHtNFrAyzgybCDK861', spotifyTrackId: '1u0WYHtNFrAyzgybCDK861' }, // Iceland 🇮🇸
  116: { title: 'Viva, Moldova!',       artist: 'Satoshi',                 spotifyUrl: 'https://open.spotify.com/track/1aco3k5pWdUjruX6vKgovf', spotifyTrackId: '1aco3k5pWdUjruX6vKgovf' }, // Moldova 🇲🇩
  117: { title: 'Ya Ya Ya',             artist: 'JONAS LOVV',              spotifyUrl: 'https://open.spotify.com/track/0BDJRKqx8Qj6EmM5o9P5Vr', spotifyTrackId: '0BDJRKqx8Qj6EmM5o9P5Vr' }, // Norway 🇳🇴
  118: { title: 'Nova Zora',            artist: 'Tamara Živković',         spotifyUrl: 'https://open.spotify.com/track/3PGOiXT00ISVuUgr14m079', spotifyTrackId: '3PGOiXT00ISVuUgr14m079' }, // Serbia 🇷🇸
  119: { title: 'Mother Nature',        artist: 'Eva Marija',              spotifyUrl: 'https://open.spotify.com/track/4kYfZeuXXmCWLvhnPIjyr1', spotifyTrackId: '4kYfZeuXXmCWLvhnPIjyr1' }, // Slovenia 🇸🇮
  120: { title: 'Ridnym',               artist: 'Leléka',                  spotifyUrl: 'https://open.spotify.com/track/44DemLB8ChS8AaN9haWsgU', spotifyTrackId: '44DemLB8ChS8AaN9haWsgU' }, // Ukraine 🇺🇦
  121: { title: 'Just Go',              artist: 'JIVA',                    spotifyUrl: 'https://open.spotify.com/track/3MdXycj2PnW7KBiYSzLVxD', spotifyTrackId: '3MdXycj2PnW7KBiYSzLVxD' }, // Belgium 🇧🇪
  122: { title: 'CROSSROADS',           artist: 'Daniel Žižka',            spotifyUrl: 'https://open.spotify.com/track/3X6cfvG2xgtx47V03hKxjG', spotifyTrackId: '3X6cfvG2xgtx47V03hKxjG' }, // Czech Republic 🇨🇿
  123: { title: 'Før Vi Går Hjem',      artist: 'Søren Torpegaard Lund',   spotifyUrl: 'https://open.spotify.com/track/6KnX2pkecFELGtegM26ezf', spotifyTrackId: '6KnX2pkecFELGtegM26ezf' }, // Denmark 🇩🇰
  124: { title: 'Liekinheitin',         artist: 'Linda Lampenius',         spotifyUrl: 'https://open.spotify.com/track/0k2NxIVax5tnGSCeruFyEL', spotifyTrackId: '0k2NxIVax5tnGSCeruFyEL' }, // Finland 🇫🇮
  125: { title: 'On Replay',            artist: 'Bzikebi',                 spotifyUrl: 'https://open.spotify.com/track/4ybdkbEdZ2JwXFbNaRbBIY', spotifyTrackId: '4ybdkbEdZ2JwXFbNaRbBIY' }, // Georgia 🇬🇪
  126: { title: 'Bangaranga',           artist: 'DARA',                    spotifyUrl: 'https://open.spotify.com/track/6SvlfrQYzUsW5UQUpUpy26', spotifyTrackId: '6SvlfrQYzUsW5UQUpUpy26' }, // Ireland 🇮🇪
  127: { title: 'Michelle',             artist: 'Noam Bettan',             spotifyUrl: 'https://open.spotify.com/track/22g4vKHFze17AV7vnequhG', spotifyTrackId: '22g4vKHFze17AV7vnequhG' }, // Israel 🇮🇱
  128: { title: 'Ēnā',                  artist: 'Atvara',                  spotifyUrl: 'https://open.spotify.com/track/5jrN6fnBH38Bh0IQJnjiUJ', spotifyTrackId: '5jrN6fnBH38Bh0IQJnjiUJ' }, // Latvia 🇱🇻
  129: { title: 'Andromeda',            artist: 'LELEK',                   spotifyUrl: 'https://open.spotify.com/track/3bTsAnErZrtBoUfORcTDTo', spotifyTrackId: '3bTsAnErZrtBoUfORcTDTo' }, // Lithuania 🇱🇹
  130: { title: 'Paloma Rumba',         artist: 'Simon',                   spotifyUrl: 'https://open.spotify.com/track/4GdU371yp4pDPleTAXoq4g', spotifyTrackId: '4GdU371yp4pDPleTAXoq4g' }, // Luxembourg 🇱🇺
  131: { title: 'Bella',               artist: 'AIDAN',                   spotifyUrl: 'https://open.spotify.com/track/6xMZVKtQ76THTiJBntzmwz', spotifyTrackId: '6xMZVKtQ76THTiJBntzmwz' }, // Malta 🇲🇹
  132: { title: 'Alice',               artist: 'Veronica Fusaro',         spotifyUrl: 'https://open.spotify.com/track/4n1hRQ4uhTLhc1XaJFFofK', spotifyTrackId: '4n1hRQ4uhTLhc1XaJFFofK' }, // Netherlands 🇳🇱
  133: { title: 'Pray',                artist: 'ALICJA',                  spotifyUrl: 'https://open.spotify.com/track/7yT5rUvzEQh60Olh2GXShd', spotifyTrackId: '7yT5rUvzEQh60Olh2GXShd' }, // Poland 🇵🇱
  134: { title: 'Rosa',                artist: 'Bandidos do Cante',       spotifyUrl: 'https://open.spotify.com/track/03Oz6PWplRogAQJgnFuoJ7', spotifyTrackId: '03Oz6PWplRogAQJgnFuoJ7' }, // Portugal 🇵🇹
  135: { title: 'My System',           artist: 'FELICIA',                 spotifyUrl: 'https://open.spotify.com/track/1XmLPHkuv95o5NUodggzfv', spotifyTrackId: '1XmLPHkuv95o5NUodggzfv' }, // Sweden 🇸🇪
}
