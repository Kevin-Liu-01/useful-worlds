# PortfolioMon trainer archive

The active roster is a local mirror of every file in Bulbagarden's
`Generation V Trainer sprites` category.

- 258 selectable source files
- 246 front-facing battle sprites
- 12 back-pose sprites
- Black / White and Black 2 / White 2 variants remain distinct
- 254 entries have a matched overworld/chibi sprite
- Four ensemble or special-effect entries have no matching overworld file and
  retain their original battle sprite when chibi mode is active

Assets are stored in:

- `gen-v/battle/`: every file from the Generation V trainer category
- `gen-v/chibi/`: matched files from the overworld trainer archive

The generated roster, including exact source filenames and source-page URLs,
is stored in `src/data/genVTrainerRoster.json`. Re-run the reproducible sync
with:

```sh
node scripts/sync-gen-v-trainers.mjs
```

Source collections:

- https://archives.bulbagarden.net/wiki/Category:Generation_V_Trainer_sprites
- https://archives.bulbagarden.net/wiki/Category:Overworld_Trainer_sprites

These are Pokémon game sprites or sprites substantially derived from the
games. Bulbagarden labels the individual files as fair-use game images. They
remain the property of their respective Pokémon rights holders and are used
here as part of a non-commercial portfolio/game homage. No ownership or open
license is claimed.

The older `bw/` and Kenney asset directories are retained only as unused legacy
files; the arena roster no longer references them. Kenney's original license
text is preserved in `KENNEY-LICENSE.txt`.
