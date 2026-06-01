import { formatFecha, formatHora } from "../utils/fecha";

function FacturaPrint({ ingreso }) {
  const servicios = ingreso.servicios || [
    { descripcion: ingreso.descripcion, monto: ingreso.monto }
  ];

  const subtotal = servicios.reduce((acc, s) => acc + s.monto, 0);
  const itbis = subtotal * 0.18;
  const total = subtotal + itbis;

  return (
    <div className="p-6 bg-white w-[600px]">

      <h1 className="text-xl font-bold mb-4">
        Clínica Dental 🦷
      </h1>

      <p>Paciente: {ingreso.cliente?.nombre}</p>
      <p>Fecha: {formatFecha(new Date())}</p>

      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th className="border p-2">Servicio</th>
            <th className="border p-2">Precio</th>
          </tr>
        </thead>

        <tbody>
          {servicios.map((s, i) => (
            <tr key={i}>
              <td className="border p-2">{s.descripcion}</td>
              <td className="border p-2">RD$ {s.monto}</td>
            </tr>
          ))}
        </tbody>
      </table> 

      <div className="mt-4">
        <p>Subtotal: RD$ {subtotal}</p>
        <p>ITBIS: RD$ {itbis}</p>
        <p className="font-bold">Total: RD$ {total}</p>
      </div>

    </div>
  );
}

export default FacturaPrint;