# Twitch integration

This directory owns Twitch-specific configuration and data normalization.

The public client must not contain a Twitch client secret. OAuth token exchange and Helix API calls belong in the Worker/API layer and will be implemented in the next Twitch sub-phase.
