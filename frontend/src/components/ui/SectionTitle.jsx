export default function SectionTitle({
    title,
    subtitle
}) {

    return (

        <div className="mb-6">

            <h1 className="text-3xl font-bold text-slate-800">
                {title}
            </h1>

            {subtitle && (

                <p className="text-gray-500 mt-2">
                    {subtitle}
                </p>

            )}

        </div>

    );

}