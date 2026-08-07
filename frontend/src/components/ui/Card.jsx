export default function Card({
    children,
    className = ""
}) {
    return (
        <div
            className={`
                bg-white
                rounded-2xl
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
                p-6
                ${className}
            `}
        >
            {children}
        </div>
    );
}