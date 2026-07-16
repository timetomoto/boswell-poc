export default function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const yaml = `backend:
  name: github
  repo: timetomoto/boswell-poc
  branch: main
  base_url: ${baseUrl}
  auth_endpoint: api/auth

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: "site"
    label: "Site settings"
    label_singular: "Site setting"
    files:
      - name: "settings"
        label: "Global settings"
        file: "src/content/site/settings.md"
        fields:
          - { name: "siteName", label: "Site name", widget: "string" }
          - { name: "tagline", label: "Tagline (footer)", widget: "string", required: false }
          - { name: "contactEmail", label: "Contact email", widget: "string", required: false }
          - { name: "donateUrl", label: "Donate URL", widget: "string", required: false }
          - { name: "donateLabel", label: "Donate button label", widget: "string", required: false }
          - { name: "footerCredits", label: "Footer credits", widget: "text", required: false }
          - { name: "body", label: "Notes (unused on site)", widget: "markdown", required: false }

  - name: "navigation"
    label: "Navigation"
    label_singular: "Nav config"
    files:
      - name: "primary"
        label: "Primary nav (used by header + footer)"
        file: "src/content/navigation/primary.md"
        fields:
          - name: "items"
            label: "Nav items"
            widget: "list"
            fields:
              - { name: "label", label: "Label", widget: "string" }
              - { name: "href", label: "URL / path", widget: "string" }
              - { name: "external", label: "External link (open in new tab)", widget: "boolean", required: false, default: false }
          - { name: "body", label: "Notes", widget: "markdown", required: false }

  - name: "voices"
    label: "Home — quotes carousel"
    label_singular: "Quotes set"
    folder: "src/content/voices"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{slug}}"
    fields:
      - name: "quotes"
        label: "Quotes"
        widget: "list"
        fields:
          - { name: "text", label: "Quote text", widget: "text" }
          - { name: "attribution", label: "Attribution", widget: "string" }
      - { name: "body", label: "Notes", widget: "markdown", required: false }

  - name: "pressHubs"
    label: "Press — sub-hub labels"
    label_singular: "Sub-hub"
    folder: "src/content/press-hubs"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{fields.slug}}"
    fields:
      - name: "slug"
        label: "Slug (must match one of: vintage, in-their-own-words, video, feature, essay)"
        widget: "select"
        options: ["vintage", "in-their-own-words", "video", "feature", "essay"]
      - { name: "kicker", label: "Kicker (small label above section title)", widget: "string", required: false }
      - { name: "label", label: "Section title (H2)", widget: "string" }
      - { name: "blurb", label: "Section blurb", widget: "text", required: false }
      - { name: "order", label: "Display order", widget: "number", required: false }
      - { name: "body", label: "Notes", widget: "markdown", required: false }

  - name: "pages"
    label: "Pages"
    label_singular: "Page"
    files:
      - name: "home"
        label: "Home"
        file: "src/content/pages/home.md"
        fields:
          - { name: "title", label: "Hero — Title (H1)", widget: "string" }
          - { name: "eyebrow", label: "Hero — Eyebrow (small caps above title)", widget: "string", required: false }
          - { name: "subtitle", label: "Hero — Subtitle", widget: "string", required: false }
          - { name: "tagline", label: "Hero — Tagline (below glyph)", widget: "string", required: false }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
          - { name: "heroCredit", label: "Hero image credit", widget: "string", required: false }
          - { name: "introEyebrow", label: "Intro — Eyebrow", widget: "string", required: false }
          - { name: "introLede", label: "Intro — Lede", widget: "string", required: false }
          - name: "introBody"
            label: "Intro — Body paragraphs"
            widget: "list"
            field: { name: "para", label: "Paragraph", widget: "text" }
            required: false
          - { name: "playlistEyebrow", label: "Playlist section — Eyebrow", widget: "string", required: false }
          - { name: "playlistTitle", label: "Playlist section — Title", widget: "string", required: false }
          - { name: "voicesEyebrow", label: "Voices section — Eyebrow", widget: "string", required: false }
          - { name: "voicesTitle", label: "Voices section — Title", widget: "string", required: false }
          - { name: "sampleEyebrow", label: "Sample the Sound — Eyebrow", widget: "string", required: false }
          - { name: "sampleTitle", label: "Sample the Sound — Title", widget: "string", required: false }
          - { name: "sampleBody", label: "Sample the Sound — Body", widget: "text", required: false }
          - { name: "sampleCtaLabel", label: "Sample the Sound — CTA button label", widget: "string", required: false }
          - { name: "donateEyebrow", label: "Donate section — Eyebrow", widget: "string", required: false }
          - { name: "donateTitle", label: "Donate section — Title", widget: "string", required: false }
          - { name: "donateBody", label: "Donate section — Body", widget: "text", required: false }
      - name: "about"
        label: "About"
        file: "src/content/pages/about.md"
        fields:
          - { name: "title", label: "Hero — Title", widget: "string" }
          - { name: "eyebrow", label: "Hero — Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Hero — Subtitle", widget: "string", required: false }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
          - { name: "heroCredit", label: "Hero image credit", widget: "string", required: false }
          - { name: "ctaEyebrow", label: "CTA section — Eyebrow", widget: "string", required: false }
          - { name: "ctaTitle", label: "CTA section — Title", widget: "string", required: false }
          - { name: "ctaBody", label: "CTA section — Body", widget: "text", required: false }
          - { name: "ctaContactLabel", label: "CTA — Contact button label", widget: "string", required: false }
          - { name: "ctaDonateLabel", label: "CTA — Donate button label", widget: "string", required: false }
          - { name: "body", label: "Body (markdown)", widget: "markdown" }
      - name: "contact"
        label: "Contact"
        file: "src/content/pages/contact.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "body", label: "Body", widget: "markdown" }
      - name: "donate"
        label: "Donate"
        file: "src/content/pages/donate.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "subtitle", label: "Subtitle", widget: "string", required: false }
          - { name: "body", label: "Body", widget: "markdown" }
      - name: "sisters-landing"
        label: "The Sisters — landing"
        file: "src/content/pages/sisters.md"
        fields:
          - { name: "title", label: "Hero — Title", widget: "string" }
          - { name: "eyebrow", label: "Hero — Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Hero — Subtitle", widget: "string", required: false }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
          - { name: "heroCredit", label: "Hero image credit", widget: "string", required: false }
          - { name: "quote", label: "Pull-quote text", widget: "text", required: false }
          - { name: "quoteAttribution", label: "Pull-quote attribution", widget: "string", required: false }
          - { name: "sistersEyebrow", label: "Sisters grid — Eyebrow", widget: "string", required: false }
          - { name: "sistersSectionTitle", label: "Sisters grid — Section title", widget: "string", required: false }
          - { name: "bioReadLabel", label: "Sisters grid — Card CTA label", widget: "string", required: false }
          - { name: "bioResourcesEyebrow", label: "Further-reading section — Eyebrow", widget: "string", required: false }
          - { name: "bioResourcesCtaLabel", label: "Further-reading section — CTA label", widget: "string", required: false }
          - { name: "body", label: "Body (intro markdown)", widget: "markdown" }
      - name: "bio-resources"
        label: "The Sisters — Boz Biography subpage"
        file: "src/content/pages/bio-resources.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "eyebrow", label: "Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Subtitle", widget: "string", required: false }
          - { name: "quote", label: "Pull-quote text", widget: "text", required: false }
          - { name: "quoteAttribution", label: "Pull-quote attribution", widget: "string", required: false }
          - { name: "bioBookUrl", label: "Book CTA — URL", widget: "string", required: false }
          - { name: "bioBookLabel", label: "Book CTA — Button label", widget: "string", required: false }
          - { name: "body", label: "Body (markdown)", widget: "markdown" }
      - name: "music-landing"
        label: "Media — landing"
        file: "src/content/pages/music.md"
        fields:
          - { name: "title", label: "Hero — Title", widget: "string" }
          - { name: "eyebrow", label: "Hero — Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Hero — Subtitle", widget: "string", required: false }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
          - { name: "heroCredit", label: "Hero image credit", widget: "string", required: false }
          - { name: "quote", label: "Pull-quote text", widget: "text", required: false }
          - { name: "quoteAttribution", label: "Pull-quote attribution", widget: "string", required: false }
          - { name: "playlistEyebrow", label: "Playlist section — Eyebrow", widget: "string", required: false }
          - { name: "lessonsEyebrow", label: "Lessons section — Eyebrow", widget: "string", required: false }
          - { name: "lessonsTitle", label: "Lessons section — Title", widget: "string", required: false }
          - { name: "lessonsLede", label: "Lessons section — Lede", widget: "text", required: false }
          - { name: "chartsTeaserEyebrow", label: "Charts teaser — Eyebrow", widget: "string", required: false }
          - { name: "chartsTeaserTitle", label: "Charts teaser — Title", widget: "string", required: false }
          - { name: "chartsTeaserBody", label: "Charts teaser — Body", widget: "text", required: false }
          - { name: "chartsTeaserCta", label: "Charts teaser — CTA label", widget: "string", required: false }
          - { name: "reviewsTeaserEyebrow", label: "Reviews teaser — Eyebrow", widget: "string", required: false }
          - { name: "reviewsTeaserTitle", label: "Reviews teaser — Title", widget: "string", required: false }
          - { name: "reviewsTeaserBody", label: "Reviews teaser — Body", widget: "text", required: false }
          - { name: "reviewsTeaserCta", label: "Reviews teaser — CTA label", widget: "string", required: false }
          - { name: "body", label: "Body (intro markdown)", widget: "markdown" }
      - name: "press-landing"
        label: "Press — landing"
        file: "src/content/pages/press.md"
        fields:
          - { name: "title", label: "Hero — Title", widget: "string" }
          - { name: "eyebrow", label: "Hero — Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Hero — Subtitle", widget: "string", required: false }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
          - { name: "heroCredit", label: "Hero image credit", widget: "string", required: false }
          - { name: "quote", label: "Pull-quote text", widget: "text", required: false }
          - { name: "quoteAttribution", label: "Pull-quote attribution", widget: "string", required: false }
          - { name: "pressReleasesEyebrow", label: "Press releases — Eyebrow", widget: "string", required: false }
          - { name: "pressReleasesTitle", label: "Press releases — Title", widget: "string", required: false }
          - { name: "pressReleasesBlurb", label: "Press releases — Blurb", widget: "text", required: false }
          - { name: "body", label: "Body (intro markdown)", widget: "markdown" }

  - name: "sisters"
    label: "Sisters — biographies"
    label_singular: "Sister"
    folder: "src/content/sisters"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{slug}}"
    fields:
      - { name: "name", label: "Name", widget: "string" }
      - { name: "nickname", label: "Nickname (CBoz, MBoz, VBoz)", widget: "string", required: false }
      - { name: "portrait", label: "Portrait", widget: "image", required: false }
      - { name: "portraitAlt", label: "Portrait — alt text", widget: "string", required: false }
      - { name: "pullQuote", label: "Pull quote", widget: "text", required: false }
      - { name: "pullQuoteAttribution", label: "Pull quote — attribution", widget: "string", required: false }
      - { name: "order", label: "Display order", widget: "number" }
      - name: "facts"
        label: "Biographical facts (museum-label style)"
        widget: "object"
        required: false
        fields:
          - { name: "born", label: "Born", widget: "string", required: false }
          - { name: "died", label: "Died", widget: "string", required: false }
          - { name: "hairColor", label: "Hair", widget: "string", required: false }
          - { name: "eyeColor", label: "Eyes", widget: "string", required: false }
          - { name: "complexion", label: "Complexion", widget: "string", required: false }
          - { name: "height", label: "Height", widget: "string", required: false }
          - { name: "marriage", label: "Marriage", widget: "string", required: false }
          - { name: "children", label: "Children", widget: "string", required: false }
      - { name: "body", label: "Biography", widget: "markdown" }

  - name: "timelines"
    label: "Timelines"
    label_singular: "Timeline"
    folder: "src/content/timelines"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{slug}}"
    fields:
      - { name: "title", label: "Title", widget: "string" }
      - name: "subject"
        label: "Subject"
        widget: "select"
        options: ["trio", "connee", "martha", "vet"]
      - { name: "intro", label: "Intro", widget: "text", required: false }
      - name: "entries"
        label: "Timeline entries"
        widget: "list"
        fields:
          - { name: "year", label: "Year", widget: "string" }
          - { name: "event", label: "Event", widget: "text" }
          - { name: "image", label: "Image", widget: "image", required: false }
          - { name: "imageAlt", label: "Image — alt text", widget: "string", required: false }
      - { name: "body", label: "Notes", widget: "markdown", required: false }

  - name: "playlists"
    label: "Media — playlists"
    label_singular: "Playlist"
    folder: "src/content/playlists"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{slug}}"
    fields:
      - { name: "title", label: "Title", widget: "string" }
      - { name: "subtitle", label: "Subtitle", widget: "string", required: false }
      - { name: "order", label: "Display order", widget: "number", required: false }
      - name: "tracks"
        label: "Tracks"
        widget: "list"
        fields:
          - { name: "title", label: "Track title", widget: "string" }
          - { name: "artist", label: "Artist", widget: "string", required: false }
          - { name: "year", label: "Year", widget: "string", required: false }
          - { name: "duration", label: "Duration (M:SS)", widget: "string", required: false }
          - { name: "audio", label: "Audio URL (MP3)", widget: "string" }

  - name: "lessons"
    label: "Media — lessons"
    label_singular: "Lesson"
    folder: "src/content/lessons"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "lesson-{{fields.order}}"
    fields:
      - { name: "title", label: "Title", widget: "string" }
      - { name: "order", label: "Order (1–5)", widget: "number" }
      - { name: "audioFile", label: "Audio file (MP3)", widget: "file" }
      - { name: "duration", label: "Duration", widget: "string", required: false }
      - { name: "summary", label: "Summary", widget: "text", required: false }
      - { name: "heroImage", label: "Hero image", widget: "image", required: false }
      - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
      - { name: "body", label: "Notes / transcript", widget: "markdown" }

  - name: "articles"
    label: "Press — articles"
    label_singular: "Article"
    folder: "src/content/articles"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{slug}}"
    fields:
      - { name: "title", label: "Title", widget: "string" }
      - name: "subhub"
        label: "Sub-hub"
        widget: "select"
        options: ["vintage", "in-their-own-words", "video", "essay", "feature"]
      - { name: "publication", label: "Publication (for vintage articles)", widget: "string", required: false }
      - { name: "publicationDate", label: "Publication date", widget: "string", required: false }
      - { name: "author", label: "Author", widget: "string", required: false }
      - { name: "heroImage", label: "Hero image", widget: "image", required: false }
      - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
      - { name: "videoEmbed", label: "Video embed URL (YouTube/Vimeo)", widget: "string", required: false }
      - { name: "externalLink", label: "External link (original source)", widget: "string", required: false }
      - { name: "order", label: "Display order", widget: "number", required: false }
      - { name: "body", label: "Body", widget: "markdown" }

  - name: "pressReleases"
    label: "Press — releases"
    label_singular: "Press release"
    folder: "src/content/press-releases"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{slug}}"
    fields:
      - { name: "title", label: "Title", widget: "string" }
      - { name: "releaseDate", label: "Release date", widget: "string", required: false }
      - { name: "document", label: "Attached document (PDF/GIF/image)", widget: "file", required: false }
      - name: "documentType"
        label: "Document type"
        widget: "select"
        options: ["pdf", "gif", "image", "html"]
        required: false
      - { name: "summary", label: "Summary", widget: "text", required: false }
      - { name: "body", label: "Body", widget: "markdown", required: false }

  - name: "performers"
    label: "Legacy — tribute performers"
    label_singular: "Performer"
    folder: "src/content/performers"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{slug}}"
    fields:
      - { name: "name", label: "Name", widget: "string" }
      - { name: "region", label: "Region", widget: "string", required: false }
      - { name: "photo", label: "Photo", widget: "image", required: false }
      - { name: "photoAlt", label: "Photo — alt text", widget: "string", required: false }
      - { name: "activeSince", label: "Active since (year)", widget: "string", required: false }
      - name: "links"
        label: "Links"
        widget: "list"
        required: false
        fields:
          - { name: "label", label: "Label", widget: "string" }
          - { name: "url", label: "URL", widget: "string" }
      - { name: "body", label: "Bio", widget: "markdown" }

  - name: "legacyFeatures"
    label: "Legacy — community features"
    label_singular: "Feature"
    folder: "src/content/legacy-features"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{slug}}"
    fields:
      - { name: "title", label: "Title", widget: "string" }
      - name: "subhub"
        label: "Sub-hub"
        widget: "select"
        options: ["bozcasts", "ascap", "boz-of-the-month", "feature"]
      - { name: "date", label: "Date", widget: "string", required: false }
      - { name: "heroImage", label: "Hero image", widget: "image", required: false }
      - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
      - { name: "externalLink", label: "External link", widget: "string", required: false }
      - { name: "body", label: "Body", widget: "markdown" }

  - name: "chartEntries"
    label: "Media — chart entries"
    label_singular: "Chart entry"
    folder: "src/content/chart-entries"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{fields.artist}}-{{fields.year}}-{{slug}}"
    fields:
      - { name: "songTitle", label: "Song title", widget: "string" }
      - name: "artist"
        label: "Artist"
        widget: "select"
        options: ["boswell-sisters", "connee-boswell"]
      - { name: "year", label: "Year", widget: "number" }
      - { name: "peakPosition", label: "Peak position", widget: "number", required: false }
      - { name: "chart", label: "Chart (Billboard, etc.)", widget: "string", required: false }
      - { name: "notes", label: "Notes", widget: "text", required: false }
      - { name: "body", label: "Body", widget: "markdown", required: false }
`;

  res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
  res.status(200).send(yaml);
}
