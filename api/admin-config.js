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

media_folder: "public"
public_folder: "/"

collections:
  - name: "page"
    label: "Pages"
    files:
      - name: "home"
        label: "Home"
        file: "src/content/page/home.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "body", label: "Body", widget: "markdown" }
      - name: "about"
        label: "About"
        file: "src/content/page/about.md"
        fields:
          - { name: "title", label: "Title", widget: "string" }
          - { name: "heroImage", label: "Hero image", widget: "image", required: false }
          - { name: "body", label: "Body", widget: "markdown" }
  - name: "article"
    label: "Articles"
    folder: "src/content/article"
    format: "frontmatter"
    extension: "md"
    create: true
    slug: "{{slug}}"
    fields:
      - { name: "title", label: "Title", widget: "string" }
      - { name: "heroImage", label: "Hero image", widget: "image", required: false }
      - { name: "body", label: "Body", widget: "markdown" }
`;

  res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
  res.status(200).send(yaml);
}
