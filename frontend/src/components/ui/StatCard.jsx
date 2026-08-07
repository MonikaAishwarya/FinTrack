import Card from "./Card";

export default function StatCard({

    title,
    value,
    icon,
    color,
    bg

}) {

    return (

        <Card
            className={`
                relative
                overflow-hidden
                hover:-translate-y-1
                ${bg}
            `}
        >

            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20"></div>

            <div className="flex justify-between items-center relative">

                <div>

                    <p className="text-white/80 text-sm font-medium">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-2">
                        {value}
                    </h2>

                </div>

                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white">

                    {icon}

                </div>

            </div>

        </Card>

    );

}