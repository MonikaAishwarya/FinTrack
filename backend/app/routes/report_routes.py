from flask import Blueprint

from app.controllers.report_controller import (
    get_daily_report,
    get_weekly_report,
    get_monthly_report,
    export_report_csv,
    export_report_pdf
)


report_bp = Blueprint(
    "report",
    __name__
)


# Daily Report
report_bp.route(
    "/daily",
    methods=["GET"]
)(get_daily_report)


# Weekly Report
report_bp.route(
    "/weekly",
    methods=["GET"]
)(get_weekly_report)


# Monthly Report
report_bp.route(
    "/monthly",
    methods=["GET"]
)(get_monthly_report)

# CSV Report Export
report_bp.route(
    "/export/csv",
    methods=["GET"]
)(export_report_csv)

# PDF Report Export
report_bp.route(
    "/export/pdf",
    methods=["GET"]
)(export_report_pdf)