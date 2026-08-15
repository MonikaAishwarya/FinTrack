import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TransactionHeatmap({ data }) {

    const svgRef = useRef(null);


    useEffect(() => {

        if (!data || data.length === 0) {
            return;
        }

        const svg = d3.select(svgRef.current);

        // Clear previous visualization
        svg.selectAll("*").remove();


        // --------------------------------------------------
        // PREPARE DATA
        // --------------------------------------------------

        const parsedData = data.map((item) => ({
            date: new Date(item.date),
            count: Number(item.count)
        }));


        const startDate = d3.min(
            parsedData,
            (d) => d.date
        );

        const endDate = d3.max(
            parsedData,
            (d) => d.date
        );


        // --------------------------------------------------
        // CREATE COMPLETE DATE RANGE
        // --------------------------------------------------

        const allDates = d3.timeDays(
            startDate,
            d3.timeDay.offset(endDate, 1)
        );


        const countMap = new Map(
            parsedData.map((d) => [
                d3.timeFormat("%Y-%m-%d")(d.date),
                d.count
            ])
        );


        const heatmapData = allDates.map((date) => ({

            date,

            count:
                countMap.get(
                    d3.timeFormat("%Y-%m-%d")(date)
                ) || 0

        }));


        // --------------------------------------------------
        // DIMENSIONS
        // --------------------------------------------------

        const cellSize = 18;

        const cellGap = 3;

        const leftMargin = 45;

        const topMargin = 35;

        const bottomMargin = 30;

        const rightMargin = 20;


        const width =
            53 * (cellSize + cellGap)
            + leftMargin
            + rightMargin;


        const height =
            7 * (cellSize + cellGap)
            + topMargin
            + bottomMargin;


        svg
            .attr(
                "viewBox",
                `0 0 ${width} ${height}`
            )
            .attr(
                "width",
                "100%"
            )
            .attr(
                "height",
                height
            );


        // --------------------------------------------------
        // COLOR SCALE
        // --------------------------------------------------

        const maxCount = d3.max(
            heatmapData,
            (d) => d.count
        ) || 1;


        const colorScale = d3.scaleSequential()
            .domain([0, maxCount])
            .interpolator(
                d3.interpolateBlues
            );


        // --------------------------------------------------
        // POSITION FUNCTIONS
        // --------------------------------------------------

        const getWeek = (date) => {

            return d3.timeWeek.count(
                startDate,
                date
            );

        };


        const getDay = (date) => {

            return date.getDay();

        };


        // --------------------------------------------------
        // DAY LABELS
        // --------------------------------------------------

        const dayLabels = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ];


        svg
            .selectAll(".day-label")
            .data(dayLabels)
            .enter()
            .append("text")
            .attr("class", "day-label")
            .attr(
                "x",
                leftMargin - 8
            )
            .attr(
                "y",
                (_, i) =>
                    topMargin
                    + i * (cellSize + cellGap)
                    + cellSize - 3
            )
            .attr(
                "text-anchor",
                "end"
            )
            .attr(
                "font-size",
                "11px"
            )
            .attr(
                "fill",
                "#64748b"
            )
            .text((d) => d);


        // --------------------------------------------------
        // MONTH LABELS
        // --------------------------------------------------

        const monthLabels = [];

        heatmapData.forEach((item) => {

            if (
                item.date.getDate() === 1 ||
                monthLabels.length === 0
            ) {

                monthLabels.push(item);

            }

        });


        svg
            .selectAll(".month-label")
            .data(monthLabels)
            .enter()
            .append("text")
            .attr("class", "month-label")
            .attr(
                "x",
                (d) =>
                    leftMargin
                    + getWeek(d.date)
                    * (cellSize + cellGap)
            )
            .attr(
                "y",
                18
            )
            .attr(
                "font-size",
                "11px"
            )
            .attr(
                "fill",
                "#64748b"
            )
            .text(
                (d) =>
                    d3.timeFormat("%b")(
                        d.date
                    )
            );


        // --------------------------------------------------
        // HEATMAP CELLS
        // --------------------------------------------------

        const tooltip = d3
            .select("body")
            .append("div")
            .style(
                "position",
                "absolute"
            )
            .style(
                "pointer-events",
                "none"
            )
            .style(
                "background",
                "#0f172a"
            )
            .style(
                "color",
                "white"
            )
            .style(
                "padding",
                "8px 10px"
            )
            .style(
                "border-radius",
                "8px"
            )
            .style(
                "font-size",
                "12px"
            )
            .style(
                "opacity",
                0
            );


        svg
            .selectAll(".heatmap-cell")
            .data(heatmapData)
            .enter()
            .append("rect")
            .attr(
                "class",
                "heatmap-cell"
            )
            .attr(
                "x",
                (d) =>
                    leftMargin
                    + getWeek(d.date)
                    * (cellSize + cellGap)
            )
            .attr(
                "y",
                (d) =>
                    topMargin
                    + getDay(d.date)
                    * (cellSize + cellGap)
            )
            .attr(
                "width",
                cellSize
            )
            .attr(
                "height",
                cellSize
            )
            .attr(
                "rx",
                4
            )
            .attr(
                "fill",
                (d) =>
                    d.count === 0
                        ? "#e2e8f0"
                        : colorScale(d.count)
            )
            .style(
                "cursor",
                "pointer"
            )
            .on(
                "mouseenter",
                function (event, d) {

                    d3.select(this)
                        .attr(
                            "stroke",
                            "#0f172a"
                        )
                        .attr(
                            "stroke-width",
                            1.5
                        );


                    tooltip
                        .style(
                            "opacity",
                            1
                        )
                        .html(
                            `
                            <div>
                                <strong>
                                    ${d3.timeFormat(
                                        "%d %b %Y"
                                    )(d.date)}
                                </strong>
                            </div>
                            <div>
                                ${d.count}
                                transaction${d.count !== 1 ? "s" : ""}
                            </div>
                            `
                        );

                }
            )
            .on(
                "mousemove",
                function (event) {

                    tooltip
                        .style(
                            "left",
                            `${event.pageX + 12}px`
                        )
                        .style(
                            "top",
                            `${event.pageY - 35}px`
                        );

                }
            )
            .on(
                "mouseleave",
                function () {

                    d3.select(this)
                        .attr(
                            "stroke",
                            "none"
                        );

                    tooltip.style(
                        "opacity",
                        0
                    );

                }
            );


        // --------------------------------------------------
        // CLEANUP
        // --------------------------------------------------

        return () => {

            tooltip.remove();

        };

    }, [data]);


    return (

        <div className="w-full overflow-x-auto">

            <svg
                ref={svgRef}
                className="min-w-[900px]"
            />

        </div>

    );

}
