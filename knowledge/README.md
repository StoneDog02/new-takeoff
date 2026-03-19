# Knowledge base

Drop your **reference files, rules, and docs** here so the takeoff agent can use them on every request — same as the “knowledge base” in your Claude custom project.

- **Supported formats:** `.md`, `.txt`, `.json`
- **Order:** Files are loaded in **alphabetical order by filename**. Use prefixes (e.g. `01-rules.md`, `02-manual.md`) if you care about order.
- **Content:** All files are concatenated and appended to the system prompt under a “Knowledge base” section. The agent sees them as reference material.

If you have `.docx` or other formats, export them to `.txt` or `.md` and place them here.

**Example:** If your Claude project has 37 reference files, copy those 37 files into this `knowledge/` folder (converting to .md/.txt/.json as needed). The app will load them once, cache them, and include them in every takeoff call.
