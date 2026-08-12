import { useEffect, useState } from "react";
import { getFraudAlerts } from "../../services/fraudService";

function FraudAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAlerts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getFraudAlerts();
            setAlerts(data);
        } catch (err) {
            console.error("Failed to load fraud alerts:", err);
            setError("Unable to load fraud alerts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlerts();
    }, []);

    const getSeverityClass = (severity) => {
        if (severity === "High") {
            return "fraud-alert-high";
        }

        if (severity === "Medium") {
            return "fraud-alert-medium";
        }

        return "fraud-alert-low";
    };

    const getSeverityIcon = (severity) => {
        if (severity === "High") {
            return "🔴";
        }

        if (severity === "Medium") {
            return "🟠";
        }

        return "🟢";
    };

    if (loading) {
        return (
            <div className="fraud-alerts-section">
                <h2>Fraud Alerts</h2>
                <p>Loading fraud alerts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fraud-alerts-section">
                <h2>Fraud Alerts</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="fraud-alerts-section">

            <div className="fraud-alerts-header">
                <h2>Fraud Alerts</h2>

                <span className="fraud-alert-count">
                    {alerts.length}
                </span>
            </div>

            {alerts.length === 0 ? (

                <div className="fraud-empty-state">
                    <p>✓ No fraud alerts detected</p>
                </div>

            ) : (

                <div className="fraud-alerts-list">

                    {alerts.map((alert) => (

                        <div
                            key={alert.id}
                            className={`fraud-alert-card ${getSeverityClass(
                                alert.severity
                            )}`}
                        >

                            <div className="fraud-alert-top">

                                <span className="fraud-alert-icon">
                                    {getSeverityIcon(
                                        alert.severity
                                    )}
                                </span>

                                <div>
                                    <h3>
                                        {alert.alert_type}
                                    </h3>

                                    <span className="fraud-alert-severity">
                                        {alert.severity}
                                    </span>
                                </div>

                            </div>

                            <p className="fraud-alert-message">
                                {alert.message}
                            </p>

                            <div className="fraud-alert-details">

                                <span>
                                    Transaction:{" "}
                                    {alert.transaction_id ?? "N/A"}
                                </span>

                                <span>
                                    {new Date(
                                        alert.created_at
                                    ).toLocaleString()}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default FraudAlerts;