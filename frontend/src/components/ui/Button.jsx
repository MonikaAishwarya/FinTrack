export default function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    className = ""
}) {

    const styles = {
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white",

        secondary:
            "bg-slate-200 hover:bg-slate-300 text-slate-800",

        danger:
            "bg-red-500 hover:bg-red-600 text-white",

        success:
            "bg-green-600 hover:bg-green-700 text-white"
    };

    return (

        <button
            type={type}
            onClick={onClick}
            className={`
                px-5
                py-3
                rounded-xl
                font-semibold
                transition-all
                duration-300
                ${styles[variant]}
                ${className}
            `}
        >
            {children}
        </button>

    );
}