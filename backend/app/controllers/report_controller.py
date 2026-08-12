import csv
import io

from datetime import datetime, timedelta

from flask import jsonify, request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.transaction_model import Transaction

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)


# ==========================================================
# HELPER FUNCTION
# ==========================================================

def generate_report(user_id, start_date, end_date):

    transactions = Transaction.query.filter(
        Transaction.user_id == user_id,
        Transaction.created_at >= start_date,
        Transaction.created_at < end_date
    ).all()

    total_transactions = len(transactions)

    total_revenue = sum(
        transaction.amount
        for transaction in transactions
        if transaction.type == "income"
        and transaction.status == "Success"
    )

    total_expenses = sum(
        transaction.amount
        for transaction in transactions
        if transaction.type == "expense"
        and transaction.status == "Success"
    )

    net_revenue = total_revenue - total_expenses

    successful_transactions = sum(
        1
        for transaction in transactions
        if transaction.status == "Success"
    )

    pending_transactions = sum(
        1
        for transaction in transactions
        if transaction.status == "Pending"
    )

    failed_transactions = sum(
        1
        for transaction in transactions
        if transaction.status == "Failed"
    )

    refunded_transactions = sum(
        1
        for transaction in transactions
        if transaction.status == "Refunded"
    )

    return {
        "total_transactions": total_transactions,
        "total_revenue": float(total_revenue),
        "total_expenses": float(total_expenses),
        "net_revenue": float(net_revenue),
        "successful_transactions": successful_transactions,
        "pending_transactions": pending_transactions,
        "failed_transactions": failed_transactions,
        "refunded_transactions": refunded_transactions
    }


# ==========================================================
# DAILY REPORT
# ==========================================================

@jwt_required()
def get_daily_report():

    user_id = int(get_jwt_identity())

    today = datetime.now().date()

    start_date = datetime.combine(
        today,
        datetime.min.time()
    )

    end_date = start_date + timedelta(days=1)

    report = generate_report(
        user_id,
        start_date,
        end_date
    )

    return jsonify({
        "report_type": "daily",
        "date": today.isoformat(),
        **report
    }), 200


# ==========================================================
# WEEKLY REPORT
# ==========================================================

@jwt_required()
def get_weekly_report():

    user_id = int(get_jwt_identity())

    today = datetime.now().date()

    # Monday = start of week
    start_day = today - timedelta(
        days=today.weekday()
    )

    start_date = datetime.combine(
        start_day,
        datetime.min.time()
    )

    end_date = start_date + timedelta(days=7)

    report = generate_report(
        user_id,
        start_date,
        end_date
    )

    return jsonify({
        "report_type": "weekly",
        "start_date": start_day.isoformat(),
        "end_date": (end_date.date() - timedelta(days=1)).isoformat(),
        **report
    }), 200


# ==========================================================
# MONTHLY REPORT
# ==========================================================

@jwt_required()
def get_monthly_report():

    user_id = int(get_jwt_identity())

    today = datetime.now().date()

    start_day = today.replace(day=1)

    start_date = datetime.combine(
        start_day,
        datetime.min.time()
    )

    # Move to first day of next month
    if start_day.month == 12:

        next_month = start_day.replace(
            year=start_day.year + 1,
            month=1,
            day=1
        )

    else:

        next_month = start_day.replace(
            month=start_day.month + 1,
            day=1
        )

    end_date = datetime.combine(
        next_month,
        datetime.min.time()
    )

    report = generate_report(
        user_id,
        start_date,
        end_date
    )

    return jsonify({
        "report_type": "monthly",
        "month": start_day.strftime("%Y-%m"),
        **report
    }), 200

def get_report_period(period):
    """
    Returns start_date and end_date for the requested report period.
    """

    today = datetime.now().date()

    if period == "daily":

        start_day = today

        start_date = datetime.combine(
            start_day,
            datetime.min.time()
        )

        end_date = start_date + timedelta(days=1)

        return start_date, end_date

    elif period == "weekly":

        start_day = today - timedelta(
            days=today.weekday()
        )

        start_date = datetime.combine(
            start_day,
            datetime.min.time()
        )

        end_date = start_date + timedelta(days=7)

        return start_date, end_date

    elif period == "monthly":

        start_day = today.replace(day=1)

        start_date = datetime.combine(
            start_day,
            datetime.min.time()
        )

        if start_day.month == 12:

            next_month = start_day.replace(
                year=start_day.year + 1,
                month=1,
                day=1
            )

        else:

            next_month = start_day.replace(
                month=start_day.month + 1,
                day=1
            )

        end_date = datetime.combine(
            next_month,
            datetime.min.time()
        )

        return start_date, end_date

    return None, None

# ==========================================================
# CSV REPORT EXPORT
# ==========================================================

@jwt_required()
def export_report_csv():

    user_id = int(get_jwt_identity())

    period = request.args.get(
        "period",
        "daily"
    ).lower()

    start_date, end_date = get_report_period(period)

    if start_date is None:

        return jsonify({
            "message": "Invalid period. Use daily, weekly, or monthly."
        }), 400

    transactions = Transaction.query.filter(
        Transaction.user_id == user_id,
        Transaction.created_at >= start_date,
        Transaction.created_at < end_date
    ).order_by(
        Transaction.created_at.desc()
    ).all()

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "Transaction ID",
        "Title",
        "Amount",
        "Type",
        "Category",
        "Payment Method",
        "Status",
        "Created At"
    ])

    for transaction in transactions:

        writer.writerow([
            transaction.id,
            transaction.title,
            transaction.amount,
            transaction.type,
            transaction.category,
            transaction.payment_method or "",
            transaction.status,
            transaction.created_at.strftime(
                "%Y-%m-%d %H:%M:%S"
            )
            if transaction.created_at
            else ""
        ])

    filename = f"{period}_report.csv"

    response = Response(
        output.getvalue(),
        mimetype="text/csv"
    )

    response.headers["Content-Disposition"] = (
        f"attachment; filename={filename}"
    )

    return response

# ==========================================================
# PDF REPORT EXPORT
# ==========================================================

@jwt_required()
def export_report_pdf():

    user_id = int(get_jwt_identity())

    period = request.args.get(
        "period",
        "daily"
    ).lower()

    start_date, end_date = get_report_period(period)

    if start_date is None:

        return jsonify({
            "message": "Invalid period. Use daily, weekly, or monthly."
        }), 400

    transactions = Transaction.query.filter(
        Transaction.user_id == user_id,
        Transaction.created_at >= start_date,
        Transaction.created_at < end_date
    ).order_by(
        Transaction.created_at.desc()
    ).all()

    # --------------------------------------------------
    # Calculate summary
    # --------------------------------------------------

    total_transactions = len(transactions)

    total_revenue = sum(
        transaction.amount
        for transaction in transactions
        if transaction.type == "income"
        and transaction.status == "Success"
    )

    total_expenses = sum(
        transaction.amount
        for transaction in transactions
        if transaction.type == "expense"
        and transaction.status == "Success"
    )

    net_revenue = total_revenue - total_expenses

    successful_transactions = sum(
        1
        for transaction in transactions
        if transaction.status == "Success"
    )

    pending_transactions = sum(
        1
        for transaction in transactions
        if transaction.status == "Pending"
    )

    failed_transactions = sum(
        1
        for transaction in transactions
        if transaction.status == "Failed"
    )

    refunded_transactions = sum(
        1
        for transaction in transactions
        if transaction.status == "Refunded"
    )

    # --------------------------------------------------
    # Create PDF
    # --------------------------------------------------

    buffer = io.BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm
    )

    styles = getSampleStyleSheet()

    elements = []

    # --------------------------------------------------
    # Title
    # --------------------------------------------------

    elements.append(
        Paragraph(
            "FinTrack Financial Report",
            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 8)
    )

    elements.append(
        Paragraph(
            f"Report Type: {period.capitalize()}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Period: {start_date.strftime('%d %B %Y')} - "
            f"{(end_date - timedelta(days=1)).strftime('%d %B %Y')}",
            styles["Normal"]
        )
    )

    elements.append(
        Spacer(1, 15)
    )

    # --------------------------------------------------
    # Summary
    # --------------------------------------------------

    elements.append(
        Paragraph(
            "Financial Summary",
            styles["Heading2"]
        )
    )

    elements.append(
        Spacer(1, 8)
    )

    summary_data = [
        ["Metric", "Value"],

        [
            "Total Transactions",
            str(total_transactions)
        ],

        [
            "Total Revenue",
            f"₹{total_revenue:,.2f}"
        ],

        [
            "Total Expenses",
            f"₹{total_expenses:,.2f}"
        ],

        [
            "Net Revenue",
            f"₹{net_revenue:,.2f}"
        ],

        [
            "Successful Transactions",
            str(successful_transactions)
        ],

        [
            "Pending Transactions",
            str(pending_transactions)
        ],

        [
            "Failed Transactions",
            str(failed_transactions)
        ],

        [
            "Refunded Transactions",
            str(refunded_transactions)
        ]
    ]

    summary_table = Table(
        summary_data,
        colWidths=[90 * mm, 70 * mm]
    )

    summary_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#1e293b")
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),

            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                6
            )
        ])
    )

    elements.append(summary_table)

    elements.append(
        Spacer(1, 20)
    )

    # --------------------------------------------------
    # Transactions
    # --------------------------------------------------

    elements.append(
        Paragraph(
            "Transaction Details",
            styles["Heading2"]
        )
    )

    elements.append(
        Spacer(1, 8)
    )

    transaction_data = [
        [
            "ID",
            "Title",
            "Amount",
            "Type",
            "Category",
            "Status"
        ]
    ]

    for transaction in transactions:

        transaction_data.append([
            str(transaction.id),
            transaction.title,
            f"₹{transaction.amount:,.2f}",
            transaction.type,
            transaction.category,
            transaction.status
        ])

    if len(transaction_data) == 1:

        transaction_data.append([
            "-",
            "No transactions found",
            "-",
            "-",
            "-",
            "-"
        ])

    transaction_table = Table(
        transaction_data,
        repeatRows=1
    )

    transaction_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#1e293b")
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),

            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),

            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                5
            )
        ])
    )

    elements.append(transaction_table)

    document.build(elements)

    buffer.seek(0)

    filename = f"{period}_report.pdf"

    return Response(
        buffer.getvalue(),
        mimetype="application/pdf",
        headers={
            "Content-Disposition":
                f"attachment; filename={filename}"
        }
    )