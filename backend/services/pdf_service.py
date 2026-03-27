from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from io import BytesIO
from datetime import datetime


def generate_prescription_pdf(rx: dict, doctor: dict, patient: dict) -> bytes:
    """
    Generate a professional prescription PDF using ReportLab (free).
    Returns: bytes of the PDF.
    """
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm
    )
    styles = getSampleStyleSheet()
    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    title_style = ParagraphStyle(
        "title", parent=styles["Heading1"],
        fontSize=20, textColor=colors.HexColor("#6C63FF"), spaceAfter=4
    )
    story.append(Paragraph("Vela Health — Digital Prescription", title_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#6C63FF")))
    story.append(Spacer(1, 8))

    # ── Doctor Info ───────────────────────────────────────────────────────────
    story.append(Paragraph(
        f"<b>Dr. {doctor.get('name', 'Unknown')}</b>  |  "
        f"PMDC: {doctor.get('pmdc_number', 'N/A')}  |  "
        f"{', '.join(doctor.get('specialties', []))}",
        styles["Normal"]
    ))
    story.append(Spacer(1, 4))

    # ── Patient Info ──────────────────────────────────────────────────────────
    story.append(Paragraph(
        f"<b>Patient:</b> {patient.get('name', 'Unknown')}  |  "
        f"<b>Date:</b> {datetime.now().strftime('%d %b %Y')}  |  "
        f"<b>Rx ID:</b> {rx.get('id', 'N/A')}",
        styles["Normal"]
    ))
    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey))
    story.append(Spacer(1, 8))

    # ── Diagnosis ─────────────────────────────────────────────────────────────
    story.append(Paragraph(f"<b>Diagnosis:</b> {rx.get('diagnosis', 'N/A')}", styles["Heading3"]))
    story.append(Spacer(1, 8))

    # ── Medications Table ─────────────────────────────────────────────────────
    story.append(Paragraph("<b>Medications:</b>", styles["Heading3"]))
    story.append(Spacer(1, 4))

    table_data = [["Medicine", "Dose", "Frequency", "Duration", "Instructions"]]
    for med in rx.get("medications", []):
        table_data.append([
            med.get("name", ""),
            med.get("dose", ""),
            med.get("frequency", ""),
            med.get("duration", ""),
            med.get("instructions", "—")
        ])

    table = Table(table_data, colWidths=[4 * cm, 2.5 * cm, 3 * cm, 2.5 * cm, 5 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#6C63FF")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F9FAFB")]),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ]))
    story.append(table)
    story.append(Spacer(1, 12))

    # ── Lab Tests ─────────────────────────────────────────────────────────────
    if rx.get("lab_tests"):
        story.append(Paragraph(f"<b>Lab Tests:</b> {', '.join(rx['lab_tests'])}", styles["Normal"]))
        story.append(Spacer(1, 8))

    # ── Advice ────────────────────────────────────────────────────────────────
    if rx.get("advice"):
        story.append(Paragraph(f"<b>Advice:</b> {rx['advice']}", styles["Normal"]))
        story.append(Spacer(1, 8))

    # ── Follow-up ─────────────────────────────────────────────────────────────
    if rx.get("follow_up_days"):
        story.append(Paragraph(
            f"<b>Follow-up:</b> Return after {rx['follow_up_days']} days", styles["Normal"]
        ))
        story.append(Spacer(1, 16))

    # ── Disclaimer ────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey))
    story.append(Spacer(1, 8))
    disclaimer_style = ParagraphStyle(
        "disclaimer", parent=styles["Italic"],
        fontSize=8, textColor=colors.grey
    )
    story.append(Paragraph(
        "DISCLAIMER: This prescription was issued via telemedicine video consultation. "
        "Physical examination was not performed. If symptoms persist or worsen, "
        "please visit a clinic immediately. Valid for 30 days from issue date.",
        disclaimer_style
    ))

    doc.build(story)
    return buf.getvalue()
