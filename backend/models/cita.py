from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base


class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True)

    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    fecha = Column(DateTime)

    estado = Column(String, default="pendiente")

    # ✅ NUEVOS CAMPOS
    motivo = Column(String)
    detalle = Column(String, nullable=True)
    duracion = Column(Integer, default=30)

    cliente = relationship("Cliente")
