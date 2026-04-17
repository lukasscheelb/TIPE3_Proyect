from __future__ import annotations

import base64
import json
import mimetypes
import uuid
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
PROPERTIES_DIR = ROOT / "Propiedades"
IMAGES_DIR = PROPERTIES_DIR / "imagenes"
HOST = "127.0.0.1"
PORT = 8000


SAMPLE_PROPERTIES = [
    {
        "id": 1,
        "titulo": "Departamento en Santiago Centro",
        "imagen": "https://placehold.co/800x520/0f62fe/ffffff?text=Santiago+Centro",
        "dueno": "Marcela Soto",
        "telefono": "+56 9 7654 3210",
        "rol": "ROL-1001",
        "foja": "201",
        "numero": "51",
        "ano": "2025",
        "tipo": "Departamento",
        "ciudad": "Santiago",
        "comuna": "Santiago Centro",
        "direccion": "Carmen 245",
        "precio": 185000,
        "uf": 5050,
        "superficieTotal": 72,
        "superficieConstruida": 68,
        "numeroPisos": 1,
        "numeroHabitaciones": 2,
        "numeroBanos": 2,
        "anoConstruccion": 2018,
        "estado": "Remodelado",
        "estacionamientos": 1,
        "jardin": False,
        "patio": False,
        "balcon": True,
        "bodega": True,
        "gastosComunes": "$95.000",
        "calefaccion": "Electrica",
        "orientacion": "Surponiente",
        "numeroPiso": 11,
        "numeroDepartamento": "1108",
        "departamentosPorPiso": 6,
        "ascensor": "Si",
        "metrosPatioJardin": "",
        "materialConstruccion": "",
        "aguaPotable": True,
        "electricidad": True,
        "gas": True,
        "lavanderia": True,
        "piscina": True,
        "clubHouse": True,
        "conserjeria": True,
        "areaVerde": True,
        "areaNinos": True,
        "estacionamientoVisitas": True,
        "costosPublicidad": "$180.000",
        "costosFotografia": "$95.000",
        "materialPublicitario": "$65.000",
        "otrosGastos": "$40.000",
        "costoTotalEstimado": "$380.000",
        "tramitesRealizados": [
            "Tasacion realizada",
            "Fotografias tomadas",
            "Publicacion en portales",
        ],
        "tramitesPendientes": [
            "Firma de contrato",
            "Recepcion de documentos",
            "Coordinacion de visitas",
        ],
        "notas": "Unidad con alta rotacion en cartera interna.",
        "condicionesVenta": "Venta sujeta a financiamiento aprobado.",
        "honorariosCorretaje": "2",
        "descripcion": "Departamento moderno, bien ubicado y listo para gestion comercial.",
    },
    {
        "id": 2,
        "titulo": "Casa familiar en Las Condes",
        "imagen": "https://placehold.co/800x520/1b4d8f/ffffff?text=Casa+Las+Condes",
        "dueno": "Patricia Fuentes",
        "telefono": "+56 9 8899 1122",
        "rol": "ROL-1002",
        "foja": "202",
        "numero": "52",
        "ano": "2025",
        "tipo": "Casa",
        "ciudad": "Santiago",
        "comuna": "Las Condes",
        "direccion": "Camino del Alba 820",
        "precio": 420000,
        "uf": 11450,
        "superficieTotal": 320,
        "superficieConstruida": 180,
        "numeroPisos": 2,
        "numeroHabitaciones": 4,
        "numeroBanos": 3,
        "anoConstruccion": 2016,
        "estado": "Usado",
        "estacionamientos": 2,
        "jardin": True,
        "patio": True,
        "balcon": False,
        "bodega": True,
        "gastosComunes": "$0",
        "calefaccion": "Central",
        "orientacion": "Nororiente",
        "numeroPiso": "",
        "numeroDepartamento": "",
        "departamentosPorPiso": "",
        "ascensor": "No",
        "metrosPatioJardin": 120,
        "materialConstruccion": "Hormigon y albanileria reforzada",
        "aguaPotable": True,
        "electricidad": True,
        "gas": True,
        "lavanderia": True,
        "piscina": True,
        "clubHouse": False,
        "conserjeria": False,
        "areaVerde": True,
        "areaNinos": True,
        "estacionamientoVisitas": True,
        "costosPublicidad": "$220.000",
        "costosFotografia": "$140.000",
        "materialPublicitario": "$85.000",
        "otrosGastos": "$60.000",
        "costoTotalEstimado": "$505.000",
        "tramitesRealizados": [
            "Tasacion realizada",
            "Fotografias tomadas",
        ],
        "tramitesPendientes": [
            "Firma de contrato",
            "Coordinacion de visitas",
        ],
        "notas": "Propiedad prioritaria para cliente inversionista.",
        "condicionesVenta": "Venta con entrega en 60 dias.",
        "honorariosCorretaje": "2",
        "descripcion": "Casa amplia, con patio, piscina y distribucion familiar.",
    },
    {
        "id": 3,
        "titulo": "Terreno rural en Puerto Varas",
        "imagen": "https://placehold.co/800x520/497174/ffffff?text=Terreno+Puerto+Varas",
        "dueno": "Inversiones del Sur",
        "telefono": "+56 9 3344 5566",
        "rol": "ROL-1003",
        "foja": "203",
        "numero": "53",
        "ano": "2025",
        "tipo": "Terreno",
        "ciudad": "Puerto Varas",
        "comuna": "Ensenada",
        "direccion": "Ruta 225 km 14",
        "precio": 275000,
        "uf": 7500,
        "superficieTotal": 850,
        "superficieConstruida": 0,
        "numeroPisos": 0,
        "numeroHabitaciones": 0,
        "numeroBanos": 0,
        "anoConstruccion": "",
        "estado": "Usado",
        "estacionamientos": 0,
        "jardin": False,
        "patio": False,
        "balcon": False,
        "bodega": False,
        "gastosComunes": "$0",
        "calefaccion": "No aplica",
        "orientacion": "Norte",
        "numeroPiso": "",
        "numeroDepartamento": "",
        "departamentosPorPiso": "",
        "ascensor": "No",
        "metrosPatioJardin": "",
        "materialConstruccion": "",
        "aguaPotable": True,
        "electricidad": True,
        "gas": False,
        "lavanderia": False,
        "piscina": False,
        "clubHouse": False,
        "conserjeria": False,
        "areaVerde": False,
        "areaNinos": False,
        "estacionamientoVisitas": False,
        "costosPublicidad": "$150.000",
        "costosFotografia": "$75.000",
        "materialPublicitario": "$35.000",
        "otrosGastos": "$20.000",
        "costoTotalEstimado": "$280.000",
        "tramitesRealizados": ["Tasacion realizada"],
        "tramitesPendientes": [
            "Recepcion de documentos",
            "Coordinacion de visitas",
        ],
        "notas": "Terreno apto para segunda vivienda o proyecto turistico.",
        "condicionesVenta": "Venta directa con documentacion al dia.",
        "honorariosCorretaje": "2.5",
        "descripcion": "Terreno amplio y bien ubicado para desarrollo o inversion.",
    },
]


def ensure_storage() -> None:
    PROPERTIES_DIR.mkdir(exist_ok=True)
    IMAGES_DIR.mkdir(exist_ok=True)
    if not list(PROPERTIES_DIR.glob("*.json")):
        for item in SAMPLE_PROPERTIES:
            write_property(item)


def property_file(property_id: int) -> Path:
    return PROPERTIES_DIR / f"{property_id}.json"


def read_property(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)

    images = data.get("imagenes")
    if isinstance(images, list):
        data["imagenes"] = [image for image in images if image]
    elif data.get("imagen"):
        data["imagenes"] = [data["imagen"]]
    else:
        data["imagenes"] = []

    if not data.get("imagen") and data["imagenes"]:
        data["imagen"] = data["imagenes"][0]

    return data


def write_property(data: dict) -> None:
    with property_file(int(data["id"])).open("w", encoding="utf-8") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)


def save_image_upload(payload: dict) -> str:
    filename = payload.get("filename", "imagen")
    content = payload.get("content", "")
    header, encoded = content.split(",", 1)
    mime = header.split(";")[0].replace("data:", "").strip() or "image/jpeg"
    extension = mimetypes.guess_extension(mime) or Path(filename).suffix or ".jpg"
    safe_name = f"{uuid.uuid4().hex}{extension}"
    image_path = IMAGES_DIR / safe_name
    image_path.write_bytes(base64.b64decode(encoded))
    return f"http://{HOST}:{PORT}/media/{safe_name}"


def prepare_property_payload(payload: dict) -> dict:
    clean_payload = dict(payload)
    image_uploads = clean_payload.pop("imageUploads", None) or []
    single_image_upload = clean_payload.pop("imageUpload", None)
    ficha_image_upload = clean_payload.pop("fichaImagenUpload", None)

    if single_image_upload and single_image_upload.get("content"):
        image_uploads.append(single_image_upload)

    existing_images = clean_payload.get("imagenes")
    if isinstance(existing_images, list):
        images = [image for image in existing_images if image]
    elif clean_payload.get("imagen"):
        images = [clean_payload["imagen"]]
    else:
        images = []

    for image_upload in image_uploads:
        if image_upload and image_upload.get("content"):
            images.append(save_image_upload(image_upload))

    clean_payload["imagenes"] = images
    clean_payload["imagen"] = images[0] if images else ""

    if ficha_image_upload and ficha_image_upload.get("content"):
        clean_payload["fichaImagen"] = save_image_upload(ficha_image_upload)

    return clean_payload


def list_properties() -> list[dict]:
    return sorted(
        (read_property(path) for path in PROPERTIES_DIR.glob("*.json")),
        key=lambda item: int(item["id"]),
    )


def next_property_id() -> int:
    items = list_properties()
    return (max(int(item["id"]) for item in items) + 1) if items else 1


class PropertyHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        parts = [part for part in parsed.path.strip("/").split("/") if part]

        if len(parts) == 2 and parts[0] == "media":
            image_path = IMAGES_DIR / parts[1]
            if not image_path.exists():
                return self._send_json({"error": "Image not found"}, HTTPStatus.NOT_FOUND)
            content = image_path.read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header(
                "Content-Type",
                mimetypes.guess_type(image_path.name)[0] or "application/octet-stream",
            )
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(content)
            return

        if parts == ["api", "properties"]:
            return self._send_json(list_properties())

        if len(parts) == 3 and parts[:2] == ["api", "properties"]:
            target = property_file(int(parts[2]))
            if not target.exists():
                return self._send_json({"error": "Property not found"}, HTTPStatus.NOT_FOUND)
            return self._send_json(read_property(target))

        return self._send_json({"error": "Route not found"}, HTTPStatus.NOT_FOUND)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/properties":
            return self._send_json({"error": "Route not found"}, HTTPStatus.NOT_FOUND)

        payload = prepare_property_payload(self._read_json())
        payload["id"] = next_property_id()
        write_property(payload)
        return self._send_json(payload, HTTPStatus.CREATED)

    def do_PUT(self):
        parsed = urlparse(self.path)
        parts = [part for part in parsed.path.strip("/").split("/") if part]
        if len(parts) != 3 or parts[:2] != ["api", "properties"]:
            return self._send_json({"error": "Route not found"}, HTTPStatus.NOT_FOUND)

        property_id = int(parts[2])
        target = property_file(property_id)
        if not target.exists():
            return self._send_json({"error": "Property not found"}, HTTPStatus.NOT_FOUND)

        payload = prepare_property_payload(self._read_json())
        payload["id"] = property_id
        write_property(payload)
        return self._send_json(payload)


def run():
    ensure_storage()
    server = ThreadingHTTPServer((HOST, PORT), PropertyHandler)
    print(f"Property server running on http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    run()
