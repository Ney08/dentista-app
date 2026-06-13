function TratamientoTimeline({

  events = []

}) {

  return (

    <div className="
      space-y-5
    ">

      {

        events.map((event, index) => (

          <div

            key={index}

            className="
              flex

              gap-4
            "
          >

            {/* DOT */}

            <div className="
              relative

              flex
              flex-col

              items-center
            ">

              <div className="
                w-4
                h-4

                rounded-full

                bg-indigo-500
              " />

              {

                index !==
                events.length - 1 && (

                  <div className="
                    w-[2px]

                    flex-1

                    bg-slate-200
                  " />

                )
              }

            </div>

            {/* CONTENT */}

            <div className="
              flex-1

              pb-5
            ">

              <div className="
                rounded-[24px]

                bg-white

                border
                border-slate-100

                p-5

                shadow-sm
              ">

                <div className="
                  flex
                  items-center
                  justify-between

                  gap-4
                ">

                  <h4 className="
                    text-sm

                    font-black

                    text-slate-800
                  ">

                    {event.title}

                  </h4>

                  <span className="
                    text-xs

                    font-semibold

                    text-slate-400
                  ">

                    {event.date}

                  </span>

                </div>

                {

                  event.description && (

                    <p className="
                      mt-3

                      text-sm

                      leading-relaxed

                      text-slate-500
                    ">

                      {
                        event.description
                      }

                    </p>

                  )
                }

              </div>

            </div>

          </div>

        ))
      }

    </div>

  );

}

export default TratamientoTimeline;