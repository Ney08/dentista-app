import Odontograma
  from "../../odontograma/Odontograma";

function OdontogramaTab({
  clienteId
}) {

  return (

    <div className="
      rounded-[32px]

      bg-white

      border
      border-slate-200

      p-6

      shadow-sm
    ">

      <Odontograma
        clienteId={clienteId}
      />

    </div>

  );

}

export default OdontogramaTab;