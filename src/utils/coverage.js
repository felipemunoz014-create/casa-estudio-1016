export function getCoverageM2(product) {
  if (!product || !product.dims) return 1;
  const match = product.dims.match(/([\d.]+)\s*[×xX]\s*([\d.]+)/);
  if (!match) return 1;
  const a = parseFloat(match[1]) / 100;
  const b = parseFloat(match[2]) / 100;
  const result = a * b;
  return result > 0 ? result : 1;
}

export function calcularCubicacion({ largo, alto, merma, descuentoVanos, coberturaM2PorUnidad, precioUnitario }) {
  const m2Bruto = largo * alto;
  const m2Neto = Math.max(m2Bruto - descuentoVanos, 0);
  const m2ConMerma = m2Neto * (1 + merma / 100);
  const unidades = Math.ceil(m2ConMerma / coberturaM2PorUnidad);
  const precioTotal = unidades * precioUnitario;
  return { m2Bruto, m2Neto, m2ConMerma, unidades, precioTotal };
}
