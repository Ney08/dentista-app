from pydantic import BaseModel
from typing import List, Optional


class ClienteOut(BaseModel):

    id: int
    nombre: str
    apellido: str
    telefono: Optional[str] = None

    class Config:
        from_attributes = True


class Servicio(BaseModel):
    descripcion: str
    monto: float
    costo_servicio: float = 0
    
class ServicioSchema(BaseModel):
    descripcion: str
    monto: float
    costo_servicio: float = 0
    
class IngresoCreate(BaseModel):
    cliente_id: int
    descuento: float = 0
    cita_id: Optional[int] = None
    servicios: List[Servicio]

class Ingreso(BaseModel):

    id: int

    cliente_id: int

    cliente: ClienteOut

    descuento: float

    pagado: bool = False

    servicios: List[Servicio]

    class Config:
        from_attributes = True

class IngresoUpdateSchema(BaseModel):
    cliente_id: int
    descuento: Optional[float] = 0
    servicios: List[ServicioSchema]
    

