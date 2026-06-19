import { useState } from "react";

import NotaClinicaTab
    from "./tabs/NotaClinicaTab";

import OdontogramaTab
    from "./tabs/OdontogramaTab";

import TratamientosTab
    from "./tabs/TratamientosTab";

import SeguimientoTab
    from "./tabs/SeguimientoTab";

function HistorialForm({
    clienteId,
    onAdd,
    historial,
    cliente
}) {

    const [activeTab, setActiveTab] =
        useState("nota");

    const tabs = [

        {
            id: "nota",
            label: "Nota clínica",
            icon: "📝"
        },

        {
            id: "odontograma",
            label: "Odontograma",
            icon: "🦷"
        },

        {
            id: "tratamientos",
            label: "Tratamientos",
            icon: "💎"
        },

        {
            id: "seguimiento",
            label: "Historial",
            icon: "📈"
        }

    ];

    return (

        <div className="
      relative
      overflow-hidden

      w-full

      min-h-[90vh]

      bg-white/80
      backdrop-blur-3xl

      border
      border-white/50

      rounded-[40px]

      p-8
      xl:p-10

      shadow-[0_30px_90px_rgba(0,0,0,0.12)]

      space-y-8
    ">

            {/* HEADER */}

            <div className="
        flex
        items-center
        justify-between
      ">

                <div>

                    <h2 className="
            text-4xl
            font-black

            text-slate-800
          ">

                        Gestión clínica avanzada

                    </h2>

                    <p className="
            mt-2

            text-slate-500
          ">

                        Workspace clínico del paciente

                    </p>

                </div>

            </div>

            {/* TABS */}

            <div className="
        flex
        flex-wrap

        gap-4
      ">

                {

                    tabs.map((tab) => (

                        <button
                            key={tab.id}

                            onClick={() =>
                                setActiveTab(tab.id)
                            }

                            className={`
                h-14

                px-6

                rounded-[22px]

                text-sm
                font-black

                transition-all
                duration-300

                ${activeTab === tab.id

                                    ? `
                    bg-gradient-to-r
                    from-indigo-500
                    to-violet-500

                    text-white
                  `

                                    : `
                    bg-white

                    border
                    border-slate-200

                    text-slate-600
                  `
                                }
              `}
                        >

                            {tab.icon}
                            {" "}
                            {tab.label}

                        </button>

                    ))

                }

            </div>

            {/* CONTENT */}

            <div className="
        min-h-[650px]
      ">

                {

                    activeTab === "nota"

                    &&

                    (
                        <NotaClinicaTab
                            clienteId={clienteId}
                            onAdd={onAdd}
                        />
                    )

                }

                {

                    activeTab === "odontograma"

                    &&

                    (
                        <OdontogramaTab
                            clienteId={clienteId}
                        />
                    )

                }

                {

                    activeTab === "tratamientos"

                    &&

                    (
                        <TratamientosTab
                            clienteId={clienteId}
                        />
                    )

                }

                {

                    activeTab === "seguimiento"

                    &&

                    (

                        <SeguimientoTab

                            historial={historial}

                            cliente={cliente}

                        />

                    )

                }

            </div>

        </div>

    );

}

export default HistorialForm;