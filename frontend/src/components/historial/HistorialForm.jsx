import { useState } from "react";

import {
    ShieldPlus,
    Gem,
    BarChart3,
    ClipboardList
} from "lucide-react";
import ToothIcon from "../icons/ToothIcon";
import HistorialTab
    from "./tabs/HistorialTab";

import HistorialPacienteTab
    from "./tabs/HistorialPacienteTab";

import OdontogramaTab
    from "./tabs/OdontogramaTab";

import TratamientosTab
    from "./tabs/TratamientosTab";

function HistorialForm({
    clienteId,
    onAdd,
    historial = [],
    cliente,
    tratamiento,

    citas = [],
    ingresos = [],
    tratamientos = [],
    odontograma = null
}) {

    const [activeTab, setActiveTab] =
        useState("notas");

    const tabs = [

        {
            id: "notas",
            label: "Notas clínicas",
            icon: <ClipboardList size={16} />
        },

        {
            id: "odontograma",
            label: "Odontograma",
            icon: <ToothIcon size={18} />
        },

        {
            id: "tratamientos",
            label: "Tratamientos",
            icon: <Gem size={16} />
        },

        {
            id: "historial",
            label: "Historial",
            icon: <BarChart3 size={16} />
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

                {tabs.map((tab) => (

                    <button
                        key={tab.id}
                        onClick={() =>
                            setActiveTab(tab.id)
                        }
                        className={`
                            h-14
                            px-6

                            flex
                            items-center
                            gap-2

                            rounded-[22px]

                            text-sm
                            font-black

                            transition-all
                            duration-300

                            ${activeTab === tab.id
                                ? `
                                    bg-gradient-to-r
                                    from-sky-700
                                    via-sky-800
                                    to-sky-900

                                    text-white

                                    shadow-[0_12px_30px_rgba(7,89,133,0.22)]
                                `
                                : `
                                    bg-white

                                    border
                                    border-slate-200

                                    text-slate-600

                                    hover:border-sky-200
                                    hover:text-sky-800
                                    hover:bg-sky-50/60
                                `
                            }
                        `}
                    >

                        <span className="
                            flex
                            items-center
                            justify-center

                            w-5
                            h-5
                        ">

                            {tab.icon}

                        </span>

                        <span>
                            {tab.label}
                        </span>

                    </button>

                ))}

            </div>

            {/* CONTENT */}

            <div className="
                min-h-[650px]
            ">

                {activeTab === "notas" && (

                    <HistorialTab

                        cliente={cliente}

                        historial={historial}

                        clienteId={clienteId}

                        onAdd={onAdd}

                    />

                )}

                {activeTab === "odontograma" && (

                    <OdontogramaTab
                        clienteId={clienteId}
                    />

                )}

                {activeTab === "tratamientos" && (

                    <TratamientosTab
                        clienteId={clienteId}
                        tratamiento={tratamiento}
                    />

                )}

                {activeTab === "historial" && (


                    <HistorialPacienteTab
                        clienteId={clienteId}
                        cliente={cliente}
                        historial={historial}
                    />


                )}

            </div>

        </div>

    );

}

export default HistorialForm;