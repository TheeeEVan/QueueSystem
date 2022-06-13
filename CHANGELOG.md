# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.0.0](https://github.com/TheeeEVan/QueueSystem/releases/tag/v2.0.0) - 2022-06-13
Obviously wasn't expecting to to go right from v1 to v2 however with the issues on LAN with peerjs i figured the changes are significant enough for a major version change. Hopefully everything works better on this new system. I'm sure there's lots of bugs but that's what new versions are for.

### Added
- This changelog
- Moved to socket.io
- Version number

### Fixed
- Users could join without providing a name
- Issues on LAN

### Removed 
- replit.nix
- PeerJS
- Confirming Kicks

## [1.0.0](https://github.com/TheeeEVan/QueueSystem/releases/tag/v1.0.0) - 2022-06-07
### Added
- List of users in the queue
- Notification when it's the client's turn
- Notification when the client was kicked

### Removed
- Sounds

### Fixed
- Clients that have ids that start with 0 couldn't be removed
- Clients could connect to other clients


## [0.1.0](https://github.com/TheeeEVan/QueueSystem/releases/tag/v0.1.0) - 2022-05-31
### Added
- Entire App