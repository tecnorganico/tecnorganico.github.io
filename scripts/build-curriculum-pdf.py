from html.parser import HTMLParser
from pathlib import Path
import textwrap

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "curriculo" / "index.html"
OUTPUT = ROOT / "curriculo" / "raffael-baptista.pdf"
PAGE_WIDTH, PAGE_HEIGHT = 595.28, 841.89
LEFT, RIGHT, TOP, BOTTOM = 48, 48, 790, 48
GREEN = (0.12, 0.42, 0.35)
INK = (0.15, 0.21, 0.18)
MUTED = (0.35, 0.42, 0.38)


class CurriculumParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.section = ""
        self.capture = None
        self.capture_text = []
        self.item = None
        self.article_depth = 0
        self.in_contact_section = False
        self.data = {"roles": [], "skills": [], "experience": [], "contact": []}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "article":
            self.article_depth += 1
        if tag == "section" and attrs.get("class") == "resume-contact":
            self.in_contact_section = True
        if tag == "li":
            self.item = {"title": "", "description": "", "date": "", "links": []}
        if tag in {"h1", "h2", "h3", "p", "time", "a", "li"}:
            self.capture = (tag, attrs)
            self.capture_text = []

    def handle_data(self, data):
        if self.capture:
            self.capture_text.append(data)

    def handle_endtag(self, tag):
        if self.capture and self.capture[0] == tag:
            kind, attrs = self.capture
            value = " ".join("".join(self.capture_text).split())
            if kind == "h2":
                if self.article_depth == 0:
                    self.section = value
                elif self.item is not None:
                    self.item["title"] = value
            elif kind == "h1":
                self.data["title"] = value
            elif kind == "p" and attrs.get("class") == "resume-lead":
                self.data["summary"] = value
            elif kind == "p" and self.section == "contato" and self.in_contact_section:
                if value:
                    self.data["contact"].append(value)
            elif kind == "a" and self.section == "contato" and self.in_contact_section:
                self.data["contact"].append(value)
            elif self.item is not None:
                if kind == "h3":
                    self.item["title"] = value
                elif kind == "time":
                    self.item["date"] = value
                elif kind == "p":
                    self.item["description"] = value
                elif kind == "li" and self.section == "competências e serviços":
                    self.item["description"] = value
                elif kind == "a" and self.section == "experiência, projetos e publicações":
                    self.item["links"].append(value)
            self.capture = None
            self.capture_text = []
        if tag == "li" and self.item is not None:
            if self.section == "áreas de atuação":
                self.data["roles"].append(self.item)
            elif self.section == "competências e serviços":
                text = " ".join(x for x in [self.item["title"], self.item["description"]] if x)
                if text:
                    self.data["skills"].append(text)
            elif self.section == "experiência, projetos e publicações":
                if self.item["title"]:
                    self.data["experience"].append(self.item)
            self.item = None
        if tag == "article":
            self.article_depth = max(0, self.article_depth - 1)
        if tag == "section" and self.in_contact_section:
            self.in_contact_section = False


def pdf_string(value):
    encoded = value.encode("cp1252", errors="replace")
    parts = []
    for byte in encoded:
        if byte in (40, 41, 92):
            parts.append("\\" + chr(byte))
        elif byte < 32 or byte > 126:
            parts.append(f"\\{byte:03o}")
        else:
            parts.append(chr(byte))
    return "(" + "".join(parts) + ")"


class Layout:
    def __init__(self):
        self.pages = []
        self.commands = []
        self.y = TOP

    def page(self):
        if self.commands:
            self.pages.append("\n".join(self.commands).encode("cp1252", errors="replace"))
        self.commands = []
        self.y = TOP

    def ensure(self, height):
        if self.y - height < BOTTOM:
            self.page()

    def text(self, value, *, size=10, font="F1", color=INK, indent=0, line_gap=3):
        available = PAGE_WIDTH - LEFT - RIGHT - indent
        width = max(35, int(available / (size * 0.5)))
        lines = textwrap.wrap(value, width=width, break_long_words=True, break_on_hyphens=False) or [""]
        line_height = size * 1.35
        self.ensure(len(lines) * line_height + line_gap)
        r, g, b = color
        for line in lines:
            self.commands.append(f"{r:.3f} {g:.3f} {b:.3f} rg BT /{font} {size:.2f} Tf {LEFT + indent:.2f} {self.y:.2f} Td {pdf_string(line)} Tj ET")
            self.y -= line_height
        self.y -= line_gap

    def heading(self, value):
        self.ensure(34)
        self.y -= 3
        self.commands.append(f"{GREEN[0]:.3f} {GREEN[1]:.3f} {GREEN[2]:.3f} RG 1.4 w {LEFT} {self.y - 6:.2f} m {PAGE_WIDTH - RIGHT} {self.y - 6:.2f} l S")
        self.text(value, size=13, font="F2", color=GREEN, line_gap=5)

    def bullet(self, value):
        self.text("• " + value, size=9.3, indent=9, line_gap=2)


def make_pdf(pages):
    objects = [None] * 5
    objects[1] = b"<< /Type /Catalog /Pages 2 0 R >>"
    objects[3] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
    objects[4] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
    page_ids = []
    for content in pages:
        page_id = len(objects)
        content_id = page_id + 1
        stream = b"<< /Length " + str(len(content)).encode() + b" >>\nstream\n" + content + b"\nendstream"
        objects.extend([None, stream])
        objects[page_id] = (f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH:.2f} {PAGE_HEIGHT:.2f}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents {content_id} 0 R >>").encode()
        page_ids.append(page_id)
    kids = " ".join(f"{obj} 0 R" for obj in page_ids)
    objects[2] = f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>".encode()

    output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]
    for index, obj in enumerate(objects[1:], start=1):
        offsets.append(len(output))
        output.extend(f"{index} 0 obj\n".encode())
        output.extend(obj)
        output.extend(b"\nendobj\n")
    xref = len(output)
    output.extend(f"xref\n0 {len(objects)}\n0000000000 65535 f \n".encode())
    for offset in offsets[1:]:
        output.extend(f"{offset:010d} 00000 n \n".encode())
    output.extend(f"trailer\n<< /Size {len(objects)} /Root 1 0 R /Info << /Title {pdf_string('Currículo de Raffael Baptista')} /Author {pdf_string('Raffael Baptista')} >> >>\nstartxref\n{xref}\n%%EOF\n".encode("cp1252", errors="replace"))
    OUTPUT.write_bytes(output)


def main():
    parser = CurriculumParser()
    parser.feed(SOURCE.read_text(encoding="utf-8"))
    data = parser.data
    layout = Layout()
    layout.text("Raffael Baptista", size=23, font="F2", color=GREEN, line_gap=1)
    layout.text("currículo profissional · educação, projetos e tecnologia", size=11, font="F2", color=MUTED, line_gap=7)
    layout.text(data.get("summary", ""), size=10.5, line_gap=9)
    layout.heading("áreas de atuação")
    for role in data["roles"]:
        layout.text(role["title"], size=10, font="F2", color=INK, line_gap=1)
        layout.text(role["description"], size=9.3, color=MUTED, indent=8, line_gap=5)
    layout.heading("competências e serviços")
    for skill in data["skills"]:
        layout.bullet(skill)
    layout.heading("experiência, projetos e publicações")
    for entry in data["experience"]:
        layout.text(entry["date"], size=9, font="F2", color=GREEN, line_gap=1)
        layout.text(entry["title"], size=10, font="F2", line_gap=1)
        layout.text(entry["description"], size=9.3, line_gap=1)
        if entry["links"]:
            layout.text("Referências: " + "; ".join(entry["links"]), size=8.5, color=MUTED, indent=8, line_gap=4)
        else:
            layout.y -= 4
    layout.heading("contato")
    for contact in data["contact"]:
        layout.text(contact, size=9.5, color=INK, line_gap=2)
    if layout.commands:
        layout.pages.append("\n".join(layout.commands).encode("cp1252", errors="replace"))
    make_pdf(layout.pages)
    print(f"PDF gerado: {OUTPUT} ({len(layout.pages)} páginas)")


if __name__ == "__main__":
    main()
