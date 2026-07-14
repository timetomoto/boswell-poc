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
          - { name: "tagline", label: "Tagline", widget: "string", required: false }
          - { name: "contactEmail", label: "Contact email", widget: "string", required: false }
          - { name: "donateUrl", label: "Donate URL", widget: "string", required: false }
          - { name: "footerCredits", label: "Footer credits", widget: "text", required: false }
          - { name: "body", label: "Notes (unused on site)", widget: "markdown", required: false }

  - name: "pages"
    label: "Pages"
    label_singular: "Page"
    files:
      - name: "home"
        label: "Home"
        file: "src/content/pages/home.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "eyebrow", label: "Eyebrow (small caps above title)", widget: "string", required: false }
          - { name: "subtitle", label: "Subtitle", widget: "string", required: false }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
          - { name: "heroCredit", label: "Hero image credit", widget: "string", required: false }
          - { name: "body", label: "Body", widget: "markdown" }
      - name: "about"
        label: "About / BozBiz"
        file: "src/content/pages/about.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "eyebrow", label: "Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Subtitle", widget: "string", required: false }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
          - { name: "body", label: "Body", widget: "markdown" }
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
          - { name: "title", label: "Title", widget: "string" }
          - { name: "eyebrow", label: "Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Subtitle", widget: "string", required: false }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "heroImageAlt", label: "Hero image — alt text", widget: "string", required: false }
          - { name: "body", label: "Body", widget: "markdown" }
      - name: "music-landing"
        label: "Music — landing"
        file: "src/content/pages/music.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "eyebrow", label: "Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Subtitle", widget: "string", required: false }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "body", label: "Body", widget: "markdown" }
      - name: "press-landing"
        label: "Press — landing"
        file: "src/content/pages/press.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "eyebrow", label: "Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Subtitle", widget: "string", required: false }
          - { name: "body", label: "Body", widget: "markdown" }
      - name: "legacy-landing"
        label: "Legacy — landing"
        file: "src/content/pages/legacy.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "eyebrow", label: "Eyebrow", widget: "string", required: false }
          - { name: "subtitle", label: "Subtitle", widget: "string", required: false }
          - { name: "body", label: "Body", widget: "markdown" }

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

  - name: "lessons"
    label: "Music — lessons"
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
    label: "Music — chart entries"
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
