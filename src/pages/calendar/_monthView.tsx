import { Moment } from "moment";
import { arrayRange } from "./_utils";

export default function MonthView({ today }: { today: Moment }) {
  const monthStart = today.clone().startOf("month");
  console.log(monthStart.format("DD-MMM-YYYY"));
  return (
    <div
      className="grid w-full"
      style={{
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "repeat(6, 1fr)",
      }}
    >
      {/* Days Sunday to Saturday */}
      {arrayRange(0, 6).map((day) => {
        const currDate = today.startOf("week").clone().add(day, "day");
        return (
          <div
            key={day}
            className="flex flex-col items-center justify-center border border-base-200 bg-base-200"
          >
            <p className="m-0">{currDate.format("ddd").toUpperCase()}</p>
          </div>
        );
      })}
      {arrayRange(0, 4).map((week) =>
        arrayRange(0, 6).map((day) => {
          const currDate = monthStart
            .clone()
            .startOf("week")
            .add(week, "week")
            .add(day, "day");
          return (
            <div
              key={day}
              className="flex flex-col items-center justify-center border border-base-200"
            >
              <p className="m-0 text-sm">{currDate.format("DD")}</p>
            </div>
          );
        })
      )}
    </div>
  );
}
