export type ItemComprobante = {
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
};

export type DatosComprobante = {
  numero: string;
  fecha: string;
  cliente: string;
  pago: string;
  items: ItemComprobante[];
  total: number;
};

const formato = (valor: number) =>
  valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

const escapeHtml = (valor: string) =>
  valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function imprimirComprobante(datos: DatosComprobante) {
  const filas = datos.items
    .map(
      (item) => `
        <tr>
          <td class="nombre">${escapeHtml(item.nombre)}</td>
          <td>${item.cantidad}</td>
          <td>${formato(item.precio)}</td>
          <td>${formato(item.subtotal)}</td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Comprobante ${datos.numero}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Courier New", monospace;
      color: #0f172a;
      padding: 16px;
      width: 320px;
      margin: 0 auto;
    }
    .header { text-align: center; border-bottom: 2px dashed #0f172a; padding-bottom: 12px; margin-bottom: 12px; }
    .header h1 { font-size: 18px; letter-spacing: 0.1em; }
    .header p { font-size: 11px; margin-top: 4px; }
    .linea { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
    .linea span:first-child { color: #475569; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 12px; }
    thead th {
      text-align: left; font-size: 10px; text-transform: uppercase;
      border-bottom: 1px solid #0f172a; padding-bottom: 4px;
    }
    thead th:not(:first-child) { text-align: right; }
    tbody td { padding: 4px 0; vertical-align: top; border-bottom: 1px dashed #cbd5e1; }
    tbody td.nombre { max-width: 140px; }
    tbody td:nth-child(n+2) { text-align: right; white-space: nowrap; }
    .total-row td { font-size: 14px; font-weight: 700; padding-top: 8px; border-bottom: none; }
    .pago { margin-top: 10px; font-size: 12px; display: flex; justify-content: space-between; }
    .footer { text-align: center; font-size: 10px; color: #475569; margin-top: 16px; border-top: 2px dashed #0f172a; padding-top: 10px; }
    .gracias { font-size: 12px; font-weight: 700; }
  </style>
</head>
<body>
  <div class="header">
    <h1>ORBIX</h1>
    <p>Gestión comercial · Comprobante de venta</p>
  </div>

  <div class="linea"><span>Pedido:</span><span>${escapeHtml(datos.numero)}</span></div>
  <div class="linea"><span>Fecha:</span><span>${escapeHtml(datos.fecha)}</span></div>
  <div class="linea"><span>Cliente:</span><span>${escapeHtml(datos.cliente)}</span></div>

  <table>
    <thead>
      <tr>
        <th>Producto</th>
        <th>Cant.</th>
        <th>P. Unit.</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${filas}
      <tr class="total-row">
        <td colspan="3">TOTAL</td>
        <td>${formato(datos.total)}</td>
      </tr>
    </tbody>
  </table>

  <div class="pago">
    <span>Método de pago</span>
    <strong>${escapeHtml(datos.pago)}</strong>
  </div>

  <div class="footer">
    <p class="gracias">¡Gracias por tu compra!</p>
    <p>Este comprobante no es factura fiscal.</p>
  </div>
</body>
</html>`;

  const ventana = window.open("", "_blank", "width=360,height=640");

  if (!ventana) {
    window.alert("Permite las ventanas emergentes para imprimir el comprobante.");
    return;
  }

  ventana.document.open();
  ventana.document.write(html);
  ventana.document.close();
  ventana.focus();
  ventana.print();
}