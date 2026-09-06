# SANCI9517 2.0

Új, egységes GitHub Pages gaming oldal.

- mobil + desktop egységes rendszer
- központi lenyíló menü asztali és mobil nézetben
- Admin csak a menüben
- Twitch státusz / néző / követő / játék
- Twitch player és chat
- clips API
- menetrend API + helyi fallback
- szavazás a `/poll/current` végponton
- védett Admin Center
- SANCI AI felület a működő `/ai/chat` végponthoz

A Twitch/AI backend külön Cloudflare Worker; a frontend nem tartalmaz titkos kulcsokat.